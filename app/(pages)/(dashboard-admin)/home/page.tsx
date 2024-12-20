'use client'
import React, { useState, useRef } from "react";
import AddAdminModal from "./adminModal";
// import AdminUserBanModal from "./AdminUserBanModal";
import AdminDeleteOfferModal from "./AdminDeleteOffer";
import AdminUserBanModal from "./testModal";
import Image from "next/image";

export default function AdminHomePage() {
  const [isAddAdminModalOpen, setIsAddAdminModalOpen] = useState<boolean>(false);
  const [isDeleteOfferModalOpen, setisDeleteOfferModalOpen] = useState<boolean>(false);
  const [isUserBanModalOpen, setisUserBanModalOpen] = useState<boolean>(false);
  const [isTestModalOpen, setIsTestModalOpen] = useState<boolean>(false);

  const modalContainerRef = useRef<HTMLDivElement | null>(null);

  const openAddAdminModal = () => setIsAddAdminModalOpen(true);
  const closeAddAdminModal = () => setIsAddAdminModalOpen(false);

  const openDeleteOfferModal = () => setisDeleteOfferModalOpen(true);
  const closeDeleteOfferModal = () => setisDeleteOfferModalOpen(false);

  const openBanUserModal = () => setisUserBanModalOpen(true);
  const closeBanUserModal = () => setisUserBanModalOpen(false);

  const openTestModal = () => setIsTestModalOpen(true);
  const closeTestModal = () => setIsTestModalOpen(false);

  return (
    <>
      <div className=" lg:min-h-screen lg:h-full lg:flex lg:flex-row lg:bg-white lg:flex-1">
        {/* Contenu principal */}
        <div className="h-2/5 lg:flex lg:flex-col lg:bg-white-500 lg:rounded-lg ">
          {/* Section Test Modal */}
          <div onClick={openTestModal}>
            <div className="lg:mt-4 lg:mb-4 lg:flex lg:flex-row lg:gap-3 lg:ml-4 lg:mr-4">
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
          <div onClick={openBanUserModal}>
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

          <div onClick={openDeleteOfferModal}>
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
            <div onClick={openAddAdminModal}>
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
            {/* user Ban */}
            <AdminUserBanModal
            isOpen={isTestModalOpen}
            closeModal={closeTestModal}
            container={modalContainerRef} 
            // Passez la ref directement
            />

            {/* Delete Offer */}
                <AdminDeleteOfferModal
        isOpen={isDeleteOfferModalOpen}
        closeModal={closeDeleteOfferModal}
        container={modalContainerRef} 
        // Passez la ref directement
        />

        </div>
      </div>
    </>
  );
}
