import React, { useEffect, useState } from "react";
import Image from "next/image";
import { formatDate } from "@/utils/functions/timeFunction/formatDate";

interface ModalProps {
    isOpen: boolean;
    closeModal: () => void;
    container: React.RefObject<HTMLDivElement>;
}

type OfferType = "vehicleOffer" | "realEstateOffer" | "commercialOffer";

interface BannedOffer {
    vendor: string;
    vendorType: string;
    title: string;
    description: string;
    price: string;
    userIsBanned: boolean;
    createdAt: string;
    banReason: string;
    banEndDate: string;
    typeOffers: OfferType;
    src: string | null;
}

const AdminDeleteOfferModal: React.FC<ModalProps> = ({ isOpen, closeModal, container }) => {
    const [expandedOffer, setExpandedOffer] = useState<number | null>(null);
    const [isBanned, setIsBanned] = useState<BannedOffer[]>([]);
    const [isMobile, setIsMobile] = useState<boolean>(false);
    const [selectedType, setSelectedType] = useState<OfferType | "">(""); // État pour le type sélectionné
    const [searchTerm, setSearchTerm] = useState<string>(""); // État pour la recherche

    useEffect(() => {
        const checkIfMobile = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        checkIfMobile();
        window.addEventListener("resize", checkIfMobile);

        return () => {
            window.removeEventListener("resize", checkIfMobile);
        };
    }, []);

    useEffect(() => {
        if (isOpen) {
            const fetchBannedEntities = async () => {
                try {
                    const response = await fetch(`/api/allOffers`);
                    if (!response.ok) {
                        throw new Error("Erreur lors de la requête");
                    }
                    const data: BannedOffer[] = await response.json();
                    setIsBanned(data);
                } catch (error: any) {
                    console.error("Erreur:", error.message);
                }
            };
            fetchBannedEntities();
        }
    }, [isOpen]);

    // Filtrer les offres en fonction du type sélectionné et de la recherche par titre
    const filteredOffers = isBanned.filter((offer) =>
        (selectedType ? offer.typeOffers === selectedType : true) &&
        offer.title.toLowerCase().includes(searchTerm.toLowerCase()) // Filtre par titre
    );

    const getImageSrc = (offer: BannedOffer) => {
        switch (offer.typeOffers) {
            case "vehicleOffer":
                return offer.src && offer.src.trim() !== "" ? offer.src : "/icons/mobil-dashboard/car-rental.svg";
            case "realEstateOffer":
                return offer.src && offer.src.trim() !== "" ? offer.src : "/icons/mobil-dashboard/building.svg";
            case "commercialOffer":
                return offer.src && offer.src.trim() !== "" ? offer.src : "/icons/mobil-dashboard/briefcase.svg";
            default:
                return "/icons/mobil-dashboard/default-image.svg";
        }
    };

    const truncateDescription = (description: string, limit: number) => {
        return description.length > limit ? `${description.substring(0, limit)}...` : description;
    };

    const toggleOfferExpand = (index: number) => {
        setExpandedOffer(expandedOffer === index ? null : index);
    };

    // Si la modal est fermée, on ne la rend pas
    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault(); // Empêche le rechargement de la page lors de la soumission
        // Ajoute ici ton code pour traiter la recherche si nécessaire
        console.log("Form submitted with search term:", searchTerm);
    };

    return (
        <div className="modal-overlay w-full h-full" onClick={closeModal}>
            <div
                className="modal-content w-full h-full flex flex-col"
                ref={container}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="modal-header flex justify-between items-center p-4 border-b">
                    <div>
                        <div className="flex items-center gap-6">
                            {/* Formulaire de recherche */}
                            <form onSubmit={handleSubmit} className="flex gap-4">
                                <div>
                                    <label htmlFor="searchOffer">Search: </label>
                                    <input
                                        type="text"
                                        name="searchOffer"
                                        id="searchOffer"
                                        placeholder="Search by Name"
                                        className="border border-black bg-gray-200 rounded-lg text-sm p-0.5 ml-0 pl-2"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)} // Mettre à jour l'état
                                    />
                                </div>
                            </form>

                            {/* Boutons pour filtrer par type d'offre */}
                            <Image
                                src="/icons/mobil-dashboard/car-rental.svg"
                                alt="Vehicle Offer"
                                width={50}
                                height={50}
                                className="cursor-pointer"
                                onClick={() => setSelectedType("vehicleOffer")}
                            />
                            <Image
                                src="/icons/mobil-dashboard/building.svg"
                                alt="Real Estate Offer"
                                width={50}
                                height={50}
                                className="cursor-pointer"
                                onClick={() => setSelectedType("realEstateOffer")}
                            />
                            <Image
                                src="/icons/mobil-dashboard/briefcase.svg"
                                alt="Commercial Offer"
                                width={50}
                                height={50}
                                className="cursor-pointer"
                                onClick={() => setSelectedType("commercialOffer")}
                            />
                            {/* Option pour voir toutes les offres */}
                            <Image
                                src="/icons/mobil-dashboard/squares-menu.svg"
                                alt="All Offers"
                                width={40}
                                height={40}
                                className="cursor-pointer"
                                onClick={() => setSelectedType("")} // Réinitialiser le filtre
                            />
                        </div>
                    </div>

                    {/* Bouton de fermeture */}
                    <Image
                        src="/icons/mobil-dashboard/cross.svg"
                        width={25}
                        height={25}
                        alt="close-modal"
                        className="cursor-pointer"
                        onClick={closeModal}
                    />
                </div>

                <div className="modal-body flex-1 overflow-y-auto p-4">
                    <div className="grid gap-4">
                        {filteredOffers.map((offer, index) => (
                            <div
                                key={index}
                                className="border border-red-300 rounded-lg shadow-sm p-4 flex flex-col md:flex-row md:items-center gap-4"
                            >
                                <Image
                                    src={getImageSrc(offer)}
                                    width={60}
                                    height={60}
                                    alt={`${offer.typeOffers} icon`}
                                    className="rounded"
                                />
                                <div className="flex-1">
                                    <h3 className="font-semibold text-lg">{offer.title}</h3>
                                    <div className="grid grid-cols-2 gap-2 text-sm text-gray-500">
                                        <div>
                                            <span className="font-bold">Vendeur:</span> {offer.vendor}
                                        </div>
                                        <div>
                                            <span className="font-bold">Type:</span> {offer.vendorType}
                                        </div>
                                        <div>
                                            <span className="font-bold">Banni:</span>{" "}
                                            <span className={offer.userIsBanned ? "text-red-500" : "text-green-500"}>
                                                {offer.userIsBanned ? "Oui" : "Non"}
                                            </span>
                                        </div>
                                        <div>
                                            <span className="font-bold">Date de création:</span> {formatDate(offer.createdAt)}
                                        </div>
                                        <div>
                                            <span className="font-bold">Prix:</span> {offer.price}€
                                        </div>
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm text-gray-500">
                                        {expandedOffer === index
                                            ? offer.description
                                            : truncateDescription(offer.description, 20)}
                                    </p>
                                    <button
                                        onClick={() => toggleOfferExpand(index)}
                                        className="text-blue-500 text-sm mt-2"
                                    >
                                        {expandedOffer === index ? "Voir moins" : "Voir plus"}
                                    </button>
                                </div>
                                <button className="bg-green-400 text-white rounded-lg px-4 py-2">Unban</button>
                                <button className="bg-blue-500 text-white rounded-lg px-4 py-2">Preview</button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDeleteOfferModal;
