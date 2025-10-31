import React from "react";
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Box,
  IconButton,
  Button,
  Chip,
  useTheme,
  alpha,
} from "@mui/material";
import {
  Edit,
  Delete,
  ListAlt,
  AccessTime,
  AttachMoney,
  Description,
} from "@mui/icons-material";

const ServiceCard = ({ service, onEdit, onDelete, onManageSubTasks }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  return (
    <Card
      elevation={0}
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        border: 1,
        borderColor: isDark ? "grey.800" : "grey.200",
        borderRadius: 2,
        transition: "all 0.2s ease-in-out",
        bgcolor: isDark ? "grey.900" : "background.paper",
        "&:hover": {
          borderColor: isDark ? "primary.dark" : "primary.light",
          transform: "translateY(-4px)",
          boxShadow: isDark
            ? "0 8px 24px rgba(0,0,0,0.4)"
            : "0 8px 24px rgba(0,0,0,0.1)",
        },
      }}
    >
      <CardContent sx={{ flex: 1, p: 3 }}>
        {/* Service Name */}
        <Typography
          variant="h6"
          fontWeight={700}
          gutterBottom
          sx={{
            color: isDark ? "grey.100" : "grey.900",
            mb: 2,
          }}
        >
          {service.name}
        </Typography>

        {/* Price and Duration */}
        <Box display="flex" gap={2} mb={2}>
          <Box
            display="flex"
            alignItems="center"
            gap={1}
            sx={{
              bgcolor: isDark
                ? alpha(theme.palette.success.dark, 0.2)
                : alpha(theme.palette.success.light, 0.15),
              px: 1.5,
              py: 0.75,
              borderRadius: 1.5,
              flex: 1,
            }}
          >
            <AttachMoney
              sx={{
                fontSize: 20,
                color: isDark ? "success.light" : "success.dark",
              }}
            />
            <Box>
              <Typography
                variant="caption"
                display="block"
                sx={{ color: isDark ? "grey.400" : "grey.600", lineHeight: 1 }}
              >
                Price
              </Typography>
              <Typography
                variant="body1"
                fontWeight={700}
                sx={{ color: isDark ? "success.light" : "success.dark" }}
              >
                ${service.price.toFixed(2)}
              </Typography>
            </Box>
          </Box>

          <Box
            display="flex"
            alignItems="center"
            gap={1}
            sx={{
              bgcolor: isDark
                ? alpha(theme.palette.info.dark, 0.2)
                : alpha(theme.palette.info.light, 0.15),
              px: 1.5,
              py: 0.75,
              borderRadius: 1.5,
              flex: 1,
            }}
          >
            <AccessTime
              sx={{
                fontSize: 20,
                color: isDark ? "info.light" : "info.dark",
              }}
            />
            <Box>
              <Typography
                variant="caption"
                display="block"
                sx={{ color: isDark ? "grey.400" : "grey.600", lineHeight: 1 }}
              >
                Duration
              </Typography>
              <Typography
                variant="body1"
                fontWeight={700}
                sx={{ color: isDark ? "info.light" : "info.dark" }}
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
            gap={1}
            sx={{
              bgcolor: isDark ? "grey.850" : "grey.50",
              p: 1.5,
              borderRadius: 1.5,
              borderLeft: 3,
              borderColor: isDark ? "grey.700" : "grey.300",
            }}
          >
            <Description
              sx={{
                fontSize: 18,
                color: isDark ? "grey.500" : "grey.400",
                mt: 0.25,
              }}
            />
            <Typography
              variant="body2"
              sx={{
                color: isDark ? "grey.300" : "grey.700",
                lineHeight: 1.6,
              }}
            >
              {service.description}
            </Typography>
          </Box>
        ) : (
          <Box
            sx={{
              bgcolor: isDark ? "grey.850" : "grey.50",
              p: 1.5,
              borderRadius: 1.5,
              textAlign: "center",
            }}
          >
            <Typography
              variant="body2"
              color="text.secondary"
              fontStyle="italic"
            >
              No description
            </Typography>
          </Box>
        )}
      </CardContent>

      {/* Actions */}
      <CardActions
        sx={{
          p: 2,
          pt: 0,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderTop: 1,
          borderColor: isDark ? "grey.800" : "grey.100",
          mt: "auto",
        }}
      >
        <Button
          variant="outlined"
          size="small"
          startIcon={<ListAlt />}
          onClick={() => onManageSubTasks(service)}
          sx={{
            textTransform: "none",
            borderRadius: 1.5,
            fontWeight: 600,
            px: 2,
          }}
        >
          SubTasks
        </Button>

        <Box display="flex" gap={0.5}>
          <IconButton
            size="small"
            onClick={() => onEdit(service)}
            sx={{
              color: isDark ? "primary.light" : "primary.main",
              "&:hover": {
                bgcolor: isDark
                  ? alpha(theme.palette.primary.dark, 0.2)
                  : alpha(theme.palette.primary.light, 0.2),
              },
            }}
          >
            <Edit fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            onClick={() => onDelete(service)}
            sx={{
              color: isDark ? "error.light" : "error.main",
              "&:hover": {
                bgcolor: isDark
                  ? alpha(theme.palette.error.dark, 0.2)
                  : alpha(theme.palette.error.light, 0.2),
              },
            }}
          >
            <Delete fontSize="small" />
          </IconButton>
        </Box>
      </CardActions>
    </Card>
  );
};

export default ServiceCard;
