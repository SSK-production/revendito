"use client";
import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";

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

  const [emailError, setEmailError] = useState<string>("");

const [showPassword, setShowPassword] = useState(false); // État pour afficher ou masquer le mot de passe
const togglePasswordVisibility = () => {
  setShowPassword(!showPassword); // Inverse l'état actuel
};
const [passwordError, setPasswordError] = useState("");
  const passwordRegex =
    /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).+$/;

  const handleChange = (changeValue: ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = changeValue.target;

    // Vérifie si c'est un champ de type fichier
    if (name === "profilePicture" && files && files[0]) {
      const file = files[0];

        // Vérification de la taille (limite à 5 Mo)
      const maxSize = 5 * 1024 * 1024; // 5 Mo en octets
    if (file.size > maxSize) {
      alert("La taille du fichier ne doit pas dépasser 5 Mo.");
    return;
  }
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
// Vérification de la validité du mot de passe à chaque changement
    if (formData.password === "password") {
      if (!passwordRegex.test(value)) {
        setPasswordError(
          "Le mot de passe doit contenir une majuscule, un chiffre et un caractère spécial."
        );
      } else {
        setPasswordError("");
      }
    }
      // Met à jour l'état avec le fichier
      setFormData({
        ...formData,
        profilePicture: file, // Ajoute l'objet File au state
      });
    } else if (name === "email") {
      // Validation de l'email avec regex
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailRegex.test(value)) {
        setEmailError("L'email doit contenir des lettres, chiffres, et '@'.");
      } else {
        setEmailError(""); // Pas d'erreur
      }
      setFormData({ ...formData, [name]: value });
    } else {
      // Gère les autres types de champs (text, email, etc.)
      setFormData({
        ...formData,
        [name]: value, // Met à jour dynamiquement les autres champs
      });
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Empêche le rechargement de la page

    // Vérifie si des erreurs sont présentes avant l'envoi
    if (emailError) {
      alert("Veuillez corriger les erreurs avant de soumettre.");
      return;
    }

    // Affiche les données du formulaire dans la console
    console.log("Form Data on Submit:", formData);
  };

  useEffect(() => {
    console.clear(); // Efface la console
    console.log("Form Data Updated:", formData);
  }, [formData]);


  return (
    <div>
      <h1>Company Register</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            name="username"
            maxLength={20}
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            id="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
 <span
            onClick={togglePasswordVisibility}
            
          >
            {showPassword ? (
              <img src="/icons/eye-open.svg" alt="Voir le mot de passe" width="24" height="24" />
            ) : (
              <img src="/icons/eye-close.svg" alt="Masquer le mot de passe" width="24" height="24" />
            )}
                    {/* Affichage de l'erreur si le mot de passe ne respecte pas les critères */}
        {passwordError && (
          <p style={{ color: "red", fontSize: "12px" }}>{passwordError}</p>
        )}
          </span>
        </div>
        <div>
          <label htmlFor="firstName">firstName:</label>
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
          <label htmlFor="lastName">lastName:</label>
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
          <label htmlFor="email">Email:</label>
          <input
            type="text"
            name="email"
            id="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          {emailError && <p style={{ color: "red" }}>{emailError}</p>}
        </div>
        <div>
          <label htmlFor="birthDate">birthDate:</label>
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
          <label htmlFor="city">City:</label>
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
          <label htmlFor="country">Country:</label>
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
          <label htmlFor="profilePicture">Profile Picture:</label>
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
          <button type="submit">Submit</button>
        </div>
      </form>
    </div>
  );
}
