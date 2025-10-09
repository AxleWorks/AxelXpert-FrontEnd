import React from "react";
import ManagerLayout from "../../layouts/manager/ManagerLayout";
import ManagerDashboard from "../../components/dashboard/manager/ManagerDashboardNew";

const ManagerDashboardPage = () => {
  return (
    <ManagerLayout>
      <ManagerDashboard />
    </ManagerLayout>
  );
};

export default ManagerDashboardPage;
