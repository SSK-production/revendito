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
    <div>
      <h1>Créer une offre de véhicule</h1>
      <form onSubmit={handleSubmit}>
        {error && <div className="error">{error}</div>}
        {successMessage && <div className="success">{successMessage}</div>}

        {/* Title */}
        <label>
          Titre:
          <input type="text" name="title" value={formData.title} onChange={handleChange} required />
        </label>

        {/* Description */}
        <label>
          Description:
          <textarea name="description" value={formData.description} onChange={handleChange} required />
        </label>

        {/* Price */}
        <label>
          Prix:
          <input type="number" name="price" value={formData.price} onChange={handleChange} required />
        </label>

        {/* Other fields */}
        <label>
          Ville:
          <input type="text" name="city" value={formData.city} onChange={handleChange} required />
        </label>

        <label>
          Pays:
          <input type="text" name="country" value={formData.country} onChange={handleChange} required />
        </label>

        <label>
          Type de véhicule:
          <select name="vehicleType" value={formData.vehicleType} onChange={handleChange} required>
            <option value="Car">Voiture</option>
            <option value="Truck">Camion</option>
            <option value="Motorcycle">Moto</option>
            <option value="Van">Van</option>
            <option value="Bicycle">Vélo</option>
            <option value="Boat">Bateau</option>
          </select>
        </label>

        <label>
          Modèle:
          <input type="text" name="model" value={formData.model} onChange={handleChange} required />
        </label>

        <label>
          Année:
          <input type="number" name="year" value={formData.year} onChange={handleChange} required />
        </label>

        <label>
          Kilométrage:
          <input type="number" name="mileage" value={formData.mileage} onChange={handleChange} required />
        </label>

        <label>
          Type de carburant:
          <input type="text" name="fuelType" value={formData.fuelType} onChange={handleChange} required />
        </label>

        <label>
          Couleur:
          <input type="text" name="color" value={formData.color} onChange={handleChange} required />
        </label>

        <label>
          Transmission:
          <input type="text" name="transmission" value={formData.transmission} onChange={handleChange} required />
        </label>

        <label>
          Nombre de portes:
          <input type="number" name="numberOfDoors" value={formData.numberOfDoors} onChange={handleChange} />
        </label>

        <label>
          Taille du moteur (L):
          <input type="text" name="engineSize" value={formData.engineSize} onChange={handleChange} />
        </label>

        <label>
          Puissance (CV):
          <input type="text" name="power" value={formData.power} onChange={handleChange} />
        </label>

        <label>
          Classe d'émission:
          <input type="text" name="emissionClass" value={formData.emissionClass} onChange={handleChange} />
        </label>

        <label>
          État:
          <select name="condition" value={formData.condition} onChange={handleChange}>
            <option value="User">Used</option>
            <option value="New">New</option>
            <option value="For Renovation">For Renovation</option>
          </select>
        </label>

        <label>
          Numéro de contact:
          <input type="text" name="contactNumber" value={formData.contactNumber} onChange={handleChange} required />
        </label>

        <label>
          Email de contact:
          <input type="email" name="contactEmail" value={formData.contactEmail} onChange={handleChange} required />
        </label>

        <label>
          Localisation automatique:
          <input type="checkbox" name="location" checked={formData.location} onChange={handleChange} />
        </label>

        <label>
          Photos:
          <input type="file" name="photos" multiple onChange={handleFileChange} />
        </label>

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Envoi en cours..." : "Créer l'offre"}
        </button>
      </form>
    </div>
  );
};

export default VehicleOfferForm;
