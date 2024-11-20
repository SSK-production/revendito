import { Dispatch, SetStateAction } from "react";

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
