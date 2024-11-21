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
  const { NotificationsComponent, addNotification } = useNotifications(); // Hook pour les notifications

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

    console.log("Company Data Submitted:", sanitizedData);

    // Affiche une notification de succès
    addNotification({
      message: "Company registered successfully! Redirecting to login...",
      variant: "success",
      duration: 3000, // Durée cohérente avec le délai
    });

    // Attendre 3 secondes avant de rediriger
    setTimeout(() => {
      router.push("/login"); // Redirection après le délai
    }, 3000); // Délai en millisecondes
  };

  const handleError = (errors: Record<string, string | null>) => {
    setErrors(errors);

    // Affiche une notification d'erreur si une validation échoue
    if (Object.keys(errors).length > 0) {
      addNotification({
        message: "Please fix the errors before submitting.",
        variant: "error",
        duration: 7000,
      });
    }
  };

  return (
    <div>
      <h1>Company Register</h1>
      <form
        onSubmit={(e) =>
          handleSubmit(e, formData, submitHandler, "companyData", handleError)
        }
      >
        <div>
          <label htmlFor="companyName">Company Name:</label>
          <input
            type="text"
            id="companyName"
            name="companyName"
            value={formData.companyName}
            onChange={(e) => handleChange(e, setFormData)}
            maxLength={20}
            required
          />
          {errors.companyName && <span>{errors.companyName}</span>}
        </div>

        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={(e) => handleChange(e, setFormData)}
            required
          />
          {errors.password && <span>{errors.password}</span>}
        </div>

        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={(e) => handleChange(e, setFormData)}
            required
          />
          {errors.email && <span>{errors.email}</span>}
        </div>

        <div>
          <label htmlFor="companyNumber">Company Number:</label>
          <input
            type="text"
            id="companyNumber"
            name="companyNumber"
            value={formData.companyNumber}
            onChange={(e) => handleChange(e, setFormData)}
            required
          />
          {errors.companyNumber && <span>{errors.companyNumber}</span>}
        </div>

        <div>
          <label htmlFor="birthDate">Birth Date:</label>
          <input
            type="date"
            id="birthDate"
            name="birthDate"
            value={formData.birthDate}
            onChange={(e) => handleChange(e, setFormData)}
            required
          />
          {errors.birthDate && <span>{errors.birthDate}</span>}
        </div>

        <div>
          <label htmlFor="city">City:</label>
          <input
            type="text"
            id="city"
            name="city"
            value={formData.city}
            onChange={(e) => handleChange(e, setFormData)}
            required
          />
          {errors.city && <span>{errors.city}</span>}
        </div>

        <div>
          <label htmlFor="country">Country:</label>
          <input
            type="text"
            id="country"
            name="country"
            value={formData.country}
            onChange={(e) => handleChange(e, setFormData)}
            required
          />
          {errors.country && <span>{errors.country}</span>}
        </div>

        <div>
          <label htmlFor="street">Street:</label>
          <input
            type="text"
            id="street"
            name="street"
            value={formData.street}
            onChange={(e) => handleChange(e, setFormData)}
            required
          />
          {errors.street && <span>{errors.street}</span>}
        </div>

        <div>
          <button type="submit">Submit</button>
        </div>
      </form>

      {/* Composant pour afficher les notifications */}
      <NotificationsComponent />
    </div>
  );
}
