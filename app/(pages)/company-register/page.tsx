"use client";

import React, { useState } from "react";
import { handleChange } from "@/utils/forms/allFunctionsForm"; // Gestion des changements
import { handleSubmit } from "@/utils/forms/allFunctionsForm"; // Gestion de la soumission
import { CompanyData } from "@/utils/interfaces/formsInterface"; // Interface pour les données
import { useRouter } from "next/navigation";
import DOMPurify from "dompurify";
import { useNotifications } from "@/components/notifications"; // Import du système de notifications

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
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50">
      <div className="w-full max-w-md bg-white shadow-2xl rounded-lg p-6">
        <h1 className="text-2xl font-bold text-gray-800 text-center mb-4">
          Register Your Company
        </h1>
        <form
          className="space-y-4"
          onSubmit={(e) =>
            handleSubmit(e, formData, submitHandler, "companyData", handleError)
          }
        >
          <div>
            <label
              htmlFor="companyName"
              className="block text-sm font-medium text-gray-700"
            >
              Company Name
            </label>
            <input
              type="text"
              id="companyName"
              name="companyName"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-lg focus:border-indigo-500 focus:ring-indigo-500"
              value={formData.companyName}
              onChange={(e) => handleChange(e, setFormData)}
              maxLength={20}
              required
            />
            {errors.companyName && (
              <p className="mt-1 text-sm text-red-600">{errors.companyName}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-lg focus:border-indigo-500 focus:ring-indigo-500"
              value={formData.password}
              onChange={(e) => handleChange(e, setFormData)}
              required
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">{errors.password}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-lg focus:border-indigo-500 focus:ring-indigo-500"
              value={formData.email}
              onChange={(e) => handleChange(e, setFormData)}
              required
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="companyNumber"
              className="block text-sm font-medium text-gray-700"
            >
              Company Number
            </label>
            <input
              type="text"
              id="companyNumber"
              name="companyNumber"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-lg focus:border-indigo-500 focus:ring-indigo-500"
              value={formData.companyNumber}
              onChange={(e) => handleChange(e, setFormData)}
              required
            />
            {errors.companyNumber && (
              <p className="mt-1 text-sm text-red-600">
                {errors.companyNumber}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="birthDate"
              className="block text-sm font-medium text-gray-700"
            >
              Birth Date
            </label>
            <input
              type="date"
              id="birthDate"
              name="birthDate"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-lg focus:border-indigo-500 focus:ring-indigo-500"
              value={formData.birthDate}
              onChange={(e) => handleChange(e, setFormData)}
              required
            />
            {errors.birthDate && (
              <p className="mt-1 text-sm text-red-600">{errors.birthDate}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="city"
              className="block text-sm font-medium text-gray-700"
            >
              City
            </label>
            <input
              type="text"
              id="city"
              name="city"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-lg focus:border-indigo-500 focus:ring-indigo-500"
              value={formData.city}
              onChange={(e) => handleChange(e, setFormData)}
              required
            />
            {errors.city && (
              <p className="mt-1 text-sm text-red-600">{errors.city}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="country"
              className="block text-sm font-medium text-gray-700"
            >
              Country
            </label>
            <input
              type="text"
              id="country"
              name="country"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-lg focus:border-indigo-500 focus:ring-indigo-500"
              value={formData.country}
              onChange={(e) => handleChange(e, setFormData)}
              required
            />
            {errors.country && (
              <p className="mt-1 text-sm text-red-600">{errors.country}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="street"
              className="block text-sm font-medium text-gray-700"
            >
              Street
            </label>
            <input
              type="text"
              id="street"
              name="street"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-lg focus:border-indigo-500 focus:ring-indigo-500"
              value={formData.street}
              onChange={(e) => handleChange(e, setFormData)}
              required
            />
            {errors.street && (
              <p className="mt-1 text-sm text-red-600">{errors.street}</p>
            )}
          </div>

          <div>
            <button
              type="submit"
              className="w-full py-2 px-4 bg-indigo-600 text-white font-semibold rounded-md shadow-xl hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              Submit
            </button>
          </div>
        </form>

        <NotificationsComponent />
      </div>
    </div>
  );
}
