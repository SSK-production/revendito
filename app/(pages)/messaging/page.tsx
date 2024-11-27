"use client";

import { useEffect, useState } from "react";

function MessagingPage() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/check-auth", {
          method: "GET",
          credentials: "include", // Assurez-vous que les cookies sont envoyés avec la requête
        });

        const data = await response.json();

        if (response.ok) {
          setIsAuthenticated(true); // L'utilisateur est authentifié
        } else {
          setIsAuthenticated(false); // L'utilisateur n'est pas authentifié
        }
      } catch (error) {
        console.error("Erreur de vérification de l'authentification:", error);
        setIsAuthenticated(false);
      }
    };

    checkAuth(); // Appel pour vérifier l'authentification
  }, []);

  return (
    <div>
      {isAuthenticated === null ? (
        <p>Chargement...</p> // Affichage pendant la vérification de l'authentification
      ) : isAuthenticated ? (
        <p>Bienvenue sur la page de messagerie !</p>
      ) : (
        <p>Veuillez vous connecter.</p>
      )}
    </div>
  );
}

export default MessagingPage;
