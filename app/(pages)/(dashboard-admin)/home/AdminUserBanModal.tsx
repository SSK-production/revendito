import Image from "next/image";
import React from "react";
// Définir les types des props
interface ModalProps {
    isOpen: boolean;
    closeModal: () => void;
}


const AdminUserBanModal : React.FC<ModalProps> = ({ isOpen, closeModal}) => {
    if (!isOpen) return null; // Si la modal n'est pas ouverte, elle ne s'affiche pas.

    return (
        <div
         className="fixed top-0 left-0 right-0 bottom-0 w-full h-full backdrop-blur-md bg-black bg-opacity-50 flex justify-center items-center z-50"
        onClick={closeModal}
    >
        <div
            className="bg-white p-6  w-full h-full text-center"
            onClick={(e) => e.stopPropagation()} // Empêche la fermeture si on clique à l'intérieur de la modal
        >
            <div className='pb-3'>
                <div className='flex justify-between pb-3'>
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
                <div className="flex justify-between">
                    <div className="flex gap-4">
                    <Image
                            src="/icons/mobil-dashboard/briefcase.svg"
                            width={32}
                            height={32}
                            alt="search icon"
                        />
                                                <Image
                            src="/icons/mobil-dashboard/building.svg"
                            width={32}
                            height={32}
                            alt="search icon"
                        />
                                                <Image
                            src="/icons/mobil-dashboard/car-rental.svg"
                            width={32}
                            height={32}
                            alt="search icon"
                        />
                    </div>
                    <form className="relative">
                        {/* Conteneur du champ de recherche avec icône */}
                        <input
                            type="text"
                            name="searchUser"
                            id="searchUser"
                            placeholder="search by FirstName"
                            className="border-2 rounded border-black w-36  pr-2 placeholder:text-xs" // Ajout d'un padding à gauche pour l'icône
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
                <div>
                    {/* je dois faire un fetch qui va récupérer tous les utilisateurs qui ont été bannis. Créer un tableau qui récupère tous les utilisateurs bannis pour pouvoir faire un map(). faire   */}
                    <p>test</p>
                </div>
            </div>
        </div>
    </div>
    )
}

export default AdminUserBanModal;