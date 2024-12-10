'use client';

import { useSearchParams } from "next/navigation";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Image from "next/image";

interface ProfileData {
  id?: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  companyName?: string;
  role: string;
  email: string;
  emailVerified: boolean;
  profilePicture?: string;
  active: boolean;
  city: string;
  country: string;
  street?: string;
  birthDate?: string;
  idCardVerified?: boolean;
  companyNumber?: string;
  createdAt: string;
  updatedAt: string;
  vehicleOffers?: number;
  realEstateOffers?: number;
  commercialOffers?: number;
}

export default function ProfilePage() {
  const searchParams = useSearchParams();
  const user = searchParams.get("user");
  const role = searchParams.get("role");

  const [data, setData] = useState<ProfileData | null>(null);
  const [isLogin, setIsLogin] = useState<boolean | null>(false);
  const [userId, setUserId] = useState<string | null>(null);

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!user || !role) {
        setError('Paramètres manquants : user et role sont obligatoires.');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        const response = await axios.get<{ data: ProfileData }>('/api/profil', {
          params: { user, role },
        });

        setData(response.data.data);
      } catch (err) {
        setError('Erreur lors de la récupération des données.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, role]);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/auth", {
          method: "GET",
          credentials: "include",
        });

        const data = await response.json();

        if (response.status === 200) {
          setIsLogin(true);
          setUserId(data.id);
        } else {
          setIsLogin(false);
        }
      } catch (error) {
        console.error("Error checking authentication:", error);
        setIsLogin(false);
      }
    };

    checkAuth();
  }, []);

  const handleUpdatePhoto = () => {
    console.log("Mettre à jour la photo de profil");
    // Ajoutez la logique ici pour ouvrir un formulaire de mise à jour de la photo de profil
  };

  const handleUpdateProfile = () => {
    console.log("Mettre à jour les données du profil");
    // Ajoutez la logique ici pour ouvrir un formulaire de mise à jour des données du profil
  };

  if (loading) return <div className="text-center mt-10">Chargement...</div>;
  if (error) return <div className="text-center mt-10 text-red-500">Erreur : {error}</div>;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-gray-100 shadow-md rounded-md">
      {data && (
        <>
          {/* En-tête */}
          <div className="flex items-center space-x-6 mb-6">
            {data.profilePicture ? (
              <Image
                src={data.profilePicture}
                width={80}
                height={80}
                alt="Photo de profil"
                className="w-20 h-20 rounded-full"
              />
            ) : (
              <div className="w-20 h-20 bg-gray-300 rounded-full flex items-center justify-center text-xl font-bold text-gray-700">
                {data.username?.charAt(0) || 'P'}
              </div>
            )}
            <div>
              <h1 className="text-2xl font-semibold text-orange-700">
                {data.firstName && data.lastName
                  ? `${data.firstName} ${data.lastName}`
                  : data.companyName || data.username || "Utilisateur"}
              </h1>
              <p className="text-gray-500">{data.role}</p>
            </div>
          </div>

          {/* Boutons d'action pour le propriétaire */}
          {isLogin && userId === data.id && (
            <div className="flex space-x-4 mb-6">
              <button
                onClick={handleUpdatePhoto}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
              >
                Modifier la photo
              </button>
              <button
                onClick={handleUpdateProfile}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
              >
                Modifier le profil
              </button>
            </div>
          )}

          {/* Informations générales */}
          <div className="bg-white p-4 rounded-md shadow-sm mb-6">
            <h2 className="text-lg font-medium text-gray-700 mb-3">Informations Générales</h2>
            <div className="space-y-2 text-gray-600">
              <p><strong>Email :</strong> {data.email}</p>
              <p><strong>Email vérifié :</strong> {data.emailVerified ? "Oui" : "Non"}</p>
              <p><strong>Statut :</strong> {data.active ? "Actif" : "Inactif"}</p>
              {data.birthDate && <p><strong>Date de Naissance :</strong> {new Date(data.birthDate).toLocaleDateString()}</p>}
              {data.idCardVerified !== undefined && (
                <p><strong>Carte d'identité vérifiée :</strong> {data.idCardVerified ? "Oui" : "Non"}</p>
              )}
              {data.companyNumber && <p><strong>Numéro d'Entreprise :</strong> {data.companyNumber}</p>}
            </div>
          </div>

          {/* Localisation */}
          <div className="bg-white p-4 rounded-md shadow-sm mb-6">
            <h2 className="text-lg font-medium text-gray-700 mb-3">Localisation</h2>
            <div className="space-y-2 text-gray-600">
              <p><strong>Ville :</strong> {data.city}</p>
              <p><strong>Pays :</strong> {data.country}</p>
              {data.street && <p><strong>Rue :</strong> {data.street}</p>}
            </div>
          </div>

          {/* Historique */}
          <div className="bg-white p-4 rounded-md shadow-sm">
            <h2 className="text-lg font-medium text-gray-700 mb-3">Historique</h2>
            <div className="space-y-2 text-gray-600">
              <p><strong>Compte créé le :</strong> {new Date(data.createdAt).toLocaleDateString()}</p>
              {isLogin && userId === data.id && (
                <p><strong>Dernière mise à jour :</strong> {new Date(data.updatedAt).toLocaleDateString()}</p>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
