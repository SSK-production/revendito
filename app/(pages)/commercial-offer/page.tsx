"use client";
import React, { useState } from "react";

type Day = "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday" | "Sunday";


const CommercialOfferForm = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    city: "",
    country: "",
    commercialType: "Product", // Définir un type commercial par défaut
    duration: "",
    contractType: "",
    workSchedule: "Full-time", // Options : Full-time, Part-time, Flexible, Other
    contactNumber: "",
    contactEmail: "",
    openingHours: {
      Monday: { start: "", end: "" },
      Tuesday: { start: "", end: "" },
      Wednesday: { start: "", end: "" },
      Thursday: { start: "", end: "" },
      Friday: { start: "", end: "" },
      Saturday: { start: "", end: "" },
      Sunday: { start: "", end: "" },
    },
    categories: [] as string[],
    photos: [] as File[], // Liste des fichiers à télécharger
  });
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);


  const categoriesList = [
    "Electronics",
    "Fashion",
    "Home",
    "Toys",
    "Books",
    "Automotive",
    "Sports",
    "Health & Beauty",
    "Food & Beverage",
    "Art & Crafts",
    "Real Estate",
    "Education",
    "Entertainment",
    "Pets",
    "Other",
  ];

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData({
        ...formData,
        photos: Array.from(e.target.files), // Mettre à jour les photos avec les fichiers sélectionnés
      });
    }
  };

  const handleCategoryChange = (category: string) => {
    setFormData((prev) => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter((cat) => cat !== category)
        : [...prev.categories, category],
    }));
  };

  const handleOpeningHoursChange = (day: Day, period: "start" | "end", value: string) => {
    setFormData((prev) => ({
      ...prev,
      openingHours: {
        ...prev.openingHours,
        [day]: {
          ...prev.openingHours[day],
          [period]: value,
        },
      },
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const form = new FormData();
      Object.keys(formData).forEach((key) => {
        if (key !== "photos" && key !== "openingHours" && key !== "categories") {
          const value = formData[key as keyof typeof formData];
          if (typeof value === "string" || value instanceof Blob || value instanceof File) {
            form.append(key, value);
          }
        }
      });

      form.append("categories", JSON.stringify(formData.categories));
      form.append("openingHours", JSON.stringify(formData.openingHours));
      formData.photos.forEach((file) => {
        form.append("photos", file);
      });

      const response = await fetch("/api/commercial", {
        method: "POST",
        body: form,
      });

      const data = await response.json();
      console.log(data);
      

      if (response.ok) {
        setSuccessMessage("Offre créée avec succès!");
        setFormData({
          title: "",
          description: "",
          price: "",
          city: "",
          country: "",
          commercialType: "Product",
          duration: "",
          contractType: "",
          workSchedule: "Full-time",
          contactNumber: "",
          contactEmail: "",
          openingHours: {
            Monday: { start: "", end: "" },
            Tuesday: { start: "", end: "" },
            Wednesday: { start: "", end: "" },
            Thursday: { start: "", end: "" },
            Friday: { start: "", end: "" },
            Saturday: { start: "", end: "" },
            Sunday: { start: "", end: "" },
          },
          categories: [],
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

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-md">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">
        Créer une offre commerciale
      </h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        
        {/* Titre */}
        <label className="block text-gray-700">
          Titre:
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </label>

        {/* Description */}
        <label className="block text-gray-700">
          Description:
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </label>

        {/* Prix */}
        <label className="block text-gray-700">
          Prix:
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </label>

        {/* Ville */}
        <label className="block text-gray-700">
          Ville:
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </label>

        {/* Pays */}
        <label className="block text-gray-700">
          Pays:
          <input
            type="text"
            name="country"
            value={formData.country}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </label>

        {/* Type de l'offre */}
        <label className="block text-gray-700">
          Type de l'offre:
          <select
            name="commercialType"
            value={formData.commercialType}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="Product">Product</option>
            <option value="Service">Job</option>
            <option value="Service">Promotion</option>
            <option value="Other">Other</option>
          </select>
        </label>

        {/* Durée */}
        <label className="block text-gray-700">
          Durée:
          <input
            type="number"
            name="duration"
            value={formData.duration}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </label>

        {/* Type de contrat */}
        <label className="block text-gray-700">
          Type de contrat:
          <input
            type="text"
            name="contractType"
            value={formData.contractType}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </label>

        {/* Horaire de travail */}
        <label className="block text-gray-700">
          Horaire de travail:
          <select
            name="workSchedule"
            value={formData.workSchedule}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="Full-time">Full-time</option>
            <option value="Part-time">Part-time</option>
            <option value="Flexible">Flexible</option>
            <option value="Other">Other</option>
          </select>
        </label>

        {/* Horaires d'ouverture */}
        <div className="block text-gray-700">
          <h2 className="text-lg font-medium mb-4">Horaires d'ouverture:</h2>
          {Object.entries(formData.openingHours).map(([day, schedule]) => (
            <div key={day} className="mb-2">
              <label className="block text-gray-600 font-semibold">{day}:</label>
              <div className="flex space-x-2">
                <input
                  type="time"
                  value={schedule.start}
                  onChange={(e) =>
                    handleOpeningHoursChange(day as Day, "start", e.target.value)
                  }
                  className="mt-1 block w-1/2 px-2 py-2 border border-gray-300 rounded-md"
                />
                <input
                  type="time"
                  value={schedule.end}
                  onChange={(e) =>
                    handleOpeningHoursChange(day as Day, "end", e.target.value)
                  }
                  className="mt-1 block w-1/2 px-2 py-2 border border-gray-300 rounded-md"
                />
              </div>
            </div>
          ))}
        </div>
         {/* Catégories */}
         <div className="block text-gray-700">
          <h2 className="text-lg font-medium mb-4">Catégories:</h2>
          <div className="grid grid-cols-2 gap-2">
            {categoriesList.map((category) => (
              <label key={category} className="flex items-center">
                <input
                  type="checkbox"
                  value={category}
                  checked={formData.categories.includes(category)}
                  onChange={() => handleCategoryChange(category)}
                  className="mr-2"
                />
                {category}
              </label>
            ))}
          </div>
        </div>
        

        {/* Numéro de contact */}
        <label className="block text-gray-700">
          Numéro de contact:
          <input
            type="text"
            name="contactNumber"
            value={formData.contactNumber}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </label>

        {/* Email de contact */}
        <label className="block text-gray-700">
          Email de contact:
          <input
            type="email"
            name="contactEmail"
            value={formData.contactEmail}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </label>

        {/* Photos */}
        <label className="block text-gray-700">
          Photos:
          <input
            type="file"
            name="photos"
            multiple
            onChange={handleFileChange}
            required
            className="mt-1 block w-full text-sm text-black file:py-2 file:px-4 file:border file:border-gray-300 file:rounded-md file:bg-indigo-500 file:text-white hover:file:bg-indigo-600"
          />
        </label>
        
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-2 px-4 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          {isSubmitting ? "Envoi en cours..." : "Créer l'offre"}
        </button>
        {error && <div className="text-red-600">{error}</div>}
        {successMessage && <div className="text-green-600">{successMessage}</div>}

      </form>
    </div>
  );
};

export default CommercialOfferForm;
