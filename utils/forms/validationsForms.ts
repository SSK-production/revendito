
type ValidationRule = (value: string) => string | null;

interface ValidationSchema {
    [key: string]: {
        rules: ValidationRule[];
        errorMessage: string;
    };
}

// Exemple de validation pour un formulaire d'entreprise ou utilisateur
export const validationSchemas: { [key: string]: ValidationSchema } = {
    companyData: {
        companyName: {
            rules: [(value) => (value.length === 0 ? "Le nom de l'entreprise est requis." : null)],
            errorMessage: "Le nom de l'entreprise est requis."
        },
        password: {
            rules: [
                (value) => (value.length < 8 ? "Le mot de passe doit avoir au moins 8 caractères." : null),
                (value) => (!/[A-Z]/.test(value) ? "Le mot de passe doit contenir au moins une lettre majuscule." : null),
                (value) => (!/[0-9]/.test(value) ? "Le mot de passe doit contenir au moins un chiffre." : null),
                
            ],
            errorMessage: "Le mot de passe est invalide."
        },
        email: {
            rules: [(value) => (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? "L'adresse email est invalide." : null)],
            errorMessage: "L'adresse email est invalide."
        },
        companyNumber: {
            rules: [
                (value) =>
                    !/^[A-Za-z]{1,3}-\d+$/.test(value)
                        ? "Le numéro d'entreprise doit commencer par 1 à 3 lettres, suivies d'un tiret et de chiffres."
                        : null,
            ],
            errorMessage: "Le numéro d'entreprise est invalide.",
        },        
    },
    userData: {
        username: {
            rules: [
                (value) => (value.length === 0 ? "Le nom d'utilisateur est requis." : null),
                (value) => (value.length < 3 ? "Le nom d'utilisateur doit dépasser 3 caractères" : null)
            ],
            errorMessage: "Le nom d'utilisateur est requis."
        },
        password: {
            rules: [
                (value) => (value.length < 8 ? "Le mot de passe doit avoir au moins 8 caractères." : null),
                (value) => (!/[A-Z]/.test(value) ? "Le mot de passe doit contenir au moins une lettre majuscule." : null),
                (value) => (!/[0-9]/.test(value) ? "Le mot de passe doit contenir au moins un chiffre." : null),
            ],
            errorMessage: "Le mot de passe est invalide."
        },
        email: {
            rules: [(value) => (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? "L'adresse email est invalide." : null)],
            errorMessage: "L'adresse email est invalide."
        },
    }
};

// Fonction de validation générique
// validation.ts

export const validateFormData = <T extends object>(formData: T, schemaName: string): Record<string, string | null> => {
    const schema = validationSchemas[schemaName];
    const errors: Record<string, string | null> = {};

    // Utilisation de Object.keys qui est valide pour les objets
    Object.keys(formData).forEach((field) => {
        const value = formData[field as keyof T] as string; // Accès au champ de l'objet formData
        const fieldSchema = schema[field];

        if (fieldSchema) {
            for (const rule of fieldSchema.rules) {
                const error = rule(value);
                if (error) {
                    errors[field] = error; // Si une erreur est trouvée pour ce champ, on l'ajoute
                    break;
                }
            }

            if (!errors[field]) {
                errors[field] = null; // Si aucune erreur n'est trouvée, mettre `null`
            }
        }
    });

    return errors;
};
