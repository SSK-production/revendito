import Image from "next/image";
import React, { useEffect, useState } from "react";

interface ModalProps {
    isOpen: boolean;
    closeModal: () => void;
}

interface BannedOffer {
    title: string;
    price: string;
    banReason: string;
    banEndDate: string;
    type: string;
    src: string;
}



const test: BannedOffer[] = [
    { title: "Vente de Voiture Audi RS6", price: "390", type: "car", src: "/icons/mobil-dashboard/briefcase.svg", banReason: "violation des règles", banEndDate: "24 Dec, 2024" },
    { title: "Annonce test 1", price: "390", type: "car", src: "/icons/mobil-dashboard/briefcase.svg", banReason: "violation des règles", banEndDate: "24h" },
    { title: "Annonce test 2", price: "390", type: "car", src: "/icons/mobil-dashboard/briefcase.svg", banReason: "violation des règles", banEndDate: "24h" },
    { title: "Annonce test 3", price: "390", type: "car", src: "/icons/mobil-dashboard/briefcase.svg", banReason: "violation des règles", banEndDate: "24h" },
    { title: "Annonce test 4", price: "390", type: "car", src: "/icons/mobil-dashboard/briefcase.svg", banReason: "violation des règles", banEndDate: "24h" },
];

const AdminDeleteOfferModal: React.FC<ModalProps> = ({ isOpen, closeModal }) => {
    const [expandedOffer, setExpandedOffer] = useState<number | null>(null);

    const toggleOfferExpand = (index: number) => {
        setExpandedOffer(expandedOffer === index ? null : index);
    };

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

    if (!isOpen) return null;

    return (
        <div
            className="fixed top-0 left-0 right-0 bottom-0 w-full h-full backdrop-blur-md bg-black bg-opacity-50 flex justify-center items-center z-50"
            onClick={closeModal}
        >
            <div
                className="bg-white p-6 w-full h-full text-center overflow-hidden"
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

                    {/* Search and Filter */}
                    <div className="flex justify-between">
                        <div className="flex gap-4">
                            <Image
                                src="/icons/mobil-dashboard/briefcase.svg"
                                width={32}
                                height={32}
                                alt="filter icon"
                            />
                            <Image
                                src="/icons/mobil-dashboard/building.svg"
                                width={32}
                                height={32}
                                alt="filter icon"
                            />
                            <Image
                                src="/icons/mobil-dashboard/car-rental.svg"
                                width={32}
                                height={32}
                                alt="filter icon"
                            />
                        </div>
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

                    {/* Offer List */}
                    <div className="flex justify-center flex-wrap gap-4 mt-4 overflow-y-auto border max-h-[60%]">
                        {test.map((offer, index) => (
                            <div
                                key={index}
                                className="bg-white rounded-lg shadow-[0_4px_6px_rgba(0,0,0,0.4)] pl-4 pt-4 w-full flex flex-col border border-red-400"
                            >
                                <div className="flex items-center gap-2 justify-between ">
                                    <Image
                                        src={offer.src}
                                        width={40}
                                        height={40}
                                        alt={`${offer.type} icon`}
                                        className="mb-4"
                                    />
                                    <h3 className="text-ms font-bold text-gray-700">{offer.title}</h3>
                                    <button onClick={() => toggleOfferExpand(index)} className="mr-2">
                                        <Image
                                            src="/icons/mobil-dashboard/userBan/arrow-narrow-down-move.svg"
                                            width={20}
                                            height={20}
                                            alt="arrow"
                                            className={`transition-transform ${
                                                expandedOffer === index ? "rotate-180" : ""
                                            }`}
                                        />
                                    </button>
                                </div>

                                <div className="flex justify-end pr-2 pb-2">
                                    <p className="text-sm text-gray-600">{offer.banEndDate}</p>
                                </div>

                                {expandedOffer === index && (
                                    <div className="flex flex-col text-left pl-4">
                                        <p className="text-sm text-gray-600">Prix: {offer.price}€</p>
                                        <p className="text-sm text-gray-600">Raison: {offer.banReason}</p>
                                        <p className="text-sm text-gray-600">Fin du bannissement: {offer.banEndDate}</p>
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
