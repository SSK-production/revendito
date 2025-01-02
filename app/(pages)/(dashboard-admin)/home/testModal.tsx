import React, { useEffect, useState } from "react";
import Image from "next/image";
import { formatDate } from "@/utils/functions/timeFunction/formatDate";
import ReportModal from "./reportModal";

interface ModalProps {
    isOpen: boolean;
    closeModal: () => void;
    container: React.RefObject<HTMLDivElement>;
}

type OfferType = "vehicleOffer" | "realEstateOffer" | "commercialOffer";

interface BannedOffer {
    id: number;
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

const TestAdminDeleteOfferModal: React.FC<ModalProps> = ({ isOpen, closeModal, container }) => {
    const [expandedOffer, setExpandedOffer] = useState<number | null>(null);
    const [isBanned, setIsBanned] = useState<BannedOffer[]>([]);
    const [isMobile, setIsMobile] = useState<boolean>(false);
    const [selectedType, setSelectedType] = useState<OfferType | "">(""); // État pour le type sélectionné
    const [searchTerm, setSearchTerm] = useState<string>(""); // État pour la recherche
    const [userId, setUserId] = useState<string | null>(null); // Stocke l'id utilisateur
    const [entity, setEntity] = useState<string | null>(null);
    const [reporterType, setReporterType] = useState<"USER" | "COMPANY" | null>(null);
    const [selectedOffer, setSelectedOffer] = useState<BannedOffer | null>(null); // Offre sélectionnée pour le report

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await fetch("/api/auth", {
                    method: "GET",
                    credentials: "include", // Assure que les cookies sont envoyés avec la requête
                });

                const data = await response.json();
                if (response.status === 200) {
                    setUserId(data.id); // Stocker l'id de l'utilisateur
                    setEntity(data.entity === "company" ? "COMPANY" : "USER");
                } else {
                    console.error(data.error || "Authentication failed");
                }
            } catch (error) {
                console.error("Error checking authentication:", error);
            }
        };

        checkAuth();
    }, []);

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

    const handleReportClick = (offer: BannedOffer) => {
        setSelectedOffer(offer); // Définit l'offre sélectionnée pour le report
    };

    const handleCloseReportModal = () => {
        setSelectedOffer(null); // Réinitialise l'offre sélectionnée pour fermer la modal
    };

    const handleReportSubmit = async (
        reason: string,
        userId: string | null,
        offerId: number | null,
        offerTitle: string | null,
        offerCategory: OfferType | "",
        entity: string | null
    ) => {
        if (!reason || !userId || offerId === null || !offerTitle || !offerCategory || !entity) {
            alert("Tous les champs sont nécessaires.");
            return;
        }

        try {
            const response = await fetch("/api/report", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    reason,
                    reporterId: userId,
                    reporterType: entity,
                    offerId: offerId.toString(),
                    offerTitle,
                    offerCategory,
                }),
            });

            if (!response.ok) {
                throw new Error("Erreur lors de l'envoi du signalement");
            }

            alert("Signalement envoyé avec succès !");
        } catch (error) {
            alert("Une erreur est survenue lors de l'envoi du signalement.");
            console.error(error);
        }
    };

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

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
    };

    return (
        <>
            <div className="modal-overlay w-full h-full" onClick={closeModal}>
                <div className="modal-content w-full h-full flex flex-col" ref={container} onClick={(e) => e.stopPropagation()}>
                    <div className="modal-header flex justify-between items-center p-4 border-b">
                        <div>
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
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                            </form>
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
                            <Image
                                src="/icons/mobil-dashboard/squares-menu.svg"
                                alt="All Offers"
                                width={40}
                                height={40}
                                className="cursor-pointer"
                                onClick={() => setSelectedType("")}
                            />
                        </div>
                        <Image
                            src="/icons/mobil-dashboard/cross.svg"
                            width={25}
                            height={25}
                            alt="close-modal"
                            className="cursor-pointer"
                            onClick={closeModal}
                        />
                    </div>
                    <div className="modal-body flex-1 overflow-y-auto p-4 ">
                        <div className="grid gap-4">
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
                                                <span className="font-bold">Date de création:</span> {formatDate(offer.createdAt)}
                                            </div>
                                            <div>
                                                <span className="font-bold">Prix:</span> {offer.price}€
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm text-gray-500">
                                            {expandedOffer === index ? offer.description : truncateDescription(offer.description, 20)}
                                        </p>
                                        <button onClick={() => toggleOfferExpand(index)} className="text-blue-500 text-sm mt-2">
                                            {expandedOffer === index ? "Voir moins" : "Voir plus"}
                                        </button>
                                    </div>
                                    <button
                                        className="bg-red-400 text-white rounded-lg px-4 py-2"
                                        onClick={() => handleReportClick(offer)}
                                    >
                                        Report
                                    </button>
                                    <button className="bg-green-400 text-white rounded-lg px-4 py-2">Unban</button>
                                    <button className="bg-blue-500 text-white rounded-lg px-4 py-2">Preview</button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {selectedOffer && entity && (
                <ReportModal
                    isOpen={!!selectedOffer}
                    onClose={handleCloseReportModal}
                    onSubmit={handleReportSubmit}
                    userId={userId}
                    offerId={selectedOffer?.id?.toString() || null}
                    offerTitle={selectedOffer?.title || null}
                    offerCategory={selectedOffer?.typeOffers || ""} // Passez le type de l'offre comme catégorie
                    entity={entity} // Passez l'entité également
                />
            )}
        </>
    );
};

export default TestAdminDeleteOfferModal;
