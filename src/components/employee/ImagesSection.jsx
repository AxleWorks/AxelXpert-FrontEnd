import React from "react";
import {
  Box,
  Typography,
  Chip as MuiChip,
  IconButton,
  Collapse,
} from "@mui/material";
import { Upload, Delete, ExpandMore, ExpandLess } from "@mui/icons-material";
import { Button } from "../ui/button";

export function ImagesSection({
  task,
  isTaskStarted,
  isExpanded,
  isUploading,
  onToggle,
  onUpload,
  onRemove,
}) {
  const images = task.taskImages || [];

  return (
    <Box sx={{ mt: 1.5}}>
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
            Images
          </Typography>
          {images.length > 0 && (
            <MuiChip
              label={images.length}
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
          {images.length > 0 && (
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))",
                gap: 1.5,
                mb: 1.5,
              }}
            >
              {images.map((image, index) => (
                <Box
                  key={image.id || index}
                  sx={{
                    position: "relative",
                    paddingTop: "100%",
                    borderRadius: 1,
                    overflow: "hidden",
                    border: "1px solid",
                    borderColor: "divider",
                    "&:hover .delete-btn": {
                      opacity: 1,
                    },
                  }}
                >
                  <Box
                    component="img"
                    src={image.imageUrl}
                    alt={image.description || `Image ${index + 1}`}
                    sx={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                  {isTaskStarted && (
                    <IconButton
                      className="delete-btn"
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemove(image);
                      }}
                      sx={{
                        position: "absolute",
                        top: 4,
                        right: 4,
                        backgroundColor: "rgba(0, 0, 0, 0.6)",
                        color: "white",
                        opacity: 0,
                        transition: "opacity 0.2s",
                        "&:hover": {
                          backgroundColor: "rgba(0, 0, 0, 0.8)",
                        },
                      }}
                    >
                      <Delete fontSize="small" />
                    </IconButton>
                  )}
                  {image.description && (
                    <Box
                      sx={{
                        position: "absolute",
                        bottom: 0,
                        left: 0,
                        right: 0,
                        backgroundColor: "rgba(0, 0, 0, 0.7)",
                        color: "white",
                        p: 0.5,
                        fontSize: "0.7rem",
                      }}
                    >
                      {image.description}
                    </Box>
                  )}
                </Box>
              ))}
            </Box>
          )}

          {isTaskStarted && (
            <Button
              variant="outlined"
              size="small"
              disabled={isUploading}
              onClick={(e) => {
                e.stopPropagation();
                onUpload();
              }}
              fullWidth
              startIcon={<Upload />}
            >
              {isUploading ? "Uploading..." : "Upload Image"}
            </Button>
          )}

          {images.length === 0 && (
            <Typography
              variant="body2"
              sx={{
                textAlign: "center",
                color: "text.secondary",
                py: 1.5,
              }}
            >
              {isTaskStarted
                ? "No images uploaded yet"
                : "Start the task to upload images"}
            </Typography>
          )}
        </Box>
      </Collapse>
    </Box>
  );
}
