import { ProfileData } from "@/app/types";
import React from "react";

interface GeneralInfoProps {
  data: ProfileData;
  currentUserId: string | null;
  userId: string;
}

const GeneralInfo: React.FC<GeneralInfoProps> = ({
  data,
  currentUserId,
  userId,
}) => {
  return (
    <div className="bg-white p-4 rounded-md shadow-sm mb-6">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-lg font-medium text-gray-700">
          General Information
        </h2>
        {currentUserId === userId && (
          <button
            onClick={() => {
              // Add your update logic here
              console.log("Update profile data");
            }}
            className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400"
          >
            Update Profile
          </button>
        )}
      </div>
      <div className="space-y-2 text-gray-600">
        <p>
          <strong>Firstname:</strong> {data.firstName}
        </p>
        <p>
          <strong>Lastname:</strong> {data.lastName}
        </p>
        {currentUserId === userId && (
          <p>
            <strong>Email:</strong> {data.email}
          </p>
        )}
        {currentUserId === userId && (
        <p>
          <strong>Email Verified:</strong> {data.active ? "Yes" : "No"}
          {!data.active && currentUserId === userId && (
            <button
              onClick={() => {
                // Add your email verification logic here
                console.log("Send verification email");
              }}
              className="ml-2 px-2 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              Send Verification Email
            </button>
          )}
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

        {data.active && currentUserId === userId && (
            <button
                onClick={() => {
                    // Add your deactivate account logic here
                    console.log("Deactivate account");
                }}
                className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400"
            >
                Deactivate Account
            </button>
        )}
      </div>
    </div>
  );
};

export default GeneralInfo;
