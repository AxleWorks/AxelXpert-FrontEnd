import React, { forwardRef } from "react";
import html2pdf from "html2pdf.js";
import { Download, FileText } from "lucide-react";
import { Button } from "../ui/button";

// PDF Report Template Component
const PDFReportTemplate = forwardRef(
  ({ reportData, filters, appointments = [] }, ref) => {
    const currentDate = new Date().toLocaleDateString();
    const reportTitle = "AxleXpert - Appointment Reports";

    // Filter appointments based on the current filters
    const filteredAppointments = appointments.filter((appointment) => {
      if (!appointment) return false;

      // Parse booking date - be flexible with date parsing
      const bookingDate = new Date(
        appointment.startAt ||
          appointment.date ||
          appointment.createdAt ||
          appointment.updatedAt ||
          new Date()
      );

      // Date range filtering
      const startDate = new Date(filters.startDate);
      const endDate = new Date(filters.endDate);

      const dateInRange =
        isNaN(bookingDate.getTime()) ||
        (bookingDate >= startDate && bookingDate <= endDate);

      // Branch filtering
      const branchMatch =
        filters.branch === "all" ||
        appointment.branchId?.toString() === filters.branch ||
        appointment.branchName
          ?.toLowerCase()
          .includes(filters.branch.toLowerCase());

      // Service type filtering
      const serviceMatch =
        filters.serviceType === "all" ||
        appointment.serviceId?.toString() === filters.serviceType ||
        appointment.serviceName
          ?.toLowerCase()
          .includes(filters.serviceType.toLowerCase());

      return dateInRange && branchMatch && serviceMatch;
    });

    // Calculate total revenue from filtered appointments
    const totalRevenue = filteredAppointments.reduce((sum, appointment) => {
      const revenue = parseFloat(
        appointment.totalPrice || appointment.price || appointment.cost || 0
      );
      return sum + (isNaN(revenue) ? 0 : revenue);
    }, 0);

    return (
      <div
        ref={ref}
        style={{
          padding: "40px",
          fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
          backgroundColor: "#ffffff",
          color: "#1a1a1a",
          width: "100%",
          minHeight: "100vh",
          lineHeight: "1.6",
        }}
      >
        {/* Professional Header */}
        <div
          style={{
            borderBottom: "4px solid #2563eb",
            paddingBottom: "30px",
            marginBottom: "40px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          <div>
            <h1
              style={{
                color: "#1e40af",
                margin: "0 0 8px 0",
                fontSize: "32px",
                fontWeight: 700,
                letterSpacing: "-0.5px",
              }}
            >
              AxleXpert Analytics Report
            </h1>
            <p
              style={{
                color: "#64748b",
                margin: "0",
                fontSize: "16px",
                fontWeight: 400,
              }}
            >
              Comprehensive Business Intelligence & Performance Metrics
            </p>
            <p
              style={{
                color: "#94a3b8",
                margin: "8px 0 0 0",
                fontSize: "14px",
                fontWeight: 500,
              }}
            >
              Generated: {currentDate}
            </p>
          </div>
          <div style={{ textAlign: "right" }}>
            <div
              style={{
                color: "#1e40af",
                fontSize: "24px",
                fontWeight: 700,
                marginBottom: "4px",
              }}
            >
              AxleXpert
            </div>
            <div
              style={{
                color: "#64748b",
                fontSize: "14px",
                fontWeight: 500,
              }}
            >
              Professional Vehicle Service Management
            </div>
          </div>
        </div>

        {/* Report Filters */}
        <div
          style={{
            marginBottom: "40px",
            backgroundColor: "#f8fafc",
            border: "1px solid #e2e8f0",
            borderRadius: "8px",
            padding: "24px",
          }}
        >
          <h3
            style={{
              color: "#1e293b",
              margin: "0 0 20px 0",
              fontSize: "18px",
              fontWeight: 600,
              borderBottom: "2px solid #e2e8f0",
              paddingBottom: "8px",
            }}
          >
            Report Parameters
          </h3>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "20px",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span
                style={{
                  fontSize: "12px",
                  fontWeight: 600,
                  color: "#64748b",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                  marginBottom: "4px",
                }}
              >
                Date Range
              </span>
              <span
                style={{
                  fontSize: "14px",
                  color: "#1e293b",
                  fontWeight: 500,
                }}
              >
                {filters.startDate} → {filters.endDate}
              </span>
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span
                style={{
                  fontSize: "12px",
                  fontWeight: 600,
                  color: "#64748b",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                  marginBottom: "4px",
                }}
              >
                Branch Filter
              </span>
              <span
                style={{
                  fontSize: "14px",
                  color: "#1e293b",
                  fontWeight: 500,
                }}
              >
                {filters.branch === "all" ? "All Branches" : filters.branch}
              </span>
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span
                style={{
                  fontSize: "12px",
                  fontWeight: 600,
                  color: "#64748b",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                  marginBottom: "4px",
                }}
              >
                Service Filter
              </span>
              <span
                style={{
                  fontSize: "14px",
                  color: "#1e293b",
                  fontWeight: 500,
                }}
              >
                {filters.serviceType === "all"
                  ? "All Services"
                  : filters.serviceType}
              </span>
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span
                style={{
                  fontSize: "12px",
                  fontWeight: 600,
                  color: "#64748b",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                  marginBottom: "4px",
                }}
              >
                Total Records
              </span>
              <span
                style={{
                  fontSize: "14px",
                  color: "#1e293b",
                  fontWeight: 500,
                }}
              >
                {filteredAppointments.length} appointments
              </span>
            </div>
          </div>
        </div>

        {/* KPI Summary */}
        <div style={{ marginBottom: "40px" }}>
          <h3
            style={{
              color: "#1e293b",
              margin: "0 0 24px 0",
              fontSize: "20px",
              fontWeight: 600,
              borderBottom: "2px solid #e2e8f0",
              paddingBottom: "12px",
            }}
          >
            Key Performance Indicators
          </h3>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
              gap: "20px",
            }}
          >
            <div
              style={{
                backgroundColor: "#ffffff",
                border: "1px solid #e2e8f0",
                borderRadius: "12px",
                padding: "24px",
                textAlign: "center",
                boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
                transition: "box-shadow 0.2s ease",
              }}
            >
              <div
                style={{
                  fontSize: "32px",
                  fontWeight: 700,
                  color: "#1e40af",
                  marginBottom: "8px",
                }}
              >
                {reportData.kpis.totalAppointments.toLocaleString()}
              </div>
              <div
                style={{
                  fontSize: "14px",
                  color: "#64748b",
                  fontWeight: 500,
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                }}
              >
                Total Appointments
              </div>
            </div>
            <div
              style={{
                backgroundColor: "#ffffff",
                border: "1px solid #e2e8f0",
                borderRadius: "12px",
                padding: "24px",
                textAlign: "center",
                boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
              }}
            >
              <div
                style={{
                  fontSize: "32px",
                  fontWeight: 700,
                  color: "#059669",
                  marginBottom: "8px",
                }}
              >
                ${reportData.kpis.totalRevenue.toLocaleString()}
              </div>
              <div
                style={{
                  fontSize: "14px",
                  color: "#64748b",
                  fontWeight: 500,
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                }}
              >
                Total Revenue
              </div>
            </div>
            <div
              style={{
                backgroundColor: "#ffffff",
                border: "1px solid #e2e8f0",
                borderRadius: "12px",
                padding: "24px",
                textAlign: "center",
                boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
              }}
            >
              <div
                style={{
                  fontSize: "32px",
                  fontWeight: 700,
                  color: "#d97706",
                  marginBottom: "8px",
                }}
              >
                {reportData.kpis.avgCompletionTime > 0
                  ? `${reportData.kpis.avgCompletionTime}hrs`
                  : "N/A"}
              </div>
              <div
                style={{
                  fontSize: "14px",
                  color: "#64748b",
                  fontWeight: 500,
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                }}
              >
                Avg Completion Time
              </div>
            </div>
            <div
              style={{
                backgroundColor: "#ffffff",
                border: "1px solid #e2e8f0",
                borderRadius: "12px",
                padding: "24px",
                textAlign: "center",
                boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
              }}
            >
              <div
                style={{
                  fontSize: "32px",
                  fontWeight: 700,
                  color: "#7c3aed",
                  marginBottom: "8px",
                }}
              >
                {reportData.kpis.branchEfficiency}%
              </div>
              <div
                style={{
                  fontSize: "14px",
                  color: "#64748b",
                  fontWeight: 500,
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                }}
              >
                Branch Utilization
              </div>
            </div>
          </div>
        </div>

        {/* Appointments Table */}
        <div style={{ marginBottom: "40px" }}>
          <h3
            style={{
              color: "#1e293b",
              margin: "0 0 24px 0",
              fontSize: "20px",
              fontWeight: 600,
              borderBottom: "2px solid #e2e8f0",
              paddingBottom: "12px",
            }}
          >
            Detailed Appointment Records
          </h3>
          <div
            style={{
              border: "1px solid #e2e8f0",
              borderRadius: "8px",
              overflow: "hidden",
              boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
            }}
          >
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                fontSize: "13px",
                backgroundColor: "#ffffff",
              }}
            >
              <thead>
                <tr style={{ backgroundColor: "#f8fafc" }}>
                  <th
                    style={{
                      borderBottom: "2px solid #e2e8f0",
                      padding: "16px 12px",
                      textAlign: "left",
                      color: "#374151",
                      fontWeight: 600,
                      fontSize: "12px",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                    }}
                  >
                    Date
                  </th>
                  <th
                    style={{
                      borderBottom: "2px solid #e2e8f0",
                      padding: "16px 12px",
                      textAlign: "left",
                      color: "#374151",
                      fontWeight: 600,
                      fontSize: "12px",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                    }}
                  >
                    Time
                  </th>
                  <th
                    style={{
                      borderBottom: "2px solid #e2e8f0",
                      padding: "16px 12px",
                      textAlign: "left",
                      color: "#374151",
                      fontWeight: 600,
                      fontSize: "12px",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                    }}
                  >
                    Customer
                  </th>
                  <th
                    style={{
                      borderBottom: "2px solid #e2e8f0",
                      padding: "16px 12px",
                      textAlign: "left",
                      color: "#374151",
                      fontWeight: 600,
                      fontSize: "12px",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                    }}
                  >
                    Service
                  </th>
                  <th
                    style={{
                      borderBottom: "2px solid #e2e8f0",
                      padding: "16px 12px",
                      textAlign: "left",
                      color: "#374151",
                      fontWeight: 600,
                      fontSize: "12px",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                    }}
                  >
                    Branch
                  </th>
                  <th
                    style={{
                      borderBottom: "2px solid #e2e8f0",
                      padding: "16px 12px",
                      textAlign: "center",
                      color: "#374151",
                      fontWeight: 600,
                      fontSize: "12px",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                    }}
                  >
                    Status
                  </th>
                  <th
                    style={{
                      borderBottom: "2px solid #e2e8f0",
                      padding: "16px 12px",
                      textAlign: "right",
                      color: "#374151",
                      fontWeight: 600,
                      fontSize: "12px",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                    }}
                  >
                    Revenue
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredAppointments.length > 0 ? (
                  filteredAppointments.map((appointment, index) => (
                    <tr
                      key={index}
                      style={{
                        backgroundColor:
                          index % 2 === 0 ? "#ffffff" : "#f8fafc",
                        borderBottom: "1px solid #f1f5f9",
                      }}
                    >
                      <td
                        style={{
                          padding: "12px",
                          color: "#1e293b",
                          fontWeight: 500,
                        }}
                      >
                        {new Date(
                          appointment.date || appointment.createdAt
                        ).toLocaleDateString()}
                      </td>
                      <td
                        style={{
                          padding: "12px",
                          color: "#1e293b",
                          fontWeight: 500,
                        }}
                      >
                        {appointment.time ||
                          new Date(appointment.createdAt).toLocaleTimeString(
                            [],
                            {
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )}
                      </td>
                      <td
                        style={{
                          padding: "12px",
                          color: "#1e293b",
                          fontWeight: 500,
                        }}
                      >
                        {appointment.customerName ||
                          appointment.customer?.name ||
                          "Unknown Customer"}
                      </td>
                      <td
                        style={{
                          padding: "12px",
                          color: "#1e293b",
                          fontWeight: 500,
                        }}
                      >
                        {appointment.serviceName ||
                          appointment.service?.name ||
                          "General Service"}
                      </td>
                      <td
                        style={{
                          padding: "12px",
                          color: "#1e293b",
                          fontWeight: 500,
                        }}
                      >
                        {appointment.branchName ||
                          appointment.branch?.name ||
                          "Main Branch"}
                      </td>
                      <td
                        style={{
                          padding: "12px",
                          textAlign: "center",
                        }}
                      >
                        <span
                          style={{
                            padding: "4px 8px",
                            borderRadius: "6px",
                            fontSize: "11px",
                            fontWeight: 600,
                            textTransform: "uppercase",
                            letterSpacing: "0.5px",
                            backgroundColor:
                              appointment.status?.toLowerCase() === "completed"
                                ? "#dcfce7"
                                : appointment.status?.toLowerCase() ===
                                  "confirmed"
                                ? "#dbeafe"
                                : appointment.status?.toLowerCase() ===
                                  "pending"
                                ? "#fef3c7"
                                : appointment.status?.toLowerCase() ===
                                  "cancelled"
                                ? "#fee2e2"
                                : "#f1f5f9",
                            color:
                              appointment.status?.toLowerCase() === "completed"
                                ? "#166534"
                                : appointment.status?.toLowerCase() ===
                                  "confirmed"
                                ? "#1e40af"
                                : appointment.status?.toLowerCase() ===
                                  "pending"
                                ? "#92400e"
                                : appointment.status?.toLowerCase() ===
                                  "cancelled"
                                ? "#dc2626"
                                : "#64748b",
                          }}
                        >
                          {appointment.status || "pending"}
                        </span>
                      </td>
                      <td
                        style={{
                          padding: "12px",
                          textAlign: "right",
                          color: "#1e293b",
                          fontWeight: 600,
                        }}
                      >
                        $
                        {appointment.totalPrice ||
                          appointment.price ||
                          appointment.cost ||
                          "0"}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="7"
                      style={{
                        padding: "40px 20px",
                        textAlign: "center",
                        color: "#64748b",
                        fontStyle: "italic",
                        backgroundColor: "#f8fafc",
                      }}
                    >
                      No appointment records found for the selected parameters
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Performance Summary */}
        <div style={{ marginBottom: "40px" }}>
          <h3
            style={{
              color: "#1e293b",
              margin: "0 0 24px 0",
              fontSize: "20px",
              fontWeight: 600,
              borderBottom: "2px solid #e2e8f0",
              paddingBottom: "12px",
            }}
          >
            Performance Summary & Insights
          </h3>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: "20px",
              marginBottom: "30px",
            }}
          >
            {/* Revenue Trend */}
            <div
              style={{
                backgroundColor: "#ffffff",
                border: "1px solid #e2e8f0",
                borderRadius: "12px",
                padding: "24px",
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.05)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "16px",
                }}
              >
                <div
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "8px",
                    backgroundColor: "#dbeafe",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginRight: "12px",
                  }}
                >
                  <span
                    style={{
                      fontSize: "18px",
                      color: "#1e40af",
                    }}
                  >
                    💰
                  </span>
                </div>
                <div>
                  <h4
                    style={{
                      margin: "0",
                      color: "#1e293b",
                      fontSize: "16px",
                      fontWeight: 600,
                    }}
                  >
                    Revenue Trend
                  </h4>
                  <p
                    style={{
                      margin: "4px 0 0 0",
                      color: "#64748b",
                      fontSize: "12px",
                    }}
                  >
                    Monthly performance analysis
                  </p>
                </div>
              </div>
              <div
                style={{
                  backgroundColor: "#f8fafc",
                  borderRadius: "8px",
                  padding: "16px",
                  marginTop: "16px",
                }}
              >
                <p
                  style={{
                    margin: "0",
                    color: "#374151",
                    fontSize: "14px",
                    lineHeight: "1.5",
                  }}
                >
                  Total revenue for the selected period:{" "}
                  <strong style={{ color: "#059669" }}>
                    ${totalRevenue.toFixed(2)}
                  </strong>
                  <br />
                  Average revenue per appointment:{" "}
                  <strong style={{ color: "#059669" }}>
                    $
                    {(
                      totalRevenue / Math.max(filteredAppointments.length, 1)
                    ).toFixed(2)}
                  </strong>
                </p>
              </div>
            </div>

            {/* Service Performance */}
            <div
              style={{
                backgroundColor: "#ffffff",
                border: "1px solid #e2e8f0",
                borderRadius: "12px",
                padding: "24px",
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.05)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "16px",
                }}
              >
                <div
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "8px",
                    backgroundColor: "#dcfce7",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginRight: "12px",
                  }}
                >
                  <span
                    style={{
                      fontSize: "18px",
                      color: "#166534",
                    }}
                  >
                    🔧
                  </span>
                </div>
                <div>
                  <h4
                    style={{
                      margin: "0",
                      color: "#1e293b",
                      fontSize: "16px",
                      fontWeight: 600,
                    }}
                  >
                    Service Performance
                  </h4>
                  <p
                    style={{
                      margin: "4px 0 0 0",
                      color: "#64748b",
                      fontSize: "12px",
                    }}
                  >
                    Completion rates and efficiency
                  </p>
                </div>
              </div>
              <div
                style={{
                  backgroundColor: "#f8fafc",
                  borderRadius: "8px",
                  padding: "16px",
                  marginTop: "16px",
                }}
              >
                <p
                  style={{
                    margin: "0",
                    color: "#374151",
                    fontSize: "14px",
                    lineHeight: "1.5",
                  }}
                >
                  Completed appointments:{" "}
                  <strong style={{ color: "#059669" }}>
                    {
                      filteredAppointments.filter(
                        (a) => a.status?.toLowerCase() === "completed"
                      ).length
                    }
                  </strong>{" "}
                  of {filteredAppointments.length}
                  <br />
                  Completion rate:{" "}
                  <strong style={{ color: "#059669" }}>
                    {filteredAppointments.length > 0
                      ? (
                          (filteredAppointments.filter(
                            (a) => a.status?.toLowerCase() === "completed"
                          ).length /
                            filteredAppointments.length) *
                          100
                        ).toFixed(1)
                      : 0}
                    %
                  </strong>
                </p>
              </div>
            </div>

            {/* Branch Utilization */}
            <div
              style={{
                backgroundColor: "#ffffff",
                border: "1px solid #e2e8f0",
                borderRadius: "12px",
                padding: "24px",
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.05)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "16px",
                }}
              >
                <div
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "8px",
                    backgroundColor: "#fef3c7",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginRight: "12px",
                  }}
                >
                  <span
                    style={{
                      fontSize: "18px",
                      color: "#92400e",
                    }}
                  >
                    🏢
                  </span>
                </div>
                <div>
                  <h4
                    style={{
                      margin: "0",
                      color: "#1e293b",
                      fontSize: "16px",
                      fontWeight: 600,
                    }}
                  >
                    Branch Utilization
                  </h4>
                  <p
                    style={{
                      margin: "4px 0 0 0",
                      color: "#64748b",
                      fontSize: "12px",
                    }}
                  >
                    Resource allocation and capacity
                  </p>
                </div>
              </div>
              <div
                style={{
                  backgroundColor: "#f8fafc",
                  borderRadius: "8px",
                  padding: "16px",
                  marginTop: "16px",
                }}
              >
                <p
                  style={{
                    margin: "0",
                    color: "#374151",
                    fontSize: "14px",
                    lineHeight: "1.5",
                  }}
                >
                  Active branches:{" "}
                  <strong style={{ color: "#059669" }}>
                    {
                      new Set(
                        filteredAppointments.map(
                          (a) => a.branchName || a.branch?.name
                        )
                      ).size
                    }
                  </strong>
                  <br />
                  Appointments per branch:{" "}
                  <strong style={{ color: "#059669" }}>
                    {(
                      filteredAppointments.length /
                      Math.max(
                        new Set(
                          filteredAppointments.map(
                            (a) => a.branchName || a.branch?.name
                          )
                        ).size,
                        1
                      )
                    ).toFixed(1)}
                  </strong>
                </p>
              </div>
            </div>
          </div>

          {/* Key Insights */}
          <div
            style={{
              backgroundColor: "#ffffff",
              border: "1px solid #e2e8f0",
              borderRadius: "12px",
              padding: "24px",
              boxShadow: "0 2px 4px rgba(0, 0, 0, 0.05)",
            }}
          >
            <h4
              style={{
                margin: "0 0 20px 0",
                color: "#1e293b",
                fontSize: "18px",
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
              }}
            >
              <span
                style={{
                  width: "24px",
                  height: "24px",
                  borderRadius: "6px",
                  backgroundColor: "#1e40af",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: "12px",
                  fontSize: "12px",
                  color: "#ffffff",
                }}
              >
                💡
              </span>
              Key Insights & Recommendations
            </h4>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                gap: "16px",
              }}
            >
              <div
                style={{
                  backgroundColor: "#f8fafc",
                  borderRadius: "8px",
                  padding: "16px",
                  borderLeft: "4px solid #1e40af",
                }}
              >
                <h5
                  style={{
                    margin: "0 0 8px 0",
                    color: "#1e293b",
                    fontSize: "14px",
                    fontWeight: 600,
                  }}
                >
                  Revenue Performance
                </h5>
                <p
                  style={{
                    margin: "0",
                    color: "#64748b",
                    fontSize: "13px",
                    lineHeight: "1.4",
                  }}
                >
                  {totalRevenue > 0
                    ? `Strong revenue performance with $${totalRevenue.toFixed(
                        2
                      )} generated. Consider scaling successful services.`
                    : "Revenue tracking shows room for improvement. Focus on high-value service offerings."}
                </p>
              </div>
              <div
                style={{
                  backgroundColor: "#f8fafc",
                  borderRadius: "8px",
                  padding: "16px",
                  borderLeft: "4px solid #059669",
                }}
              >
                <h5
                  style={{
                    margin: "0 0 8px 0",
                    color: "#1e293b",
                    fontSize: "14px",
                    fontWeight: 600,
                  }}
                >
                  Operational Efficiency
                </h5>
                <p
                  style={{
                    margin: "0",
                    color: "#64748b",
                    fontSize: "13px",
                    lineHeight: "1.4",
                  }}
                >
                  {filteredAppointments.filter(
                    (a) => a.status?.toLowerCase() === "completed"
                  ).length /
                    Math.max(filteredAppointments.length, 1) >
                  0.8
                    ? "Excellent completion rates indicate efficient operations. Maintain current standards."
                    : "Completion rates suggest opportunities for process optimization and resource allocation."}
                </p>
              </div>
              <div
                style={{
                  backgroundColor: "#f8fafc",
                  borderRadius: "8px",
                  padding: "16px",
                  borderLeft: "4px solid #92400e",
                }}
              >
                <h5
                  style={{
                    margin: "0 0 8px 0",
                    color: "#1e293b",
                    fontSize: "14px",
                    fontWeight: 600,
                  }}
                >
                  Growth Opportunities
                </h5>
                <p
                  style={{
                    margin: "0",
                    color: "#64748b",
                    fontSize: "13px",
                    lineHeight: "1.4",
                  }}
                >
                  {new Set(
                    filteredAppointments.map(
                      (a) => a.branchName || a.branch?.name
                    )
                  ).size > 1
                    ? "Multi-branch operations provide scalability. Consider cross-branch service standardization."
                    : "Single branch focus allows for deep expertise. Evaluate expansion opportunities."}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            borderTop: "2px solid #e2e8f0",
            paddingTop: "24px",
            marginTop: "40px",
            textAlign: "center",
            backgroundColor: "#f8fafc",
            borderRadius: "8px",
            padding: "24px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "12px",
            }}
          >
            <div
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "6px",
                backgroundColor: "#1e40af",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginRight: "12px",
              }}
            >
              <span
                style={{
                  fontSize: "16px",
                  color: "#ffffff",
                  fontWeight: 600,
                }}
              >
                A
              </span>
            </div>
            <h4
              style={{
                margin: "0",
                color: "#1e293b",
                fontSize: "16px",
                fontWeight: 600,
              }}
            >
              AxleXpert Vehicle Service Management
            </h4>
          </div>
          <p
            style={{
              margin: "0 0 8px 0",
              color: "#64748b",
              fontSize: "13px",
              lineHeight: "1.4",
            }}
          >
            This report was generated automatically by the AxleXpert Management
            System
          </p>
          <p
            style={{
              margin: "0",
              color: "#94a3b8",
              fontSize: "11px",
            }}
          >
            © 2025 AxleXpert. All rights reserved. | Generated on{" "}
            {new Date().toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>
      </div>
    );
  }
);

