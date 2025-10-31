import React, { useState } from "react";
import {
  Box,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
} from "@mui/material";
import {
  Upload,
  Close,
  Delete,
} from "@mui/icons-material";
import { Button } from "../ui/button";

export function TaskImageUploadModal({
  open,
  onClose,
  onConfirm,
  isUploading = false,
}) {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [imageDescriptions, setImageDescriptions] = useState({});
  const [previewUrls, setPreviewUrls] = useState({});

  const handleFileSelect = (event) => {
    const files = Array.from(event.target.files);

    if (files.length === 0) return;

    const file = files[0];

    const fileId = `${Date.now()}`;

    // Revoke previous preview URL if exists
    if (Object.keys(previewUrls).length > 0) {
      Object.values(previewUrls).forEach(url => URL.revokeObjectURL(url));
    }
    
    // Clear previous selections and set new single file
    setSelectedFiles([{ id: fileId, file }]);
    setPreviewUrls({ [fileId]: URL.createObjectURL(file) });
    setImageDescriptions({ [fileId]: "" });
  };

  const handleRemoveSelectedFile = (fileId) => {
    setSelectedFiles([]);
    setImageDescriptions({});
    
    // Revoke preview URL to free memory
    if (previewUrls[fileId]) {
      URL.revokeObjectURL(previewUrls[fileId]);
    }
    
    setPreviewUrls({});
  };

  const handleDescriptionChange = (fileId, description) => {
    setImageDescriptions((prev) => ({
      ...prev,
      [fileId]: description,
    }));
  };

  const handleConfirm = () => {
    if (selectedFiles.length === 0) {
      console.warn("No file selected");
      return;
    }

    const { id, file } = selectedFiles[0];
    const description = imageDescriptions[id] || "";

    onConfirm(file, description);
    handleClose();
  };

  const handleClose = () => {
    // Revoke all preview URLs to free memory
    Object.values(previewUrls).forEach(url => URL.revokeObjectURL(url));
    
    setSelectedFiles([]);
    setImageDescriptions({});
    setPreviewUrls({});
    
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography variant="h6">Upload Image</Typography>
          <IconButton onClick={handleClose} size="small">
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3, mt: 2 }}>
          <Button
            component="label"
            variant="outlined"
            sx={{
              py: 3,
              borderStyle: "dashed",
              borderWidth: 2,
              borderColor: "divider",
              "&:hover": {
                borderColor: "primary.main",
                backgroundColor: "action.hover",
              },
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 1,
              }}
            >
              <Upload sx={{ fontSize: "2.5rem", color: "primary.main" }} />
              <Typography>Click to select an image</Typography>
              <Typography variant="caption" color="text.secondary">
                Maximum file size: 10MB
              </Typography>
            </Box>
            <input
              type="file"
              hidden
              accept="image/*"
              onChange={handleFileSelect}
            />
          </Button>

          {selectedFiles.length > 0 && (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: "medium" }}>
                Selected Image
              </Typography>
              {selectedFiles.map(({ id, file }) => (
                <Box
                  key={id}
                  sx={{
                    display: "flex",
                    gap: 2,
                    p: 2,
                    border: "1px solid",
                    borderColor: "divider",
                    borderRadius: 1,
                    alignItems: "flex-start",
                  }}
                >
                  <Box
                    component="img"
                    src={previewUrls[id]}
                    alt={file.name}
                    sx={{
                      width: 120,
                      height: 120,
                      objectFit: "cover",
                      borderRadius: 1,
                      flexShrink: 0,
                    }}
                  />

                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="body2" sx={{ fontWeight: "medium" }}>
                      {file.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </Typography>

                    <TextField
                      fullWidth
                      size="small"
                      label="Image Description (Optional)"
                      placeholder="Enter description for this image"
                      value={imageDescriptions[id] || ""}
                      onChange={(e) =>
                        handleDescriptionChange(id, e.target.value)
                      }
                      multiline
                      rows={2}
                      sx={{ mt: 1.5 }}
                    />
                  </Box>

                  <IconButton
                    size="small"
                    onClick={() => handleRemoveSelectedFile(id)}
                    sx={{
                      color: "error.main",
                      "&:hover": {
                        backgroundColor: "error.light",
                      },
                    }}
                  >
                    <Delete />
                  </IconButton>
                </Box>
              ))}
            </Box>
          )}
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 2, pt: 0 }}>
        <Button onClick={handleClose} variant="outlined">
          Cancel
        </Button>
        <Button
          onClick={handleConfirm}
          disabled={selectedFiles.length === 0 || isUploading}
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
          {isUploading ? "Uploading..." : "Upload Image"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
