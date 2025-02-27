"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import axios from "axios";

const ValidateEmailPage: React.FC = () => {

    const [message, setMessage] = useState<string>("");
    const searchParams = useSearchParams();
    const token = searchParams.get("token");


    useEffect(() => {
        const validateEmail = async () => {
            try {
                const response = await axios.post("/api/validate-email", { token });
                setMessage(response.data.message);
            } catch (error) {
                setMessage(`Failed to validate email : ${error}`);
            }
        };

        if (token) {
            validateEmail();
        }
        else {
            setMessage("Failed : The validation token is missing. Please check your email for the validation link.");
        }
    }, [token]);
    

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-lg">
            {message && (
                <p className={`mt-4 text-center ${message.startsWith("Failed") ? "text-red-600" : "text-green-600"}`}>
                {message}
                </p>
            )}
            </div>
        </div>
    );
};

export default ValidateEmailPage;