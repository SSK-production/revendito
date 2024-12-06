"use client";
import { handleChange } from "@/utils/forms/allFunctionsForm"; // Assurez-vous que cette fonction est bien définie
import { handleSubmit } from "@/utils/forms/allFunctionsForm"; // Import de handleSubmit
import { userData } from "@/utils/interfaces/formsInterface"; // L'interface des données du formulaire
import { useState } from "react";
import { useRouter } from "next/navigation";
import DOMPurify from "dompurify"; //sanitize content
import { useNotifications } from "@/components/notifications"; // Import du système de notifications
import countries from 'i18n-iso-countries';
import en from 'i18n-iso-countries/langs/en.json';
countries.registerLocale(en);
export default function FormCompanyRegister() {
  const [formData, setFormData] = useState<userData>({
    username: "",
    password: "",
    firstName: "",
    lastName: "",
    email: "",
    birthDate: "",
    city: "",
    country: "",
  });

  const [errors, setErrors] = useState<Record<string, string | null>>({});
  const router = useRouter();
  const { NotificationsComponent, addNotification } = useNotifications(); // Hook pour les notifications

  const submitHandler = async (data: userData) => {
    // Nettoyage simple au lieu de DOMPurify
    const sanitizedData = {
      ...data,
      username: data.username.trim(),
      password: data.password.trim(),
      firstName: data.firstName.trim(),
      lastName: data.lastName.trim(),
      email: data.email.trim(),
      city: data.city.trim(),
      country: data.country.trim(),
    };
  
    try {
      const response = await fetch("/api/user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(sanitizedData),
      });
  
      const result = await response.json();
  
      if (!response.ok) {
        if (result.error) {
          // Affiche les erreurs du backend
          handleError(result.error.reduce((acc:any, msg:any) => {
            acc[msg.split(" ")[0].toLowerCase()] = msg;
            return acc;
          }, {}));
        } else {
          throw new Error("Failed to register user.");
        }
        return;
      }
  
      addNotification({
        message: "User registered successfully! Redirecting to login...",
        variant: "success",
        duration: 3000,
      });
  
      setTimeout(() => {
        router.push("/login");
      }, 3000);
    } catch (error) {
      console.error(error);
      addNotification({
        message: "An error occurred while registering. Please try again.",
        variant: "error",
        duration: 7000,
      });
    }
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
  const countryOptions = countries.getNames('en', { select: 'official' }); // ou 'fr' pour le français

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100">
      <div className="w-full max-w-md bg-white shadow-md rounded-lg p-8">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Register
        </h1>
        <form
          onSubmit={(e) =>
            handleSubmit(e, formData, submitHandler, "userData", handleError)
          }
          className="space-y-6"
        >
          {/* Username */}
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700"
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={(e) =>
                setFormData({ ...formData, username: e.target.value })
              }
              required
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
            {errors.username && (
              <span className="text-red-500 text-sm">{errors.username}</span>
            )}
          </div>

          {/* Password */}
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
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              required
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
            {errors.password && (
              <span className="text-red-500 text-sm">{errors.password}</span>
            )}
          </div>

          {/* First Name */}
          <div>
            <label
              htmlFor="firstName"
              className="block text-sm font-medium text-gray-700"
            >
              First Name
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={(e) =>
                setFormData({ ...formData, firstName: e.target.value })
              }
              required
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
            {errors.firstName && (
              <span className="text-red-500 text-sm">{errors.firstName}</span>
            )}
          </div>

          {/* Last Name */}
          <div>
            <label
              htmlFor="lastName"
              className="block text-sm font-medium text-gray-700"
            >
              Last Name
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={(e) =>
                setFormData({ ...formData, lastName: e.target.value })
              }
              required
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
            {errors.lastName && (
              <span className="text-red-500 text-sm">{errors.lastName}</span>
            )}
          </div>

          {/* Email */}
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
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
            {errors.email && (
              <span className="text-red-500 text-sm">{errors.email}</span>
            )}
          </div>

          {/* Birth Date */}
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
              value={formData.birthDate}
              onChange={(e) =>
                setFormData({ ...formData, birthDate: e.target.value })
              }
              required
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
            {errors.birthDate && (
              <span className="text-red-500 text-sm">{errors.birthDate}</span>
            )}
          </div>

          {/* City */}
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
              value={formData.city}
              onChange={(e) =>
                setFormData({ ...formData, city: e.target.value })
              }
              required
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
            {errors.city && (
              <span className="text-red-500 text-sm">{errors.city}</span>
            )}
          </div>

          {/* Country */}
          <div>
      <label
        htmlFor="country"
        className="block text-sm font-medium text-gray-700"
      >
        Country
      </label>
      <select
        id="country"
        name="country"
        value={formData.country}
        onChange={(e) => setFormData({ ...formData, country: e.target.value })}
        required
        className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
      >
        <option value="">Select a country</option>
        {Object.entries(countryOptions).map(([code, name]) => (
          <option key={code} value={code}>
            {name}
          </option>
        ))}
      </select>
      {errors.country && (
        <span className="text-red-500 text-sm">{errors.country}</span>
      )}
    </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              className="w-full bg-indigo-500 text-white p-2 rounded-md hover:bg-indigo-600"
            >
              Register
            </button>
          </div>
        </form>
      </div>
      <NotificationsComponent />
    </div>
  );
}
