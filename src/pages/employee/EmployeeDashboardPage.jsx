import React from "react";
import EmployeeLayout from "../../layouts/employee/EmployeeLayout";
import EmployeeDashboard from "../../components/dashboard/employee/EmployeeDashboardImproved";

const EmployeeDashboardPage = () => {
  return (
    <EmployeeLayout>
      <EmployeeDashboard />
    </EmployeeLayout>
  );
};

export default EmployeeDashboardPage;
