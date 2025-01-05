import React from "react";
import Image from "next/image";
import MessageModal from "@/app/components/Messages/MessageModal";
import { ProfileData } from "@/app/types";

interface ProfileHeaderProps {
  data: ProfileData;
  currentUserId: string | null;
  userId: string;
  isLogin: boolean;
  showModal: boolean;
  role: string | null;
  setShowModal: (value: boolean) => void;
  onBanUser: (userId: string) => void;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  data,
  currentUserId,
  isLogin,
  showModal,
  setShowModal,
  onBanUser,
  role,
}) => {
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center space-x-6">
        {data.profilePicture ? (
          <Image
            src={data.profilePicture}
            width={80}
            height={80}
            alt="Profile Picture"
            className="w-20 h-20 rounded-full"
          />
        ) : (
          <div className="w-20 h-20 bg-gray-300 rounded-full flex items-center justify-center text-xl font-bold text-orange-700">
            {data.username?.charAt(0) || "P"}
          </div>
        )}
        <div>
          <h1 className="text-2xl font-semibold text-orange-700">
            {data.firstName && data.lastName
              ? `${data.username}`
              : data.companyName || data.username || "User"}
          </h1>
          <p className="text-gray-500">{data.role}</p>
        </div>
      </div>

      <div className="flex space-x-4">
        {isLogin && data.id !== currentUserId && (
          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Contacter le vendeur
          </button>
        )}

        {isLogin && (role === "MODERATOR" || role === "ADMIN") && (
          <button
            onClick={() => onBanUser(data.id)}
            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-700"
          >
            Bannir l'utilisateur
          </button>
        )}
      </div>

      <MessageModal
        show={showModal}
        handleClose={() => setShowModal(false)}
        receiverId={data.id}
        offerId={null}
        offerType={""}
        otherPersonName={data?.username || data?.companyName || "User"}
      />
    </div>
  );
};

export default ProfileHeader;
