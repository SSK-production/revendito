import { FiEdit, FiTrash2, FiEye, FiEyeOff } from "react-icons/fi";
import Image from "next/image";
import { Offers } from "@/app/types";
import UpdateOffer from "../shared/UpdateOffer"; // Import UpdateOffer
import { useState } from "react";
import Modal from "./Modal";
import StatusOfferForm from "./statusOfferForm";
import axios from "axios"
import DeleteOfferForm from "./DeleteOfferForm";

interface UserOffersProps {
  offers: {
    vehicleOffers: Offers[];
    realEstateOffers: Offers[];
    commercialOffers: Offers[];
  };
  currentUserId: string | null;
  userId: string;
  onProfilUpdate: () => void;
}

const UserOffers: React.FC<UserOffersProps> = ({ offers, currentUserId, userId, onProfilUpdate }) => {
  const { vehicleOffers, realEstateOffers, commercialOffers } = offers;

  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState<number | null>(null);
  const [selectedOfferType, setSelectedOfferType] = useState<string>("");
  const [isModalStatusOffer, setIsModalStatusOffer] = useState(false);
  const [statusOffer,setStatusOffer] = useState<boolean | null>(null);
  const [isModalDeleteOffer, setIsModalDeleteOffer] = useState(false);

  const openModal = (offer: Offers, offerType: string) => {
    setSelectedOffer(offer.id);
    setSelectedOfferType(offerType);
    setModalOpen(true);
  };

  const closeModal = () => {
    setSelectedOffer(null);
    setSelectedOfferType("");
    setModalOpen(false);
    onProfilUpdate();
  };

  const handlePublish = async (offer: Offers, offerType : string) =>  {
    setSelectedOffer(offer.id);
    setSelectedOfferType(offerType);
    setStatusOffer(offer.active);
    setIsModalStatusOffer(true);
  }
  const changeOfferStatus = async () => {
    try {
        const response = await axios.put(
          `/api/changeOfferStatus`,
          {
            active: statusOffer,
            offerId: selectedOffer,
            offerType: selectedOfferType
          },
          {
            withCredentials: true,
          }
        );
            console.log("Status account is changed", response.data.message);
            setIsModalStatusOffer(false)
            onProfilUpdate()
    } catch (error) {
      console.error("Error updating status : ", error);
    }
  }
  const handleDelete = async (offer: Offers, offerType : string) =>  {
    setSelectedOffer(offer.id);
    setSelectedOfferType(offerType);
    setStatusOffer(offer.active);
    setIsModalDeleteOffer(true);
  }

  const deleteOffer = async (password : string) => {
    try {
      const response = await axios.delete(
          "/api/deleteOffer",
          {
              data: {
                  password: password,
                  offerId: selectedOffer,
                  offerType: selectedOfferType
              },
              withCredentials: true
          }
      );
      console.log(response.data.message);
      setIsModalDeleteOffer(false);
      onProfilUpdate()
  } catch (error) {
      console.error("Error updating status :", error);
  }
    
  }

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
        onClick={() => handlePublish(offer, offerType)}
        className={`hover:text-green-700 text-green-500`}
      >
        {offer.active ? <FiEyeOff size={20} title="Visible" /> : <FiEye size={20} title="Mettre en ligne" />}
      </button>
      <button onClick={() => handleDelete(offer, offerType)} className="text-red-500 hover:text-red-700">
        <FiTrash2 size={20} title="Delete" />
      </button>
    </div>
  );

  const renderOffers = (offerList: Offers[], offerType: string) => {
    const filteredOffers = offerList.filter((offer) =>
      currentUserId === userId ? true : offer.validated
    );
    return (
      <section>
        {filteredOffers.length > 0 ? (
          <ul className="space-y-4">
            {filteredOffers.map((offer) => (
              <li
                key={offer.id}
                className="p-4 border border-gray-200 hover:shadow-md transition-shadow flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
              >
                <div className="flex items-start space-x-4">
                  {offer.photos && offer.photos.length > 0 && (
                    <div className="relative w-24 h-24 rounded-md overflow-hidden">
                      <Image
                        src={offer.photos[0]}
                        alt={offer.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        style={{ objectFit: 'cover' }}
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
        ) : null}
      </section>
    );
  };

  const allOffersEmpty =
    vehicleOffers.length === 0 &&
    realEstateOffers.length === 0 &&
    commercialOffers.length === 0;

  return (
    <div className="space-y-8 p-4 sm:p-6 bg-white">
      <h2 className="text-xl font-normal text-center md:text-left">
        {currentUserId === userId ? "Toutes vos offres" : "Offres disponibles"}
      </h2>

      {allOffersEmpty ? (
        <p className="text-gray-500">No offers available.</p>
      ) : (
        <>
          {/* Vehicle Offers */}
          {renderOffers(vehicleOffers, "vehicle")}

          {/* Real Estate Offers */}
          {renderOffers(realEstateOffers, "property")}

          {/* Commercial Offers */}
          {renderOffers(commercialOffers, "commercial")}
        </>
      )}

      {/* Modal */}
      {isModalOpen && selectedOffer && selectedOfferType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <UpdateOffer offerId={selectedOffer} offerType={selectedOfferType} onClose={closeModal} />
        </div>
      )}
      <Modal 
        isOpen={isModalStatusOffer}
        onClose={() => setIsModalStatusOffer(false)}
        title="change status offer" 
       >
        <StatusOfferForm selectedOffer={selectedOffer} offerType={selectedOfferType} active={statusOffer} onConfirm={changeOfferStatus} onCancel={() => setIsModalStatusOffer(false)}/>
      </Modal>

      <Modal 
        isOpen={isModalDeleteOffer}
        onClose={() => setIsModalDeleteOffer(false)}
        title="delete offer" 
       >
        <DeleteOfferForm selectedOffer={selectedOffer} offerType={selectedOfferType} onConfirm={deleteOffer} onCancel={() => setIsModalDeleteOffer(false)}/>
      </Modal>
    </div>
  );
};

export default UserOffers;
