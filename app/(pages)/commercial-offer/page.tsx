"use client";
import React, { useState } from 'react';

const CommercialOfferForm = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    city: '',
    country: '',
    commercialType: 'Product',  // Définir un type commercial par défaut
    duration: '',
    contractType: '',
    workSchedule: '',
    contactNumber: '',
    contactEmail: '',
    photos: [] as File[],  // Liste des fichiers à télécharger
  });
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData({
        ...formData,
        photos: Array.from(e.target.files),  // Mettre à jour les photos avec les fichiers sélectionnés
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const form = new FormData();
      // Ajouter tous les champs du formulaire
      Object.keys(formData).forEach((key) => {
        if (key !== 'photos') {
          form.append(key, formData[key as keyof typeof formData]);
        }
      });

      // Ajouter les photos
      formData.photos.forEach((file) => {
        form.append('photos', file);
      });

      const response = await fetch('/api/commercial', {
        method: 'POST',
        body: form,
      });

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage('Offre créée avec succès!');
        setFormData({
          title: '',
          description: '',
          price: '',
          city: '',
          country: '',
          commercialType: 'Sale',
          duration: '',
          contractType: '',
          workSchedule: '',
          contactNumber: '',
          contactEmail: '',
          photos: [],
        });
      } else {
        setError(data.error || 'Une erreur est survenue');
      }
    } catch (error) {
      setError('Erreur lors de l\'envoi de la requête');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-md">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">Créer une offre commerciale</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <div className="text-red-600">{error}</div>}
        {successMessage && <div className="text-green-600">{successMessage}</div>}
        
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
            <option value="Service">Service</option>
            <option value="Other">Other</option>
          </select>
        </label>

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
        <label className="block text-gray-700">
          Horraire semaine:
          <input
            type="text"
            name="workSchedule"
            value={formData.workSchedule}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </label>
        <label className="block text-gray-700">
          Contact number:
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
          Contact email:
          <input
            type="text"
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

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-2 px-4 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          {isSubmitting ? 'Envoi en cours...' : 'Créer l\'offre'}
        </button>
      </form>
    </div>
  );
};

export default CommercialOfferForm;
