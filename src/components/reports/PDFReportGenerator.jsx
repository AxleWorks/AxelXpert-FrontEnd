import React, { forwardRef } from "react";
import html2pdf from "html2pdf.js";
import { Download, FileText } from "lucide-react";
import { Button } from "../ui/button";

// PDF Report Template Component
const PDFReportTemplate = forwardRef(
  ({ reportData, filters, appointments = [] }, ref) => {
    const currentDate = new Date().toLocaleDateString();
    const reportTitle = "AxleXpert - Appointment Reports";

    return (
      <div
        ref={ref}
        style={{
          padding: "20px",
          fontFamily: "Arial, sans-serif",
          backgroundColor: "white",
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
                }}
              >
                AxleXpert
              </div>
              <div style={{ color: "#666", fontSize: "12px" }}>
                Vehicle Service Management
              </div>
            </div>
          </div>
        </div>

        {/* Report Filters */}
        <div style={{ marginBottom: "30px" }}>
          <h3
            style={{
              color: "#333",
              borderBottom: "2px solid #eee",
              paddingBottom: "10px",
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
              <strong>Date Range:</strong> {filters.startDate} to{" "}
              {filters.endDate}
            </div>
            <div>
              <strong>Branch:</strong>{" "}
              {filters.branch === "all" ? "All Branches" : filters.branch}
            </div>
            <div>
              <strong>Service Type:</strong>{" "}
              {filters.serviceType === "all"
                ? "All Services"
                : filters.serviceType}
            </div>
            <div>
              <strong>Total Records:</strong> {appointments.length}
            </div>
          </div>
        </div>

        {/* KPI Summary */}
        <div style={{ marginBottom: "30px" }}>
          <h3
            style={{
              color: "#333",
              borderBottom: "2px solid #eee",
              paddingBottom: "10px",
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
              }}
            >
              <div
                style={{
                  fontSize: "24px",
                  fontWeight: "bold",
                  color: "#1976d2",
                }}
              >
                {reportData.kpis.totalAppointments}
              </div>
              <div style={{ fontSize: "12px", color: "#666" }}>
                Total Appointments
              </div>
            </div>
            <div
              style={{
                border: "1px solid #ddd",
                padding: "15px",
                borderRadius: "8px",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  fontSize: "24px",
                  fontWeight: "bold",
                  color: "#4caf50",
                }}
              >
                ${reportData.kpis.totalRevenue.toLocaleString()}
              </div>
              <div style={{ fontSize: "12px", color: "#666" }}>
                Total Revenue
              </div>
            </div>
            <div
              style={{
                border: "1px solid #ddd",
                padding: "15px",
                borderRadius: "8px",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  fontSize: "24px",
                  fontWeight: "bold",
                  color: "#ff9800",
                }}
              >
                {reportData.kpis.avgCompletionTime}hrs
              </div>
              <div style={{ fontSize: "12px", color: "#666" }}>
                Avg Completion
              </div>
            </div>
            <div
              style={{
                border: "1px solid #ddd",
                padding: "15px",
                borderRadius: "8px",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  fontSize: "24px",
                  fontWeight: "bold",
                  color: "#9c27b0",
                }}
              >
                {reportData.kpis.branchEfficiency}%
              </div>
              <div style={{ fontSize: "12px", color: "#666" }}>
                Branch Efficiency
              </div>
            </div>
          </div>
        </div>

        {/* Appointments Table */}
        <div style={{ marginBottom: "30px" }}>
          <h3
            style={{
              color: "#333",
              borderBottom: "2px solid #eee",
              paddingBottom: "10px",
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
            }}
          >
            <thead>
              <tr style={{ backgroundColor: "#f5f5f5" }}>
                <th
                  style={{
                    border: "1px solid #ddd",
                    padding: "8px",
                    textAlign: "left",
                  }}
                >
                  Date
                </th>
                <th
                  style={{
                    border: "1px solid #ddd",
                    padding: "8px",
                    textAlign: "left",
                  }}
                >
                  Time
                </th>
                <th
                  style={{
                    border: "1px solid #ddd",
                    padding: "8px",
                    textAlign: "left",
                  }}
                >
                  Customer
                </th>
                <th
                  style={{
                    border: "1px solid #ddd",
                    padding: "8px",
                    textAlign: "left",
                  }}
                >
                  Service
                </th>
                <th
                  style={{
                    border: "1px solid #ddd",
                    padding: "8px",
                    textAlign: "left",
                  }}
                >
                  Branch
                </th>
                <th
                  style={{
                    border: "1px solid #ddd",
                    padding: "8px",
                    textAlign: "left",
                  }}
                >
                  Status
                </th>
                <th
                  style={{
                    border: "1px solid #ddd",
                    padding: "8px",
                    textAlign: "right",
                  }}
                >
                  Price
                </th>
              </tr>
            </thead>
            <tbody>
              {appointments.length > 0 ? (
                appointments.map((appointment, index) => (
                  <tr
                    key={index}
                    style={{
                      backgroundColor: index % 2 === 0 ? "#ffffff" : "#f9f9f9",
                    }}
                  >
                    <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                      {new Date(
                        appointment.date || appointment.createdAt
                      ).toLocaleDateString()}
                    </td>
                    <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                      {appointment.time ||
                        new Date(appointment.createdAt).toLocaleTimeString()}
                    </td>
                    <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                      {appointment.customerName ||
                        appointment.customer?.name ||
                        "Unknown Customer"}
                    </td>
                    <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                      {appointment.serviceName ||
                        appointment.service?.name ||
                        "General Service"}
                    </td>
                    <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                      {appointment.branchName ||
                        appointment.branch?.name ||
                        "Main Branch"}
                    </td>
                    <td style={{ border: "1px solid #ddd", padding: "8px" }}>
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
        <div style={{ marginBottom: "30px" }}>
          <h3
            style={{
              color: "#333",
              borderBottom: "2px solid #eee",
              paddingBottom: "10px",
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
              }}
            >
              <div
                style={{
                  fontSize: "18px",
                  fontWeight: "bold",
                  color: "#1976d2",
                }}
              >
                {reportData.performanceMetrics.avgRevenuePerJob}
              </div>
              <div style={{ fontSize: "12px", color: "#666" }}>
                Average Revenue per Job
              </div>
            </div>
            <div
              style={{
                border: "1px solid #ddd",
                padding: "15px",
                borderRadius: "8px",
              }}
            >
              <div
                style={{
                  fontSize: "18px",
                  fontWeight: "bold",
                  color: "#4caf50",
                }}
              >
                {reportData.performanceMetrics.employeeUtilization}%
              </div>
              <div style={{ fontSize: "12px", color: "#666" }}>
                Employee Utilization
              </div>
            </div>
            <div
              style={{
                border: "1px solid #ddd",
                padding: "15px",
                borderRadius: "8px",
              }}
            >
              <div
                style={{
                  fontSize: "18px",
                  fontWeight: "bold",
                  color: "#ff9800",
                }}
              >
                {reportData.performanceMetrics.onTimeCompletion}%
              </div>
              <div style={{ fontSize: "12px", color: "#666" }}>
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
