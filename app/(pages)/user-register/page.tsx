"use client";

import { useState } from "react";
import axios from "axios";

// Type des données du formulaire
interface FormData {
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  email: string;
  birthDate: string;
  city: string;
  country: string;
}

export default function RegisterForm() {
  const [formData, setFormData] = useState<FormData>({
    username: "",
    password: "",
    firstName: "",
    lastName: "",
    email: "",
    birthDate: "",
    city: "",
    country: "",
  });

  const [errors, setErrors] = useState<string[]>([]);
  const [success, setSuccess] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors([]);
    setSuccess(null);

    try {
      const response = await axios.post("/api/user", formData); // URL à adapter si nécessaire
      setSuccess("User registered successfully!");
    } catch (err: any) {
      if (err.response?.data?.error) {
        if (Array.isArray(err.response.data.error)) {
          setErrors(err.response.data.error); // Erreurs de validation
        } else {
          setErrors([err.response.data.error]); // Erreur unique
        }
      } else {
        setErrors(["An unexpected error occurred."]);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-gray-700 mb-6 text-center">
          Register
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          {[
            { label: "Username", name: "username", type: "text" },
            { label: "Password", name: "password", type: "password" },
            { label: "First Name", name: "firstName", type: "text" },
            { label: "Last Name", name: "lastName", type: "text" },
            { label: "Email", name: "email", type: "email" },
            { label: "Birth Date", name: "birthDate", type: "date" },
            { label: "City", name: "city", type: "text" },
            { label: "Country", name: "country", type: "text" },
          ].map(({ label, name, type }) => (
            <div key={name} className="flex flex-col">
              <label htmlFor={name} className="text-sm font-medium text-gray-600">
                {label}
              </label>
              <input
                type={type}
                id={name}
                name={name}
                value={formData[name as keyof FormData]}
                onChange={handleChange}
                className="mt-1 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
                required
              />
            </div>
          ))}
          {errors.length > 0 && (
            <div className="bg-red-100 text-red-700 p-3 rounded">
              <ul className="list-disc pl-5 space-y-1">
                {errors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
          )}
          {success && (
            <div className="bg-green-100 text-green-700 p-3 rounded text-center">
              {success}
            </div>
          )}
          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded transition duration-200"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
}