PDFReportTemplate.displayName = "PDFReportTemplate";

// Main PDF Generator Component
const PDFReportGenerator = ({
  reportData,
  filters,
  appointments = [],
  onDownloadStart,
  onDownloadComplete,
}) => {
  const pdfRef = React.useRef();

  const generatePDF = async () => {
    if (onDownloadStart) onDownloadStart();

    try {
      const element = pdfRef.current;

      const opt = {
        margin: [0.5, 0.5, 0.5, 0.5],
        filename: `AxleXpert_Report_${
          new Date().toISOString().split("T")[0]
        }.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: {
          scale: 2,
          useCORS: true,
          allowTaint: true,
          backgroundColor: "#ffffff",
          logging: false,
          windowWidth: 1200,
        },
        jsPDF: {
          unit: "in",
          format: "a4",
          orientation: "portrait",
          compress: true,
        },
      };

      await html2pdf().set(opt).from(element).save();

      if (onDownloadComplete) onDownloadComplete();
    } catch (error) {
      console.error("Error generating PDF:", error);
      if (onDownloadComplete) onDownloadComplete();
    }
  };

  return (
    <div>
      {/* Download Button */}
      <Button
        onClick={generatePDF}
        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white"
      >
        <Download className="w-4 h-4" />
        Download PDF Report
      </Button>

      {/* Hidden PDF Template */}
      <div style={{ position: "absolute", left: "-9999px", top: "-9999px" }}>
        <PDFReportTemplate
          ref={pdfRef}
          reportData={reportData}
          filters={filters}
          appointments={appointments}
        />
      </div>
    </div>
  );
};

export default PDFReportGenerator;
