import React from "react";
import { Card, CardContent } from "./card";

export function KPICard({
  title,
  value,
  icon: Icon,
  trend,
  trendUp,
  color = "bg-primary",
}) {
  const colorClass = color.includes("bg-") ? color : `bg-${color}`;

  return (
    <Card sx={{ overflow: "hidden" }}>
      <CardContent sx={{ p: 3 }}>
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
          }}
        >
          <div style={{ flex: 1 }}>
            <p
              style={{
                color: "text.secondary",
                marginBottom: "4px",
                fontSize: "0.875rem",
              }}
            >
              {title}
            </p>
            <h3
              style={{
                marginBottom: "8px",
                fontSize: "1.5rem",
                fontWeight: "bold",
              }}
            >
              {value}
            </h3>
            {trend && (
              <p
                style={{
                  color: trendUp ? "#16a34a" : "#dc2626",
                  fontSize: "0.875rem",
                }}
              >
                {trend}
              </p>
            )}
          </div>
          <div
            style={{
              backgroundColor: colorClass.includes("primary")
                ? "#1976d2"
                : colorClass.includes("green")
                ? "#16a34a"
                : colorClass.includes("secondary")
                ? "#9e9e9e"
                : colorClass.includes("accent")
                ? "#9c27b0"
                : "#1976d2",
              borderRadius: "12px",
              padding: "12px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Icon style={{ height: "24px", width: "24px", color: "white" }} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
