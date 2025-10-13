import React from "react";
import ManagerLayout from "../../layouts/manager/ManagerLayout";
import ServicesManagement from "../../components/manager/ServicesManagement";

const ManagerServicesPage = () => {
  return (
    <ManagerLayout>
      <div style={{ padding: 16 }}>
        <ServicesManagement />
      </div>
    </ManagerLayout>
  );
};

export default ManagerServicesPage;
