import React from "react";
import {
  Box,
  Typography,
  IconButton,
  Paper,
  Chip,
  useTheme,
} from "@mui/material";
import { Edit, Delete, DragIndicator } from "@mui/icons-material";

const SubTaskCard = ({ subTask, onEdit, onDelete, disabled }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  return (
    <Paper
      elevation={0}
      sx={{
        p: 2.5,
        mb: 1.5,
        border: 1,
        borderColor: isDark ? "grey.800" : "grey.200",
        bgcolor: isDark ? "grey.900" : "background.paper",
        borderRadius: 2,
        transition: "all 0.2s ease-in-out",
        "&:hover": {
          bgcolor: isDark ? "grey.850" : "grey.50",
          borderColor: isDark ? "grey.700" : "grey.300",
          transform: "translateY(-2px)",
          boxShadow: isDark
            ? "0 4px 12px rgba(0,0,0,0.4)"
            : "0 4px 12px rgba(0,0,0,0.08)",
        },
      }}
    >
      <Box display="flex" alignItems="flex-start" gap={1.5}>
        <DragIndicator
          sx={{
            color: isDark ? "grey.600" : "grey.400",
            mt: 0.5,
            cursor: "grab",
            "&:active": { cursor: "grabbing" },
          }}
        />
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Box
            display="flex"
            alignItems="center"
            gap={1.5}
            mb={1}
            flexWrap="wrap"
          >
            <Chip
              label={`#${subTask.orderIndex}`}
              size="small"
              sx={{
                bgcolor: isDark ? "primary.dark" : "primary.main",
                color: "white",
                fontWeight: 700,
                fontSize: "0.75rem",
                height: 24,
                minWidth: 40,
              }}
            />
            <Typography
              variant="subtitle1"
              fontWeight={600}
              sx={{
                color: isDark ? "grey.100" : "grey.900",
                flex: 1,
                minWidth: "fit-content",
              }}
            >
              {subTask.title}
            </Typography>
            {subTask.isMandatory && (
              <Chip
                label="MANDATORY"
                size="small"
                sx={{
                  bgcolor: isDark ? "error.dark" : "error.light",
                  color: isDark ? "error.light" : "error.dark",
                  fontWeight: 700,
                  fontSize: "0.65rem",
                  height: 22,
                }}
              />
            )}
          </Box>
          {subTask.description && (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                ml: 0,
                pl: 0,
                lineHeight: 1.6,
                color: isDark ? "grey.400" : "grey.600",
              }}
            >
              {subTask.description}
            </Typography>
          )}
        </Box>
        <Box display="flex" gap={0.5}>
          <IconButton
            size="small"
            onClick={() => onEdit(subTask)}
            disabled={disabled}
            sx={{
              color: isDark ? "primary.light" : "primary.main",
              "&:hover": {
                bgcolor: isDark ? "primary.dark" : "primary.light",
              },
            }}
          >
            <Edit fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            onClick={() => onDelete(subTask)}
            disabled={disabled}
            sx={{
              color: isDark ? "error.light" : "error.main",
              "&:hover": {
                bgcolor: isDark ? "error.dark" : "error.light",
              },
            }}
          >
            <Delete fontSize="small" />
          </IconButton>
        </Box>
      </Box>
    </Paper>
  );
};

export default SubTaskCard;
