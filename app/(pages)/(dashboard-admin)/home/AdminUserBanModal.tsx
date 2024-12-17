import Image from "next/image";
import React, { useState, useEffect } from "react";
import { formatDate } from "@/utils/functions/timeFunction/formatDate";

// Définir les types des props
interface ModalProps {
    isOpen: boolean;
    closeModal: () => void;
}

interface BannedUser {
    id: number;
    firstName: string;
    lastName: string;
    banReason: string;  // `banReason` est une chaîne de caractères ici, pas un tableau.
    banEndDate: string;
    banCount: string;
}


const AdminUserBanModal: React.FC<ModalProps> = ({ isOpen, closeModal }) => {
    const [expandedUser, setExpandedUser] = useState<number | null>(null); // Déclarer l'état pour les utilisateurs dépliés
    const [isBanned, setIsBanned] = useState<BannedUser[]>([]);

    // fetch des utilisateurs banni uniquement lorsque la modal est ouverte
    useEffect(() => {
        if (isOpen) {
            const fetchBannedEntities = async () => {
                try {
                    const response = await fetch(`/api/searchUser?isBanned=true`);
                    if (!response.ok) {
                        throw new Error('Erreur lors de la requête');
                    }
                    const data: BannedUser[] = await response.json(); // Assurez-vous que les données ont le bon type
                    console.log(data);
                    if (data.length > 0) {
                        setIsBanned(data); // Mettez à jour l'état des utilisateurs bannis
                    } else {
                        console.log("Aucune entité bannie trouvée.");
                    }
                } catch (error: any) {
                    console.error('Erreur:', error.message);
                }
            };
            fetchBannedEntities();
        }
    }, [isOpen]);  // Déclenche l'effet uniquement quand `isOpen` change

    if (!isOpen) return null; // Si la modal n'est pas ouverte, ne rien afficher.

    const toggleUserExpand = (userId: number) => {
        setExpandedUser(expandedUser === userId ? null : userId); // Déplie ou replie l'utilisateur
    };

    return (
        <div
            className="fixed top-0 left-0 right-0 bottom-0 w-full h-full backdrop-blur-md bg-black bg-opacity-50 flex justify-center items-center z-50"
            onClick={closeModal}
        >
            <div
                className="bg-white p-6 w-full h-full text-center overflow-y-auto"
                onClick={(e) => e.stopPropagation()} // Empêche la fermeture si on clique à l'intérieur de la modal
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
                            <input
                                type="text"
                                name="searchUser"
                                id="searchUser"
                                placeholder="search by FirstName"
                                className="border-2 rounded border-black w-36 pr-2 placeholder:text-xs"
                            />
                            <Image
                                src="/icons/mobil-dashboard/search.svg"
                                width={15}
                                height={15}
                                alt="search icon"
                                className="absolute top-1/2 right-2 -translate-y-1/2 pointer-events-none"
                            />
                        </form>
                    </div>
                    <div className="space-y-4">
                        {/* Boucle pour afficher chaque utilisateur banni  isBanned*/}
                        {isBanned.map((user) => (
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
                                        <div className="flex">
                                            <p>Banned By : {user.id} </p> 
                                        </div>
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
                                                <p>End Ban</p>
                                                <p>{formatDate(user.banEndDate)}</p>
                                            </div>
                                        </div>

                                        {/* Affichage de la raison du bannissement */}
                                        <div className="flex flex-col mt-6">
                                            <h2 className="flex justify-start">Ban Reason</h2>
                                            <div className="space-y-4">
                                                <div className="flex flex-col gap-2 bg-white rounded-md pt-2 pb-4 pl-2 pr-2">
                                                    <div className="flex items-center gap-2">
                                                        <Image
                                                            src="/icons/mobil-dashboard/userBan/warning.svg"
                                                            width={20}
                                                            height={20}
                                                            alt="warning.svg"
                                                        />
                                                        <h2 className="text-lg font-normal">{user.banReason}</h2> {/* Affiche le banReason */}
                                                    </div>
                                                </div>
                                            </div>
                                            <div>
                                                <button className="bg-blue-400 pl-4 pr-4 mt-4 pt-2 pb-2 rounded-full font-bold text-white text-sm">
                                                    UnBan
                                                </button>
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
