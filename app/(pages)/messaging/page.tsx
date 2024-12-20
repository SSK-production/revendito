"use client"
import { useState } from "react";
import { useForm } from "react-hook-form";

export default function SendMessage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [serverError, setServerError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const onSubmit = async (data) => {
    try {
      setServerError("");
      setSuccessMessage("");

      const response = await fetch("/api/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const { error } = await response.json();
        setServerError(
          Array.isArray(error) ? error.join(", ") : error || "Erreur inconnue"
        );
        return;
      }

      const { newMessage } = await response.json();
      setSuccessMessage("Message envoyé avec succès !");
    } catch (err) {
      setServerError("Une erreur s'est produite : " + err.message);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white shadow-md rounded px-8 py-6">
      <h1 className="text-xl font-bold mb-4">Envoyer un message</h1>
      {serverError && (
        <div className="text-red-500 mb-4">
          <strong>Erreur : </strong>
          {serverError}
        </div>
      )}
      {successMessage && (
        <div className="text-green-500 mb-4">{successMessage}</div>
      )}
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Contenu */}
        <div className="mb-4">
          <label className="block text-gray-700">Contenu :</label>
          <textarea
            {...register("content", {
              required: "Le contenu est obligatoire.",
              minLength: {
                value: 5,
                message: "Le contenu doit contenir au moins 5 caractères.",
              },
            })}
            className={`w-full px-3 py-2 border ${
              errors.content ? "border-red-500" : "border-gray-300"
            } rounded`}
            rows="4"
          />
          {errors.content && (
            <p className="text-red-500 text-sm mt-1">{errors.content.message}</p>
          )}
        </div>

        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Envoyer
        </button>
      </form>
    </div>
  );
}
