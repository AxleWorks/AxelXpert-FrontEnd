import React from "react";
import { Card, Typography } from "@mui/material";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const RevenuePieChart = () => {
  const revenueData = [
    { name: "Vehicle Sales", value: 45, color: "#3b82f6" },
    { name: "Service & Repair", value: 30, color: "#10b981" },
    { name: "Parts", value: 15, color: "#f59e0b" },
    { name: "Maintenance", value: 10, color: "#ef4444" },
  ];

  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: 3,
        border: "1px solid #e2e8f0",
        p: 3,
        width: "120%",
        height: "400px",
      }}
    >
      <Typography
        variant="h6"
        sx={{ fontWeight: 700, mb: 3, color: "#1e293b" }}
      >
        Revenue Distribution
      </Typography>
      <ResponsiveContainer width="100%" height="85%">
        <PieChart>
          <Pie
            data={revenueData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={120}
            paddingAngle={5}
            dataKey="value"
          >
            {revenueData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: "#ffffff",
              border: "1px solid #e2e8f0",
              borderRadius: "8px",
              boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
            }}
            formatter={(value) => [`${value}%`, ""]}
          />
          <Legend
            verticalAlign="bottom"
            height={36}
            iconType="circle"
            wrapperStyle={{ fontSize: "12px" }}
          />
        </PieChart>
      </ResponsiveContainer>
    </Card>
  );
};

export default RevenuePieChart;
