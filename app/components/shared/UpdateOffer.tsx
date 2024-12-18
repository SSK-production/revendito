import { Commercial, Property, Vehicle } from "@/app/types";
import React, { useState, useEffect } from "react";
import axios from "axios";

interface UpdateOfferProps {
  offerId: number;
  offerType: string;
  onClose: () => void; // Function to handle modal close
}

const UpdateOffer: React.FC<UpdateOfferProps> = ({ offerId, offerType, onClose }) => {
  const [offer, setOffer] = useState<Vehicle | Property | Commercial | null>(null);

  useEffect(() => {
    const fetchOffer = async () => {
      try {
        const response = await axios.get(`/api/offer?category=${offerType}&offerId=${offerId}`);
        setOffer(response.data.data);
      } catch (error) {
        console.error("Failed to fetch offer", error);
      }
    };
    fetchOffer();
  }, [offerId, offerType]);

  const renderForm = () => {
    if (!offer) {
      return <p>Loading...</p>;
    }

    switch (offerType) {
      case "vehicle":
        return <VehicleForm offer={offer as Vehicle} />;
      case "property":
        return <PropertyForm offer={offer as Property} />;
      case "commercial":
        return <CommercialForm offer={offer as Commercial} />;
      default:
        return <p>Invalid offer type</p>;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg max-w-lg w-full">
        <div className="flex justify-between items-center px-4 py-3 border-b border-gray-200">
          <h3 className="text-lg font-semibold">Update Offer</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 focus:outline-none"
          >
            &times;
          </button>
        </div>
        <div className="p-4">{renderForm()}</div>
      </div>
    </div>
  );
};

// Placeholder for Vehicle Form
const VehicleForm: React.FC<{ offer: Vehicle }> = ({ offer }) => (
  <form>
    <h3>Update Vehicle Offer</h3>
    {/* Add other fields as needed */}
  </form>
);

const PropertyForm: React.FC<{ offer: Property }> = ({ offer }) => (
  <form>
    <h3>Update Real Estate Offer</h3>
    {/* Add other fields as needed */}
  </form>
);

const CommercialForm: React.FC<{ offer: Commercial }> = ({ offer }) => (
  <form>
    <h3>Update Commercial Offer</h3>
    {/* Add other fields as needed */}
  </form>
);

export default UpdateOffer;
