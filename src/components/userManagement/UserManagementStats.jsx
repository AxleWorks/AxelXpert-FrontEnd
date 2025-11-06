import React from "react";
import { Box, Grid, Typography } from "@mui/material";
import { User, UserCheck, UserX } from "lucide-react";
import { Card, CardContent } from "../ui/card";

const StatCard = React.memo(
  ({ title, value, Icon, iconBg = "#f3f8ff", iconColor = "#0b75d9" }) => (
    <Card
      sx={{
        borderRadius: 3,
        display: "flex",
        flexDirection: "column",
        flex: 1,
        minHeight: 140,
        width: "100%",
      }}
    >
      <CardContent
        sx={{
          p: 3,
          flexGrow: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 2,
            width: "100%",
          }}
        >
          <Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              {title}
            </Typography>
            <Typography variant="h4" fontWeight={800} sx={{ lineHeight: 1 }}>
              {value}
            </Typography>
          </Box>

          <Box
            sx={{
              width: 56,
              height: 56,
              borderRadius: 12,
              backgroundColor: iconBg,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 1px 2px rgba(0,0,0,0.06)",
            }}
          >
            {Icon ? <Icon size={20} color={iconColor} /> : null}
          </Box>
        </Box>
      </CardContent>
    </Card>
  )
);

StatCard.displayName = "StatCard";

const UserManagementStats = React.memo(({ employees, type = "employees" }) => {
  const stats = React.useMemo(() => {
    const totalEmployees = employees.length;
    const activeEmployees = employees.filter(
      (emp) => emp.isActive && !emp.isBlocked
    ).length;
    const inactiveEmployees = employees.filter(
      (emp) => !emp.isActive || emp.isBlocked
    ).length;

    return { totalEmployees, activeEmployees, inactiveEmployees };
  }, [employees]);

  // Labels change based on type
  const labels =
    type === "customers"
      ? {
          total: "Total Customers",
          active: "Active",
          inactive: "Inactive/Blocked",
        }
      : {
          total: "Total Employees",
          active: "Active",
          inactive: "Inactive/Blocked",
        };

  return (
    <Grid
      container
      spacing={3}
      sx={{ mb: 3, alignItems: "stretch", width: "100%" }}
    >
      <Grid
        item
        xs={12}
        md={4}
        sx={{
          display: "flex",
          alignItems: "stretch",
          flex: 1,
          minWidth: 0,
        }}
      >
        <StatCard
          title={labels.total}
          value={stats.totalEmployees}
          Icon={User}
          iconBg="#eaf3ff"
          iconColor="#0b75d9"
        />
      </Grid>
      <Grid
        item
        xs={12}
        md={4}
        sx={{
          display: "flex",
          alignItems: "stretch",
          flex: 1,
          minWidth: 0,
        }}
      >
        <StatCard
          title={labels.active}
          value={stats.activeEmployees}
          Icon={UserCheck}
          iconBg="#e9fbf0"
          iconColor="#10b981"
        />
      </Grid>
      <Grid
        item
        xs={12}
        md={4}
        sx={{
          display: "flex",
          alignItems: "stretch",
          flex: 1,
          minWidth: 0,
        }}
      >
        <StatCard
          title={labels.inactive}
          value={stats.inactiveEmployees}
          Icon={UserX}
          iconBg="#fff6ea"
          iconColor="#f59e0b"
        />
      </Grid>
    </Grid>
  );
});

UserManagementStats.displayName = "UserManagementStats";

export default UserManagementStats;
