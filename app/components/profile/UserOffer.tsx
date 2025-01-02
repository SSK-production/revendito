import { FiEdit, FiTrash2, FiEye, FiEyeOff } from "react-icons/fi";
import Image from "next/image";
import { Offers } from "@/app/types";
import UpdateOffer from "../shared/UpdateOffer"; // Import UpdateOffer
import { useState } from "react";

interface UserOffersProps {
  offers: {
    vehicleOffers: Offers[];
    realEstateOffers: Offers[];
    commercialOffers: Offers[];
  };
  currentUserId: string | null;
  userId: string;
}

const UserOffers: React.FC<UserOffersProps> = ({ offers, currentUserId, userId }) => {
  const { vehicleOffers, realEstateOffers, commercialOffers } = offers;

  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState<number | null>(null);
  const [selectedOfferType, setSelectedOfferType] = useState<string>("");

  const openModal = (offer: Offers, offerType: string) => {
    setSelectedOffer(offer.id);
    setSelectedOfferType(offerType);
    setModalOpen(true);
  };

  const closeModal = () => {
    setSelectedOffer(null);
    setSelectedOfferType("");
    setModalOpen(false);
  };

  const handlePublish = (offer: Offers) => console.log(`Toggle publish for offer ${offer}`);
  const handleDelete = (offer: Offers) => console.log(`Delete offer ${offer}`);

  const StatusBadge = ({ active }: { active: boolean }) => (
    <span
      className={`inline-block w-3 h-3 rounded-full ${
        active ? "bg-green-500" : "bg-red-400"
      }`}
      title={active ? "Active" : "Inactive"}
    ></span>
  );

  const ActionButtons = ({ offer, offerType }: { offer: Offers; offerType: string }) => (
    <div className="flex flex-wrap gap-2 md:gap-4 justify-end md:justify-start mt-2">
      <button
        onClick={() => openModal(offer, offerType)}
        className="text-blue-500 hover:text-blue-700"
      >
        <FiEdit size={20} title="Update" />
      </button>
      <button
        onClick={() => handlePublish(offer)}
        className={`hover:text-green-700 text-green-500`}
      >
        {offer.active ? <FiEyeOff size={20} title="Visible" /> : <FiEye size={20} title="Mettre en ligne" />}
      </button>
      <button onClick={() => handleDelete(offer)} className="text-red-500 hover:text-red-700">
        <FiTrash2 size={20} title="Delete" />
      </button>
    </div>
  );

  const renderOffers = (offerList: Offers[], offerType: string) => {
    const filteredOffers = offerList.filter((offer) =>
      currentUserId === userId ? !offer.validated : offer.validated
    );
    return (
      <section>
        {filteredOffers.length > 0 ? (
          <ul className="space-y-4">
            {filteredOffers.map((offer) => (
              <li
                key={offer.id}
                className="p-4 border border-gray-200 rounded-md hover:shadow-md transition-shadow flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
              >
                <div className="flex items-start space-x-4">
                  {offer.photos && offer.photos.length > 0 && (
                    <div className="relative w-24 h-24 rounded-md overflow-hidden">
                      <Image
                        src={offer.photos[0]}
                        alt={offer.title}
                        layout="fill"
                        objectFit="cover"
                      />
                    </div>
                  )}
                  <div>
                    <div className="flex items-center space-x-2">
                      {currentUserId === userId && <StatusBadge active={offer.active} />}
                      <p className="text-lg font-semibold">{offer.title}</p>
                    </div>
                    <p className="text-gray-600">
                      Price: <span className="font-medium">{offer.price}€</span>
                    </p>
                    <p className="text-gray-600">
                      Location: {offer.city}, {offer.country}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                {currentUserId === userId && (
                  <ActionButtons offer={offer} offerType={offerType} />
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No offers available.</p>
        )}
      </section>
    );
  };

  return (
    <div className="space-y-8 p-4 sm:p-6 bg-white">
      <h1 className="text-xl font-bold text-center md:text-left">
        {currentUserId === userId ? "Toutes vos offres" : "Offres disponibles"}
      </h1>

      {/* Vehicle Offers */}
      {renderOffers(vehicleOffers, "vehicle")}

      {/* Real Estate Offers */}
      {renderOffers(realEstateOffers, "property")}

      {/* Commercial Offers */}
      {renderOffers(commercialOffers, "commercial")}

      {/* Modal */}
      {isModalOpen && selectedOffer && selectedOfferType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <UpdateOffer offerId={selectedOffer} offerType={selectedOfferType} onClose={closeModal} />
        </div>
      )}
    </div>
  );
};

export default UserOffers;
