import { Dispatch, SetStateAction } from "react";
import { validateFormData } from "./validationsForms";

// handleChange accepte tout type d'objet, donc il peut être utilisé pour différents types
export const handleChange = <T>(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    setFormData: Dispatch<SetStateAction<T>>  // Utilisation d'un type générique
) => {
    const { name, value } = e.target;

    // Vérifie si l'élément est un input de type "file"
    if (e.target instanceof HTMLInputElement && e.target.type === "file") {
        const files = (e.target as HTMLInputElement).files;  // Cast explicite pour accéder à "files"

        if (files && files.length > 0) {
            // Si des fichiers sont présents, on les ajoute dans le state
            setFormData((prevData) => ({
                ...prevData,
                [name]: files[0],  // Stocke le premier fichier sélectionné
            }));
        }
    } else {
        // Sinon, on gère les champs classiques (texte, email, etc.)
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,  // Stocke la valeur sous forme de chaîne de caractères
        }));
    }
};


export const handleSubmit = <T extends object>(
    e: React.FormEvent,
    formData: T,
    callback: (data: T) => void,
    schemaName: string,
    handleError: (errors: Record<string, string | null>) => void
) => {
    e.preventDefault();

    // Validation des données du formulaire
    const errors = validateFormData(formData, schemaName);

    // Si des erreurs sont trouvées, on appelle la fonction handleError pour afficher les erreurs
    const hasErrors = Object.values(errors).some(error => error !== null);
    if (hasErrors) {
        handleError(errors);
        return; // Empêche la soumission si des erreurs existent
    }

    // Si aucune erreur, on appelle le callback pour soumettre les données
    callback(formData);
};
