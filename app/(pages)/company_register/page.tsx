'use client';
import React, { useState } from "react";
import { handleChange } from "@/utils/forms/allFunctionsForm";  // Assurez-vous que cette fonction est bien définie
import { handleSubmit } from "@/utils/forms/allFunctionsForm"; // Import de handleSubmit
import { CompanyData } from "@/utils/interfaces/formsInterface"; // L'interface des données du formulaire
import { useRouter } from "next/navigation";
import DOMPurify from "dompurify";

// Composant de formulaire d'enregistrement de l'entreprise
export default function CompanyRegister() {

    // Initialisation de l'état pour les données du formulaire
    const [formData, setFormData] = useState<CompanyData>({
        companyName: "",
        password: "",
        email: "",
        companyNumber: "",
        birthDate: "",
        city: "",
        country: "",
        street: "",
    });

    // État pour afficher les erreurs de validation
    const [errors, setErrors] = useState<Record<string, string | null>>({});
    const router = useRouter();
    // Fonction de soumission des données après validation
    const submitHandler = (data: CompanyData) => {
        const sanitizedData = {
            ...data,
            companyName: DOMPurify.sanitize(data.companyName),
            password: DOMPurify.sanitize(data.password),
            email: DOMPurify.sanitize(data.email),
            companyNumber: DOMPurify.sanitize(data.companyNumber),
            birthDate: DOMPurify.sanitize(data.birthDate),
            city: DOMPurify.sanitize(data.city),
            country: DOMPurify.sanitize(data.country),
            street: DOMPurify.sanitize(data.street)
        };

        console.log("User Data Submitted:", sanitizedData);


        router.push("/login"); // Rediriger vers la page de connexion
        console.log("Company Data Submitted:", data);

    };

    // Fonction pour gérer l'affichage des erreurs de validation
    const handleError = (errors: Record<string, string | null>) => {
        setErrors(errors); // Met à jour l'état avec les erreurs
    };

    return (
        <div>
            <h1>Company Register</h1>
            <form onSubmit={(e) => handleSubmit(e, formData, submitHandler, 'companyData', handleError)}>
                <div>
                    <label htmlFor="companyName">Company Name:</label>
                    <input
                        type="text"
                        id="companyName"
                        name="companyName"
                        value={formData.companyName}
                        onChange={(e) => handleChange(e, setFormData)}
                        maxLength={20}
                        required
                    />
                    {errors.companyName && <span>{errors.companyName}</span>}  {/* Affichage de l'erreur */}
                </div>

                <div>
                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={(e) => handleChange(e, setFormData)}
                        required
                    />
                    {errors.password && <span>{errors.password}</span>}  {/* Affichage de l'erreur */}
                </div>

                <div>
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={(e) => handleChange(e, setFormData)}
                        required
                    />
                    {errors.email && <span>{errors.email}</span>}  {/* Affichage de l'erreur */}
                </div>

                <div>
                    <label htmlFor="companyNumber">Company Number:</label>
                    <input
                        type="text"
                        id="companyNumber"
                        name="companyNumber"
                        value={formData.companyNumber}
                        onChange={(e) => handleChange(e, setFormData)}
                        required
                    />
                    {errors.companyNumber && <span>{errors.companyNumber}</span>}  {/* Affichage de l'erreur */}
                </div>

                <div>
                    <label htmlFor="birthDate">Birth Date:</label>
                    <input
                        type="date"
                        id="birthDate"
                        name="birthDate"
                        value={formData.birthDate}
                        onChange={(e) => handleChange(e, setFormData)}
                        required
                    />
                    {errors.birthDate && <span>{errors.birthDate}</span>}  {/* Affichage de l'erreur */}
                </div>

                <div>
                    <label htmlFor="city">City:</label>
                    <input
                        type="text"
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={(e) => handleChange(e, setFormData)}
                        required
                    />
                    {errors.city && <span>{errors.city}</span>}  {/* Affichage de l'erreur */}
                </div>

                <div>
                    <label htmlFor="country">Country:</label>
                    <input
                        type="text"
                        id="country"
                        name="country"
                        value={formData.country}
                        onChange={(e) => handleChange(e, setFormData)}
                        required
                    />
                    {errors.country && <span>{errors.country}</span>}  {/* Affichage de l'erreur */}
                </div>

                <div>
                    <label htmlFor="street">Street:</label>
                    <input
                        type="text"
                        id="street"
                        name="street"
                        value={formData.street}
                        onChange={(e) => handleChange(e, setFormData)}
                        required
                    />
                    {errors.street && <span>{errors.street}</span>}  {/* Affichage de l'erreur */}
                </div>

                <div>
                    <button type="submit">Submit</button>
                </div>
            </form>
        </div>
    );
}
