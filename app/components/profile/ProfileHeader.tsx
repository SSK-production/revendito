// Fichier : ProfileHeader.tsx
import React from "react";
import Image from "next/image";
import axios from "axios";
import MessageModal from "@/app/components/Messages/MessageModal";
import { ProfileData } from "@/app/types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBan, faMessage } from "@fortawesome/free-solid-svg-icons";

interface ProfileHeaderProps {
  data: ProfileData;
  currentUserId: string | null;
  currentUsername: string | null;
  userId: string;
  isLogin: boolean;
  showModal: boolean;
  role: string | null;
  setShowModal: (value: boolean) => void;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  data,
  currentUserId,
  currentUsername,
  isLogin,
  showModal,
  setShowModal,
  role,
}) => {
  // Fonction pour bannir un utilisateur
  const handleBanUser = async (userId: string) => {
    try {
      const response = await axios.post("/api/bans", {
        id: userId,
        username: currentUsername,
        type: "user", // ou "company" si nécessaire
        bannTitle: "Violation des règles",
        reason: ["Comportement inapproprié"],
        duration: 30, // Durée en jours
      });

      if (response.status === 200) {
        alert("L'utilisateur a été banni avec succès.");
      } else {
        alert("Une erreur s'est produite lors du bannissement.");
      }
    } catch (error) {
      console.error("Erreur lors du bannissement :", error);
      alert("Impossible de bannir l'utilisateur. Veuillez réessayer.");
    }
  };

  return (
    <div className="flex flex-col md:flex-row items-center justify-between mb-6 space-y-4 md:space-y-0">
      <div className="flex flex-col md:flex-row items-center space-x-0 md:space-x-6 space-y-4 md:space-y-0">
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
        <div className="text-center md:text-left">
          <h1 className="text-2xl font-semibold text-orange-700">
            {data.firstName && data.lastName
              ? `${data.username}`
              : data.companyName || data.username || "User"}
          </h1>
          <p className="text-gray-500">{data.role}</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
        {isLogin && data.id !== currentUserId && (
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center justify-center space-x-2 text-white bg-blue-500 hover:bg-blue-700 p-2 rounded-full shadow-md transition duration-300"
          >
            <FontAwesomeIcon icon={faMessage} />
            <span>Message</span>
          </button>
        )}

        {isLogin && data.id !== currentUserId && (role === "MODERATOR" || role === "ADMIN") && (
          !data.isBanned ? (
            <button
              onClick={() => handleBanUser(data.id)}
              className="flex items-center justify-center space-x-2 text-white bg-red-500 hover:bg-red-700 p-2 rounded-full shadow-md transition duration-300"
            >
              <FontAwesomeIcon icon={faBan} />
              <span>Ban</span>
            </button>
          ) : (
            <span className="flex items-center justify-center space-x-2 text-white bg-gray-500 p-2 rounded-full shadow-md">
              <FontAwesomeIcon icon={faBan} />
              <span>Banned</span>
            </span>
          )
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
