import React from "react";
import { Card, Typography } from "@mui/material";
import {
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const ServiceBarChart = () => {
  const serviceData = [
    { service: "Oil Change", count: 145, revenue: 8700 },
    { service: "Brake Repair", count: 89, revenue: 15680 },
    { service: "Tire Rotation", count: 134, revenue: 6700 },
    { service: "Engine Diagnostic", count: 67, revenue: 20100 },
    { service: "Battery Replacement", count: 92, revenue: 13800 },
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
        Service Performance
      </Typography>
      <ResponsiveContainer width="100%" height="90%">
        <BarChart data={serviceData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis
            dataKey="service"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 11, fill: "#64748b" }}
            angle={-45}
            textAnchor="end"
            height={80}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: "#64748b" }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#ffffff",
              border: "1px solid #e2e8f0",
              borderRadius: "8px",
              boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
            }}
          />
          <Bar
            dataKey="count"
            fill="#3b82f6"
            radius={[4, 4, 0, 0]}
            name="Count"
          />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
};

export default ServiceBarChart;
