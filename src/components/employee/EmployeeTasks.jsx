import React, { useState, useEffect } from "react";
import { Box, Typography } from "@mui/material";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { TaskImageUploadModal } from "./TaskImageUploadModal";
import { TaskCard } from "./TaskCard";
import { CompletedTaskCard } from "./CompletedTaskCard";
import { authenticatedAxios } from "../../utils/axiosConfig";
import { API_BASE } from "../../config/apiEndpoints";
import { uploadImageToCloudinary } from "../../utils/cloudinaryUtils";
import { getCurrentUser } from "../../utils/jwtUtils";

export function EmployeeTasks() {
  const [activeTasks, setActiveTasks] = useState([]);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [taskNotes, setTaskNotes] = useState({});
  const [notesVisibility, setNotesVisibility] = useState({});
  const [uploadingImages, setUploadingImages] = useState({});

  
  const [expandedImages, setExpandedImages] = useState({});
  const [expandedNotes, setExpandedNotes] = useState({});

  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [currentTaskId, setCurrentTaskId] = useState(null);

  const activeTaskInProgress = activeTasks.find(task => task.status === "IN_PROGRESS");
  const hasActiveTimer = !!activeTaskInProgress;

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        // Get user from JWT token
        const user = getCurrentUser();
        if (!user) {
          console.error("No authenticated user found");
          return;
        }

        const response = await authenticatedAxios.get(
          `${API_BASE}/api/tasks/employee/${user.id}`
        );

        const allTasks = response.data;
        const active = allTasks.filter((task) => task.status !== "COMPLETED");
        const completed = allTasks.filter(
          (task) => task.status === "COMPLETED"
        );

        setActiveTasks(active);
        setCompletedTasks(completed);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };
    fetchTasks();
  }, []);

  const handleStartTimer = async (taskId) => {
    const currentTime = new Date().toISOString();

    try {
      // Send start time to backend
      await authenticatedAxios.patch(`${API_BASE}/api/tasks/${taskId}`, {
        startTime: currentTime,
        status: "IN_PROGRESS",
      });

      // Update local state
      setActiveTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === taskId
            ? {
                ...task,
                status: "IN_PROGRESS",
                startTime: new Date(currentTime).toLocaleTimeString(),
                actualStartTime: currentTime,
              }
            : task
        )
      );
    } catch (error) {
      console.error("Failed to start timer:", error);
    }
  };

  const handleSubtaskToggle = async (taskId, subtaskId) => {
    const task = activeTasks.find((t) => t.id === taskId);
    const subtask = task.subTasks.find((st) => st.id === subtaskId);

    if (task.status !== "IN_PROGRESS") return;

    const toggledState =
      subtask.status === "COMPLETED" ? "NOT_STARTED" : "COMPLETED";

    // hold the updated subtasks
    const updatedSubtasks = task.subTasks.map((st) =>
      st.id === subtaskId ? { ...st, status: toggledState } : st
    );

    // progress update
    const completedCount = updatedSubtasks.filter(
      (st) => st.status === "COMPLETED"
    ).length;
    const progress = Math.round(
      (completedCount / updatedSubtasks.length) * 100
    );
    const allSubtasksCompleted = updatedSubtasks.every(
      (st) => st.status === "COMPLETED"
    );

    setActiveTasks((prevTasks) =>
      prevTasks.map((t) => {
        if (t.id === taskId) {
          return {
            ...t,
            subTasks: updatedSubtasks,
            progress: progress,
            status: allSubtasksCompleted ? "COMPLETED" : t.status,
          };
        }
        return t;
      })
    );

    try {
      await authenticatedAxios.patch(
        `${API_BASE}/api/tasks/subtasks/${subtaskId}`,
        {
          status: toggledState,
        }
      );

      if (allSubtasksCompleted) {
        await handleTaskCompletion(taskId, updatedSubtasks);
      }
    } catch (error) {
      console.error("Failed to update subtask:", error);

      // Revert to original state on error
      setActiveTasks((prevTasks) =>
        prevTasks.map((t) => {
          if (t.id === taskId) {
            return {
              ...t,
              subTasks: task.subTasks,
              progress: task.progress,
              status: task.status,
            };
          }
          return t;
        })
      );
    }
  };

  const handleTaskCompletion = async (taskId, updatedSubtasks) => {
    const completionTime = new Date().toISOString();

    try {
      await authenticatedAxios.patch(`${API_BASE}/api/tasks/${taskId}`, {
        completedTime: completionTime,
        status: "COMPLETED",
      });

      setActiveTasks((prevTasks) => {
        const completedTask = prevTasks.find((t) => t.id === taskId);
        if (!completedTask) return prevTasks;

        setCompletedTasks((prevCompleted) => [
          ...prevCompleted,
          {
            ...completedTask,
            status: "COMPLETED",
            completedTime: new Date(completionTime).toLocaleString(),
            subTasks: updatedSubtasks,
          },
        ]);

        return prevTasks.filter((t) => t.id !== taskId);
      });
    } catch (error) {
      console.error("Failed to complete task:", error);
    }
  };

  const handleOpenUploadModal = (taskId) => {
    setCurrentTaskId(taskId);
    setUploadModalOpen(true);
  };

  const handleCloseUploadModal = () => {
    setUploadModalOpen(false);
    setCurrentTaskId(null);
  };

  const handleImageUpload = async (file, description) => {
    if (!file || !currentTaskId) return;

    setUploadingImages((prev) => ({ ...prev, [currentTaskId]: true }));

    try {
      const result = await uploadImageToCloudinary(file);

      if (!result.success) {
        console.error(`Failed to upload ${file.name}:`, result.error);
        throw new Error(result.error);
      }

      const imageData = {
        imageUrl: result.data.url,
        description: description || "",
      };

      await authenticatedAxios.post(
        `${API_BASE}/api/tasks/${currentTaskId}/images`,
        {
          imageUrl: imageData.imageUrl,
          description: imageData.description,
        }
      );

      setActiveTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === currentTaskId
            ? {
                ...task,
                taskImages: [...(task.taskImages || []), imageData],
              }
            : task
        )
      );
    } catch (error) {
      console.error("Failed to upload image:", error);
    } finally {
      setUploadingImages((prev) => ({ ...prev, [currentTaskId]: false }));
    }
  };

  const handleNotesChange = (taskId, value) => {
    setTaskNotes((prev) => ({
      ...prev,
      [taskId]: value,
    }));
  };

  const handleVisibilityChange = (taskId, checked) => {
    setNotesVisibility((prev) => ({
      ...prev,
      [taskId]: checked,
    }));
  };

  const handleNotesSubmit = async (taskId) => {
    const noteText = taskNotes[taskId] || "";
    const isVisible = notesVisibility[taskId] || false;

    if (!noteText.trim()) {
      console.warn("Note is empty");
      return;
    }

    try {
      // Get user from JWT token
      const user = getCurrentUser();
      if (!user) {
        console.error("No authenticated user found");
        return;
      }

      const response = await authenticatedAxios.post(
        `${API_BASE}/api/tasks/${taskId}/notes?authorId=${user.id}`,
        {
          noteType: "EMPLOYEE_NOTE",
          content: noteText,
          visibleToCustomer: isVisible,
        }
      );

      // Add note to local state
      const newNote = {
        id: response.data.id || Date.now(),
        content: noteText,
        visibleToCustomer: isVisible,
        createdAt: new Date().toISOString(),
        noteType: "EMPLOYEE_NOTE",
      };

      setActiveTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === taskId
            ? {
                ...task,
                taskNotes: [...(task.taskNotes || []), newNote],
              }
            : task
        )
      );

      setTaskNotes((prev) => ({
        ...prev,
        [taskId]: "",
      }));
      setNotesVisibility((prev) => ({
        ...prev,
        [taskId]: false,
      }));

    } catch (error) {
      console.error("Failed to submit note:", error);
    }
  };

  const handleRemoveImage = async (taskId, imageData) => {
    const imageId = imageData.id;

    // Store original state for rollback 
    const originalTask = activeTasks.find((t) => t.id === taskId);
    const originalTaskCopy = {
      ...originalTask,
      taskImages: [...(originalTask.taskImages || [])],
    };

    // Optimistic update
    setActiveTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId
          ? {
              ...task,
              taskImages: (task.taskImages || []).filter((img) => {
                return img.id !== imageId;
              }),
            }
          : task
      )
    );

    try {
      await authenticatedAxios.delete(
        `${API_BASE}/api/tasks/${taskId}/images/${imageId}`
      );

      console.log("Image removed successfully");
    } catch (error) {
      console.error("Failed to remove image:", error);

      setActiveTasks((prevTasks) =>
        prevTasks.map((task) => (task.id === taskId ? originalTaskCopy : task))
      );
    }
  };

