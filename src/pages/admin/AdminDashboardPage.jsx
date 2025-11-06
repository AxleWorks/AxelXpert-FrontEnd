import React from "react";
import AdminLayout from "../../layouts/admin/AdminLayout";
import AdminDashboard from "../../components/dashboard/admin/AdminDashboard";

const AdminDashboardPage = () => {
  return (
    <AdminLayout>
      <AdminDashboard />
    </AdminLayout>
  );
};

export default AdminDashboardPage;
