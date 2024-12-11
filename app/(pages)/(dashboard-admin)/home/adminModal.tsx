import Image from 'next/image';
import React from 'react';

// Définir les types des props
interface ModalProps {
    isOpen: boolean;
    closeModal: () => void;
}

//Faire le fetch des données utilisateur en fonction du Name => lorsqu'on clique sur enter ou sur la loupe, envoi la requête. 
//Une fois la requête effectuée, update les champs Firstname et Lastname par les données recuillis 

const Modal: React.FC<ModalProps> = ({ isOpen, closeModal }) => {
    if (!isOpen) return null; // Si la modal n'est pas ouverte, elle ne s'affiche pas.

    return (
        <div
            className="fixed top-0 left-0 right-0 bottom-0 backdrop-blur-md bg-black bg-opacity-50 flex justify-center items-center z-50"
            onClick={closeModal}
        >
            <div
                className="bg-white p-6 rounded-lg min-w-[300px] text-center"
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
                    <div className="flex justify-end">
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
                        <form >
                            <div className='flex flex-col'>
                                <label htmlFor="firstname" className='flex'>Firstname</label>
                                <input type="text" name="firstname" id="firstname" className='border-2 rounded border-black' />
                            </div>
                            <div className='flex flex-col'>
                                <label htmlFor="lastname" className='flex'>Lastname</label>
                                <input type="text" name="lastname" id="lastname" className='border-2 rounded border-black' />
                            </div>
                            <div className='mb-1'>
                                <label htmlFor="rank" className='flex'>Rank</label>
                                <select id="options" className="mt-1 block  pl-3 pr-10 py-2  border-2 text-xs border-black focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
                                    <option className='text-xs'>USER</option>
                                    <option className='text-xs'>ADMIN</option>
                                </select>
                            </div>
                        </form>
                    </div>
                </div>
                <button
                    className="px-8 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                    Submit
                </button>
                {/* faire le fetch qui va envoyer les données update */}
            </div>
        </div>
    );
};

export default Modal;
