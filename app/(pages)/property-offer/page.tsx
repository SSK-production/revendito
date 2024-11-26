'use client';

import { useState } from 'react';

export default function RealEstateOfferPage() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    city: '',
    country: '',
    propertyType: '',
    surface: '',
    rooms: '',
    bedrooms: '',
    bathrooms: '',
    heatingType: '',
    energyClass: '',
    furnished: false,
  });
  const [photos, setPhotos] = useState<File[]>([]);
  const [message, setMessage] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
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
    photos.forEach((file) => form.append('photos', file));

    try {
      const res = await fetch('/api/property', {
        method: 'POST',
        body: form,
        credentials: 'include', // Include cookies
      });

      const result = await res.json();
      if (res.ok) {
        setMessage('Offer created successfully!');
        setFormData({
          title: '',
          description: '',
          price: '',
          city: '',
          country: '',
          propertyType: '',
          surface: '',
          rooms: '',
          bedrooms: '',
          bathrooms: '',
          heatingType: '',
          energyClass: '',
          furnished: false,
        });
        setPhotos([]);
      } else {
        setMessage(`Error: ${result.error}`);
      }
    } catch (error) {
      setMessage('An error occurred while creating the offer.');
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 p-5 border rounded shadow-lg bg-white">
      <h1 className="text-2xl font-bold mb-5">Create Real Estate Offer</h1>

      {message && <p className="mb-4 text-red-600">{message}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title */}
        <div className="flex flex-col">
          <label htmlFor="title" className="text-sm font-medium">Title</label>
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
          <label htmlFor="description" className="text-sm font-medium">Description</label>
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
          <label htmlFor="price" className="text-sm font-medium">Price (€)</label>
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
          <label htmlFor="city" className="text-sm font-medium">City</label>
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
          <label htmlFor="country" className="text-sm font-medium">Country</label>
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

        {/* Property Type */}
        <div className="flex flex-col">
          <label htmlFor="propertyType" className="text-sm font-medium">Property Type</label>
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

        {/* Surface */}
        <div className="flex flex-col">
          <label htmlFor="surface" className="text-sm font-medium">Surface (m²)</label>
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
          <label htmlFor="rooms" className="text-sm font-medium">Number of Rooms</label>
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
          <label htmlFor="bedrooms" className="text-sm font-medium">Number of Bedrooms</label>
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
          <label htmlFor="bathrooms" className="text-sm font-medium">Number of Bathrooms</label>
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
          <label htmlFor="heatingType" className="text-sm font-medium">Heating Type</label>
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
          <label htmlFor="energyClass" className="text-sm font-medium">Energy Class</label>
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
          <label htmlFor="furnished" className="text-sm font-medium">Furnished</label>
        </div>

        {/* Photos */}
        <div className="flex flex-col">
          <label htmlFor="photos" className="text-sm font-medium">Photos</label>
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
      </form>
    </div>
  );
}
