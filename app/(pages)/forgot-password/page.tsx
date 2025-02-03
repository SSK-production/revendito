"use client";
import React, { useState } from "react";
import axios from "axios";

const ForgotPasswordPage: React.FC = () => {
    const [email, setEmail] = useState<string>("");
    const [message, setMessage] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setMessage(""); // Reset le message
        setLoading(true);

        try {
            const response = await axios.post("/api/forgot-password", { email });

            if (response.data.success) {
                setMessage("Un email de réinitialisation de mot de passe a été envoyé.");
            } else {
                setMessage("Erreur lors de l'envoi de l'email. Veuillez réessayer.");
            }
        } catch {
            setMessage("Une erreur s'est produite. Vérifiez l'adresse email et réessayez.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="max-w-lg w-full bg-white p-8 rounded-lg shadow-lg">
                <h1 className="text-2xl font-bold text-center mb-6">Mot de passe oublié</h1>
                <form onSubmit={handleSubmit}>
                    <div className="mb-6">
                        <label htmlFor="email" className="block text-gray-700">
                            Adresse email
                        </label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="mt-2 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-lg"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full py-3 bg-indigo-600 text-white rounded-md text-lg font-semibold hover:bg-indigo-700 disabled:opacity-50"
                        disabled={loading}
                    >
                        {loading ? "Envoi en cours..." : "Envoyer le lien de réinitialisation"}
                    </button>
                </form>
                {message && <p className="mt-6 text-center text-green-600 text-lg">{message}</p>}
            </div>
        </div>
    );
};

export default ForgotPasswordPage;
