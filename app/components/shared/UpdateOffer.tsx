/* eslint-disable @typescript-eslint/no-explicit-any */
import { Commercial, Property, Vehicle } from "@/app/types";
import React, { useState, useEffect } from "react";
import axios from "axios";

interface UpdateOfferProps {
  offerId: number;
  offerType: string;
  onClose: () => void; // Function to handle modal close
}

const UpdateOffer: React.FC<UpdateOfferProps> = ({ offerId, offerType, onClose }) => {
  const [offer, setOffer] = useState<Record<string, any> | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOffer = async () => {
      try {
        const response = await axios.get(`/api/offer?category=${offerType}&offerId=${offerId}`);
        setOffer(response.data.data);
      } catch {
        setError("Failed to fetch offer. Please try again later.");
      }
    };
    fetchOffer();
  }, [offerId, offerType]);

  const updateOffer = async (id: number, type: string, data: Record<string, any>) => {
    try {
      const response = await axios.put(`/api/updateOffer`, {
        id,
        offerType: type,
        data,
      });
      console.log("Offer updated successfully:", response.data);
      alert("Offer updated successfully!");
    } catch (error: unknown) {
      console.error("Error updating offer:", error);
      throw new Error("Failed to update the offer.");
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      if (!offer) {
        alert("No offer data available for update.");
        return;
      }

      // Appeler la fonction updateOffer
      await updateOffer(offerId, offerType, offer);

      onClose(); // Fermer la modal après une mise à jour réussie
    } catch {
      alert("An error occurred while updating the offer.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderForm = () => {
    if (!offer) {
      return (
        <div className="flex items-center justify-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600"></div>
          <span className="ml-2 text-gray-500">Loading...</span>
        </div>
      );
    }

    switch (offerType) {
      case "vehicle":
        return <VehicleForm offer={offer} setOffer={setOffer} />;
      case "property":
        return <PropertyForm offer={offer} setOffer={setOffer} />;
      case "commercial":
        return <CommercialForm offer={offer} setOffer={setOffer} />;
      default:
        return <p className="text-red-500">Invalid offer type</p>;
    }
  };

  if (error) {
    return (
      <div className="flex items-center justify-center py-4">
        <p className="text-red-500 bg-red-100 rounded p-2">{error}</p>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-2xl max-w-3xl w-full overflow-hidden transform transition-all duration-300">
        <div className="flex justify-between items-center px-4 py-3 border-b border-gray-200 bg-blue-600 text-white w-full">
          <h3 className="text-lg font-semibold">Update Offer</h3>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-300 focus:outline-none text-xl"
          >
            &times;
          </button>
        </div>
        <div className="p-4 bg-white h-[70vh] overflow-y-auto grid grid-cols-1 gap-4 w-3/4 mx-auto">
          {renderForm()}
        </div>
        <div className="p-4 border-t border-gray-200 bg-green-100 w-full">
          <button
            onClick={handleSubmit}
            className="w-full bg-blue-600 text-white rounded-md py-2 hover:bg-blue-500 focus:outline-none transition-all duration-150"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                Updating...
              </div>
            ) : (
              "Update Offer"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

const FormField: React.FC<{
  label: string;
  type: string;
  value: string | number | boolean;
  error?: string;
  onChange: (value: string | number | boolean) => void;
}> = ({ label, type, value, error, onChange }) => (
  <label className="block text-center">
    <span className="text-gray-700 font-medium">{label}</span>
    {type === "textarea" ? (
      <textarea
        value={value as string}
        onChange={(e) => onChange(e.target.value)}
        className={`mt-1 block w-3/4 mx-auto border-gray-300 rounded-md shadow-sm focus:ring focus:ring-indigo-200 focus:border-indigo-300 transition-all duration-150 ${
          error ? "border-red-500 focus:ring-red-200 focus:border-red-300" : ""
        }`}
        rows={4}
      ></textarea>
    ) : type === "checkbox" ? (
      <input
        type="checkbox"
        checked={!!value} // Utilisation de `checked` pour synchroniser la case
        onChange={(e) => onChange(e.target.checked)}
        className={`mt-1 block w-6 h-6 mx-auto border-gray-300 rounded shadow-sm focus:ring focus:ring-indigo-200 focus:border-indigo-300 transition-all duration-150 ${
          error ? "border-red-500 focus:ring-red-200 focus:border-red-300" : ""
        }`}
      />
    ) : (
      <input
        type={type}
        value={value as string | number | readonly string[] | undefined}
        onChange={(e) =>
          onChange(type === "checkbox" ? e.target.checked : e.target.value)
        }
        className={`mt-1 block w-3/4 mx-auto border-gray-300 rounded-md shadow-sm focus:ring focus:ring-indigo-200 focus:border-indigo-300 transition-all duration-150 ${
          error ? "border-red-500 focus:ring-red-200 focus:border-red-300" : ""
        }`}
      />
    )}
    {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
  </label>
);



const VehicleForm: React.FC<{ offer: Vehicle, setOffer: React.Dispatch<React.SetStateAction<Vehicle | Property | Commercial | null>> }> = ({ offer, setOffer }) => (
  <form className="space-y-4 grid grid-cols-1 gap-4">
  <h3 className="text-xl font-bold text-indigo-600 col-span-full text-center">Update Vehicle Offer</h3>
  
  <FormField label="Title" type="text" value={offer.title || ""} onChange={(value) => setOffer({ ...offer, title: value as string })} />
  <FormField label="Description" type="textarea" value={offer.description || ""} onChange={(value) => setOffer({ ...offer, description: value as string })} />
  <FormField label="Price" type="number" value={offer.price || 0} onChange={(value) => setOffer({ ...offer, price: value as number })} />
  <FormField label="City" type="text" value={offer.city || ""} onChange={(value) => setOffer({ ...offer, city: value as string })} />
  <FormField label="Country" type="text" value={offer.country || ""} onChange={(value) => setOffer({ ...offer, country: value as string })} />
  <FormField label="Vehicle Type" type="text" value={offer.vehicleType || ""} onChange={(value) => setOffer({ ...offer, vehicleType: value as string })} />
  <FormField label="Model" type="text" value={offer.model || ""} onChange={(value) => setOffer({ ...offer, model: value as string })} />
  <FormField label="Year" type="number" value={offer.year || 0} onChange={(value) => setOffer({ ...offer, year: value as number })} />
  <FormField label="Mileage" type="number" value={offer.mileage || 0} onChange={(value) => setOffer({ ...offer, mileage: value as number })} />
  <FormField label="Fuel Type" type="text" value={offer.fuelType || ""} onChange={(value) => setOffer({ ...offer, fuelType: value as string })} />
  <FormField label="Color" type="text" value={offer.color || ""} onChange={(value) => setOffer({ ...offer, color: value as string })} />
  <FormField label="Transmission" type="text" value={offer.transmission || ""} onChange={(value) => setOffer({ ...offer, transmission: value as string })} />
  <FormField label="Number of Doors" type="number" value={offer.numberOfDoors || 0} onChange={(value) => setOffer({ ...offer, numberOfDoors: value as number })} />
  <FormField label="Engine Size" type="number" value={offer.engineSize || 0} onChange={(value) => setOffer({ ...offer, engineSize: value as number })} />
  <FormField label="Power (HP)" type="number" value={offer.power || 0} onChange={(value) => setOffer({ ...offer, power: value as number })} />
  <FormField label="Emission Class" type="text" value={offer.emissionClass || ""} onChange={(value) => setOffer({ ...offer, emissionClass: value as string })} />
  <FormField label="Condition" type="text" value={offer.condition || ""} onChange={(value) => setOffer({ ...offer, condition: value as string })} />
  <FormField label="Contact Number" type="text" value={offer.contactNumber || ""} onChange={(value) => setOffer({ ...offer, contactNumber: value as string })} />
  <FormField label="Contact Email" type="text" value={offer.contactEmail || ""} onChange={(value) => setOffer({ ...offer, contactEmail: value as string })} />
  <FormField label="Location" type="checkbox" value={offer.location || false} onChange={(value) => setOffer({ ...offer, location: value as boolean })} />
</form>

);

const PropertyForm: React.FC<{ offer: Property, setOffer: React.Dispatch<React.SetStateAction<Vehicle | Property | Commercial | null>> }> = ({ offer, setOffer }) => (
<form className="space-y-4 grid grid-cols-1 gap-4">
  <h3 className="text-xl font-bold text-indigo-600 col-span-full text-center">Update Real Estate Offer</h3>
  <FormField label="Title" type="text" value={offer.title || ""} onChange={(value) => setOffer({ ...offer, title: value as string })} />
  <FormField label="Description" type="textarea" value={offer.description || ""} onChange={(value) => setOffer({ ...offer, description: value as string })} />
  <FormField label="Price" type="number" value={offer.price || 0} onChange={(value) => setOffer({ ...offer, price: value as number })} />
  <FormField label="City" type="text" value={offer.city || ""} onChange={(value) => setOffer({ ...offer, city: value as string })} />
  <FormField label="Country" type="text" value={offer.country || ""} onChange={(value) => setOffer({ ...offer, country: value as string })} />
  <FormField label="Property Type" type="text" value={offer.propertyType || ""} onChange={(value) => setOffer({ ...offer, propertyType: value as string })} />
  <FormField label="Property Condition" type="text" value={offer.propertyCondition || ""} onChange={(value) => setOffer({ ...offer, propertyCondition: value as string })} />
  <FormField label="Surface" type="number" value={offer.surface || 0} onChange={(value) => setOffer({ ...offer, surface: value as number })} />
  <FormField label="Rooms" type="number" value={offer.rooms || 0} onChange={(value) => setOffer({ ...offer, rooms: value as number })} />
  <FormField label="Bedrooms" type="number" value={offer.bedrooms || 0} onChange={(value) => setOffer({ ...offer, bedrooms: value as number })} />
  <FormField label="Bathrooms" type="number" value={offer.bathrooms || 0} onChange={(value) => setOffer({ ...offer, bathrooms: value as number })} />
  <FormField label="Heating Type" type="text" value={offer.heatingType || ""} onChange={(value) => setOffer({ ...offer, heatingType: value as string })} />
  <FormField label="Energy Class" type="text" value={offer.energyClass || ""} onChange={(value) => setOffer({ ...offer, energyClass: value as string })} />
  <FormField label="Furnished" type="checkbox" value={offer.furnished || false} onChange={(value) => setOffer({ ...offer, furnished: value as boolean })} />
  <FormField label="Parking" type="checkbox" value={offer.parking || false} onChange={(value) => setOffer({ ...offer, parking: value as boolean })} />
  <FormField label="Garage" type="checkbox" value={offer.garage || false} onChange={(value) => setOffer({ ...offer, garage: value as boolean })} />
  <FormField label="Elevator" type="checkbox" value={offer.elevator || false} onChange={(value) => setOffer({ ...offer, elevator: value as boolean })} />
  <FormField label="Balcony" type="checkbox" value={offer.balcony || false} onChange={(value) => setOffer({ ...offer, balcony: value as boolean })} />
  <FormField label="Terrace" type="checkbox" value={offer.terrace || false} onChange={(value) => setOffer({ ...offer, terrace: value as boolean })} />
  <FormField label="Garden" type="checkbox" value={offer.garden || false} onChange={(value) => setOffer({ ...offer, garden: value as boolean })} />
  <FormField label="Basement Available" type="checkbox" value={offer.basementAvailable || false} onChange={(value) => setOffer({ ...offer, basementAvailable: value as boolean })} />
  <FormField label="Floor Number" type="number" value={offer.floorNumber || 0} onChange={(value) => setOffer({ ...offer, floorNumber: value as number })} />
  <FormField label="Total Floors" type="number" value={offer.totalFloor || 0} onChange={(value) => setOffer({ ...offer, totalFloor: value as number })} />
  <FormField label="Contact Number" type="text" value={offer.contactNumber || ""} onChange={(value) => setOffer({ ...offer, contactNumber: value as string })} />
  <FormField label="Contact Email" type="text" value={offer.contactEmail || ""} onChange={(value) => setOffer({ ...offer, contactEmail: value as string })} />
  <FormField label="Availability Date" type="date" value={offer.avaibilabilityDate ? offer.avaibilabilityDate.toString() : ""} onChange={(value) => setOffer({ ...offer, avaibilabilityDate: new Date(value as string) })} />
  <FormField label="Location" type="checkbox" value={offer.location || false} onChange={(value) => setOffer({ ...offer, location: value as boolean })} />
</form>

);

const CommercialForm: React.FC<{ offer: Commercial, setOffer: React.Dispatch<React.SetStateAction<Vehicle | Property | Commercial | null>> }> = ({ offer, setOffer }) => (
  <form className="space-y-4 grid grid-cols-1 gap-4">
  <h3 className="text-xl font-bold text-indigo-600 col-span-full text-center">Update Commercial Offer</h3>
  
  <FormField label="Title" type="text" value={offer.title || ""} onChange={(value) => setOffer({ ...offer, title: value as string })} />
  <FormField label="Description" type="textarea" value={offer.description || ""} onChange={(value) => setOffer({ ...offer, description: value as string })} />
  <FormField label="Price" type="number" value={offer.price || 0} onChange={(value) => setOffer({ ...offer, price: value as number })} />
  <FormField label="City" type="text" value={offer.city || ""} onChange={(value) => setOffer({ ...offer, city: value as string })} />
  <FormField label="Country" type="text" value={offer.country || ""} onChange={(value) => setOffer({ ...offer, country: value as string })} />
  <FormField label="Commercial Type" type="text" value={offer.commercialType || ""} onChange={(value) => setOffer({ ...offer, commercialType: value as string })} />
  <FormField label="Duration" type="number" value={offer.duration || 0} onChange={(value) => setOffer({ ...offer, duration: value as number })} />
  <FormField label="Contract Type" type="text" value={offer.contractType || ""} onChange={(value) => setOffer({ ...offer, contractType: value as string })} />
  <FormField label="Work Schedule" type="text" value={offer.workSchedule || ""} onChange={(value) => setOffer({ ...offer, workSchedule: value as string })} />
  <FormField label="Contact Number" type="text" value={offer.contactNumber || ""} onChange={(value) => setOffer({ ...offer, contactNumber: value as string })} />
  <FormField label="Contact Email" type="text" value={offer.contactEmail || ""} onChange={(value) => setOffer({ ...offer, contactEmail: value as string })} />
</form>

);

export default UpdateOffer;
