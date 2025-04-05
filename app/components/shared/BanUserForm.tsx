import React, { useState } from "react";

interface BanFormProps {
    initialData: {
        id: string,
        username: string,
        type: string,
        bannTitle: string;
        reason: string;
        duration: string;
        isBanned: boolean; // Ajout d'une propriété pour indiquer si l'utilisateur est banni
    };
    onSave: (updatedData: {
        id: string,
        username: string,
        type: string,
        bannTitle: string;
        reason: string;
        duration: string;
    }) => void;
    onCancel: () => void;
    onUnban: () => void; // Ajout d'une fonction pour gérer le débannissement
}

const BanUserForm: React.FC<BanFormProps> = ({ initialData, onSave, onCancel, onUnban }) => {
    const [formData, setFormData] = useState(initialData);
    const [errorMessage, setErrorMessage] = useState("");

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

   
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Form submitted with data:", formData);
        
        if (!formData.bannTitle || !formData.reason || !formData.duration) {
            setErrorMessage("All fields are required.");
            return;
        }
        setErrorMessage("");
        onSave({ ...formData });
    };

    if (formData.isBanned) {
        return (
            <div>
                <p className="text-lg font-medium text-gray-700">
                    This user is already banned. Are you sure you want to unban them?
                </p>
                <div className="mt-6 flex justify-end space-x-4">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={onUnban}
                        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                    >
                        Unban
                    </button>
                </div>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit}>
            <div className="space-y-4">
                {/* Champs de bannissement */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Ban Title
                    </label>
                    <input
                        type="text"
                        name="bannTitle"
                        value={formData.bannTitle}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-400"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Reason
                    </label>
                    <input
                        type="text"
                        name="reason"
                        value={formData.reason}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-400"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Duration
                    </label>
                    <select
                        name="duration"
                        value={formData.duration}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-400"
                    >
                        <option value="">Select duration</option>
                        <option value="1">1 day</option>
                        <option value="3">3 days</option>
                        <option value="7">7 days</option>
                        <option value="30">1 month</option>
                        <option value="90">3 months</option>
                        <option value="180">6 months</option>
                        <option value="365">1 year</option>
                        <option value="100000">Permanent</option>
                    </select>
                </div>
            </div>
            {errorMessage && (
                <div className="mt-4 text-red-500">
                    {errorMessage}
                </div>
            )}
            <div className="mt-6 flex justify-end space-x-4">
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                >
                    Save
                </button>
            </div>
        </form>
    );
};

export default BanUserForm;
