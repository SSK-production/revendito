"use client";

import { useEffect, useState, ChangeEvent, FormEvent } from "react";

type FormData = {
  senderId: string;
  receiverId: string;
  content: string;
  offerId: string | null;
};

type ApiResponse = {
  message?: string;
  email?: string;
  error?: string;
};

export default function TestApi() {
  const [result, setResult] = useState<ApiResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({
    senderId: "",
    receiverId: "",
    content: "",
    offerId: null,
  });

  // Vérification de la session utilisateur
  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await fetch("/api/auth", {
          method: "GET",
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("Utilisateur non authentifié");
        }

        const data: ApiResponse = await response.json();
        console.log("Utilisateur authentifié:", data.email);
      } catch (err) {
        console.error("Erreur de vérification de session:", err);
        setError("Utilisateur non authentifié");
      }
    };

    checkSession();
  }, []);

  // Gestion de la requête GET pour récupérer les messages
  const handleGetRequest = async () => {
    try {
      setError(null); // Réinitialiser les erreurs
      setResult(null); // Réinitialiser les résultats

      const response = await fetch("/api/message", {
        method: "GET",
        credentials: "include", // Cela envoie les cookies avec la requête
      });

      if (!response.ok) {
        throw new Error(
          `Erreur HTTP ${response.status}: ${response.statusText}`
        );
      }

      const data: ApiResponse = await response.json();
      setResult(data);
    } catch (err) {
      console.error("Erreur lors de la requête GET:", err);
      setError(err instanceof Error ? err.message : "Erreur inconnue");
    }
  };

  // Gestion de la requête POST pour envoyer un message
  const handlePostRequest = async (e: FormEvent) => {
    e.preventDefault();
    try {
      setError(null); // Réinitialiser les erreurs
      setResult(null); // Réinitialiser les résultats

      // Validation côté front pour s'assurer que les IDs sont remplis
      if (!formData.senderId || !formData.receiverId || !formData.content) {
        setError("Tous les champs sont requis.");
        return;
      }

      // Validation de offerId si présent
      if (formData.offerId && isNaN(Number(formData.offerId))) {
        setError("L'Offer ID doit être un nombre.");
        return;
      }

      const response = await fetch("/api/message", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Envoyer les cookies avec la requête
        body: JSON.stringify({
          ...formData,
          offerId: formData.offerId ? Number(formData.offerId) : null,
        }),
      });

      if (!response.ok) {
        throw new Error(
          `Erreur HTTP ${response.status}: ${response.statusText}`
        );
      }

      const data: ApiResponse = await response.json();
      setResult(data);
    } catch (err) {
      console.error("Erreur lors de la requête POST:", err);
      setError(
        err instanceof Error ? err.message : "Erreur inconnue lors de l'envoi."
      );
    }
  };

  // Gestion des changements dans le formulaire
  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>Tester l API</h1>

      {/* Bouton pour GET */}
      <button
        onClick={handleGetRequest}
        style={{
          padding: "10px 20px",
          fontSize: "16px",
          backgroundColor: "#0070f3",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
          marginBottom: "20px",
        }}
      >
        Envoyer une requête GET
      </button>

      <h2>Envoyer une requête POST</h2>

      {/* Formulaire pour POST */}
      <form
        onSubmit={handlePostRequest}
        style={{ display: "flex", flexDirection: "column", maxWidth: "400px" }}
      >
        <label style={{ marginBottom: "10px" }}>
          Sender ID :
          <input
            type="text"
            name="senderId"
            value={formData.senderId}
            onChange={handleInputChange}
            style={{
              padding: "8px",
              fontSize: "14px",
              marginTop: "5px",
              marginBottom: "10px",
              width: "100%",
              border: "1px solid #ccc",
              borderRadius: "5px",
            }}
          />
        </label>

        <label style={{ marginBottom: "10px" }}>
          Receiver ID :
          <input
            type="text"
            name="receiverId"
            value={formData.receiverId}
            onChange={handleInputChange}
            style={{
              padding: "8px",
              fontSize: "14px",
              marginTop: "5px",
              marginBottom: "10px",
              width: "100%",
              border: "1px solid #ccc",
              borderRadius: "5px",
            }}
          />
        </label>

        <label style={{ marginBottom: "10px" }}>
          Content :
          <textarea
            name="content"
            value={formData.content}
            onChange={handleInputChange}
            style={{
              padding: "8px",
              fontSize: "14px",
              marginTop: "5px",
              marginBottom: "10px",
              width: "100%",
              height: "80px",
              border: "1px solid #ccc",
              borderRadius: "5px",
            }}
          />
        </label>

        <label style={{ marginBottom: "10px" }}>
          Offer ID (optionnel) :
          <input
            type="text"
            name="offerId"
            value={formData.offerId ?? ""}
            onChange={handleInputChange}
            style={{
              padding: "8px",
              fontSize: "14px",
              marginTop: "5px",
              marginBottom: "10px",
              width: "100%",
              border: "1px solid #ccc",
              borderRadius: "5px",
            }}
          />
        </label>

        <button
          type="submit"
          style={{
            padding: "10px 20px",
            fontSize: "16px",
            backgroundColor: "#0070f3",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Envoyer la requête POST
        </button>
      </form>

      {/* Affichage des erreurs et résultats */}
      {error && <p style={{ color: "red", marginTop: "20px" }}>{error}</p>}
      {result && (
        <div
          style={{
            marginTop: "20px",
            padding: "10px",
            backgroundColor: "#e0f7e0", // Fond vert pour le succès
            borderRadius: "5px",
          }}
        >
          <p style={{ color: "green" }}>Message envoyé avec succès!</p>
          <pre>{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
