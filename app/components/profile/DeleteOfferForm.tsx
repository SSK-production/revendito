import React, { useState } from "react";

interface DeleteOfferPromptProps {
    selectedOffer: number | null;
    offerType: string;
    onConfirm: (password: string) => void;
    onCancel: () => void;
}

const DeleteOfferForm: React.FC<DeleteOfferPromptProps> = ({ onConfirm, onCancel }) => {
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleConfirm = () => {
        if (password.trim() === "") {
            setError("Password is required.");
        } else {
            setError("");
            onConfirm(password);
        }
    };

    return (
        <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-800">
                Are you sure you want to delete this offer?
            </h3>
            <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Enter your password to confirm:
                </label>
                <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
            </div>
            <div className="flex justify-end space-x-4">
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400"
                >
                    Cancel
                </button>
                <button
                    type="button"
                    onClick={handleConfirm}
                    className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400"
                >
                    Delete
                </button>
            </div>
        </form>
    );
};

export default DeleteOfferForm;