const handleRemoveNote = async (taskId, noteId) => {
  console.log("=== REMOVE NOTE DEBUG ===");
  console.log("taskId:", taskId, "noteId:", noteId);
  
  const originalTask = activeTasks.find((t) => t.id === taskId);
  
  const originalTaskCopy = {
    ...originalTask,
    taskNotes: [...(originalTask.taskNotes || [])],
  };

  console.log("About to perform optimistic update...");
  
  // Optimistic update
  setActiveTasks((prevTasks) => {
    const updatedTasks = prevTasks.map((task) => {
      if (task.id === taskId) {
        const filteredNotes = (task.taskNotes || []).filter((note) => {
          return note.id !== noteId;
        });
        
        return {
          ...task,
          taskNotes: filteredNotes,
        };
      }
      return task;
    });
    
    return updatedTasks;
  });

  try {
    await authenticatedAxios.delete(
      `${API_BASE}/api/tasks/${taskId}/notes/${noteId}`
    );

  } catch (error) {
    console.error("Failed to remove note:", error);

    setActiveTasks((prevTasks) =>
      prevTasks.map((task) => (task.id === taskId ? originalTaskCopy : task))
    );
  }
};
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      <Box>
        <Typography variant="h4" component="h1" gutterBottom>
          My Tasks
        </Typography>
        <Typography color="text.secondary">
          Manage and track your assigned tasks
        </Typography>
      </Box>

      <Tabs defaultValue="active" sx={{ width: "100%" }}>
        <TabsList
          sx={{
            display: "grid",
            width: "100%",
            maxWidth: "28rem",
            gridTemplateColumns: "repeat(2, 1fr)",
          }}
        >
          <TabsTrigger value="active">Active Tasks</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>

        <TabsContent
          value="active"
          sx={{ display: "flex", flexDirection: "column", gap: 3, mt: 3 }}
        >
          {activeTasks.map((task) => {
            const isTaskStarted = task.status === "IN_PROGRESS" || task.status === "COMPLETED";
            const isUploading = uploadingImages[task.id];

            return (
              <TaskCard
                key={task.id}
                task={task}
                isTaskStarted={isTaskStarted}
                hasActiveTimer={hasActiveTimer}
                isUploading={isUploading}
                expandedImages={expandedImages[task.id] || false}
                expandedNotes={expandedNotes[task.id] || false}
                noteText={taskNotes[task.id] || ""}
                isNoteVisible={notesVisibility[task.id] || false}
                onStartTimer={() => handleStartTimer(task.id)}
                onSubtaskToggle={(subtaskId) =>
                  handleSubtaskToggle(task.id, subtaskId)
                }
                onImageUpload={() => handleOpenUploadModal(task.id)}
                onImageRemove={(image) => handleRemoveImage(task.id, image)}
                onImageToggle={() => {
                  setExpandedImages((prev) => ({
                    ...prev,
                    [task.id]: !prev[task.id],
                  }));
                }}
                onNoteToggle={() => {
                  setExpandedNotes((prev) => ({
                    ...prev,
                    [task.id]: !prev[task.id],
                  }));
                }}
                onNoteChange={(value) => handleNotesChange(task.id, value)}
                onNoteVisibilityChange={(checked) =>
                  handleVisibilityChange(task.id, checked)
                }
                onNoteSubmit={() => handleNotesSubmit(task.id)}
                onNoteRemove={(noteId) => handleRemoveNote(task.id, noteId)}
              />
            );
          })}
        </TabsContent>

        <TabsContent
          value="completed"
          sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 3 }}
        >
          {completedTasks.map((task) => (
            <CompletedTaskCard key={task.id} task={task} />
          ))}
        </TabsContent>
      </Tabs>

      <TaskImageUploadModal
        open={uploadModalOpen}
        onClose={handleCloseUploadModal}
        onConfirm={handleImageUpload}
        taskId={currentTaskId}
        isUploading={uploadingImages[currentTaskId]}
      />
    </Box>
  );
}
