import React from "react";
import ManagerLayout from "../../layouts/manager/ManagerLayout";
import ManagerDashboard from "../../components/dashboard/manager/ManagerDashboard";

const ManagerDashboardPage = () => {
  return (
    <ManagerLayout>
      <ManagerDashboard />
    </ManagerLayout>
  );
};

export default ManagerDashboardPage;
