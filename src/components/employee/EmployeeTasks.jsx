import React, { useState, useEffect } from "react";
import { Box, Typography } from "@mui/material";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { TaskCard } from "./TaskCard";
import { toast } from "../ui/toast";
import { CompletedTaskCard } from "./CompletedTaskCard";
import { authenticatedAxios } from "../../utils/axiosConfig";
import { API_BASE } from "../../config/apiEndpoints";
import { getCurrentUser } from "../../utils/jwtUtils";

export function EmployeeTasks() {
  const [activeTasks, setActiveTasks] = useState([]);
  const [completedTasks, setCompletedTasks] = useState([]);

  const activeTaskInProgress = activeTasks.find(
    (task) => task.status === "IN_PROGRESS"
  );
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
      toast.success("Task timer started successfully.");
    } catch (error) {
      console.error("Failed to start timer:", error);
    }
  };

  const handleSubtaskToggle = async (taskId, subtaskId) => {
    const task = activeTasks.find((t) => t.id === taskId);
    const subtask = task.subTasks.find((st) => st.id === subtaskId);

    if (task.status !== "IN_PROGRESS") {
      toast.error("Start the task timer before updating subtasks.");
      return;
    }

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
            const isTaskStarted =
              task.status === "IN_PROGRESS" || task.status === "COMPLETED";

            return (
              <TaskCard
                key={task.id}
                task={task}
                isTaskStarted={isTaskStarted}
                hasActiveTimer={hasActiveTimer}
                onStartTimer={() => handleStartTimer(task.id)}
                onSubtaskToggle={(subtaskId) =>
                  handleSubtaskToggle(task.id, subtaskId)
                }
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
    </Box>
  );
}
