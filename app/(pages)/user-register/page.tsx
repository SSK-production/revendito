"use client";
import { handleChange } from "@/utils/forms/allFunctionsForm"; // Assurez-vous que cette fonction est bien définie
import { handleSubmit } from "@/utils/forms/allFunctionsForm"; // Import de handleSubmit
import { userData } from "@/utils/interfaces/formsInterface"; // L'interface des données du formulaire
import { useState } from "react";
import { useRouter } from "next/navigation";
import DOMPurify from "dompurify"; //sanitze content
import { useNotifications } from "@/components/notifications"; // Import du système de notifications

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
    profilePicture: null, // Initialiser avec null, car aucun fichier n'est sélectionné par défaut
  });

  const [errors, setErrors] = useState<Record<string, string | null>>({});
  const router = useRouter();
  const { NotificationsComponent, addNotification } = useNotifications(); // Hook pour les notifications

  const submitHandler = async (data: userData) => {
    const sanitizedData = {
      ...data,
      username: DOMPurify.sanitize(data.username),
      password: DOMPurify.sanitize(data.password),
      firstName: DOMPurify.sanitize(data.firstName),
      lastName: DOMPurify.sanitize(data.lastName),
      email: DOMPurify.sanitize(data.email),
      city: DOMPurify.sanitize(data.city),
      country: DOMPurify.sanitize(data.country),
    };

    try {
      const formDataToSend = new FormData();

      for (const key in sanitizedData) {
        formDataToSend.append(key, (sanitizedData as any)[key]);
      }

      if (sanitizedData.profilePicture) {
        formDataToSend.append("profilePicture", sanitizedData.profilePicture);
      }

      const response = await fetch("/api/user", {
        method: "POST",
        body: formDataToSend,
      });

      if (!response.ok) {
        throw new Error("Failed to register user.");
      }

      const result = await response.json();
      addNotification({
        message: "User registered successfully! Redirecting to login...",
        variant: "success",
        duration: 3000,
      });

      setTimeout(() => {
        router.push("/login");
      }, 3000);
    } catch (error) {
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

          {/* Other fields */}
          {/* Repeat similar pattern for Last Name, Email, etc. */}
          
          {/* Profile Picture */}
          <div>
            <label
              htmlFor="profilePicture"
              className="block text-sm font-medium text-gray-700"
            >
              Profile Picture
            </label>
            <input
              type="file"
              id="profilePicture"
              name="profilePicture"
              accept="image/png, image/jpeg"
              onChange={(e) => {
                const file = e.target.files ? e.target.files[0] : null;
                setFormData({ ...formData, profilePicture: file });
              }}
              className="mt-1 block w-full text-sm text-gray-900 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
            />
            {errors.profilePicture && (
              <span className="text-red-500 text-sm">
                {errors.profilePicture}
              </span>
            )}
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
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
