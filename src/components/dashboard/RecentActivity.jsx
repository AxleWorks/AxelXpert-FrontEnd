import React from "react";
import {
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
} from "@mui/material";
import { ArrowForwardIos } from "@mui/icons-material";

const RecentActivity = ({ activities }) => (
  <Card
    elevation={0}
    sx={{
      borderRadius: 3,
      border: "1px solid #e2e8f0",
      height: "100%",
    }}
  >
    <CardContent>
      <Typography
        variant="h6"
        sx={{ fontWeight: 600, mb: 2, color: "#1e293b" }}
      >
        Recent Activity
      </Typography>
      <List disablePadding>
        {activities.map((activity, index) => (
          <ListItem key={index} disablePadding sx={{ mb: 1 }}>
            <ListItemAvatar>
              <Avatar
                sx={{ backgroundColor: activity.color, width: 32, height: 32 }}
              >
                {activity.icon}
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={activity.title}
              secondary={activity.time}
              primaryTypographyProps={{
                fontSize: "0.875rem",
                fontWeight: 500,
              }}
              secondaryTypographyProps={{
                fontSize: "0.75rem",
              }}
            />
            <ListItemSecondaryAction>
              <IconButton size="small">
                <ArrowForwardIos sx={{ fontSize: 12 }} />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>
    </CardContent>
  </Card>
);

export default RecentActivity;
