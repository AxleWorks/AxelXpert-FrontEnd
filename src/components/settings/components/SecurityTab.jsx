import React from "react";
import ChangePasswordCard from "./ChangePasswordCard";
import TwoFactorAuthCard from "./TwoFactorAuthCard";
import DangerZoneCard from "./DangerZoneCard";

const SecurityTab = ({
  passwordData,
  handlePasswordChange,
  showPasswords,
  togglePasswordVisibility,
  handleChangePassword,
  handleDeleteAccount,
  saving,
}) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "32px",
        marginTop: "32px",
        paddingBottom: "24px",
      }}
    >
      <ChangePasswordCard
        passwordData={passwordData}
        handlePasswordChange={handlePasswordChange}
        showPasswords={showPasswords}
        togglePasswordVisibility={togglePasswordVisibility}
        handleChangePassword={handleChangePassword}
        saving={saving}
      />

      <TwoFactorAuthCard />

      <DangerZoneCard
        handleDeleteAccount={handleDeleteAccount}
        saving={saving}
      />
    </div>
  );
};

export default SecurityTab;
