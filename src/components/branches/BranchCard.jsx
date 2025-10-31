import React from "react";
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Box,
  IconButton,
  Chip,
  useTheme,
  alpha,
} from "@mui/material";
import {
  Edit,
  Delete,
  LocationOn,
  AccessTime,
  Person,
  Phone,
  Map,
  Email,
} from "@mui/icons-material";

const BranchCard = ({ branch, onEdit, onDelete, isManager }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  return (
    <Card
      elevation={0}
      sx={{
        width: 370,
        minWidth: 370,
        maxWidth: 370,
        height: 420,
        minHeight: 420,
        maxHeight: 420,
        display: "flex",
        flexDirection: "column",
        border: 1,
        borderColor: isDark ? "grey.800" : "grey.200",
        borderRadius: 3,
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        bgcolor: isDark ? "grey.900" : "background.paper",
        position: "relative",
        overflow: "hidden",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 4,
          background: isDark
            ? `linear-gradient(90deg, ${theme.palette.success.dark}, ${theme.palette.success.main})`
            : `linear-gradient(90deg, ${theme.palette.success.main}, ${theme.palette.success.light})`,
          opacity: 0,
          transition: "opacity 0.3s ease",
        },
        "&:hover": {
          borderColor: theme.palette.success.main,
          transform: "translateY(-6px)",
          boxShadow: isDark
            ? `0 12px 32px ${alpha(
                theme.palette.success.dark,
                0.3
              )}, 0 2px 8px rgba(0,0,0,0.4)`
            : `0 12px 32px ${alpha(
                theme.palette.success.main,
                0.15
              )}, 0 2px 8px rgba(0,0,0,0.08)`,
          "&::before": {
            opacity: 1,
          },
        },
      }}
    >
      <CardContent
        sx={{
          flex: 1,
          p: 3,
          pt: 3.5,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {/* Branch Name */}
        <Typography
          variant="h6"
          fontWeight={700}
          gutterBottom
          sx={{
            color: isDark ? "grey.50" : "grey.900",
            mb: 2.5,
            fontSize: "1.15rem",
            letterSpacing: "-0.01em",
            lineHeight: 1.3,
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
          }}
        >
          {branch.name}
        </Typography>

        {/* Location */}
        <Box
          display="flex"
          alignItems="flex-start"
          gap={1.5}
          mb={2}
          sx={{
            bgcolor: isDark
              ? alpha(theme.palette.info.dark, 0.15)
              : alpha(theme.palette.info.light, 0.12),
            border: 1,
            borderColor: isDark
              ? alpha(theme.palette.info.dark, 0.3)
              : alpha(theme.palette.info.main, 0.2),
            px: 2,
            py: 1.5,
            borderRadius: 2,
            transition: "all 0.2s ease",
            "&:hover": {
              bgcolor: isDark
                ? alpha(theme.palette.info.dark, 0.25)
                : alpha(theme.palette.info.light, 0.2),
              borderColor: isDark
                ? alpha(theme.palette.info.main, 0.4)
                : alpha(theme.palette.info.main, 0.3),
            },
          }}
        >
          <LocationOn
            sx={{
              fontSize: 20,
              color: isDark ? "info.light" : "info.dark",
              mt: 0.25,
              flexShrink: 0,
            }}
          />
          <Typography
            variant="body2"
            sx={{
              color: isDark ? "grey.300" : "grey.700",
              lineHeight: 1.6,
              fontSize: "0.9rem",
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
            }}
          >
            {branch.address || "No address provided"}
          </Typography>
        </Box>

        {/* Hours */}
        <Box display="flex" gap={2} mb={2}>
          <Box
            display="flex"
            alignItems="center"
            gap={1.5}
            sx={{
              bgcolor: isDark
                ? alpha(theme.palette.warning.dark, 0.15)
                : alpha(theme.palette.warning.light, 0.12),
              border: 1,
              borderColor: isDark
                ? alpha(theme.palette.warning.dark, 0.3)
                : alpha(theme.palette.warning.main, 0.2),
              px: 2,
              py: 1.25,
              borderRadius: 2,
              flex: 1,
              transition: "all 0.2s ease",
              "&:hover": {
                bgcolor: isDark
                  ? alpha(theme.palette.warning.dark, 0.25)
                  : alpha(theme.palette.warning.light, 0.2),
                borderColor: isDark
                  ? alpha(theme.palette.warning.main, 0.4)
                  : alpha(theme.palette.warning.main, 0.3),
              },
            }}
          >
            <Box
              sx={{
                bgcolor: isDark
                  ? alpha(theme.palette.warning.dark, 0.3)
                  : alpha(theme.palette.warning.main, 0.15),
                borderRadius: 1.5,
                p: 0.75,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <AccessTime
                sx={{
                  fontSize: 20,
                  color: isDark ? "warning.light" : "warning.dark",
                }}
              />
            </Box>
            <Box sx={{ minWidth: 0, flex: 1 }}>
              <Typography
                variant="caption"
                display="block"
                sx={{
                  color: isDark ? "grey.400" : "grey.600",
                  lineHeight: 1,
                  mb: 0.5,
                  fontWeight: 500,
                  textTransform: "uppercase",
                  fontSize: "0.7rem",
                  letterSpacing: "0.5px",
                }}
              >
                Hours
              </Typography>
              <Typography
                variant="body2"
                fontWeight={600}
                sx={{
                  color: isDark ? "warning.light" : "warning.dark",
                  fontSize: "0.85rem",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {branch.openHours && branch.closeHours
                  ? `${branch.openHours} - ${branch.closeHours}`
                  : "Not set"}
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Manager */}
        {branch.managerName && (
          <Box
            display="flex"
            alignItems="center"
            gap={1.5}
            mb={2}
            sx={{
              bgcolor: isDark
                ? alpha(theme.palette.primary.dark, 0.15)
                : alpha(theme.palette.primary.light, 0.12),
              border: 1,
              borderColor: isDark
                ? alpha(theme.palette.primary.dark, 0.3)
                : alpha(theme.palette.primary.main, 0.2),
              px: 2,
              py: 1.25,
              borderRadius: 2,
              transition: "all 0.2s ease",
              "&:hover": {
                bgcolor: isDark
                  ? alpha(theme.palette.primary.dark, 0.25)
                  : alpha(theme.palette.primary.light, 0.2),
                borderColor: isDark
                  ? alpha(theme.palette.primary.main, 0.4)
                  : alpha(theme.palette.primary.main, 0.3),
              },
            }}
          >
            <Person
              sx={{
                fontSize: 20,
                color: isDark ? "primary.light" : "primary.dark",
              }}
            />
            <Box sx={{ minWidth: 0, flex: 1 }}>
              <Typography
                variant="caption"
                display="block"
                sx={{
                  color: isDark ? "grey.400" : "grey.600",
                  lineHeight: 1,
                  mb: 0.5,
                  fontWeight: 500,
                  textTransform: "uppercase",
                  fontSize: "0.7rem",
                  letterSpacing: "0.5px",
                }}
              >
                Manager
              </Typography>
              <Typography
                variant="body2"
                fontWeight={600}
                sx={{
                  color: isDark ? "primary.light" : "primary.dark",
                  fontSize: "0.9rem",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {branch.managerName}
              </Typography>
            </Box>
          </Box>
        )}

        {/* Phone */}
        {branch.phone && (
          <Box
            display="flex"
            alignItems="center"
            gap={1.5}
            sx={{
              bgcolor: isDark
                ? alpha(theme.palette.background.paper, 0.4)
                : "grey.50",
              px: 2,
              py: 1.25,
              borderRadius: 2,
              borderLeft: 4,
              borderColor: isDark ? "success.dark" : "success.light",
            }}
          >
            <Phone
              sx={{
                fontSize: 18,
                color: isDark ? "grey.500" : "grey.400",
              }}
            />
            <Typography
              variant="body2"
              sx={{
                color: isDark ? "grey.300" : "grey.700",
                fontSize: "0.9rem",
                fontWeight: 500,
              }}
            >
              {branch.phone}
            </Typography>
          </Box>
        )}
      </CardContent>

      {/* Actions */}
      <CardActions
        sx={{
          p: 2.5,
          pt: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderTop: 1,
          borderColor: isDark ? "grey.800" : "grey.100",
          mt: "auto",
          bgcolor: isDark
            ? alpha(theme.palette.background.default, 0.3)
            : alpha(theme.palette.success.main, 0.02),
        }}
      >
        {/* Contact & Map Icons - Available for all users */}
        <Box display="flex" gap={1}>
          {/* Map Link */}
          {branch.mapLink && (
            <IconButton
              size="medium"
              onClick={() => window.open(branch.mapLink, "_blank")}
              sx={{
                color: isDark ? "success.light" : "success.main",
                border: 1,
                borderColor: isDark
                  ? alpha(theme.palette.success.dark, 0.3)
                  : alpha(theme.palette.success.main, 0.2),
                borderRadius: 1.5,
                transition: "all 0.2s ease",
                "&:hover": {
                  bgcolor: isDark
                    ? alpha(theme.palette.success.dark, 0.2)
                    : alpha(theme.palette.success.light, 0.2),
                  borderColor: theme.palette.success.main,
                  transform: "translateY(-2px)",
                },
              }}
            >
              <Map fontSize="small" />
            </IconButton>
          )}

          {/* Email Link */}
          {branch.email && (
            <IconButton
              size="medium"
              onClick={() => {
                window.location.href = `mailto:${branch.email}`;
              }}
              sx={{
                color: isDark ? "warning.light" : "warning.main",
                border: 1,
                borderColor: isDark
                  ? alpha(theme.palette.warning.dark, 0.3)
                  : alpha(theme.palette.warning.main, 0.2),
                borderRadius: 1.5,
                transition: "all 0.2s ease",
                "&:hover": {
                  bgcolor: isDark
                    ? alpha(theme.palette.warning.dark, 0.2)
                    : alpha(theme.palette.warning.light, 0.2),
                  borderColor: theme.palette.warning.main,
                  transform: "translateY(-2px)",
                },
              }}
            >
              <Email fontSize="small" />
            </IconButton>
          )}
        </Box>

        {/* Manager Actions */}
        {isManager && (
          <Box display="flex" gap={1}>
            <IconButton
              size="medium"
              onClick={() => onEdit(branch)}
              sx={{
                color: isDark ? "primary.light" : "primary.main",
                border: 1,
                borderColor: isDark
                  ? alpha(theme.palette.primary.dark, 0.3)
                  : alpha(theme.palette.primary.main, 0.2),
                borderRadius: 1.5,
                transition: "all 0.2s ease",
                "&:hover": {
                  bgcolor: isDark
                    ? alpha(theme.palette.primary.dark, 0.2)
                    : alpha(theme.palette.primary.light, 0.2),
                  borderColor: theme.palette.primary.main,
                  transform: "translateY(-2px)",
                },
              }}
            >
              <Edit fontSize="small" />
            </IconButton>
            <IconButton
              size="medium"
              onClick={() => onDelete(branch.id)}
              sx={{
                color: isDark ? "error.light" : "error.main",
                border: 1,
                borderColor: isDark
                  ? alpha(theme.palette.error.dark, 0.3)
                  : alpha(theme.palette.error.main, 0.2),
                borderRadius: 1.5,
                transition: "all 0.2s ease",
                "&:hover": {
                  bgcolor: isDark
                    ? alpha(theme.palette.error.dark, 0.2)
                    : alpha(theme.palette.error.light, 0.2),
                  borderColor: theme.palette.error.main,
                  transform: "translateY(-2px)",
                },
              }}
            >
              <Delete fontSize="small" />
            </IconButton>
          </Box>
        )}
      </CardActions>
    </Card>
  );
};

export default BranchCard;
