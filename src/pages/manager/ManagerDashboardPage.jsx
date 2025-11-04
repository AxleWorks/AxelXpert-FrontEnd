import React from "react";
import ManagerLayout from "../../layouts/manager/ManagerLayout";
import ManagerDashboard from "../../components/dashboard/manager/ManagerDashboardImproved";

const ManagerDashboardPage = () => {
  return (
    <ManagerLayout>
      <ManagerDashboard />
    </ManagerLayout>
  );
};

export default ManagerDashboardPage;
