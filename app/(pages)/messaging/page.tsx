"use client";

import { useEffect, useState, ChangeEvent, FormEvent } from "react";

type FormData = {
  senderId: string;
  receiverId: string; // receiverId est maintenant nécessaire
  content: string;
  offerId: string | null;
};

type ApiResponse = {
  message?: object;
  error?: string;
};

export default function TestApi() {
  const [result, setResult] = useState<ApiResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({
    senderId: "",
    receiverId: "", // receiverId est maintenant bien initialisé
    content: "",
    offerId: null,
  });

  // Vérification de session utilisateur
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
      } catch (err: unknown) {
        setError("Utilisateur non authentifié");
      }
    };

    checkSession();
  }, []);

  // Gestion de la requête GET
  const handleGetRequest = async () => {
    try {
      setError(null);
      setResult(null);

      const response = await fetch("/api/messageJordan", {
        method: "GET",
        credentials: "include",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Erreur lors de la requête GET.");
      }

      const data: ApiResponse = await response.json();
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue.");
    }
  };

  // Gestion de la requête POST
  const handlePostRequest = async (e: FormEvent) => {
    e.preventDefault();

    // Validation des champs requis
    if (!formData.senderId || !formData.receiverId || !formData.content) {
      setError("Tous les champs sont requis.");
      return;
    }

    try {
      setError(null);
      setResult(null);

      // Remplacement de `receiverId` par `receiverUserId` pour la requête POST
      const response = await fetch("/api/messageJordan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          senderUserId: formData.senderId, // Envoi de senderId comme senderUserId
          receiverUserId: formData.receiverId, // Envoi de receiverId comme receiverUserId
          content: formData.content,
          offerId: formData.offerId ? Number(formData.offerId) : null,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Erreur lors de la requête.");
      }

      const data: ApiResponse = await response.json();
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue.");
    }
  };

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
    <div
      style={{
        padding: "20px",
        fontFamily: "'Roboto', sans-serif",
        maxWidth: "800px",
        margin: "0 auto",
        backgroundColor: "#f9f9f9",
        borderRadius: "10px",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
      }}
    >
      <h1
        style={{
          color: "#333",
          fontSize: "2rem",
          fontWeight: "bold",
          marginBottom: "20px",
          textAlign: "center",
        }}
      >
        Tester l'API
      </h1>

      {/* Bouton GET */}
      <button
        onClick={handleGetRequest}
        style={{
          padding: "12px 24px",
          fontSize: "16px",
          backgroundColor: "#0070f3",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
          display: "block",
          margin: "0 auto 30px auto",
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
          transition: "background-color 0.3s",
        }}
        onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#005bb5")}
        onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#0070f3")}
      >
        Envoyer une requête GET
      </button>

      {/* Formulaire POST */}
      <h2
        style={{
          fontSize: "1.5rem",
          color: "#444",
          fontWeight: "600",
          marginBottom: "10px",
          textAlign: "center",
        }}
      >
        Envoyer une requête POST
      </h2>
      <form
        onSubmit={handlePostRequest}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "15px",
          backgroundColor: "#fff",
          padding: "20px",
          borderRadius: "10px",
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
        }}
      >
        <label style={{ fontWeight: "500", fontSize: "14px", color: "#555" }}>
          Sender ID:
          <input
            type="text"
            name="senderId"
            value={formData.senderId}
            onChange={handleInputChange}
            style={{
              width: "100%",
              padding: "10px",
              marginTop: "5px",
              border: "1px solid #ddd",
              borderRadius: "5px",
              fontSize: "14px",
            }}
          />
        </label>

        <label style={{ fontWeight: "500", fontSize: "14px", color: "#555" }}>
          Receiver ID:
          <input
            type="text"
            name="receiverId"
            value={formData.receiverId}
            onChange={handleInputChange}
            style={{
              width: "100%",
              padding: "10px",
              marginTop: "5px",
              border: "1px solid #ddd",
              borderRadius: "5px",
              fontSize: "14px",
            }}
          />
        </label>

        <label style={{ fontWeight: "500", fontSize: "14px", color: "#555" }}>
          Content:
          <textarea
            name="content"
            value={formData.content}
            onChange={handleInputChange}
            style={{
              width: "100%",
              height: "100px",
              padding: "10px",
              marginTop: "5px",
              border: "1px solid #ddd",
              borderRadius: "5px",
              fontSize: "14px",
            }}
          />
        </label>

        <label style={{ fontWeight: "500", fontSize: "14px", color: "#555" }}>
          Offer ID (optionnel):
          <input
            type="text"
            name="offerId"
            value={formData.offerId ?? ""}
            onChange={handleInputChange}
            style={{
              width: "100%",
              padding: "10px",
              marginTop: "5px",
              border: "1px solid #ddd",
              borderRadius: "5px",
              fontSize: "14px",
            }}
          />
        </label>

        <button
          type="submit"
          style={{
            padding: "12px 24px",
            fontSize: "16px",
            backgroundColor: "#0070f3",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            marginTop: "10px",
            alignSelf: "center",
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
            transition: "background-color 0.3s",
          }}
          onMouseOver={(e) =>
            (e.currentTarget.style.backgroundColor = "#005bb5")
          }
          onMouseOut={(e) =>
            (e.currentTarget.style.backgroundColor = "#0070f3")
          }
        >
          Envoyer
        </button>
      </form>

      {/* Gestion des erreurs et résultats */}
      {error && (
        <p
          style={{
            marginTop: "20px",
            color: "red",
            fontWeight: "bold",
            textAlign: "center",
          }}
        >
          {error}
        </p>
      )}
      {result && (
        <div
          style={{
            marginTop: "20px",
            padding: "15px",
            backgroundColor: "#e6f4ea",
            border: "1px solid #d4edda",
            borderRadius: "5px",
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
          }}
        >
          <p style={{ color: "#155724", fontWeight: "600" }}>
            Requête réussie !
          </p>
          <pre
            style={{
              backgroundColor: "#f8f9fa",
              padding: "10px",
              borderRadius: "5px",
              overflow: "auto",
              fontSize: "14px",
            }}
          >
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
