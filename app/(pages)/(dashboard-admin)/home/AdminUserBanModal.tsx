import Image from "next/image";
import React, { useState, useEffect } from "react";

// Définir les types des props
interface ModalProps {
    isOpen: boolean;
    closeModal: () => void;
}

const AdminUserBanModal: React.FC<ModalProps> = ({ isOpen, closeModal }) => {
    // Déclarez les hooks avant tout autre code.
    const [expandedUser, setExpandedUser] = useState<number | null>(null); // Déclarer l'état pour les utilisateurs dépliés

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden"; // Empêche le scrolling
        } else {
            document.body.style.overflow = ""; // Réinitialise le scrolling
        }
        return () => {
            document.body.style.overflow = ""; // Cleanup
        };
    }, [isOpen]);

    if (!isOpen) return null; // Si la modal n'est pas ouverte, elle ne s'affiche pas.

    // Données simulées pour les utilisateurs bannis
    const bannedUsers = [
        {
            id: 1,
            firstName: "Masy",
            lastName: "Jordan",
            banReason: "Fake Offer Abuse",
            banDuration: "24h",
            banCount: "3",
            titleBan: ["Fake Offer Abuse", "Fake Offer Abuse2", "Fake Offer Abuse2"],
            descriptionOfBan: ["Violation of marketplace rules - posting fraudulent offers", "dumb", "idiot"],
        },
        {
            id: 2,
            firstName: "Alex",
            lastName: "Smith",
            banReason: "Spamming",
            banDuration: "48h",
            banCount: "3",
            titleBan: ["Fake Offer Abuse", "Fake Offer Abuse2", "Fake Offer Abuse2"],
            descriptionOfBan: ["noob", "dumb", "idiot"],
        },
        {
            id: 3,
            firstName: "John",
            lastName: "Doe",
            banReason: "Harassment",
            banDuration: "72h",
            banCount: "3",
            titleBan: ["Fake Offer Abuse", "Fake Offer Abuse2", "Fake Offer Abuse2","aaaaaaaaaaaaaaaa"],
            descriptionOfBan: ["noob", "dumb", "idiot","bbbbbbbbb"],
        },
    ];

    const toggleUserExpand = (userId: number) => {
        setExpandedUser(expandedUser === userId ? null : userId); // Déplie ou replie l'utilisateur
    };

    return (
        <div
            className="fixed top-0 left-0 right-0 bottom-0 w-full h-full backdrop-blur-md bg-black bg-opacity-50 flex justify-center items-center z-50"
            onClick={closeModal}
        >
            <div
                className="bg-white p-6 w-full h-full text-center"
                // onClick={(e) => e.stopPropagation()} // Empêche la fermeture si on clique à l'intérieur de la modal
            >
                <div className="pb-3">
                    <div className="flex justify-between pb-3">
                        <div>
                            <span className="text-orange-700 dark:text-orange-600 font-medium">Re</span>Ventures
                        </div>
                        <div>
                            <Image
                                src="/icons/mobil-dashboard/cross.svg"
                                width={25}
                                height={25}
                                alt="user-rouded.svg"
                                onClick={closeModal}
                            />
                        </div>
                    </div>
                    <div className="flex justify-end">
                        <form className="relative">
                            {/* Conteneur du champ de recherche avec icône */}
                            <input
                                type="text"
                                name="searchUser"
                                id="searchUser"
                                placeholder="search by FirstName"
                                className="border-2 rounded border-black w-36 pr-2 placeholder:text-xs" // Ajout d'un padding à gauche pour l'icône
                            />
                            {/* L'icône de recherche */}
                            <Image
                                src="/icons/mobil-dashboard/search.svg"
                                width={15}
                                height={15}
                                alt="search icon"
                                className="absolute top-1/2 right-2 -translate-y-1/2 pointer-events-none" // Positionne l'image dans le champ
                            />
                        </form>
                    </div>
                    <div className="space-y-4">
                        {/* Boucle pour afficher chaque utilisateur banni */}
                        {bannedUsers.map((user) => (
                            <div key={user.id}>
                                {/* Accordion Item */}
                                <div className="flex justify-between items-center bg-[#D9D9D9] pl-2 pr-2 pt-4 pb-4 mt-4 rounded-tl-lg rounded-tr-lg shadow-[0_4px_6px_rgba(0,0,0,0.4)]">
                                    <div className="flex items-center gap-2">
                                        <Image
                                            src="/icons/mobil-dashboard/ban-user.svg"
                                            width={30}
                                            height={30}
                                            alt="ban-user.svg"
                                        />
                                        <div className="flex gap-2">
                                            <p>{user.firstName}</p>
                                            <p>{user.lastName}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="bg-[#ED2B2B] rounded-xl pl-3 pr-3">
                                            <p className="text-white text-bold text-center text-sm font-bold">BANNED</p>
                                        </div>
                                        <button onClick={() => toggleUserExpand(user.id)}>
                                            <Image
                                                src="/icons/mobil-dashboard/userBan/arrow-narrow-down-move.svg"
                                                width={30}
                                                height={30}
                                                alt="arrow"
                                                className={`transition-transform ${expandedUser === user.id ? "rotate-180" : ""}`}
                                            />
                                        </button>
                                    </div>
                                </div>

                                {/* Content qui se déploie lorsqu'un utilisateur est sélectionné */}
                                {expandedUser === user.id && (
                                    <div className="pt-4 pb-2 pl-4 pr-4 border bg-[#D9D9D9] shadow-[0_4px_6px_rgba(0,0,0,0.4)]">
                                        <div className="flex justify-between">
                                            <div className="bg-white rounded-md ml-2 pl-6 pr-6 flex flex-col items-center pt-2 pb-1">
                                                <Image
                                                    src="/icons/mobil-dashboard/userBan/stop-sign.svg"
                                                    width={30}
                                                    height={30}
                                                    alt="stop-sign.svg"
                                                />
                                                <p>Ban Count</p>
                                                <p>{user.banCount}</p>
                                            </div>
                                            <div className="bg-white rounded-md mr-2 pl-6 pr-6 flex flex-col items-center pt-2 pb-1">
                                                <Image
                                                    src="/icons/mobil-dashboard/userBan/clock.svg"
                                                    width={30}
                                                    height={30}
                                                    alt="stop-sign.svg"
                                                />
                                                <p>Ban Count</p>
                                                <p>{user.banCount}</p>
                                            </div>
                                            {/* titleBan descriptionOfBan */}
                                        </div>

                                        {/* Informations supplémentaires sur l'utilisateur */}
                                        <div className="flex flex-col mt-6">
                                            <h2 className="flex justify-start">Ban History</h2>
                                            <div className="space-y-4">
                                                {user.titleBan.map((title, index) => (
                                                    <div
                                                        key={index}
                                                        className="flex flex-col gap-2 bg-white rounded-md pt-2 pb-4 pl-2 pr-2"
                                                    >
                                                        <div className="flex items-center gap-2">
                                                            <Image
                                                                src="/icons/mobil-dashboard/userBan/warning.svg"
                                                                width={20}
                                                                height={20}
                                                                alt="warning.svg"
                                                            />
                                                            <h2 className="text-lg font-normal">{title}</h2>
                                                        </div>

                                                        <div className="text-justify">
                                                            <p className="text-gray-600 text-sm">{user.descriptionOfBan[index]}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminUserBanModal;
