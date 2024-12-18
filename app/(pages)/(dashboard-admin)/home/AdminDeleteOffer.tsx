import Image from "next/image";
import React, { useEffect, useState } from "react";
import { formatDate } from "@/utils/functions/timeFunction/formatDate";

interface ModalProps {
    isOpen: boolean;
    closeModal: () => void;
}

type OfferType = "vehicleOffer" | "realEstateOffer" | "commercialOffer";

interface BannedOffer {
    vendor: string; //ok
    vendorType: string; //ok
    title: string; //ok
    description: string;
    price: string; //ok
    userIsBanned: boolean; //ok 
    createdAt: string; // ok 
    banReason: string;
    banEndDate: string;
    typeOffers: OfferType; // Utilisation du type `typeOffers` venant du backend
    src: string | null; // Assurez-vous que src peut être null
}

const AdminDeleteOfferModal: React.FC<ModalProps> = ({ isOpen, closeModal }) => {
    const [expandedOffer, setExpandedOffer] = useState<number | null>(null);
    const [isBanned, setIsBanned] = useState<BannedOffer[]>([]);

    // Fetch des utilisateurs bannis uniquement lorsque la modal est ouverte
    useEffect(() => {
        if (isOpen) {
            const fetchBannedEntities = async () => {
                try {
                    const response = await fetch(`/api/allOffers`);
                    if (!response.ok) {
                        throw new Error("Erreur lors de la requête");
                    }
                    const data: BannedOffer[] = await response.json();

                    // Mettre à jour l'état avec toutes les offres
                    setIsBanned(data);
                } catch (error: any) {
                    console.error("Erreur:", error.message);
                }
            };

            fetchBannedEntities();
        }
    }, [isOpen]); // Déclenche l'effet uniquement quand `isOpen` change

    if (!isOpen) return null; // Si la modal n'est pas ouverte, ne rien afficher.

    const toggleOfferExpand = (index: number) => {
        setExpandedOffer(expandedOffer === index ? null : index);
    };

    const getImageSrc = (offer: BannedOffer) => {
        // Utilisation du switch pour retourner l'image en fonction du type d'offre
        switch (offer.typeOffers) {
            case "vehicleOffer":
                return offer.src && offer.src.trim() !== "" ? offer.src : "/icons/mobil-dashboard/car-rental.svg";
            case "realEstateOffer":
                return offer.src && offer.src.trim() !== "" ? offer.src : "/icons/mobil-dashboard/building.svg";
            case "commercialOffer":
                return offer.src && offer.src.trim() !== "" ? offer.src : "/icons/mobil-dashboard/briefcase.svg";
            default:
                return "/icons/mobil-dashboard/default-image.svg"; // Image par défaut si le type n'est pas reconnu
        }
    };

    return (
        <div
            className="fixed top-0 left-0 right-0 bottom-0 w-full h-screen backdrop-blur-md bg-black bg-opacity-50 flex justify-center items-center z-50"
            onClick={closeModal}
        >
            <div
                className="bg-white p-6 w-full h-full flex  overflow-hidden"
                onClick={(e) => e.stopPropagation()} // Empêche la fermeture si on clique à l'intérieur de la modal
            >
                {/* Header */}
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
                                alt="close-modal"
                                onClick={closeModal}
                                className="cursor-pointer"
                            />
                        </div>
                    </div>

                    {/* Offer List */}
                    <div className="flex items-center flex-wrap gap-4 mt-4 overflow-y-auto max-h-[80vh] scroll-smooth">
                        {isBanned.map((offer, index) => (
                            <div
                                key={index}
                                className="bg-white rounded-lg shadow-[0_4px_6px_rgba(0,0,0,0.4)] pl-4 pt-4 w-full flex flex-col border border-red-400 "
                            >
                                <div className="flex items-center justify-between space-x-2">
                                    {/* Affichage de l'image en fonction du type d'offre avec `switch` */}
                                    <div className="flex items-center gap-2">
                                        <Image
                                            src={getImageSrc(offer)} // Appel de la fonction `getImageSrc` pour obtenir l'image
                                            width={40}
                                            height={40}
                                            alt={`${offer.typeOffers} icon`} // Utilisation du `typeOffers` pour l'icon

                                        />

                                        <div className="h-[40px] flex items-center ml-2">
                                            <p className="text-ms font-bold text-gray-700 ">
                                                {offer.title}
                                            </p>
                                        </div>
                                    </div>


                                    <button onClick={() => toggleOfferExpand(index)}>
                                        <Image
                                            src="/icons/mobil-dashboard/userBan/arrow-narrow-down-move.svg"
                                            width={20}
                                            height={20}
                                            alt="arrow"
                                            className={`transition-transform ${expandedOffer === index ? "rotate-180" : ""} mr-2`}
                                        />
                                    </button>
                                </div>

                                <div className="flex justify-end pr-2 pb-2">
                                    <p className="text-sm text-gray-600">{offer.vendor}</p>
                                </div>

                                {expandedOffer === index && (
                                    <div className="flex flex-col text-left pl-4 mt-4">
                                        <div>
                                            <p>test</p>
                                        </div>
                                        <div className="flex gap-1">
                                            <p>{offer.vendor}</p>
                                            <p>{offer.vendorType}</p>
                                            <p>{offer.userIsBanned}</p>
                                            <p>{formatDate(offer.createdAt)}</p>
                                        </div>
                                        <div className="text-sm lg:text-xl font-bold text-green-500 flex items-center border border-gray-200 w-fit p-1 rounded-md">
                                            <svg
                                                stroke="currentColor"
                                                fill="currentColor"
                                                strokeWidth="0"
                                                viewBox="0 0 512 512"
                                                className="mr-2"
                                                height="1em"
                                                width="1em"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path d="M0 252.118V48C0 21.49 21.49 0 48 0h204.118a48 48 0 0 1 33.941 14.059l211.882 211.882c18.745 18.745 18.745 49.137 0 67.882L293.823 497.941c-18.745 18.745-49.137 18.745-67.882 0L14.059 286.059A48 48 0 0 1 0 252.118zM112 64c-26.51 0-48 21.49-48 48s21.49 48 48 48 48-21.49 48-48-21.49-48-48-48z"></path>
                                            </svg>
                                            <p className="text-sm inline-block">{offer.price}€</p>
                                        </div>
                                        <form action="#">
                                            <label htmlFor="activateOffer" className="block text-gray-700 font-medium mb-2">
                                                Activer l'offre :
                                            </label>
                                            <select
                                                name="activateOffer"
                                                id="activateOffer"
                                                className="border border-gray-300 rounded-md p-2 w-fit focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            >
                                                <option value="false">False</option>
                                                <option value="true">True</option>
                                            </select>
                                        </form>
                                        <button>Prévisualiser</button>
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

export default AdminDeleteOfferModal;
