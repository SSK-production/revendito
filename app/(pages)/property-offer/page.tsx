"use client";

import { useState } from "react";
import { countries } from "@/app/lib/IsoCodeCountry";

export default function RealEstateOfferPage() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    city: "",
    country: "",
    propertyType: "",
    propertyCondition: "",
    surface: "",
    rooms: "",
    bedrooms: "",
    bathrooms: "",
    heatingType: "",
    energyClass: "",
    furnished: false,
    parking: false,
    garage: false,
    elevator: false,
    balcony: false,
    terrace: false,
    garden: false,
    basementAvailable: false,
    floorNumber: "",
    totalFloors: "",
    contactNumber: "",
    contactEmail: "",
    availabilityDate: "",
    location: false,
  });
  const [photos, setPhotos] = useState<File[]>([]);
  const [message, setMessage] = useState<string | null>(null);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
  
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setPhotos(Array.from(e.target.files));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const form = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      form.append(key, String(value));
    });
    photos.forEach((file) => form.append("photos", file));

    try {
      const res = await fetch("/api/property", {
        method: "POST",
        body: form,
        credentials: "include", // Include cookies
      });

      const result = await res.json();
      if (res.ok) {
        setMessage("Offer created successfully!");
        setFormData({
          title: "",
          description: "",
          price: "",
          city: "",
          country: "",
          propertyType: "",
          propertyCondition: "",
          surface: "",
          rooms: "",
          bedrooms: "",
          bathrooms: "",
          heatingType: "",
          energyClass: "",
          furnished: false,
          parking: false,
          garage: false,
          elevator: false,
          balcony: false,
          terrace: false,
          garden: false,
          basementAvailable: false,
          floorNumber: "",
          totalFloors: "",
          contactNumber: "",
          contactEmail: "",
          availabilityDate: "",
          location: false,
        });
        setPhotos([]);
      } else {
        setMessage(`Error: ${result.error}`);
      }
    } catch {
      setMessage("An error occurred while creating the offer.");
    }
  };

  const nextStep = () => setStep((prev) => Math.min(prev + 1, 3));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  return (
    <div className="max-w-3xl mx-auto mt-10 p-5 border rounded-lg shadow-lg bg-white">
      <h1 className="text-3xl font-bold mb-8 text-center">Create Real Estate Offer</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
      {step === 1 && (
        <>
        {/* Step 1: Basic Information */}
        <div className="flex flex-col">
          <label htmlFor="title" className="text-sm font-medium mb-1">
          Title
          </label>
          <input
          id="title"
          name="title"
          value={formData.title}
          onChange={handleInputChange}
          className="border rounded-lg px-4 py-2 text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Offer title"
          required
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="description" className="text-sm font-medium mb-1">
          Description
          </label>
          <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          className="border rounded-lg px-4 py-2 text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Offer description"
          required
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="price" className="text-sm font-medium mb-1">
          Price (€)
          </label>
          <input
          id="price"
          name="price"
          type="number"
          value={formData.price}
          onChange={handleInputChange}
          className="border rounded-lg px-4 py-2 text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Price in euros"
          required
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="country" className="text-sm font-medium mb-1">
          Country
          </label>
          <select
          name="country"
          value={formData.country}
          onChange={handleInputChange}
          required
          className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
          <option value="">Select a country</option>
          {countries.map(({ code, name }) => (
            <option key={code} value={code}>
            {name}
            </option>
          ))}
          </select>
        </div>

        <div className="flex flex-col">
          <label htmlFor="city" className="text-sm font-medium mb-1">
          City
          </label>
          <input
          id="city"
          name="city"
          value={formData.city}
          onChange={handleInputChange}
          className="border rounded-lg px-4 py-2 text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="City"
          required
          />
        </div>
        </>
      )}

      {step === 2 && (
        <>
        {/* Step 2: Property Details */}
        <div className="flex flex-col">
          <label htmlFor="propertyType" className="text-sm font-medium mb-1">
          Property Type
          </label>
          <select
          id="propertyType"
          name="propertyType"
          value={formData.propertyType}
          onChange={handleInputChange}
          className="border rounded-lg px-4 py-2 text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
          >
          <option value="">Select Property Type</option>
          <option value="Apartment">Apartment</option>
          <option value="House">House</option>
          <option value="Studio">Studio</option>
          <option value="Villa">Villa</option>
          <option value="Duplex">Duplex</option>
          <option value="Penthouse">Penthouse</option>
          <option value="Commercial">Commercial</option>
          </select>
        </div>

        <div className="flex flex-col">
          <label htmlFor="propertyCondition" className="text-sm font-medium mb-1">
          Property Condition
          </label>
          <select
          id="propertyCondition"
          name="propertyCondition"
          value={formData.propertyCondition}
          onChange={handleInputChange}
          className="border rounded-lg px-4 py-2 text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
          >
          <option value="">Select Property Condition</option>
          <option value="New">New</option>
          <option value="Renovated">Renovated</option>
          <option value="Good">Good</option>
          <option value="To Renovate">To Renovate</option>
          </select>
        </div>

        <div className="flex flex-col">
          <label htmlFor="surface" className="text-sm font-medium mb-1">
          Surface (m²)
          </label>
          <input
          id="surface"
          name="surface"
          type="number"
          value={formData.surface}
          onChange={handleInputChange}
          className="border rounded-lg px-4 py-2 text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Surface in m²"
          required
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="rooms" className="text-sm font-medium mb-1">
          Number of Rooms
          </label>
          <input
          id="rooms"
          name="rooms"
          type="number"
          value={formData.rooms}
          onChange={handleInputChange}
          className="border rounded-lg px-4 py-2 text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Number of rooms"
          required
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="bedrooms" className="text-sm font-medium mb-1">
          Number of Bedrooms
          </label>
          <input
          id="bedrooms"
          name="bedrooms"
          type="number"
          value={formData.bedrooms}
          onChange={handleInputChange}
          className="border rounded-lg px-4 py-2 text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Number of bedrooms"
          required
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="bathrooms" className="text-sm font-medium mb-1">
          Number of Bathrooms
          </label>
          <input
          id="bathrooms"
          name="bathrooms"
          type="number"
          value={formData.bathrooms}
          onChange={handleInputChange}
          className="border rounded-lg px-4 py-2 text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Number of bathrooms"
          required
          />
        </div>
        </>
      )}

      {step === 3 && (
        <>
        {/* Step 3: Additional Details */}
        <div className="flex flex-col">
          <label htmlFor="heatingType" className="text-sm font-medium mb-1">
          Heating Type
          </label>
          <select
          id="heatingType"
          name="heatingType"
          value={formData.heatingType}
          onChange={handleInputChange}
          className="border rounded-lg px-4 py-2 text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
          <option value="">Select Heating Type</option>
          <option value="Gas">Gas</option>
          <option value="Electric">Electric</option>
          <option value="Oil">Oil</option>
          <option value="Other">Other</option>
          </select>
        </div>

        <div className="flex flex-col">
          <label htmlFor="energyClass" className="text-sm font-medium mb-1">
          Energy Class
          </label>
          <select
          id="energyClass"
          name="energyClass"
          value={formData.energyClass}
          onChange={handleInputChange}
          className="border rounded-lg px-4 py-2 text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
          <option value="">Select Energy Class</option>
          <option value="A">A</option>
          <option value="B">B</option>
          <option value="C">C</option>
          <option value="D">D</option>
          <option value="E">E</option>
          <option value="F">F</option>
          <option value="G">G</option>
          </select>
        </div>

        <div className="flex items-center">
          <input
          id="furnished"
          name="furnished"
          type="checkbox"
          checked={formData.furnished}
          onChange={handleInputChange}
          className="mr-2 focus:ring-2 focus:ring-blue-500"
          />
          <label htmlFor="furnished" className="text-sm font-medium">
          Furnished
          </label>
        </div>

        <div className="flex items-center">
          <input
          id="parking"
          name="parking"
          type="checkbox"
          checked={formData.parking}
          onChange={handleInputChange}
          className="mr-2 focus:ring-2 focus:ring-blue-500"
          />
          <label htmlFor="parking" className="text-sm font-medium">
          Parking
          </label>
        </div>

        <div className="flex items-center">
          <input
          id="garage"
          name="garage"
          type="checkbox"
          checked={formData.garage}
          onChange={handleInputChange}
          className="mr-2 focus:ring-2 focus:ring-blue-500"
          />
          <label htmlFor="garage" className="text-sm font-medium">
          Garage
          </label>
        </div>

        <div className="flex items-center">
          <input
          id="elevator"
          name="elevator"
          type="checkbox"
          checked={formData.elevator}
          onChange={handleInputChange}
          className="mr-2 focus:ring-2 focus:ring-blue-500"
          />
          <label htmlFor="elevator" className="text-sm font-medium">
          Elevator
          </label>
        </div>

        <div className="flex items-center">
          <input
          id="balcony"
          name="balcony"
          type="checkbox"
          checked={formData.balcony}
          onChange={handleInputChange}
          className="mr-2 focus:ring-2 focus:ring-blue-500"
          />
          <label htmlFor="balcony" className="text-sm font-medium">
          Balcony
          </label>
        </div>

        <div className="flex items-center">
          <input
          id="terrace"
          name="terrace"
          type="checkbox"
          checked={formData.terrace}
          onChange={handleInputChange}
          className="mr-2 focus:ring-2 focus:ring-blue-500"
          />
          <label htmlFor="terrace" className="text-sm font-medium">
          Terrace
          </label>
        </div>

        <div className="flex items-center">
          <input
          id="garden"
          name="garden"
          type="checkbox"
          checked={formData.garden}
          onChange={handleInputChange}
          className="mr-2 focus:ring-2 focus:ring-blue-500"
          />
          <label htmlFor="garden" className="text-sm font-medium">
          Garden
          </label>
        </div>

        <div className="flex items-center">
          <input
          id="basementAvailable"
          name="basementAvailable"
          type="checkbox"
          checked={formData.basementAvailable}
          onChange={handleInputChange}
          className="mr-2 focus:ring-2 focus:ring-blue-500"
          />
          <label htmlFor="basementAvailable" className="text-sm font-medium">
          Basement Available
          </label>
        </div>

        <div className="flex flex-col">
          <label htmlFor="floorNumber" className="text-sm font-medium mb-1">
          Floor Number
          </label>
          <input
          id="floorNumber"
          name="floorNumber"
          type="number"
          value={formData.floorNumber}
          onChange={handleInputChange}
          className="border rounded-lg px-4 py-2 text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Floor number"
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="totalFloors" className="text-sm font-medium mb-1">
          Total Floors
          </label>
          <input
          id="totalFloors"
          name="totalFloors"
          type="number"
          value={formData.totalFloors}
          onChange={handleInputChange}
          className="border rounded-lg px-4 py-2 text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Total number of floors"
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="contactNumber" className="text-sm font-medium mb-1">
          Contact Number
          </label>
          <input
          id="contactNumber"
          name="contactNumber"
          type="tel"
          value={formData.contactNumber}
          onChange={handleInputChange}
          className="border rounded-lg px-4 py-2 text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Contact number"
          required
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="contactEmail" className="text-sm font-medium mb-1">
          Contact Email
          </label>
          <input
          id="contactEmail"
          name="contactEmail"
          type="email"
          value={formData.contactEmail}
          onChange={handleInputChange}
          className="border rounded-lg px-4 py-2 text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Contact email"
          required
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="availabilityDate" className="text-sm font-medium mb-1">
          Availability Date
          </label>
          <input
          id="availabilityDate"
          name="availabilityDate"
          type="date"
          value={formData.availabilityDate}
          onChange={handleInputChange}
          className="border rounded-lg px-4 py-2 text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="photos" className="text-sm font-medium mb-1">
          Photos
          </label>
          <input
          type="file"
          id="photos"
          name="photos"
          multiple
          onChange={handleFileChange}
          className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        </>
      )}

      <div className="flex justify-between">
        {step > 1 && (
        <button
          type="button"
          onClick={prevStep}
          className="bg-gray-300 text-black font-bold py-2 px-4 rounded-lg hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
        >
          Previous
        </button>
        )}
        {step < 3 && (
        <button
          type="button"
          onClick={nextStep}
          className="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Next
        </button>
        )}
        {step === 3 && (
        <button
          type="submit"
          className="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Create Offer
        </button>
        )}
      </div>
      {message && <p className="mt-4 text-red-600 text-center">{message}</p>}
      </form>
    </div>
  );
}
