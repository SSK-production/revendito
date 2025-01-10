// Fichier : ProfileHeader.tsx
import React, { useState } from "react";
import Image from "next/image";
import axios from "axios";
import MessageModal from "@/app/components/Messages/MessageModal";
import { ProfileData } from "@/app/types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBan, faMessage } from "@fortawesome/free-solid-svg-icons";
import Modal from "./Modal";
import BanUserForm from "../shared/BanUserForm";
import { useNotifications } from "@/components/notifications";

interface ProfileHeaderProps {
  data: ProfileData;
  currentUserId: string | null;
  currentUsername: string | null;
  userId: string;
  isLogin: boolean;
  showModal: boolean;
  role: string | null;
  entity: string | null;
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
  entity
}) => {
  const [isModalOpenBanForm, setisModalOpenBanForm] = useState(false);
  const { NotificationsComponent, addNotification } = useNotifications();
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
          <p className="text-gray-500">{entity}</p>
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

        {isLogin &&
          data.id !== currentUserId &&
          (role === "MODERATOR" || role === "ADMIN") &&
          (!data.isBanned ? (
            <button
              onClick={() => setisModalOpenBanForm(true)}
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
          ))}
      </div>
      {/* Modal */}
      <Modal
        isOpen={isModalOpenBanForm}
        onClose={() => setisModalOpenBanForm(false)}
        title="ban user"
      >
        <BanUserForm
          initialData={{
            id: data.id,
            username: currentUsername || "",
            type: "user",
            bannTitle: "",
            reason: "",
            duration: "",
          }}
          onSave={async (updatedData) => {
            try {
              // Adapter les données pour correspondre à ce que l'API attend
              const payload = {
                id: data.id, // Remplacez par l'identifiant de l'utilisateur ou de l'entreprise à bannir
                username: currentUsername, // Facultatif selon votre cas d'usage
                type: "user", // ou "company"
                bannTitle: [updatedData.bannTitle],
                reason: [updatedData.reason],
                duration: parseInt(updatedData.duration, 10), // Convertir en nombre (jours)
              };

              const response = await axios.patch("/api/bans", payload);
              console.log("Response from server:", response.data);

              addNotification({
                message: "user banned successfully",
                variant: "success",
                duration: 7000,
              });
              setisModalOpenBanForm(false); // Fermer la modale après succès
            } catch (error) {
              console.error("Error while sending data:", error);
                addNotification({
                message: "An error occurred while banning the user. Please try again.",
                variant: "error",
                duration: 7000,
                });
            }
          }}
          onCancel={() => setisModalOpenBanForm(false)} // Ferme la modale en cas d'annulation
        />
      </Modal>
      <MessageModal
        show={showModal}
        handleClose={() => setShowModal(false)}
        receiverId={data.id}
        offerId={null}
        offerType={""}
        otherPersonName={data?.username || data?.companyName || "User"}
      />
      <NotificationsComponent />
    </div>
  );
};

export default ProfileHeader;
