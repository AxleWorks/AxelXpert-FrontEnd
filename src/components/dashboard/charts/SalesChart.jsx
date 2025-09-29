import React from "react";
import { Card, Typography, Box } from "@mui/material";
import {
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const SalesChart = () => {
  const salesData = [
    { month: "Jan", sales: 45000, services: 28000 },
    { month: "Feb", sales: 52000, services: 31000 },
    { month: "Mar", sales: 48000, services: 35000 },
    { month: "Apr", sales: 61000, services: 42000 },
    { month: "May", sales: 55000, services: 38000 },
    { month: "Jun", sales: 67000, services: 45000 },
  ];

  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: 3,
        border: "1px solid #e2e8f0",
        p: 3,
        height: "400px",
      }}
    >
      <Typography
        variant="h6"
        sx={{ fontWeight: 700, mb: 3, color: "#1e293b" }}
      >
        Sales Overview
      </Typography>
      <ResponsiveContainer width="100%" height="90%">
        <AreaChart data={salesData}>
          <defs>
            <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="servicesGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis
            dataKey="month"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: "#64748b" }}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: "#64748b" }}
            tickFormatter={(value) => `$${value / 1000}k`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#ffffff",
              border: "1px solid #e2e8f0",
              borderRadius: "8px",
              boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
            }}
            formatter={(value) => [`$${value.toLocaleString()}`, ""]}
          />
          <Area
            type="monotone"
            dataKey="sales"
            stroke="#3b82f6"
            strokeWidth={3}
            fill="url(#salesGradient)"
            name="Sales"
          />
          <Area
            type="monotone"
            dataKey="services"
            stroke="#10b981"
            strokeWidth={3}
            fill="url(#servicesGradient)"
            name="Services"
          />
        </AreaChart>
      </ResponsiveContainer>
    </Card>
  );
};

export default SalesChart;
