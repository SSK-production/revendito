"use client";
import { handleChange } from "@/utils/forms/allFunctionsForm"; // Assurez-vous que cette fonction est bien définie
import { handleSubmit } from "@/utils/forms/allFunctionsForm"; // Import de handleSubmit
import { userData } from "@/utils/interfaces/formsInterface"; // L'interface des données du formulaire
import { useState } from "react";
import { useRouter } from "next/navigation";
import DOMPurify from "dompurify"; //sanitze content
import { useNotifications } from "@/components/notifications"; // Import du système de notifications

export default function FormCompanyRegister() {
  // Initialisation de l'état pour les données du formulaire
  const [formData, setFormData] = useState<userData>({
    username: "",
    password: "",
    firstName: "",
    lastName: "",
    email: "",
    birthDate: "",
    city: "",
    country: "",
    profilePicture: null, // Initialiser avec null, car aucun fichier n'est sélectionné par défaut
  });

  // État pour afficher les erreurs de validation
  const [errors, setErrors] = useState<Record<string, string | null>>({});
  const router = useRouter();
  const { NotificationsComponent, addNotification } = useNotifications(); // Hook pour les notifications

  // Fonction de soumission des données après validation
  const submitHandler = (data: userData) => {
    // Désinfecter les données sensibles
    const sanitizedData = {
      ...data,
      username: DOMPurify.sanitize(data.username),
      password: DOMPurify.sanitize(data.password),
      firstName: DOMPurify.sanitize(data.firstName),
      lastName: DOMPurify.sanitize(data.lastName),
      email: DOMPurify.sanitize(data.email),
      city: DOMPurify.sanitize(data.city),
      country: DOMPurify.sanitize(data.country),
    };

    console.log("User Data Submitted:", sanitizedData);

    // Affiche une notification de succès
    addNotification({
      message: "User registered successfully! Redirecting to login...",
      variant: "success",
      duration: 3000, // Durée de la notification
    });

    // Attendre 3 secondes avant de rediriger
    setTimeout(() => {
      router.push("/login"); // Redirection après le délai
    }, 3000); // Délai en millisecondes
  };

  // Fonction pour gérer l'affichage des erreurs de validation
  const handleError = (errors: Record<string, string | null>) => {
    setErrors(errors); // Met à jour l'état avec les erreurs

    // Affiche une notification d'erreur si une validation échoue
    if (Object.keys(errors).length > 0) {
      addNotification({
        message: "Please fix the errors before submitting.",
        variant: "error",
        duration: 7000, // Durée de la notification d'erreur
      });
    }
  };

  return (
    <div>
      <h1>User Register</h1>
      <form
        onSubmit={(e) =>
          handleSubmit(e, formData, submitHandler, "userData", handleError)
        }
      >
        <div>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={(e) =>
              setFormData({ ...formData, username: e.target.value })
            }
            required
          />
          {errors.username && (
            <span style={{ color: "red" }}>{errors.username}</span>
          )}{" "}
          {/* Affichage de l'erreur */}
        </div>

        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            required
          />
          {errors.password && (
            <span style={{ color: "red" }}>{errors.password}</span>
          )}{" "}
          {/* Affichage de l'erreur */}
        </div>

        <div>
          <label htmlFor="firstName">First Name:</label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={(e) =>
              setFormData({ ...formData, firstName: e.target.value })
            }
            required
          />
          {errors.firstName && (
            <span style={{ color: "red" }}>{errors.firstName}</span>
          )}{" "}
          {/* Affichage de l'erreur */}
        </div>

        <div>
          <label htmlFor="lastName">Last Name:</label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={(e) =>
              setFormData({ ...formData, lastName: e.target.value })
            }
            required
          />
          {errors.lastName && (
            <span style={{ color: "red" }}>{errors.lastName}</span>
          )}{" "}
          {/* Affichage de l'erreur */}
        </div>

        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            required
          />
          {errors.email && <span style={{ color: "red" }}>{errors.email}</span>}{" "}
          {/* Affichage de l'erreur */}
        </div>

        <div>
          <label htmlFor="birthDate">Birth Date:</label>
          <input
            type="date"
            id="birthDate"
            name="birthDate"
            value={formData.birthDate}
            onChange={(e) =>
              setFormData({ ...formData, birthDate: e.target.value })
            }
            required
          />
          {errors.birthDate && (
            <span style={{ color: "red" }}>{errors.birthDate}</span>
          )}{" "}
          {/* Affichage de l'erreur */}
        </div>

        <div>
          <label htmlFor="city">City:</label>
          <input
            type="text"
            id="city"
            name="city"
            value={formData.city}
            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
            required
          />
          {errors.city && <span style={{ color: "red" }}>{errors.city}</span>}{" "}
          {/* Affichage de l'erreur */}
        </div>

        <div>
          <label htmlFor="country">Country:</label>
          <input
            type="text"
            id="country"
            name="country"
            value={formData.country}
            onChange={(e) =>
              setFormData({ ...formData, country: e.target.value })
            }
            required
          />
          {errors.country && (
            <span style={{ color: "red" }}>{errors.country}</span>
          )}{" "}
          {/* Affichage de l'erreur */}
        </div>

        <div>
          <label htmlFor="profilePicture">Profile Picture:</label>
          <input
            type="file"
            id="profilePicture"
            name="profilePicture"
            accept="image/png, image/jpeg, image/jpg, image/gif"
            onChange={(e) => handleChange(e, setFormData)} // Utilisation de handleChange pour gérer le fichier
            required
          />
          {errors.profilePicture && (
            <span style={{ color: "red" }}>{errors.profilePicture}</span>
          )}{" "}
          {/* Affichage de l'erreur */}
        </div>

        <div>
          <button type="submit">Submit</button>
        </div>
      </form>

      {/* Composant pour afficher les notifications */}
      <NotificationsComponent />
    </div>
  );
}
