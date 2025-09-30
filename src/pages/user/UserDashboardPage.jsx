import React from "react";
import UserLayout from "../../layouts/user/UserLayout";
import UserDashboard from "../../components/dashboard/user/UserDashboardNew";

const UserDashboardPage = () => {
  return (
    <UserLayout>
      <UserDashboard />
    </UserLayout>
  );
};

export default UserDashboardPage;
