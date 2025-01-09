import { ProfileData } from "@/app/types";
import React, { useState } from "react";
import Modal from "./Modal";
import UpdateProfileForm from "./UpdateProfileForm";
import { faPencil } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import UpdateEmailForm from "./UpdateEmailForm";
import ChangePasswordForm from "./ChangePasswordForm";
import axios from "axios";

interface GeneralInfoProps {
  data: ProfileData;
  currentUserId: string | null;
  userId: string;
  entity: string | null;
}

const GeneralInfo: React.FC<GeneralInfoProps> = ({
  data,
  currentUserId,
  userId,
  entity
}) => {
  const [isModalOpenGeneralInfo, setIsModalOpenGeneralInfo] = useState(false);
  const [isModalOpenAccount, setIsModalOpenAccount] = useState(false);
  const [isModalOpenPassword, setIsModalOpenPassword] = useState(false);
  console.log(data);
  
  const handleSave = async (updatedData: {
    username?: string | null;
    companyName?: string | null;
    firstName?: string;
    lastName?: string;
    birthDate?: string;
    companyNumber?: string;
    city?: string;
    country?: string;
    street?: string;
  }) => {
    try {
      const response = await axios.put(`/api/profileUpdate`, updatedData);
      console.log("Updated profile data:", response.data);
      setIsModalOpenGeneralInfo(false); // Close the modal after saving
    } catch (error) {
      console.error("Error updating profile data:", error);
    }
  };

  const handleSaveAccount = (updatedData: {
    email: string;
  }) => {
    console.log("Updated profile data:", updatedData);
    setIsModalOpenAccount(false); // Close the modal after saving
  };

  const handleSavePassword = (passwordData: { currentPassword: string; newPassword: string }) => {
    console.log("Password data:", passwordData);
    setIsModalOpenPassword(false); // Close the modal after saving
  };

  return (
    <>
      <div className="bg-white p-4 rounded-md shadow-sm mb-6">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-xl font-semibold text-gray-800">
            General Information
          </h2>
          {currentUserId === userId && (
            <button
              onClick={() => setIsModalOpenGeneralInfo(true)}
              className="p-1 text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400 flex items-center"
              title="Edit General Information"
            >
              <FontAwesomeIcon icon={faPencil} />
            </button>
          )}
        </div>
        <div className="space-y-2 text-gray-600">
          {data.firstName && (
            <p>
            <strong>Firstname:</strong> {data.firstName}
          </p>
          )}
          {data.lastName && (
            <p>
              <strong>Lastname:</strong> {data.lastName}
            </p>
          )}
          {data.birthDate && (
            <p>
              <strong>Birth Date:</strong>{" "}
              {new Date(data.birthDate).toLocaleDateString()}
            </p>
          )}
          {data.companyNumber && (
            <p>
              <strong>Company Number:</strong> {data.companyNumber}
            </p>
          )}
          <p>
            <strong>City:</strong> {data.city}
          </p>
          <p>
            <strong>Country:</strong> {data.country}
          </p>
          {data.street && (
            <p>
              <strong>Street:</strong> {data.street}
            </p>
          )}

          

          {/* Modal */}
          <Modal
            isOpen={isModalOpenGeneralInfo}
            onClose={() => setIsModalOpenGeneralInfo(false)}
            title="Update Profile"
          >
            <UpdateProfileForm
              initialData={{
                entity: entity || "",
                username: data.username,
                companyName: data.companyName,
                firstName: data.firstName || "",
                lastName: data.lastName || "",
                birthDate: data.birthDate,
                companyNumber: data.companyNumber,
                city: data.city,
                country: data.country,
                street: data.street,
              }}
              onSave={handleSave}
              onCancel={() => setIsModalOpenGeneralInfo(false)}
            />
          </Modal>
        </div>
      </div>

      {/* Account Information */}
      {currentUserId === userId && (
        <div className="bg-white p-6 rounded-md shadow-md mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold text-gray-800">
              Account Information
            </h2>
            <button
              onClick={() => setIsModalOpenAccount(true)}
              className="p-2 text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400 flex items-center"
              title="Edit Account Information"
            >
              <FontAwesomeIcon icon={faPencil} />
            </button>
          </div>
          <div className="space-y-3 text-gray-600">
            <p>
              <strong>Email:</strong> {data.email}
            </p>
            <p>
              <strong>Email Verified:</strong> {data.active ? "Yes" : "No"}
              {!data.active && (
                <button
                  onClick={() => {
                    // Add your email verification logic here
                    console.log("Send verification email");
                  }}
                  className="ml-2 text-blue-500 hover:underline focus:outline-none"
                >
                  Send Verification Email
                </button>
              )}
            </p>
            <button
              onClick={() => setIsModalOpenPassword(true)}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              Change Password
            </button>
          </div>
          {data.active && currentUserId === userId && (
            <button
              onClick={() => {
                // Add your deactivate account logic here
                console.log("Deactivate account");
              }}
              className="mt-4 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400"
            >
              Deactivate Account
            </button>
          )}
          {!data.active && currentUserId === userId && (
            <button
              onClick={() => {
                // Add your deactivate account logic here
                console.log("Activate account");
              }}
              className="mt-4 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400"
            >
              Activate Account
            </button>
          )}
        </div>
      )}
      <Modal
        isOpen={isModalOpenAccount}
        onClose={() => setIsModalOpenAccount(false)}
        title="Update Account Information"
      >
        <UpdateEmailForm
          data={{ email: data.email }}
          handleSaveAccount={handleSaveAccount}
          setIsModalOpenAccount={setIsModalOpenAccount}
        />
      </Modal>

      {/* Modal for Password Update */}
      <Modal
        isOpen={isModalOpenPassword}
        onClose={() => setIsModalOpenPassword(false)}
        title="Update Password"
      >
        <ChangePasswordForm
          onSave={(passwordData) => {
            handleSavePassword(passwordData);
            setIsModalOpenPassword(false); // Close the modal after saving
          }}
          onCancel={() => setIsModalOpenPassword(false)} // Close the modal if canceled
        />
      </Modal>
    </>
  );
};

export default GeneralInfo;
