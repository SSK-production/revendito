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

const VehicleForm: React.FC<{ offer: Vehicle }> = ({ offer }) => (
  <form className="space-y-4">
    <h3 className="text-xl font-bold">Update Vehicle Offer</h3>
    <label className="block">
      <span className="text-gray-700">Vehicle Type</span>
      <input
        type="text"
        defaultValue={offer.vehicleType || ""}
        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring focus:ring-indigo-200 focus:border-indigo-300"
      />
    </label>
    <label className="block">
      <span className="text-gray-700">Model</span>
      <input
        type="text"
        defaultValue={offer.model || ""}
        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring focus:ring-indigo-200 focus:border-indigo-300"
      />
    </label>
    <label className="block">
      <span className="text-gray-700">Year</span>
      <input
        type="number"
        defaultValue={offer.year || 0}
        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring focus:ring-indigo-200 focus:border-indigo-300"
      />
    </label>
    <label className="block">
      <span className="text-gray-700">Mileage</span>
      <input
        type="number"
        defaultValue={offer.mileage || 0}
        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring focus:ring-indigo-200 focus:border-indigo-300"
      />
    </label>
    <label className="block">
      <span className="text-gray-700">Fuel Type</span>
      <input
        type="text"
        defaultValue={offer.fuelType || ""}
        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring focus:ring-indigo-200 focus:border-indigo-300"
      />
    </label>
    <label className="block">
      <span className="text-gray-700">Color</span>
      <input
        type="text"
        defaultValue={offer.color || ""}
        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring focus:ring-indigo-200 focus:border-indigo-300"
      />
    </label>
    <label className="block">
      <span className="text-gray-700">Transmission</span>
      <input
        type="text"
        defaultValue={offer.transmission || ""}
        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring focus:ring-indigo-200 focus:border-indigo-300"
      />
    </label>
    <label className="block">
      <span className="text-gray-700">Number of Doors</span>
      <input
        type="number"
        defaultValue={offer.numberOfDoors || 0}
        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring focus:ring-indigo-200 focus:border-indigo-300"
      />
    </label>
    {/* Add all other Vehicle fields similarly */}
  </form>
);

const PropertyForm: React.FC<{ offer: Property }> = ({ offer }) => (
  <form className="space-y-4">
    <h3 className="text-xl font-bold">Update Real Estate Offer</h3>
    <label className="block">
      <span className="text-gray-700">Property Type</span>
      <input
        type="text"
        defaultValue={offer.propertyType || ""}
        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring focus:ring-indigo-200 focus:border-indigo-300"
      />
    </label>
    <label className="block">
      <span className="text-gray-700">Surface</span>
      <input
        type="number"
        defaultValue={offer.surface || 0}
        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring focus:ring-indigo-200 focus:border-indigo-300"
      />
    </label>
    <label className="block">
      <span className="text-gray-700">Rooms</span>
      <input
        type="number"
        defaultValue={offer.rooms || 0}
        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring focus:ring-indigo-200 focus:border-indigo-300"
      />
    </label>
    <label className="block">
      <span className="text-gray-700">Bedrooms</span>
      <input
        type="number"
        defaultValue={offer.bedrooms || 0}
        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring focus:ring-indigo-200 focus:border-indigo-300"
      />
    </label>
    <label className="block">
      <span className="text-gray-700">Bathrooms</span>
      <input
        type="number"
        defaultValue={offer.bathrooms || 0}
        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring focus:ring-indigo-200 focus:border-indigo-300"
      />
    </label>
    {/* Add all other Property fields similarly */}
  </form>
);

const CommercialForm: React.FC<{ offer: Commercial }> = ({ offer }) => (
  <form className="space-y-4">
    <h3 className="text-xl font-bold">Update Commercial Offer</h3>
    <label className="block">
      <span className="text-gray-700">Commercial Type</span>
      <input
        type="text"
        defaultValue={offer.commercialType || ""}
        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring focus:ring-indigo-200 focus:border-indigo-300"
      />
    </label>
    <label className="block">
      <span className="text-gray-700">Duration</span>
      <input
        type="number"
        defaultValue={offer.duration || 0}
        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring focus:ring-indigo-200 focus:border-indigo-300"
      />
    </label>
    <label className="block">
      <span className="text-gray-700">Contract Type</span>
      <input
        type="text"
        defaultValue={offer.contractType || ""}
        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring focus:ring-indigo-200 focus:border-indigo-300"
      />
    </label>
    <label className="block">
      <span className="text-gray-700">Work Schedule</span>
      <input
        type="text"
        defaultValue={offer.workSchedule || ""}
        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring focus:ring-indigo-200 focus:border-indigo-300"
      />
    </label>
    {/* Add all other Commercial fields similarly */}
  </form>
);

export default UpdateOffer;
