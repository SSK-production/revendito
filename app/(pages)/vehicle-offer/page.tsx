"use client";
import React, { useState } from "react";
import { countries } from "@/app/lib/IsoCodeCountry";

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
    mileage: "None",
    fuelType: "None",
    color: "",
    transmission: "None",
    numberOfDoors: "0",
    engineSize: "none",
    power: "None",
    emissionClass: "None",
    condition: "Occasion",
    contactNumber: "",
    contactEmail: "",
    location: false,
    photos: [] as File[],
  });

  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [step, setStep] = useState(1);

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
          fuelType: "None",
          color: "",
          transmission: "None",
          numberOfDoors: "0",
          engineSize: "None",
          power: "None",
          emissionClass: "None",
          condition: "Occasion",
          contactNumber: "",
          contactEmail: "",
          location: false,
          photos: [],
        });
      } else {
        setError(data.error || "Une erreur est survenue");
      }
    } catch {
      setError("Erreur lors de l'envoi de la requête");
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () => {
    if (formData.vehicleType === "Bicycle" && step === 1) {
      setStep(3);
    } else {
      setStep(step + 1);
    }
  };

  const prevStep = () => {
    if (formData.vehicleType === "Bicycle" && step === 3) {
      setStep(1);
    } else {
      setStep(step - 1);
    }
   
  } 

 
  return (
    <div className="max-w-2xl mx-auto p-4 bg-white shadow-md rounded-lg">
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-600">Créer une offre de véhicule</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
      {step === 1 && (
      <>
      <label className="block">
        <span className="text-gray-700">Titre:</span>
        <input type="text" name="title" value={formData.title} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 px-4 py-2" />
      </label>

      <label className="block">
        <span className="text-gray-700">Description:</span>
        <textarea name="description" value={formData.description} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 px-4 py-2" />
      </label>

      <label className="block">
        <span className="text-gray-700">Prix:</span>
        <input type="number" name="price" value={formData.price} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 px-4 py-2" />
      </label>

      <label className="block">
        <span className="text-gray-700">Pays:</span>
        <select
          name="country"
          value={formData.country}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm px-4 py-2"
        >
          <option value="">Sélectionnez un pays</option>
          {countries.map(({ code, name }) => (
            <option key={code} value={code}>
              {name}
            </option>
          ))}
        </select>
        </label>

      <label className="block">
        <span className="text-gray-700">Ville:</span>
        <input type="text" name="city" value={formData.city} onChange={handleChange} required 
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 px-4 py-2" />
      </label>

      

      <label className="block">
        <span className="text-gray-700">Type de véhicule:</span>
        <select name="vehicleType" value={formData.vehicleType} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 px-4 py-2">
        <option value="Car">Car</option>
        <option value="Truck">Truck</option>
        <option value="Motorcycle">Motorcycle</option>
        <option value="Van">Van</option>
        <option value="Bicycle">Bicycle</option>
        </select>
      </label>

      <div className="flex justify-between">
        <button type="button" onClick={nextStep} className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600">
        Suivant
        </button>
      </div>
      </>
      )}

      {step === 2 && (
      <>
      {formData.vehicleType !== "Bicycle" && (
        <label className="block">
        <span className="text-gray-700">Modèle:</span>
        <input type="text" name="model" value={formData.model} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 px-4 py-2" />
        </label>
      )}
      {formData.vehicleType !== "Bicycle" && (
        <label className="block">
        <span className="text-gray-700">Année:</span>
        <input type="number" name="year" value={formData.year} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 px-4 py-2" />
        </label>
      )}
      {formData.vehicleType !== "Bicycle" && (
        <label className="block">
        <span className="text-gray-700">Kilométrage:</span>
        <input type="number" name="mileage" value={formData.mileage} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 px-4 py-2" />
        </label>
      )}
      {formData.vehicleType !== "Bicycle" && (
        <label className="block">
        <span className="text-gray-700">Type de carburant:</span>
        <select name="fuelType" value={formData.fuelType} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 px-4 py-2">
        <option value="Diesel">Diesel</option>
        <option value="Electric">Electric</option>
        <option value="Hybrid">Hybrid</option>
        <option value="None">None</option>
        </select>
        </label>
      )}
      {formData.vehicleType !== "Bicycle" && (
        <label className="block">
        <span className="text-gray-700">Transmission:</span>
        <select name="transmission" value={formData.transmission} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 px-4 py-2">
        <option value="Manual">Manual</option>
        <option value="Automatic">Automatic</option>
        <option value="None">None</option>
        </select>
        </label>
      )}
      <div className="flex justify-between space-x-4">
        <button type="button" onClick={prevStep} className="w-full bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600">
        Précédent
        </button>
        <button type="button" onClick={nextStep} className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600">
        Suivant
        </button>
      </div>
      </>
      )}

      {step === 3 && (
      <>
      <label className="block">
        <span className="text-gray-700">Couleur:</span>
        <input type="text" name="color" value={formData.color} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 px-4 py-2" />
      </label>
      {formData.vehicleType !== "Bicycle" && formData.vehicleType !== "Motorcycle" && (
        <label className="block">
        <span className="text-gray-700">Nombre de portes:</span>
        <input type="number" name="numberOfDoors" value={formData.numberOfDoors} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 px-4 py-2" />
        </label>
      )}
      {formData.vehicleType !== "Bicycle" && (
        <label className="block">
        <span className="text-gray-700">Taille du moteur (L):</span>
        <input type="text" name="engineSize" value={formData.engineSize} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 px-4 py-2" />
        </label>
      )}
      {formData.vehicleType !== "Bicycle" && (
        <label className="block">
        <span className="text-gray-700">Puissance (CV):</span>
        <input type="text" name="power" value={formData.power} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 px-4 py-2" />
        </label>
      )}
      {formData.vehicleType !== "Bicycle" && (
        <label className="block">
        <span className="text-gray-700">Classe d'émission:</span>
        <input type="text" name="emissionClass" value={formData.emissionClass} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 px-4 py-2" />
        </label>
      )}
      <label className="block">
        <span className="text-gray-700">État:</span>
        <select name="condition" value={formData.condition} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 px-4 py-2">
        <option value="User">Used</option>
        <option value="New">New</option>
        <option value="For Renovation">For Renovation</option>
        </select>
      </label>

      <label className="block">
        <span className="text-gray-700">Numéro de contact:</span>
        <input type="text" name="contactNumber" value={formData.contactNumber} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 px-4 py-2" />
      </label>

      <label className="block">
        <span className="text-gray-700">Email de contact:</span>
        <input type="email" name="contactEmail" value={formData.contactEmail} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 px-4 py-2" />
      </label>

      <label className="block flex items-center">
        <span className="text-gray-700 mr-2">Location:</span>
        <input type="checkbox" name="location" checked={formData.location} onChange={handleChange} className="mt-1 h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
      </label>

      <label className="block">
        <span className="text-gray-700">Photos:</span>
        <input type="file" name="photos" multiple onChange={handleFileChange} className="mt-1 block w-full" />
      </label>

      <div className="flex justify-between space-x-4">
        <button type="button" onClick={prevStep} className="w-full bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600">
        Précédent
        </button>
        <button type="submit" disabled={isSubmitting} className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 disabled:opacity-50">
        {isSubmitting ? "Envoi en cours..." : "Créer l'offre"}
        </button>
      </div>
      {error && <div className="text-red-500 mt-4">{error}</div>}
      {successMessage && <div className="text-green-500 mt-4">{successMessage}</div>}
      </>
      )}
      </form>
    </div>
  );
};

export default VehicleOfferForm;
