import React from "react";
import ProfileInformationCard from "./ProfileInformationCard";
import AccountInformationCard from "./AccountInformationCard";

const ProfileTab = ({
  userDetails,
  formData,
  handleInputChange,
  handleSaveProfile,
  saving,
  role,
}) => {
  return (
    <div
      className="mt-8"
      style={{ 
        display: "flex", 
        flexDirection: "column", 
        gap: "32px",
        paddingBottom: "24px"
      }}
    >
      <ProfileInformationCard
        userDetails={userDetails}
        formData={formData}
        handleInputChange={handleInputChange}
        handleSaveProfile={handleSaveProfile}
        saving={saving}
        role={role}
      />

      <AccountInformationCard userDetails={userDetails} />
    </div>
  );
};

export default ProfileTab;
