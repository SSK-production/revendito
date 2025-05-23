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
  onProfilUpdate: () => void;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  data,
  currentUserId,
  currentUsername,
  isLogin,
  showModal,
  setShowModal,
  role,
  entity,
  onProfilUpdate
}) => {
  const [isModalOpenBanForm, setisModalOpenBanForm] = useState(false);
  const { NotificationsComponent, addNotification } = useNotifications();
  const [bannedUser, setBannedUser] = useState<boolean | null>(false);
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
              onClick={() => {
                setisModalOpenBanForm(true);
                setBannedUser(false);
              }}
              className="flex items-center justify-center space-x-2 text-white bg-red-500 hover:bg-red-700 p-2 rounded-full shadow-md transition duration-300"
            >
              <FontAwesomeIcon icon={faBan} />
              <span>Ban</span>
            </button>
          ) : (
            <button
              onClick={() => {
                setisModalOpenBanForm(true);
                setBannedUser(true);
              }}
              className="flex items-center justify-center space-x-2 text-white bg-red-500 hover:bg-red-700 p-2 rounded-full shadow-md transition duration-300"
            >
              <FontAwesomeIcon icon={faBan} />
              <span>Unban</span>
            </button>
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
            isBanned: data.isBanned || false,
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
                banned: bannedUser
              };

              const response = await axios.patch("/api/bans", payload);
              console.log("Response from server:", response.data);

              addNotification({
                message: response.data.message,
                variant: "success",
                duration: 7000,
              });
              setTimeout(() => {
                setisModalOpenBanForm(false);
                onProfilUpdate();
              }, 7000)
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
          onUnban={ async () => {
            try {
              const payload = {
              id: data.id,
              username: currentUsername,
              type: "user",
              banned: bannedUser,
              };

              const response = await axios.patch("/api/bans", payload);
              console.log("Response from server:", response.data);

              addNotification({
              message: response.data.message,
              variant: "success",
              duration: 3000,
              });
               // Close the modal after success
              setTimeout(() => {
                setisModalOpenBanForm(false);
                onProfilUpdate();
              }, 7000)
            } catch (error) {
              console.error("Error while unbanning the user:", error);
              addNotification({
              message: "An error occurred while unbanning the user. Please try again.",
              variant: "error",
              duration: 3000,
              });
            }
          }} // Ferme la modale et met à jour le profil après unban
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
