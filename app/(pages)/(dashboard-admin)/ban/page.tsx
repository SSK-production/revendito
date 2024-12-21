"use client";
import React, { useState } from "react";

// Définir le type de données pour la requête de bannissement
interface BanRequest {
  id: string;
  username: string;
  type: "user" | "company";
  reason: string[];
  bannTitle: object; // BannTitle est un objet JSON
  duration: number; // Durée en jours
}

const BanUserForm: React.FC = () => {
  const [id, setId] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [type, setType] = useState<"user" | "company">("user");
  const [reason, setReason] = useState<string>("");
  const [bannTitle, setBannTitle] = useState<{ title: string; description: string }>({
    title: "",
    description: "",
  });
  const [duration, setDuration] = useState<number>(1);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");

  // Fonction pour obtenir le token d'accès du cookie
  const getAccessToken = (): string | null => {
    const cookie = document.cookie
      .split(";")
      .find((cookie) => cookie.trim().startsWith("access_token="));
    if (cookie) {
      return cookie.split("=")[1];
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Vérification de la validité des champs
    if (!id || !username || !reason || !bannTitle.title || duration <= 0) {
      setErrorMessage("Tous les champs sont requis et la durée doit être positive.");
      return;
    }

    // Préparer les données à envoyer
    const banData: BanRequest = {
      id,
      username,
      type,
      reason: [reason],
      bannTitle: bannTitle, // BannTitle est un objet JSON
      duration,
    };

    const accessToken = getAccessToken(); // Obtenir le token d'accès
    if (!accessToken) {
      setErrorMessage("Accès non autorisé. Veuillez vous connecter.");
      return;
    }

    try {
      // Envoi de la requête POST à l'API
      const response = await fetch("/api/bans", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${accessToken}`, // Ajouter le token d'accès dans les en-têtes
        },
        body: JSON.stringify(banData),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage("Bannissement appliqué avec succès.");
        setErrorMessage("");
      } else {
        setErrorMessage(data.error || "Erreur inconnue.");
        setSuccessMessage("");
      }
    } catch (error) {
      console.error("Erreur lors de la requête:", error);
      setErrorMessage("Erreur serveur, veuillez réessayer plus tard.");
      setSuccessMessage("");
    }
  };

  return (
    <div>
      <h2>Bannir un utilisateur ou une entreprise</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="id">ID de l'utilisateur (UUID):</label>
          <input
            type="text"
            id="id"
            value={id}
            onChange={(e) => setId(e.target.value)}
            placeholder="Entrez l'ID de l'utilisateur"
            required
          />
        </div>

        <div>
          <label htmlFor="username">Nom d'utilisateur:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Entrez le nom d'utilisateur"
            required
          />
        </div>

        <div>
          <label htmlFor="type">Type:</label>
          <select
            id="type"
            value={type}
            onChange={(e) => setType(e.target.value as "user" | "company")}
            required
          >
            <option value="user">Utilisateur</option>
            <option value="company">Entreprise</option>
          </select>
        </div>

        <div>
          <label htmlFor="reason">Raison du bannissement:</label>
          <textarea
            id="reason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Entrez la raison du bannissement"
            required
          />
        </div>

        <div>
          <label htmlFor="bannTitle">Titre du bannissement:</label>
          <input
            type="text"
            id="bannTitle"
            value={bannTitle.title}
            onChange={(e) =>
              setBannTitle((prev) => ({ ...prev, title: e.target.value }))
            }
            placeholder="Entrez le titre du bannissement"
            required
          />
        </div>

        <div>
          <label htmlFor="bannDescription">Description du bannissement:</label>
          <textarea
            id="bannDescription"
            value={bannTitle.description}
            onChange={(e) =>
              setBannTitle((prev) => ({ ...prev, description: e.target.value }))
            }
            placeholder="Entrez la description du bannissement"
          />
        </div>

        <div>
          <label htmlFor="duration">Durée du bannissement (en jours):</label>
          <input
            type="number"
            id="duration"
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
            min="1"
            required
          />
        </div>

        <button type="submit">Bannir</button>
      </form>

      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
      {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
    </div>
  );
};

export default BanUserForm;
