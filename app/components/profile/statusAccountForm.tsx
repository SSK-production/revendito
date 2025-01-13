import React, { useState } from "react";

interface PasswordPromptProps {
    active : boolean
    onConfirm: (statusAccoundData : {password: string, active:boolean}) => void;
    onCancel: () => void;
}

const StatusAccountForm: React.FC<PasswordPromptProps> = ({active, onConfirm, onCancel }) => {
    const [password, setPassword] = useState("");

    const handleConfirm = () => {
        if (password) {
            onConfirm({password, active});
        } else {
            alert("Please enter a password!");
        }
    };

    return (
        <form onSubmit={(e) => { e.preventDefault(); handleConfirm(); }} className="space-y-6">
            {active ? (
                <h3 className="text-xl font-semibold text-gray-800">Do you want to desactivate your account?</h3>
            ) : (
                <h3 className="text-xl font-semibold text-gray-800">Do you want to activate your account?</h3>
            )}
            <div>
                <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700"
                >
                    Password
                </label>
                <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="mt-1 w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
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
                    type="submit"
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                    Confirm
                </button>
            </div>
        </form>
    );
};

export default StatusAccountForm;
