import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  useTheme,
  alpha,
} from "@mui/material";
import {
  AccessTime,
  AttachMoney,
  Description,
  CheckCircle,
} from "@mui/icons-material";

const UserServiceCard = ({ service }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  return (
    <Card
      elevation={0}
      sx={{
        width: 370,
        minWidth: 370,
        maxWidth: 370,
        height: 380,
        minHeight: 380,
        maxHeight: 380,
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
            ? `linear-gradient(90deg, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`
            : `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
          opacity: 0,
          transition: "opacity 0.3s ease",
        },
        "&:hover": {
          borderColor: theme.palette.primary.main,
          transform: "translateY(-6px)",
          boxShadow: isDark
            ? `0 12px 32px ${alpha(
                theme.palette.primary.dark,
                0.3
              )}, 0 2px 8px rgba(0,0,0,0.4)`
            : `0 12px 32px ${alpha(
                theme.palette.primary.main,
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
        {/* Service Name */}
        <Box
          display="flex"
          alignItems="flex-start"
          justifyContent="space-between"
          mb={2.5}
        >
          <Typography
            variant="h6"
            fontWeight={700}
            sx={{
              color: isDark ? "grey.50" : "grey.900",
              fontSize: "1.15rem",
              letterSpacing: "-0.01em",
              lineHeight: 1.3,
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              flex: 1,
            }}
          >
            {service.name}
          </Typography>
          <Chip
            icon={<CheckCircle sx={{ fontSize: 16 }} />}
            label="Available"
            size="small"
            sx={{
              ml: 1.5,
              bgcolor: isDark
                ? alpha(theme.palette.success.dark, 0.2)
                : alpha(theme.palette.success.light, 0.15),
              color: isDark ? "success.light" : "success.dark",
              fontWeight: 600,
              fontSize: "0.7rem",
              height: 24,
              "& .MuiChip-icon": {
                color: isDark ? "success.light" : "success.dark",
              },
            }}
          />
        </Box>

        {/* Price and Duration */}
        <Box display="flex" gap={2} mb={2.5}>
          <Box
            display="flex"
            alignItems="center"
            gap={1.5}
            sx={{
              bgcolor: isDark
                ? alpha(theme.palette.success.dark, 0.15)
                : alpha(theme.palette.success.light, 0.12),
              border: 1,
              borderColor: isDark
                ? alpha(theme.palette.success.dark, 0.3)
                : alpha(theme.palette.success.main, 0.2),
              px: 2,
              py: 1.25,
              borderRadius: 2,
              flex: 1,
              transition: "all 0.2s ease",
              "&:hover": {
                bgcolor: isDark
                  ? alpha(theme.palette.success.dark, 0.25)
                  : alpha(theme.palette.success.light, 0.2),
                borderColor: isDark
                  ? alpha(theme.palette.success.main, 0.4)
                  : alpha(theme.palette.success.main, 0.3),
              },
            }}
          >
            <Box
              sx={{
                bgcolor: isDark
                  ? alpha(theme.palette.success.dark, 0.3)
                  : alpha(theme.palette.success.main, 0.15),
                borderRadius: 1.5,
                p: 0.75,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <AttachMoney
                sx={{
                  fontSize: 22,
                  color: isDark ? "success.light" : "success.dark",
                }}
              />
            </Box>
            <Box>
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
                Price
              </Typography>
              <Typography
                variant="body1"
                fontWeight={700}
                sx={{
                  color: isDark ? "success.light" : "success.dark",
                  fontSize: "1.1rem",
                }}
              >
                ${service.price.toFixed(2)}
              </Typography>
            </Box>
          </Box>

          <Box
            display="flex"
            alignItems="center"
            gap={1.5}
            sx={{
              bgcolor: isDark
                ? alpha(theme.palette.info.dark, 0.15)
                : alpha(theme.palette.info.light, 0.12),
              border: 1,
              borderColor: isDark
                ? alpha(theme.palette.info.dark, 0.3)
                : alpha(theme.palette.info.main, 0.2),
              px: 2,
              py: 1.25,
              borderRadius: 2,
              flex: 1,
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
            <Box
              sx={{
                bgcolor: isDark
                  ? alpha(theme.palette.info.dark, 0.3)
                  : alpha(theme.palette.info.main, 0.15),
                borderRadius: 1.5,
                p: 0.75,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <AccessTime
                sx={{
                  fontSize: 22,
                  color: isDark ? "info.light" : "info.dark",
                }}
              />
            </Box>
            <Box>
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
                Duration
              </Typography>
              <Typography
                variant="body1"
                fontWeight={700}
                sx={{
                  color: isDark ? "info.light" : "info.dark",
                  fontSize: "1.1rem",
                }}
              >
                {service.durationMinutes} min
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Description */}
        {service.description ? (
          <Box
            display="flex"
            gap={1.5}
            sx={{
              bgcolor: isDark
                ? alpha(theme.palette.background.paper, 0.4)
                : "grey.50",
              p: 2,
              borderRadius: 2,
              borderLeft: 4,
              borderColor: isDark ? "primary.dark" : "primary.light",
              transition: "all 0.2s ease",
              flex: 1,
              overflow: "hidden",
              minHeight: 0,
              "&:hover": {
                bgcolor: isDark
                  ? alpha(theme.palette.background.paper, 0.6)
                  : alpha(theme.palette.primary.light, 0.05),
              },
            }}
          >
            <Description
              sx={{
                fontSize: 20,
                color: isDark ? "grey.500" : "grey.400",
                mt: 0.25,
                flexShrink: 0,
              }}
            />
            <Typography
              variant="body2"
              sx={{
                color: isDark ? "grey.300" : "grey.700",
                lineHeight: 1.7,
                fontSize: "0.9rem",
                overflow: "hidden",
                textOverflow: "ellipsis",
                display: "-webkit-box",
                WebkitLineClamp: 4,
                WebkitBoxOrient: "vertical",
              }}
            >
              {service.description}
            </Typography>
          </Box>
        ) : (
          <Box
            sx={{
              bgcolor: isDark
                ? alpha(theme.palette.background.paper, 0.3)
                : "grey.50",
              p: 2,
              borderRadius: 2,
              textAlign: "center",
              border: 1,
              borderStyle: "dashed",
              borderColor: isDark ? "grey.700" : "grey.300",
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Typography
              variant="body2"
              sx={{
                color: isDark ? "grey.500" : "grey.500",
                fontStyle: "italic",
              }}
            >
              No description provided
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default UserServiceCard;
