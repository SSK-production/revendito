"use client";
import React, { useState, ChangeEvent, FormEvent } from "react";

// Définir un type pour les données du formulaire
interface FormData {
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  email: string;
  birthDate: string;
  city: string;
  country: string;
  profilePicture: File;
}

export default function FormCompanyRegister() {
  const [formData, setFormData] = useState<FormData>({
    username: "",
    password: "",
    firstName: "",
    lastName: "",
    email: "",
    birthDate: "",
    city: "",
    country: "",
    profilePicture: new File([], "default"), // Fournir une valeur par défaut valide
  });

  const handleChange = (changeValue: ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = changeValue.target;

    // Vérifie si c'est un champ de type fichier
    if (name === "profilePicture" && files && files[0]) {
      const file = files[0];

      // Vérifie le type MIME
      if (
        !["image/png", "image/jpeg", "image/jpg", "image/gif"].includes(
          file.type
        )
      ) {
        alert(
          "Veuillez sélectionner un fichier image valide (PNG, JPEG, JPG, GIF)."
        );
        return;
      }

      // Met à jour l'état avec le fichier
      setFormData({
        ...formData,
        profilePicture: file, // Ajoute l'objet File au state
      });
    } else {
      // Gère les autres types de champs (text, email, etc.)
      setFormData({
        ...formData,
        [name]: value, // Met à jour dynamiquement les autres champs
      });
    }
  };
  return (
    <div>
      <h1>Company Register</h1>
      <form action="#">
        <div>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="text"
            name="password"
            id="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="firstName">firstName</label>
          <input
            type="text"
            name="firstName"
            id="firstName"
            value={formData.firstName}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="lastName">lastName</label>
          <input
            type="text"
            name="lastName"
            id="lastName"
            value={formData.lastName}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="email">email</label>
          <input
            type="text"
            name="email"
            id="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="birthDate">birthDate</label>
          <input
            type="date"
            name="birthDate"
            id="birthDate"
            value={formData.birthDate}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="city">city</label>
          <input
            type="text"
            name="city"
            id="city"
            value={formData.city}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="country">country</label>
          <input
            type="text"
            name="country"
            id="country"
            value={formData.country}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="profilePicture">profile Picture</label>
          <input
            type="file"
            name="profilePicture"
            id="profilePicture"
            accept="image/png, image/jpeg, image/jpg, image/gif"
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <button>Submit</button>
        </div>
      </form>
    </div>
  );
}
