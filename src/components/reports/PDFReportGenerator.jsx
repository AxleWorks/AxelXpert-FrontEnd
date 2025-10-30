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
        appointment.startAt || appointment.date || appointment.createdAt || appointment.updatedAt || new Date()
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
        appointment.branchName?.toLowerCase().includes(filters.branch.toLowerCase());

      // Service type filtering
      const serviceMatch =
        filters.serviceType === "all" ||
        appointment.serviceId?.toString() === filters.serviceType ||
        appointment.serviceName?.toLowerCase().includes(filters.serviceType.toLowerCase());

      return dateInRange && branchMatch && serviceMatch;
    });

    return (
      <div
        ref={ref}
        style={{
          padding: "20px",
          fontFamily: "Arial, sans-serif",
          backgroundColor: "#ffffff",
          color: "#000000",
          width: "100%",
          minHeight: "100vh",
        }}
      >
        {/* Header */}
        <div
          style={{
            borderBottom: "3px solid #1976d2",
            paddingBottom: "20px",
            marginBottom: "30px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <h1
                style={{
                  color: "#1976d2",
                  margin: "0",
                  fontSize: "28px",
                  fontWeight: "bold",
                }}
              >
                {reportTitle}
              </h1>
              <p style={{ color: "#666", margin: "5px 0", fontSize: "14px" }}>
                Generated on: {currentDate}
              </p>
            </div>
            <div style={{ textAlign: "right" }}>
              <div
                style={{
                  color: "#1976d2",
                  fontSize: "20px",
                  fontWeight: "bold",
                  backgroundColor: "transparent",
                }}
              >
                AxleXpert
              </div>
              <div
                style={{
                  color: "#666",
                  fontSize: "12px",
                  backgroundColor: "transparent",
                }}
              >
                Vehicle Service Management
              </div>
            </div>
          </div>
        </div>

        {/* Report Filters */}
        <div style={{ marginBottom: "30px", backgroundColor: "#ffffff" }}>
          <h3
            style={{
              color: "#333",
              borderBottom: "2px solid #eee",
              paddingBottom: "10px",
              backgroundColor: "transparent",
            }}
          >
            Report Filters
          </h3>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: "15px",
              marginTop: "15px",
            }}
          >
            <div>
              <strong style={{ color: "#000" }}>Date Range:</strong>{" "}
              <span style={{ color: "#333" }}>
                {filters.startDate} to {filters.endDate}
              </span>
            </div>
            <div>
              <strong style={{ color: "#000" }}>Branch:</strong>{" "}
              <span style={{ color: "#333" }}>
                {filters.branch === "all" ? "All Branches" : filters.branch}
              </span>
            </div>
            <div>
              <strong style={{ color: "#000" }}>Service Type:</strong>{" "}
              <span style={{ color: "#333" }}>
                {filters.serviceType === "all"
                  ? "All Services"
                  : filters.serviceType}
              </span>
            </div>
            <div>
              <strong style={{ color: "#000" }}>Total Records:</strong>{" "}
              <span style={{ color: "#333" }}>{filteredAppointments.length}</span>
            </div>
          </div>
        </div>

        {/* KPI Summary */}
        <div style={{ marginBottom: "30px", backgroundColor: "#ffffff" }}>
          <h3
            style={{
              color: "#333",
              borderBottom: "2px solid #eee",
              paddingBottom: "10px",
              backgroundColor: "transparent",
            }}
          >
            Key Performance Indicators
          </h3>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: "15px",
              marginTop: "15px",
            }}
          >
            <div
              style={{
                border: "1px solid #ddd",
                padding: "15px",
                borderRadius: "8px",
                textAlign: "center",
                backgroundColor: "#ffffff",
              }}
            >
              <div
                style={{
                  fontSize: "24px",
                  fontWeight: "bold",
                  color: "#1976d2",
                  backgroundColor: "transparent",
                }}
              >
                {reportData.kpis.totalAppointments}
              </div>
              <div
                style={{
                  fontSize: "12px",
                  color: "#666",
                  backgroundColor: "transparent",
                }}
              >
                Total Appointments
              </div>
            </div>
            <div
              style={{
                border: "1px solid #ddd",
                padding: "15px",
                borderRadius: "8px",
                textAlign: "center",
                backgroundColor: "#ffffff",
              }}
            >
              <div
                style={{
                  fontSize: "24px",
                  fontWeight: "bold",
                  color: "#4caf50",
                  backgroundColor: "transparent",
                }}
              >
                ${reportData.kpis.totalRevenue.toLocaleString()}
              </div>
              <div
                style={{
                  fontSize: "12px",
                  color: "#666",
                  backgroundColor: "transparent",
                }}
              >
                Total Revenue
              </div>
            </div>
            <div
              style={{
                border: "1px solid #ddd",
                padding: "15px",
                borderRadius: "8px",
                textAlign: "center",
                backgroundColor: "#ffffff",
              }}
            >
              <div
                style={{
                  fontSize: "24px",
                  fontWeight: "bold",
                  color: "#ff9800",
                  backgroundColor: "transparent",
                }}
              >
                {reportData.kpis.avgCompletionTime}hrs
              </div>
              <div
                style={{
                  fontSize: "12px",
                  color: "#666",
                  backgroundColor: "transparent",
                }}
              >
                Avg Completion
              </div>
            </div>
            <div
              style={{
                border: "1px solid #ddd",
                padding: "15px",
                borderRadius: "8px",
                textAlign: "center",
                backgroundColor: "#ffffff",
              }}
            >
              <div
                style={{
                  fontSize: "24px",
                  fontWeight: "bold",
                  color: "#9c27b0",
                  backgroundColor: "transparent",
                }}
              >
                {reportData.kpis.branchEfficiency}%
              </div>
              <div
                style={{
                  fontSize: "12px",
                  color: "#666",
                  backgroundColor: "transparent",
                }}
              >
                Branch Efficiency
              </div>
            </div>
          </div>
        </div>

        {/* Appointments Table */}
        <div style={{ marginBottom: "30px", backgroundColor: "#ffffff" }}>
          <h3
            style={{
              color: "#333",
              borderBottom: "2px solid #eee",
              paddingBottom: "10px",
              backgroundColor: "transparent",
            }}
          >
            Appointment Details
          </h3>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              marginTop: "15px",
              fontSize: "12px",
              backgroundColor: "#ffffff",
            }}
          >
            <thead>
              <tr style={{ backgroundColor: "#f5f5f5" }}>
                <th
                  style={{
                    border: "1px solid #ddd",
                    padding: "8px",
                    textAlign: "left",
                    color: "#000",
                    backgroundColor: "#f5f5f5",
                  }}
                >
                  Date
                </th>
                <th
                  style={{
                    border: "1px solid #ddd",
                    padding: "8px",
                    textAlign: "left",
                    color: "#000",
                    backgroundColor: "#f5f5f5",
                  }}
                >
                  Time
                </th>
                <th
                  style={{
                    border: "1px solid #ddd",
                    padding: "8px",
                    textAlign: "left",
                    color: "#000",
                    backgroundColor: "#f5f5f5",
                  }}
                >
                  Customer
                </th>
                <th
                  style={{
                    border: "1px solid #ddd",
                    padding: "8px",
                    textAlign: "left",
                    color: "#000",
                    backgroundColor: "#f5f5f5",
                  }}
                >
                  Service
                </th>
                <th
                  style={{
                    border: "1px solid #ddd",
                    padding: "8px",
                    textAlign: "left",
                    color: "#000",
                    backgroundColor: "#f5f5f5",
                  }}
                >
                  Branch
                </th>
                <th
                  style={{
                    border: "1px solid #ddd",
                    padding: "8px",
                    textAlign: "left",
                    color: "#000",
                    backgroundColor: "#f5f5f5",
                  }}
                >
                  Status
                </th>
                <th
                  style={{
                    border: "1px solid #ddd",
                    padding: "8px",
                    textAlign: "right",
                    color: "#000",
                    backgroundColor: "#f5f5f5",
                  }}
                >
                  Price
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredAppointments.length > 0 ? (
                filteredAppointments.map((appointment, index) => (
                  <tr
                    key={index}
                    style={{
                      backgroundColor: index % 2 === 0 ? "#ffffff" : "#f9f9f9",
                    }}
                  >
                    <td
                      style={{
                        border: "1px solid #ddd",
                        padding: "8px",
                        color: "#000",
                      }}
                    >
                      {new Date(
                        appointment.date || appointment.createdAt
                      ).toLocaleDateString()}
                    </td>
                    <td
                      style={{
                        border: "1px solid #ddd",
                        padding: "8px",
                        color: "#000",
                      }}
                    >
                      {appointment.time ||
                        new Date(appointment.createdAt).toLocaleTimeString()}
                    </td>
                    <td
                      style={{
                        border: "1px solid #ddd",
                        padding: "8px",
                        color: "#000",
                      }}
                    >
                      {appointment.customerName ||
                        appointment.customer?.name ||
                        "Unknown Customer"}
                    </td>
                    <td
                      style={{
                        border: "1px solid #ddd",
                        padding: "8px",
                        color: "#000",
                      }}
                    >
                      {appointment.serviceName ||
                        appointment.service?.name ||
                        "General Service"}
                    </td>
                    <td
                      style={{
                        border: "1px solid #ddd",
                        padding: "8px",
                        color: "#000",
                      }}
                    >
                      {appointment.branchName ||
                        appointment.branch?.name ||
                        "Main Branch"}
                    </td>
                    <td
                      style={{
                        border: "1px solid #ddd",
                        padding: "8px",
                        color: "#000",
                      }}
                    >
                      <span
                        style={{
                          padding: "2px 6px",
                          borderRadius: "4px",
                          fontSize: "10px",
                          backgroundColor:
                            appointment.status === "completed"
                              ? "#e8f5e8"
                              : appointment.status === "pending"
                              ? "#fff3cd"
                              : appointment.status === "cancelled"
                              ? "#f8d7da"
                              : "#e2e3e5",
                          color:
                            appointment.status === "completed"
                              ? "#155724"
                              : appointment.status === "pending"
                              ? "#856404"
                              : appointment.status === "cancelled"
                              ? "#721c24"
                              : "#383d41",
                        }}
                      >
                        {appointment.status || "pending"}
                      </span>
                    </td>
                    <td
                      style={{
                        border: "1px solid #ddd",
                        padding: "8px",
                        textAlign: "right",
                        color: "#000",
                      }}
                    >
                      ${appointment.price || appointment.cost || "0"}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="7"
                    style={{
                      border: "1px solid #ddd",
                      padding: "20px",
                      textAlign: "center",
                      color: "#666",
                      backgroundColor: "#ffffff",
                    }}
                  >
                    No appointments found for the selected criteria
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Performance Summary */}
        <div style={{ marginBottom: "30px", backgroundColor: "#ffffff" }}>
          <h3
            style={{
              color: "#333",
              borderBottom: "2px solid #eee",
              paddingBottom: "10px",
              backgroundColor: "transparent",
            }}
          >
            Performance Summary
          </h3>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "15px",
              marginTop: "15px",
            }}
          >
            <div
              style={{
                border: "1px solid #ddd",
                padding: "15px",
                borderRadius: "8px",
                backgroundColor: "#ffffff",
              }}
            >
              <div
                style={{
                  fontSize: "18px",
                  fontWeight: "bold",
                  color: "#1976d2",
                  backgroundColor: "transparent",
                }}
              >
                {reportData.performanceMetrics.avgRevenuePerJob}
              </div>
              <div
                style={{
                  fontSize: "12px",
                  color: "#666",
                  backgroundColor: "transparent",
                }}
              >
                Average Revenue per Job
              </div>
            </div>
            <div
              style={{
                border: "1px solid #ddd",
                padding: "15px",
                borderRadius: "8px",
                backgroundColor: "#ffffff",
              }}
            >
              <div
                style={{
                  fontSize: "18px",
                  fontWeight: "bold",
                  color: "#4caf50",
                  backgroundColor: "transparent",
                }}
              >
                {reportData.performanceMetrics.employeeUtilization}%
              </div>
              <div
                style={{
                  fontSize: "12px",
                  color: "#666",
                  backgroundColor: "transparent",
                }}
              >
                Employee Utilization
              </div>
            </div>
            <div
              style={{
                border: "1px solid #ddd",
                padding: "15px",
                borderRadius: "8px",
                backgroundColor: "#ffffff",
              }}
            >
              <div
                style={{
                  fontSize: "18px",
                  fontWeight: "bold",
                  color: "#ff9800",
                  backgroundColor: "transparent",
                }}
              >
                {reportData.performanceMetrics.onTimeCompletion}%
              </div>
              <div
                style={{
                  fontSize: "12px",
                  color: "#666",
                  backgroundColor: "transparent",
                }}
              >
                On-Time Completion
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            borderTop: "1px solid #ddd",
            paddingTop: "20px",
            marginTop: "30px",
            textAlign: "center",
            color: "#666",
            fontSize: "12px",
            backgroundColor: "#ffffff",
          }}
        >
          <p>
            This report was generated automatically by AxleXpert Vehicle Service
            Management System
          </p>
          <p>© 2025 AxleXpert. All rights reserved.</p>
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
