"use client";

import React, { useState } from "react";
import { handleChange } from "@/utils/forms/allFunctionsForm"; // Gestion des changements
import { handleSubmit } from "@/utils/forms/allFunctionsForm"; // Gestion de la soumission
import { CompanyData } from "@/utils/interfaces/formsInterface"; // Interface pour les données
import { useRouter } from "next/navigation";
import DOMPurify from "dompurify";
import { useNotifications } from "@/components/notifications"; // Import du système de notifications
import { capitalizeFirstLetter } from "@/app/lib/function";




// Composant de formulaire d'enregistrement de l'entreprise
export default function CompanyRegister() {
  const [formData, setFormData] = useState<CompanyData>({
    companyName: "",
    password: "",
    email: "",
    companyNumber: "",
    birthDate: "",
    city: "",
    country: "",
    street: "",
  });

  const [errors, setErrors] = useState<Record<string, string | null>>({});
  const router = useRouter();
  const { NotificationsComponent, addNotification } = useNotifications();

  // Fonction pour envoyer les données
  const sendData = async (data: CompanyData) => {
    try {
      const response = await fetch("/api/company", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const result = await response.json();
        console.log("Company successfully created:", result);

        addNotification({
          message: "Company registered successfully! Redirecting to login...",
          variant: "success",
          duration: 3000,
        });

        // Redirection après succès
        setTimeout(() => {
          router.push("/login");
        }, 3000);
      } else {
        const errorData = await response.json();
        const errorMessage =
          errorData?.error || "An error occurred during registration.";

        addNotification({
          message: `Error: ${errorMessage}`,
          variant: "error",
          duration: 7000,
        });
        console.error("Registration error:", errorData);
      }
    } catch (error) {
      console.error("Fetch error:", error);

      addNotification({
        message: "An unexpected error occurred.",
        variant: "error",
        duration: 7000,
      });
    }
  };

  const submitHandler = (data: CompanyData) => {
    // Sanitize data pour éviter les failles XSS
    const sanitizedData = {
      ...data,
      companyName: DOMPurify.sanitize(data.companyName),
      password: DOMPurify.sanitize(data.password),
      email: DOMPurify.sanitize(data.email),
      companyNumber: DOMPurify.sanitize(data.companyNumber),
      birthDate: DOMPurify.sanitize(data.birthDate),
      city: DOMPurify.sanitize(data.city),
      country: DOMPurify.sanitize(data.country),
      street: DOMPurify.sanitize(data.street),
    };

    console.log("Submitting sanitized data:", sanitizedData);

    // Envoyer les données à l'API
    sendData(sanitizedData);
  };

  const handleError = (errors: Record<string, string | null>) => {
    setErrors(errors);

    if (Object.keys(errors).length > 0) {
      addNotification({
        message: "Please fix the errors before submitting.",
        variant: "error",
        duration: 7000,
      });
    }
  };

  

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-8">
  <div className="w-full max-w-lg bg-white p-8 rounded-2xl shadow-2xl">
    <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
      Register Your Company
    </h1>

    <form
      className="space-y-5"
      onSubmit={(e) =>
        handleSubmit(e, formData, submitHandler, "companyData", handleError)
      }
    >
      {/* Company Name */}
      <div>
        <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-1">
          Company Name
        </label>
        <input
          type="text"
          id="companyName"
          name="companyName"
          value={capitalizeFirstLetter(formData.companyName)}
          onChange={(e) => handleChange(e, setFormData)}
          maxLength={20}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        {errors.companyName && (
          <p className="mt-1 text-sm text-red-600">{errors.companyName}</p>
        )}
      </div>

      {/* Password */}
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
          Password
        </label>
        <input
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={(e) => handleChange(e, setFormData)}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        {errors.password && (
          <p className="mt-1 text-sm text-red-600">{errors.password}</p>
        )}
      </div>

      {/* Email */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={(e) => handleChange(e, setFormData)}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-600">{errors.email}</p>
        )}
      </div>

      {/* Company Number */}
      <div>
        <label htmlFor="companyNumber" className="block text-sm font-medium text-gray-700 mb-1">
          Company Number
        </label>
        <input
          type="text"
          id="companyNumber"
          name="companyNumber"
          value={formData.companyNumber}
          onChange={(e) => handleChange(e, setFormData)}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        {errors.companyNumber && (
          <p className="mt-1 text-sm text-red-600">{errors.companyNumber}</p>
        )}
      </div>

      {/* Birth Date */}
      <div>
        <label htmlFor="birthDate" className="block text-sm font-medium text-gray-700 mb-1">
          Birth Date
        </label>
        <input
          type="date"
          id="birthDate"
          name="birthDate"
          value={formData.birthDate}
          onChange={(e) => handleChange(e, setFormData)}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        {errors.birthDate && (
          <p className="mt-1 text-sm text-red-600">{errors.birthDate}</p>
        )}
      </div>

      {/* City */}
      <div>
        <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
          City
        </label>
        <input
          type="text"
          id="city"
          name="city"
          value={formData.city}
          onChange={(e) => handleChange(e, setFormData)}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        {errors.city && (
          <p className="mt-1 text-sm text-red-600">{errors.city}</p>
        )}
      </div>

      {/* Country */}
      <div>
        <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
          Country
        </label>
        <input
          type="text"
          id="country"
          name="country"
          value={formData.country}
          onChange={(e) => handleChange(e, setFormData)}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        {errors.country && (
          <p className="mt-1 text-sm text-red-600">{errors.country}</p>
        )}
      </div>

      {/* Street */}
      <div>
        <label htmlFor="street" className="block text-sm font-medium text-gray-700 mb-1">
          Street
        </label>
        <input
          type="text"
          id="street"
          name="street"
          value={formData.street}
          onChange={(e) => handleChange(e, setFormData)}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        {errors.street && (
          <p className="mt-1 text-sm text-red-600">{errors.street}</p>
        )}
      </div>

      {/* Submit Button */}
      <div>
        <button
          type="submit"
          className="w-full py-3 px-4 bg-indigo-600 text-white font-semibold rounded-md shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          Submit
        </button>
      </div>
    </form>

    <div className="mt-6">
      <NotificationsComponent />
    </div>
  </div>
</div>

  );
}
