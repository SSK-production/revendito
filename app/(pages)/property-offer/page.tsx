"use client";

import { useState } from "react";

export default function RealEstateOfferPage() {
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
    } catch (error) {
      setMessage("An error occurred while creating the offer.");
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 p-5 border rounded shadow-lg bg-white">
      <h1 className="text-2xl font-bold mb-5">Create Real Estate Offer</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title */}
        <div className="flex flex-col">
          <label htmlFor="title" className="text-sm font-medium">
            Title
          </label>
          <input
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            className="border rounded px-3 py-2 text-black"
            placeholder="Offer title"
            required
          />
        </div>

        {/* Description */}
        <div className="flex flex-col">
          <label htmlFor="description" className="text-sm font-medium">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            className="border rounded px-3 py-2 text-black"
            placeholder="Offer description"
            required
          />
        </div>

        {/* Price */}
        <div className="flex flex-col">
          <label htmlFor="price" className="text-sm font-medium">
            Price (€)
          </label>
          <input
            id="price"
            name="price"
            type="number"
            value={formData.price}
            onChange={handleInputChange}
            className="border rounded px-3 py-2 text-black"
            placeholder="Price in euros"
            required
          />
        </div>

        {/* City */}
        <div className="flex flex-col">
          <label htmlFor="city" className="text-sm font-medium">
            City
          </label>
          <input
            id="city"
            name="city"
            value={formData.city}
            onChange={handleInputChange}
            className="border rounded px-3 py-2 text-black"
            placeholder="City"
            required
          />
        </div>

        {/* Country */}
        <div className="flex flex-col">
          <label htmlFor="country" className="text-sm font-medium">
            Country
          </label>
          <input
            id="country"
            name="country"
            value={formData.country}
            onChange={handleInputChange}
            className="border rounded px-3 py-2 text-black"
            placeholder="Country"
            required
          />
        </div>

        {/* Location */}
        <div className="flex items-center">
          <input
            id="location"
            name="location"
            type="checkbox"
            checked={formData.location}
            onChange={handleInputChange}
            className="mr-2"
          />
          <label htmlFor="garage" className="text-sm font-medium">
            Location
          </label>
        </div>

        {/* Property Type */}
        <div className="flex flex-col">
          <label htmlFor="propertyType" className="text-sm font-medium">
            Property Type
          </label>
          <input
            id="propertyType"
            name="propertyType"
            value={formData.propertyType}
            onChange={handleInputChange}
            className="border rounded px-3 py-2 text-black"
            placeholder="Property type (e.g., Apartment, House)"
            required
          />
        </div>

        {/* Property Condition */}
        <div className="flex flex-col">
          <label htmlFor="propertyCondition" className="text-sm font-medium">
            Property Condition
          </label>
          <select
            id="propertyCondition"
            name="propertyCondition"
            value={formData.propertyCondition}
            onChange={handleInputChange}
            className="border rounded px-3 py-2 text-black"
            required
          >
            <option value="">Select Property Condition</option>
            <option value="New">New</option>
            <option value="Renovated">Renovated</option>
            <option value="Good">Good</option>
            <option value="To Renovate">To Renovate</option>
          </select>
        </div>

        {/* Surface */}
        <div className="flex flex-col">
          <label htmlFor="surface" className="text-sm font-medium">
            Surface (m²)
          </label>
          <input
            id="surface"
            name="surface"
            type="number"
            value={formData.surface}
            onChange={handleInputChange}
            className="border rounded px-3 py-2 text-black"
            placeholder="Surface in m²"
            required
          />
        </div>

        {/* Number of Rooms */}
        <div className="flex flex-col">
          <label htmlFor="rooms" className="text-sm font-medium">
            Number of Rooms
          </label>
          <input
            id="rooms"
            name="rooms"
            type="number"
            value={formData.rooms}
            onChange={handleInputChange}
            className="border rounded px-3 py-2 text-black"
            placeholder="Number of rooms"
            required
          />
        </div>

        {/* Number of Bedrooms */}
        <div className="flex flex-col">
          <label htmlFor="bedrooms" className="text-sm font-medium">
            Number of Bedrooms
          </label>
          <input
            id="bedrooms"
            name="bedrooms"
            type="number"
            value={formData.bedrooms}
            onChange={handleInputChange}
            className="border rounded px-3 py-2 text-black"
            placeholder="Number of bedrooms"
            required
          />
        </div>

        {/* Number of Bathrooms */}
        <div className="flex flex-col">
          <label htmlFor="bathrooms" className="text-sm font-medium">
            Number of Bathrooms
          </label>
          <input
            id="bathrooms"
            name="bathrooms"
            type="number"
            value={formData.bathrooms}
            onChange={handleInputChange}
            className="border rounded px-3 py-2 text-black"
            placeholder="Number of bathrooms"
            required
          />
        </div>

        {/* Heating Type */}
        <div className="flex flex-col">
          <label htmlFor="heatingType" className="text-sm font-medium">
            Heating Type
          </label>
          <select
            id="heatingType"
            name="heatingType"
            value={formData.heatingType}
            onChange={handleInputChange}
            className="border rounded px-3 py-2 text-black"
          >
            <option value="">Select Heating Type</option>
            <option value="Gas">Gas</option>
            <option value="Electric">Electric</option>
            <option value="Oil">Oil</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {/* Energy Class */}
        <div className="flex flex-col">
          <label htmlFor="energyClass" className="text-sm font-medium">
            Energy Class
          </label>
          <select
            id="energyClass"
            name="energyClass"
            value={formData.energyClass}
            onChange={handleInputChange}
            className="border rounded px-3 py-2 text-black"
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

        {/* Furnished */}
        <div className="flex items-center">
          <input
            id="furnished"
            name="furnished"
            type="checkbox"
            checked={formData.furnished}
            onChange={handleInputChange}
            className="mr-2"
          />
          <label htmlFor="furnished" className="text-sm font-medium">
            Furnished
          </label>
        </div>

        {/* Parking */}
        <div className="flex items-center">
          <input
            id="parking"
            name="parking"
            type="checkbox"
            checked={formData.parking}
            onChange={handleInputChange}
            className="mr-2"
          />
          <label htmlFor="parking" className="text-sm font-medium">
            Parking
          </label>
        </div>

        {/* Garage */}
        <div className="flex items-center">
          <input
            id="garage"
            name="garage"
            type="checkbox"
            checked={formData.garage}
            onChange={handleInputChange}
            className="mr-2"
          />
          <label htmlFor="garage" className="text-sm font-medium">
            Garage
          </label>
        </div>

        {/* Elevator */}
        <div className="flex items-center">
          <input
            id="elevator"
            name="elevator"
            type="checkbox"
            checked={formData.elevator}
            onChange={handleInputChange}
            className="mr-2"
          />
          <label htmlFor="elevator" className="text-sm font-medium">
            Elevator
          </label>
        </div>

        {/* Balcony */}
        <div className="flex items-center">
          <input
            id="balcony"
            name="balcony"
            type="checkbox"
            checked={formData.balcony}
            onChange={handleInputChange}
            className="mr-2"
          />
          <label htmlFor="balcony" className="text-sm font-medium">
            Balcony
          </label>
        </div>

        {/* Terrace */}
        <div className="flex items-center">
          <input
            id="terrace"
            name="terrace"
            type="checkbox"
            checked={formData.terrace}
            onChange={handleInputChange}
            className="mr-2"
          />
          <label htmlFor="terrace" className="text-sm font-medium">
            Terrace
          </label>
        </div>

        {/* Garden */}
        <div className="flex items-center">
          <input
            id="garden"
            name="garden"
            type="checkbox"
            checked={formData.garden}
            onChange={handleInputChange}
            className="mr-2"
          />
          <label htmlFor="garden" className="text-sm font-medium">
            Garden
          </label>
        </div>

        {/* Basement Available */}
        <div className="flex items-center">
          <input
            id="basementAvailable"
            name="basementAvailable"
            type="checkbox"
            checked={formData.basementAvailable}
            onChange={handleInputChange}
            className="mr-2"
          />
          <label htmlFor="basementAvailable" className="text-sm font-medium">
            Basement Available
          </label>
        </div>

        {/* Floor Number */}
        <div className="flex flex-col">
          <label htmlFor="floorNumber" className="text-sm font-medium">
            Floor Number
          </label>
          <input
            id="floorNumber"
            name="floorNumber"
            type="number"
            value={formData.floorNumber}
            onChange={handleInputChange}
            className="border rounded px-3 py-2 text-black"
            placeholder="Floor number"
          />
        </div>

        {/* Total Floors */}
        <div className="flex flex-col">
          <label htmlFor="totalFloors" className="text-sm font-medium">
            Total Floors
          </label>
          <input
            id="totalFloors"
            name="totalFloors"
            type="number"
            value={formData.totalFloors}
            onChange={handleInputChange}
            className="border rounded px-3 py-2 text-black"
            placeholder="Total number of floors"
          />
        </div>

        {/* Contact Number */}
        <div className="flex flex-col">
          <label htmlFor="contactNumber" className="text-sm font-medium">
            Contact Number
          </label>
          <input
            id="contactNumber"
            name="contactNumber"
            type="tel"
            value={formData.contactNumber}
            onChange={handleInputChange}
            className="border rounded px-3 py-2 text-black"
            placeholder="Contact number"
            required
          />
        </div>

        {/* Contact Email */}
        <div className="flex flex-col">
          <label htmlFor="contactEmail" className="text-sm font-medium">
            Contact Email
          </label>
          <input
            id="contactEmail"
            name="contactEmail"
            type="email"
            value={formData.contactEmail}
            onChange={handleInputChange}
            className="border rounded px-3 py-2 text-black"
            placeholder="Contact email"
            required
          />
        </div>

        {/* Availability Date */}
        <div className="flex flex-col">
          <label htmlFor="availabilityDate" className="text-sm font-medium">
            Availability Date
          </label>
          <input
            id="availabilityDate"
            name="availabilityDate"
            type="date"
            value={formData.availabilityDate}
            onChange={handleInputChange}
            className="border rounded px-3 py-2 text-black"
            required
          />
        </div>

        {/* Photos */}
        <div className="flex flex-col">
          <label htmlFor="photos" className="text-sm font-medium">
            Photos
          </label>
          <input
            type="file"
            id="photos"
            name="photos"
            multiple
            onChange={handleFileChange}
            className="border rounded px-3 py-2"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded hover:bg-blue-700"
        >
          Create Offer
        </button>
        {message && <p className="mb-4 text-red-600">{message}</p>}
      </form>
    </div>
  );
}
