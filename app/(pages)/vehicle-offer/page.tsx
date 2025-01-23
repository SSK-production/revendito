"use client";
import React, { useState } from "react";

const VehicleOfferForm = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    city: "",
    country: "",
    vehicleType: "Car",
    model: "",
    year: "",
    mileage: "",
    fuelType: "",
    color: "",
    transmission: "",
    numberOfDoors: "",
    engineSize: "",
    power: "",
    emissionClass: "",
    condition: "Occasion",
    contactNumber: "",
    contactEmail: "",
    location: false,
    photos: [] as File[],
  });

  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const value = e.target.type === "checkbox" ? (e.target as HTMLInputElement).checked : e.target.value;
    setFormData({
      ...formData,
      [e.target.name]: value,
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData({
        ...formData,
        photos: Array.from(e.target.files),
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const token = document.cookie.split("=")[1]; // Assumes the token is stored as a cookie

      const form = new FormData();
      Object.keys(formData).forEach((key) => {
        if (key !== "photos") {
          form.append(key, String(formData[key as keyof typeof formData]));
        }
      });

      formData.photos.forEach((file) => {
        form.append("photos", file);
      });

      const response = await fetch("/api/vehicle", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: form,
      });

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage("Offre de véhicule créée avec succès !");
        setFormData({
          title: "",
          description: "",
          price: "",
          city: "",
          country: "",
          vehicleType: "Car",
          model: "",
          year: "",
          mileage: "",
          fuelType: "",
          color: "",
          transmission: "",
          numberOfDoors: "",
          engineSize: "",
          power: "",
          emissionClass: "",
          condition: "Occasion",
          contactNumber: "",
          contactEmail: "",
          location: false,
          photos: [],
        });
      } else {
        setError(data.error || "Une erreur est survenue");
      }
    } catch (error) {
      setError("Erreur lors de l'envoi de la requête");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Créer une offre de véhicule</h1>
      <form onSubmit={handleSubmit} className="space-y-4">

      {/* Title */}
      <label className="block">
        <span className="text-gray-700">Titre:</span>
        <input type="text" name="title" value={formData.title} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
      </label>

      {/* Description */}
      <label className="block">
        <span className="text-gray-700">Description:</span>
        <textarea name="description" value={formData.description} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
      </label>

      {/* Price */}
      <label className="block">
        <span className="text-gray-700">Prix:</span>
        <input type="number" name="price" value={formData.price} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
      </label>

      {/* Other fields */}
      <label className="block">
        <span className="text-gray-700">Ville:</span>
        <input type="text" name="city" value={formData.city} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
      </label>

      <label className="block">
        <span className="text-gray-700">Pays:</span>
        <input type="text" name="country" value={formData.country} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
      </label>

      <label className="block">
        <span className="text-gray-700">Type de véhicule:</span>
        <select name="vehicleType" value={formData.vehicleType} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
        <option value="Car">Voiture</option>
        <option value="Truck">Camion</option>
        <option value="Motorcycle">Moto</option>
        <option value="Van">Van</option>
        <option value="Bicycle">Vélo</option>
        <option value="Boat">Bateau</option>
        </select>
      </label>

      <label className="block">
        <span className="text-gray-700">Modèle:</span>
        <input type="text" name="model" value={formData.model} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
      </label>

      <label className="block">
        <span className="text-gray-700">Année:</span>
        <input type="number" name="year" value={formData.year} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
      </label>

      <label className="block">
        <span className="text-gray-700">Kilométrage:</span>
        <input type="number" name="mileage" value={formData.mileage} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
      </label>

      <label className="block">
        <span className="text-gray-700">Type de carburant:</span>
        <input type="text" name="fuelType" value={formData.fuelType} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
      </label>

      <label className="block">
        <span className="text-gray-700">Couleur:</span>
        <input type="text" name="color" value={formData.color} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
      </label>

      <label className="block">
        <span className="text-gray-700">Transmission:</span>
        <input type="text" name="transmission" value={formData.transmission} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
      </label>

      <label className="block">
        <span className="text-gray-700">Nombre de portes:</span>
        <input type="number" name="numberOfDoors" value={formData.numberOfDoors} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
      </label>

      <label className="block">
        <span className="text-gray-700">Taille du moteur (L):</span>
        <input type="text" name="engineSize" value={formData.engineSize} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
      </label>

      <label className="block">
        <span className="text-gray-700">Puissance (CV):</span>
        <input type="text" name="power" value={formData.power} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
      </label>

      <label className="block">
        <span className="text-gray-700">Classe d'émission:</span>
        <input type="text" name="emissionClass" value={formData.emissionClass} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
      </label>

      <label className="block">
        <span className="text-gray-700">État:</span>
        <select name="condition" value={formData.condition} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
        <option value="User">Used</option>
        <option value="New">New</option>
        <option value="For Renovation">For Renovation</option>
        </select>
      </label>

      <label className="block">
        <span className="text-gray-700">Numéro de contact:</span>
        <input type="text" name="contactNumber" value={formData.contactNumber} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
      </label>

      <label className="block">
        <span className="text-gray-700">Email de contact:</span>
        <input type="email" name="contactEmail" value={formData.contactEmail} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
      </label>

      <label className="block">
        <span className="text-gray-700">Localisation automatique:</span>
        <input type="checkbox" name="location" checked={formData.location} onChange={handleChange} className="mt-1" />
      </label>

      <label className="block">
        <span className="text-gray-700">Photos:</span>
        <input type="file" name="photos" multiple onChange={handleFileChange} className="mt-1 block w-full" />
      </label>

      <button type="submit" disabled={isSubmitting} className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 disabled:opacity-50">
        {isSubmitting ? "Envoi en cours..." : "Créer l'offre"}
      </button>
      {error && <div className="text-red-500">{error}</div>}
      {successMessage && <div className="text-green-500">{successMessage}</div>}

      </form>
    </div>
  );
};

export default VehicleOfferForm;
