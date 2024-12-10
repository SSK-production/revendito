'use client';

import React from 'react';

type ProfileProps = {
  type: 'user' | 'company'; // Définit si le profil est un utilisateur ou une entreprise
  data: UserProfile | CompanyProfile; // Les données à afficher
};

// Types pour les modèles User et Company
interface UserProfile {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  emailVerified: boolean;
  role: string;
  active: boolean;
  idCardVerified: boolean;
  birthDate: string;
  profilePicture?: string;
  city: string;
  country: string;
  createdAt: string;
  updatedAt: string;
  vehicleOffers?: number;
  realEstateOffers?: number;
  commercialOffers?: number;
}

interface CompanyProfile {
  id: string;
  companyName: string;
  email: string;
  emailVerified: boolean;
  role: string;
  active: boolean;
  companyNumber: string;
  birthDate?: string;
  profilePicture?: string;
  city: string;
  country: string;
  street: string;
  createdAt: string;
  updatedAt: string;
  vehicleOffers?: number;
  realEstateOffers?: number;
  commercialOffers?: number;
}

const ProfilePage: React.FC<ProfileProps> = ({ type, data }) => {
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-md">
      {/* En-tête */}
      <div className="flex items-center space-x-4">
        {data.profilePicture ? (
          <img
            src={data.profilePicture}
            alt="Profile"
            className="w-20 h-20 rounded-full"
          />
        ) : (
          <div className="w-20 h-20 bg-gray-300 rounded-full flex items-center justify-center text-white text-lg">
            {type === 'user' ? data.username.charAt(0) : data.companyName.charAt(0)}
          </div>
        )}
        <div>
          <h1 className="text-2xl font-semibold">
            {type === 'user' ? `${data.firstName} ${data.lastName}` : data.companyName}
          </h1>
          <p className="text-gray-500">{type === 'user' ? data.username : data.email}</p>
        </div>
      </div>

      {/* Informations générales */}
      <div className="mt-6 space-y-4">
        <h2 className="text-lg font-semibold text-gray-700">Informations Générales</h2>
        <div className="grid grid-cols-2 gap-4">
          {type === 'user' ? (
            <>
              <Info label="Prénom" value={data.firstName} />
              <Info label="Nom" value={data.lastName} />
              <Info label="Email" value={data.email} />
              <Info label="Email Vérifié" value={data.emailVerified ? '✔️ Oui' : '❌ Non'} />
              <Info label="Rôle" value={data.role} />
              <Info label="Statut Actif" value={data.active ? '✔️ Oui' : '❌ Non'} />
              <Info label="Carte d'identité Vérifiée" value={data.idCardVerified ? '✔️ Oui' : '❌ Non'} />
              <Info label="Date de Naissance" value={new Date(data.birthDate).toLocaleDateString()} />
            </>
          ) : (
            <>
              <Info label="Nom de l'Entreprise" value={data.companyName} />
              <Info label="Email" value={data.email} />
              <Info label="Email Vérifié" value={data.emailVerified ? '✔️ Oui' : '❌ Non'} />
              <Info label="Numéro d'Enregistrement" value={data.companyNumber} />
              <Info label="Rôle" value={data.role} />
              <Info label="Statut Actif" value={data.active ? '✔️ Oui' : '❌ Non'} />
              <Info label="Date d'Enregistrement" value={data.birthDate ? new Date(data.birthDate).toLocaleDateString() : 'Non spécifié'} />
            </>
          )}
        </div>
      </div>

      {/* Localisation */}
      <div className="mt-6 space-y-4">
        <h2 className="text-lg font-semibold text-gray-700">Localisation</h2>
        <div className="grid grid-cols-2 gap-4">
          <Info label="Ville" value={data.city} />
          <Info label="Pays" value={data.country} />
          {type === 'company' && <Info label="Rue" value={data.street} />}
        </div>
      </div>

      {/* Historique */}
      <div className="mt-6 space-y-4">
        <h2 className="text-lg font-semibold text-gray-700">Historique</h2>
        <div className="grid grid-cols-2 gap-4">
          <Info label="Créé le" value={new Date(data.createdAt).toLocaleDateString()} />
          <Info label="Dernière Mise à Jour" value={new Date(data.updatedAt).toLocaleDateString()} />
        </div>
      </div>

      {/* Offres associées */}
      <div className="mt-6 space-y-4">
        <h2 className="text-lg font-semibold text-gray-700">Offres Associées</h2>
        <div className="grid grid-cols-3 gap-4">
          <Info label="Offres de Véhicules" value={data.vehicleOffers?.toString() || '0'} />
          <Info label="Offres Immobilières" value={data.realEstateOffers?.toString() || '0'} />
          <Info label="Offres Commerciales" value={data.commercialOffers?.toString() || '0'} />
        </div>
      </div>
    </div>
  );
};

// Composant utilitaire pour afficher une ligne d'information
const Info: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div>
    <p className="text-sm text-gray-500">{label}</p>
    <p className="font-medium text-gray-900">{value}</p>
  </div>
);

export default ProfilePage;
