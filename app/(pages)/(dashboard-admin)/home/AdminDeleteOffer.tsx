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
    id: number;
    type: boolean;
    vendor: string;
    validated: boolean;
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
    const [selectedValidation, setSelectedValidation] = useState<"validated" | "notValidated" | "">(""); // Filtre par validation

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
                    const response = await fetch(`/api/allOffers?validation=${selectedValidation}`);
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
    }, [isOpen, selectedValidation]); // Ajouter selectedValidation ici pour recharger quand la valeur change

    // Filtrer les offres en fonction du type sélectionné et de la recherche par titre
    const filteredOffers = isBanned.filter((offer) =>
        (selectedType ? offer.typeOffers === selectedType : true) &&
        offer.title.toLowerCase().includes(searchTerm.toLowerCase()) // Filtre par titre
    );

    // Vérification s'il y a des offres "notValidated" à afficher
    const noOffersToValidate = selectedValidation === "notValidated" && filteredOffers.every((offer) => offer.validated);

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

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault(); // Empêche le rechargement de la page lors de la soumission
        // Ajoute ici ton code pour traiter la recherche si nécessaire
        console.log("Form submitted with search term:", searchTerm);
    };

    // Gestion du changement de validation
    const handleValidationChange = async (offer: BannedOffer, index: number) => {
        const updatedOffers = [...isBanned];
        const updatedOffer = { ...offer, validated: !offer.validated };
        updatedOffers[index] = updatedOffer;
        setIsBanned(updatedOffers); // Mise à jour immédiate de l'interface

        // Appel API pour mettre à jour la validation
        try {
            const response = await fetch(`/api/updateOfferValidation`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    id: offer.id, // Utiliser l'ID unique de l'offre
                    type: offer.typeOffers, // Ajouter le type de l'offre
                    validated: !offer.validated, // Nouvel état de validation
                }),
            });

            if (!response.ok) {
                throw new Error('Erreur lors de la mise à jour de la validation');
            }

            const data = await response.json();
            console.log("Mise à jour réussie:", data);
            // Re-récupérer les données pour s'assurer que l'état est bien synchronisé avec le backend
            const fetchBannedEntities = async () => {
                try {
                    const response = await fetch(`/api/allOffers?validation=${selectedValidation}`);
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
        } catch (error) {
            // En cas d'erreur, revert la mise à jour dans l'interface
            console.error("Erreur lors de la mise à jour de la validation:", error);
            updatedOffer.validated = offer.validated; // Annule l'action si l'API échoue
            updatedOffers[index] = updatedOffer;
            setIsBanned(updatedOffers);
        }
    };

    return (
        <div className=" modal-overlay  lg:w-full lg:h-full lg:bg-red-950" onClick={closeModal}>
            <div
                className="modal-content lg:w-full lg:h-full lg:flex lg:flex-col" 
                ref={container}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="modal-header flex justify-between items-center p-4 border-b">
                    <div>
                        <div className="flex flex-col items-center gap-4">
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

                            {/* Filtre par validation */}
                            <div className="flex space-x-2">
                                <button
                                    className={`px-6 py-2 rounded-md font-medium transition-all duration-200 ease-in-out shadow-sm hover:shadow-md
          ${selectedValidation === "validated"
                                            ? "bg-gradient-to-r from-green-400 to-green-500 text-white"
                                            : "bg-white text-gray-700 hover:bg-gray-50"
                                        }`}
                                    onClick={() => setSelectedValidation("validated")}
                                >
                                    Validated
                                </button>
                                <button
                                    className={`px-6 py-2 rounded-md font-medium transition-all duration-200 ease-in-out shadow-sm hover:shadow-md
          ${selectedValidation === "notValidated"
                                            ? "bg-gradient-to-r from-red-400 to-red-500 text-white"
                                            : "bg-white text-gray-700 hover:bg-gray-50"
                                        }`}
                                    onClick={() => setSelectedValidation("notValidated")}
                                >
                                    Not validated
                                </button>
                                <button
                                    className={`px-6 py-2 rounded-md font-medium transition-all duration-200 ease-in-out shadow-sm hover:shadow-md
          ${selectedValidation === ""
                                            ? "bg-gradient-to-r from-blue-400 to-blue-500 text-white"
                                            : "bg-white text-gray-700 hover:bg-gray-50"
                                        }`}
                                    onClick={() => setSelectedValidation("")}
                                >
                                    All
                                </button>
                            </div>

                            {/* Boutons pour filtrer par type d'offre */}
                            <div className="flex gap-6">
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
                    </div>

                    {/* Bouton de fermeture */}
                    <div>
                        <Image
                            src="/icons/mobil-dashboard/cross.svg"
                            width={25}
                            height={25}
                            alt="close-modal"
                            className=" absolute cursor-pointer"
                            onClick={closeModal}
                        />
                    </div>
                    
                </div>
                <div className="modal-body flex-1 overflow-y-auto p-4">
                    <div className="grid gap-4">
                        {/* Message quand il n'y a pas d'offre à valider */}
                        {noOffersToValidate && (
                            <div className="p-4 text-center bg-gray-100 border border-gray-300 rounded-lg">
                                Il n'y a pas d'offre à valider.
                            </div>
                        )}

                        {/* Affichage des offres filtrées */}
                        {filteredOffers.map((offer, index) => (
                            <div
                                key={index}
                                className="border border-red-300 rounded-lg shadow-sm p-4 flex flex-col md:flex-row md:items-center gap-4 bg-white"
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
                                            <span className="font-bold">Validé:</span>{" "}
                                            <span className={offer.validated ? "text-green-500" : "text-red-500"}>
                                                {offer.validated ? "Oui" : "Non"}
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
                                {/* Case à cocher pour "validated" */}
                                <label className="flex items-center space-x-3 cursor-pointer group">
                                    <div className="relative">
                                        <input
                                            type="checkbox"
                                            className="hidden"
                                            checked={offer.validated}
                                            onChange={() => handleValidationChange(offer, index)}
                                        />
                                        <div
                                            className={`w-6 h-6 rounded border-2 transition-all duration-200 ease-in-out
                    ${offer.validated
                                                    ? "bg-green-500 border-green-500"
                                                    : "bg-white border-gray-300 group-hover:border-green-500"
                                                }`}
                                        >
                                            <svg
                                                className={`w-4 h-4 text-white fill-current absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 transition-opacity duration-200 ease-in-out ${offer.validated ? "opacity-100" : "opacity-0"}`}
                                                viewBox="0 0 20 20"
                                            >
                                                <path d="M0 11l2-2 5 5L18 3l2 2L7 18z" />
                                            </svg>
                                        </div>
                                    </div>
                                    <span
                                        className={`text-sm font-medium transition-colors duration-200 ease-in-out ${offer.validated ? "text-green-600" : "text-gray-700 group-hover:text-green-600"}`}
                                    >
                                        {offer.validated ? "Validé" : "Non validé"}
                                    </span>
                                </label>

                                {/* Bouton supprimer uniquement si validated est false */}
                                {!offer.validated && (
                                    <button
                                        onClick={async () => {
                                            try {
                                                const response = await fetch(`/api/deleteOffer`, {
                                                    method: "DELETE",
                                                    headers: {
                                                        "Content-Type": "application/json",
                                                    },
                                                    body: JSON.stringify({ id: offer.id }),
                                                });

                                                if (!response.ok) {
                                                    throw new Error("Erreur lors de la suppression de l'offre");
                                                }

                                                // Mise à jour de l'état pour retirer l'offre supprimée
                                                setIsBanned((prevOffers) =>
                                                    prevOffers.filter((item) => item.id !== offer.id)
                                                );
                                            } catch (error) {
                                                console.error("Erreur lors de la suppression:", error);
                                            }
                                        }}
                                        className="bg-red-500 text-white rounded-lg px-4 py-2 hover:bg-red-600 transition-all"
                                    >
                                        Supprimer
                                    </button>
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
