"use client";
import { useState } from "react";

export default function TestApi() {
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleGetRequest = async () => {
    try {
      setError(null); // Réinitialiser les erreurs
      setResult(null); // Réinitialiser les résultats

      const response = await fetch("/api/message", {
        // Remplacez par votre endpoint
        method: "GET",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(
          `Erreur HTTP ${response.status}: ${response.statusText}`
        );
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      console.error("Erreur lors de la requête:", err);
      setError(err.message);
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>Tester l'API GET</h1>
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
        }}
      >
        Envoyer une requête GET
      </button>

      <h2>Résultat :</h2>
      {result && (
        <pre style={{ backgroundColor: "black", padding: "10px" }}>
          {JSON.stringify(result, null, 2)}
        </pre>
      )}

      {error && <p style={{ color: "red" }}>Erreur : {error}</p>}
    </div>
  );
}
