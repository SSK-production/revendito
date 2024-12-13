"use client"
import React, { useState } from "react";
import AddAdminModal from "./adminModal";
import AdminUserBanModal from "./AdminUserBanModal";
import AdminDeleteOfferModal from "./AdminDeleteOffer";
import Image from "next/image";


export default function AdminHomePage() {
    const [isAddAdminModalOpen, setIsAddAdminModalOpen] = useState<boolean>(false);
    const [isDeleteOfferModalOpen, setisDeleteOfferModalOpen] = useState<boolean>(false);
    const [isUserBanModalOpen, setisUserBanModalOpen] = useState<boolean>(false);

    // Gestionnaires pour la modal Add Admin
    const openAddAdminModal = () => setIsAddAdminModalOpen(true);
    const closeAddAdminModal = () => setIsAddAdminModalOpen(false);

    // Gestionnaires pour la modal Delete Offer
    const openDeleteOfferModal = () => setisDeleteOfferModalOpen(true);
    const closeDeleteOfferModal = () => setisDeleteOfferModalOpen(false);

    // const open
    const openBanUserModal = () => setisUserBanModalOpen(true);
    const closeBanUserModal = () => setisUserBanModalOpen(false);

    return (
        <>
            {/* Faire la logique de lorsqu'il y a un nouveau report, changer la cloche en cloche avec notif */}
            <div className="flex flex-col gap-3">
                <div className="flex flex-col justify-between p-4 pb-8 bg-[#D9D9D9] rounded-lg border border-orange-900/70 shadow-md">
                    <div className="flex justify-end">
                        <Image
                            src="/icons/mobil-dashboard/bell.svg"
                            width={25}
                            height={25}
                            alt="bell"
                        />
                    </div>
                    <div className="flex gap-2 items-center">
                        <Image
                            src="/icons/mobil-dashboard/status-info.svg"
                            width={30}
                            height={30}
                            alt="status-info"
                        />
                        <p className="flex items-center">Report</p>
                    </div>
                </div>

                <div className="flex flex-col justify-between p-4 pb-8 bg-[#D9D9D9] rounded-lg border border-orange-900/70 shadow-md"
                onClick={openBanUserModal}>
                    <div className="flex gap-2 items-center mt-4">
                        <Image
                            src="/icons/mobil-dashboard/ban-user.svg"
                            width={35}
                            height={35}
                            alt="ban-user.svg"
                        />
                        <p className="flex items-center">Ban User</p>
                    </div>
                     {/* Modal Ban User */}
                <AdminUserBanModal isOpen={isUserBanModalOpen} closeModal={closeBanUserModal} />
                </div>

                {/* Modal Ban User */}
                <AdminDeleteOfferModal isOpen={isDeleteOfferModalOpen} closeModal={closeDeleteOfferModal} />

                <div className="flex justify-between">
                    <div
                        className="flex flex-col justify-between p-4 pb-8 bg-[#D9D9D9] rounded-lg border border-orange-900/70 shadow-md"
                        onClick={openDeleteOfferModal} // Logic moved here
                    >
                        <div className="flex flex-col gap-2 items-center mt-4">
                            <Image
                                src="/icons/mobil-dashboard/bin.svg"
                                width={35}
                                height={35}
                                alt="delete-offer.svg"
                            />
                            <p className="flex items-center">Delete Offer</p>
                        </div>
                    </div>

                    {/* Add admin */}
                    <div
                        className="flex flex-col justify-between p-4 pb-8 bg-[#D9D9D9] rounded-lg border border-orange-900/70 shadow-md"
                        onClick={openAddAdminModal}
                    >
                        <div className="flex flex-col gap-2 items-center">
                            <Image
                                src="/icons/mobil-dashboard/add.svg"
                                width={55}
                                height={55}
                                alt="add-admin.svg"
                            />
                            <p className="flex items-center">Add Admin</p>
                        </div>
                        {/* Modal Add Admin */}
                        <AddAdminModal isOpen={isAddAdminModalOpen} closeModal={closeAddAdminModal} />
                    </div>
                </div>

                <div className="flex justify-between p-4 bg-[#D9D9D9] rounded-lg border border-orange-900/70 shadow-md">
                    <div className="flex gap-2 items-center">
                        <div className="flex flex-col gap-2 items-center">
                            <Image
                                src="/icons/mobil-dashboard/user-rounded.svg"
                                width={35}
                                height={35}
                                alt="user-rounded.svg"
                            />
                            <p className="flex items-center">1000000</p>
                        </div>
                    </div>
                    <div className="w-px h-24 bg-black my-4"></div>
                    <div className="flex flex-col justify-center gap-2 items-center">
                        <Image
                            src="/icons/mobil-dashboard/page.svg"
                            width={35}
                            height={35}
                            alt="page.svg"
                        />
                        <p className="flex items-center">1000000</p>
                    </div>
                </div>
            </div>
        </>
    );
}
