'use client';

import React, { useState, useRef } from "react";
import AddAdminModal from "./adminModal";
import AdminDeleteOfferModal from "./AdminDeleteOffer";
import AdminUserBanModal from "./AdminUserBanModal";
import TestAdminDeleteOfferModal from "./testModal";
import Image from "next/image";

export default function AdminHomePage() {
  const [openModal, setOpenModal] = useState<string | null>(null); // Etat centralisé pour gérer quelle modal est ouverte
  const modalContainerRef = useRef<HTMLDivElement | null>(null);

  // Fonction pour ouvrir une modal, remplace l'état de la modal ouverte précédente
  const openModalHandler = (modalName: string) => {
    setOpenModal(modalName);
  };

  // Fonction pour fermer la modal
  const closeModalHandler = () => {
    setOpenModal(null);
  };

  return (
    <>
      <div className="lg:min-h-screen lg:h-full lg:flex lg:flex-row  lg:flex-1 lg:bg-[#dbdbdb] lg:rounded-md ">
        {/* Contenu principal */}
        <div className="h-2/5 lg:flex lg:flex-col lg:bg-[#d6d4d4] lg:rounded-lg lg:m-4 ">
          {/* Section Test Modal */}
          <div onClick={() => openModalHandler("test")}>
            <div className="lg:mt-4 lg:mb-4 lg:flex lg:flex-row lg:gap-3 lg:ml-4 lg:mr-4 ">
              <Image
                src="/icons/mobil-dashboard/add.svg"
                width={55}
                height={55}
                alt="test-modal.svg"
              />
              <p className="flex items-center">Open Test Modal</p>
            </div>
          </div>

          {/* Autres sections */}
          <div onClick={() => openModalHandler("banUser")}>
            <div className="lg:mt-4 lg:mb-4 lg:flex lg:flex-row lg:gap-3 lg:ml-4 lg:mr-4">
              <Image
                src="/icons/mobil-dashboard/ban-user.svg"
                width={35}
                height={35}
                alt="ban-user.svg"
              />
              <p className="flex items-center">Ban User</p>
            </div>
          </div>

          <div onClick={() => openModalHandler("deleteOffer")}>
            <div className="lg:mt-4 lg:mb-4 lg:flex lg:flex-row lg:gap-3 lg:ml-4 lg:mr-4">
              <Image
                src="/icons/mobil-dashboard/bin.svg"
                width={35}
                height={35}
                alt="delete-offer.svg"
              />
              <p className="flex items-center">Delete Offer</p>
            </div>
          </div>

          <div className="lg:flex lg:justify-between lg:ml-2 lg:mr-4">
            <div onClick={() => openModalHandler("addAdmin")}>
              <div className="lg:flex lg:justify-start">
                <Image
                  src="/icons/mobil-dashboard/add.svg"
                  width={55}
                  height={55}
                  alt="add-admin.svg"
                />
                <p className="flex items-center">Add Admin</p>
              </div>
            </div>
          </div>
        </div>

        {/* Conteneur pour modales */}
        <div className="lg:flex flex-1">
          {/* Modales */}

          {openModal === "test" && (
            <TestAdminDeleteOfferModal
              isOpen={openModal === "test"}
              closeModal={closeModalHandler}
              container={modalContainerRef}
            />
          )}

          {openModal === "banUser" && (
            <AdminUserBanModal
              isOpen={openModal === "banUser"}
              closeModal={closeModalHandler}
              container={modalContainerRef}
            />
          )}

          {openModal === "deleteOffer" && (
            <AdminDeleteOfferModal
              isOpen={openModal === "deleteOffer"}
              closeModal={closeModalHandler}
              container={modalContainerRef}
            />
          )}

          {openModal === "addAdmin" && (
            <AddAdminModal
              isOpen={openModal === "addAdmin"}
              closeModal={closeModalHandler}
              container={modalContainerRef}
            />
          )}
        </div>
      </div>
    </>
  );
}
