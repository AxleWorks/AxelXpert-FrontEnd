import React from "react";
import {
  Box,
  Typography,
  Chip as MuiChip,
  IconButton,
  Collapse,
  Checkbox as MuiCheckbox,
  FormControlLabel,
} from "@mui/material";
import { Delete, Visibility, ExpandMore, ExpandLess } from "@mui/icons-material";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";

export function NotesSection({
  task,
  isTaskStarted,
  isExpanded,
  noteText,
  isVisible,
  onToggle,
  onNoteChange,
  onVisibilityChange,
  onSubmit,
  onRemove,
}) {
  const notes = task.taskNotes || [];

  return (
    <Box sx={{ mt: 1.5 }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          cursor: "pointer",
          p: 1,
          backgroundColor: "action.hover",
          borderRadius: 1,
          "&:hover": {
            backgroundColor: "action.selected",
          },
        }}
        onClick={onToggle}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
            Notes
          </Typography>
          {notes.length > 0 && (
            <MuiChip
              label={notes.length}
              size="small"
              sx={{
                height: 18,
                fontSize: "0.7rem",
                backgroundColor: "primary.main",
                color: "white",
              }}
            />
          )}
        </Box>
        <IconButton size="small">
          {isExpanded ? <ExpandLess /> : <ExpandMore />}
        </IconButton>
      </Box>

      <Collapse in={isExpanded}>
        <Box sx={{ p: 1.5, backgroundColor: "background.paper" }}>
          {notes.length > 0 && (
            <Box sx={{ mb: 1.5, display: "flex", flexDirection: "column", gap: 1 }}>
              {notes.map((note, index) => (
                <Box
                  key={note.id || index}
                  sx={{
                    position: "relative",
                    p: 1.5,
                    backgroundColor: "action.hover",
                    borderRadius: 1,
                    border: "1px solid",
                    borderColor: "divider",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      mb: 0.5,
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Typography
                        variant="caption"
                        sx={{ color: "text.secondary", fontSize: "0.7rem" }}
                      >
                        {new Date(note.createdAt).toLocaleString()}
                      </Typography>
                      {note.visibleToCustomer && (
                        <MuiChip
                          icon={<Visibility sx={{ fontSize: 11 }} />}
                          label="Visible"
                          size="small"
                          sx={{
                            height: 16,
                            fontSize: "0.65rem",
                            backgroundColor: "success.light",
                            color: "success.dark",
                          }}
                        />
                      )}
                    </Box>
                    {isTaskStarted && (
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          onRemove(note.id);
                        }}
                        sx={{
                          color: "error.main",
                          "&:hover": {
                            backgroundColor: "error.light",
                          },
                        }}
                      >
                        <Delete fontSize="small" />
                      </IconButton>
                    )}
                  </Box>
                  <Typography
                    variant="body2"
                    sx={{ whiteSpace: "pre-wrap", lineHeight: 1.6 }}
                  >
                    {note.content}
                  </Typography>
                </Box>
              ))}
            </Box>
          )}

          {isTaskStarted && (
            <Box
              sx={{
                backgroundColor: "background.default",
                borderRadius: 1,
                p: 1.5,
                border: "1px solid",
                borderColor: "divider",
              }}
            >
              <Textarea
                placeholder="Add a note..."
                value={noteText}
                onChange={(e) => onNoteChange(e.target.value)}
                rows={3}
                style={{
                  width: "100%",
                  padding: "8px",
                  borderRadius: "4px",
                  fontFamily: "inherit",
                  fontSize: "0.875rem",
                }}
              />
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mt: 1,
                }}
              >
                <FormControlLabel
                  control={
                    <MuiCheckbox
                      size="small"
                      checked={isVisible}
                      onChange={(e) => onVisibilityChange(e.target.checked)}
                    />
                  }
                  label={
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                      <Visibility sx={{ fontSize: "1rem" }} />
                      <Typography variant="body2">Visible to customer</Typography>
                    </Box>
                  }
                  sx={{ color: "text.secondary", m: 0 }}
                />
                <Button
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSubmit();
                  }}
                  disabled={!noteText?.trim()}
                  sx={{
                    backgroundColor: "primary.main",
                    color: "white",
                    "&:hover": {
                      backgroundColor: "primary.dark",
                    },
                    "&:disabled": {
                      backgroundColor: "action.disabledBackground",
                      color: "action.disabled",
                    },
                  }}
                >
                  Add Note
                </Button>
              </Box>
            </Box>
          )}

          {notes.length === 0 && (
            <Typography
              variant="body2"
              sx={{
                textAlign: "center",
                color: "text.secondary",
                py: 1.5,
              }}
            >
              {isTaskStarted
                ? "No notes added yet"
                : "Start the task to add notes"}
            </Typography>
          )}
        </Box>
      </Collapse>
    </Box>
  );
}
