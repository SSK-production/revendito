"use client";
import React, { useState } from "react";
import { countries } from "@/app/lib/IsoCodeCountry";

type Day = "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday" | "Sunday";

const CommercialOfferForm = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    city: "",
    country: "",
    commercialType: "Product",
    duration: "3",
    contractType: "Other",
    workSchedule: "Full-time",
    contactNumber: "",
    contactEmail: "",
    openingHours: {
      Monday: { start: "09:00", end: "17:00" },
      Tuesday: { start: "09:00", end: "17:00"},
      Wednesday: { start: "09:00", end: "17:00" },
      Thursday: { start: "09:00", end: "17:00" },
      Friday: { start: "09:00", end: "17:00" },
      Saturday: { start: "09:00", end: "17:00" },
      Sunday: { start: "09:00", end: "17:00" },
    },
    categories: [] as string[],
    photos: [] as File[],
  });
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [step, setStep] = useState(1);

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
        photos: Array.from(e.target.files),
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
          duration: "3",
          contractType: "Other",
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

  const nextStep = () => {
    if (formData.commercialType === "Product" || formData.commercialType === "Other") {
      setStep(3);
    } else {
      setStep((prev) => Math.min(prev + 1, 3));
    }
  };
  const prevStep = () => {
    if (formData.commercialType === "Product" || formData.commercialType === "Other") {
      setStep(1);
    } else {
      setStep((prev) => Math.max(prev - 1, 1));
    }
  } 

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-md">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">
        Créer une offre commerciale
      </h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {step === 1 && (
          <>
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
            <label className="block text-gray-700">
              Pays:
              <select
                name="country"
                value={formData.country}
                onChange={handleChange}
                required
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">Select a country</option>
                {countries.map(({ code, name }) => (
                  <option key={code} value={code}>
                    {name}
                  </option>
                ))}
              </select>
            </label>
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
                <option value="Job">Job</option>
                <option value="Service">Promotion</option>
                <option value="Other">Other</option>
              </select>
            </label>
          </>
        )}
        {step === 2 && (
          <>
            {formData.commercialType === "Job" && (
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
            )}
            {formData.commercialType === "Job" && (
              <label className="block text-gray-700">
                Type de contrat:
                <select
                  name="contractType"
                  value={formData.contractType}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">Select...</option>
                  <option value="Permanent">Permanent (Full-time job)</option>
                  <option value="Fixed-Term">Fixed-Term (Temporary job)</option>
                  <option value="Freelance">Freelance / Independent</option>
                  <option value="Internship">
                    Internship / Apprenticeship
                  </option>
                  <option value="Other">Other</option>
                </select>
              </label>
            )}
            {formData.commercialType === "Job" && (
              <label className="block text-gray-700">
                Horaire de travail:
                <select
                  name="workSchedule"
                  value={formData.workSchedule}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">Select...</option>
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Flexible">Flexible</option>
                  <option value="Other">Other</option>
                </select>
              </label>
            )}
            {formData.commercialType === "Service" && (
              <div className="block text-gray-700">
                <h2 className="text-lg font-medium mb-4">
                  Horaires d'ouverture:
                </h2>
                {Object.entries(formData.openingHours).map(
                  ([day, schedule]) => (
                    <div key={day} className="mb-2">
                      <label className="block text-gray-600 font-semibold">
                        {day}:
                      </label>
                      <div className="flex space-x-2">
                        <input
                          type="time"
                          value={schedule.start || "09:00"}
                          onChange={(e) =>
                            handleOpeningHoursChange(
                              day as Day,
                              "start",
                              e.target.value
                            )
                          }
                          className="mt-1 block w-1/2 px-2 py-2 border border-gray-300 rounded-md"
                        />
                        <input
                          type="time"
                          value={schedule.end || "17:00"}
                          onChange={(e) =>
                            handleOpeningHoursChange(
                              day as Day,
                              "end",
                              e.target.value
                            )
                          }
                          className="mt-1 block w-1/2 px-2 py-2 border border-gray-300 rounded-md"
                        />
                      </div>
                    </div>
                  )
                )}
              </div>
            )}
          </>
        )}
        {step === 3 && (
          <>
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
          </>
        )}
        <div className="flex justify-between">
          {step > 1 && (
            <button
              type="button"
              onClick={prevStep}
              className="py-2 px-4 bg-gray-300 text-black font-semibold rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              Précédent
            </button>
          )}
          {step < 3 && (
            <button
              type="button"
              onClick={nextStep}
              className="py-2 px-4 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              Suivant
            </button>
          )}
          {step === 3 && (
            <button
              type="submit"
              disabled={isSubmitting}
              className="py-2 px-4 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {isSubmitting ? "Envoi en cours..." : "Créer l'offre"}
            </button>
          )}
        </div>
        {error && <div className="text-red-600">{error}</div>}
        {successMessage && (
          <div className="text-green-600">{successMessage}</div>
        )}
      </form>
    </div>
  );
};

export default CommercialOfferForm;
