'use client'
import React, { useState } from "react";
import { handleChange } from "@/utils/forms/allFunctionsForm";
import { CompanyData } from "@/utils/interfaces/formsInterface"; // Corriger l'import de l'interface

export default function CompanyRegister() {

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

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Tu peux envoyer ici les données du formulaire, par exemple en utilisant fetch/axios pour l'API
        console.log(formData); // Pour tester
    };

    return (
        <div>
            <h1>Company Register</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="companyName">Company Name:</label>
                    <input
                        type="text"
                        id="companyName"
                        name="companyName"
                        value={formData.companyName}
                        onChange={(e) => handleChange(e, setFormData)}
                        maxLength={35}
                        required
                    />
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
                </div>
                <div>
                    <button type="submit">Submit</button>
                </div>
            </form>
        </div>
    );
}


