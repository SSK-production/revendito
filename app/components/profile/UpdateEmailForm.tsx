import React, { useState } from "react";

interface UpdateEmailFormProps {
  data: { email: string };
  handleSaveAccount: (updatedData: { email: string; password: string }) => void;
  setIsModalOpenAccount: (isOpen: boolean) => void;
}

const UpdateEmailForm: React.FC<UpdateEmailFormProps> = ({
  data,
  handleSaveAccount,
  setIsModalOpenAccount,
}) => {
  const [email, setEmail] = useState(data.email);
  const [password, setPassword] = useState<string>(""); // Champ de validation par mot de passe
  const [passwordError, setPasswordError] = useState<string | null>(null); // Gestion des erreurs de mot de passe

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation du mot de passe
    if (!password) {
      setPasswordError("Please enter your password to confirm changes.");
      return;
    }

    setPasswordError(null);
    handleSaveAccount({ email ,password });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-4">
        {/* Champ de mise à jour de l'email */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
            required
          />
        </div>

        {/* Champ de validation par mot de passe */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Password Confirmation
          </label>
          <input
            type="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
              passwordError
                ? "border-red-500 focus:ring-red-400"
                : "border-gray-300 focus:ring-green-400"
            }`}
            placeholder="Enter your password to confirm changes"
            required
          />
          {passwordError && (
            <p className="mt-1 text-sm text-red-500">{passwordError}</p>
          )}
        </div>
      </div>
      <div className="mt-6 flex justify-end space-x-4">
        <button
          type="button"
          onClick={() => setIsModalOpenAccount(false)}
          className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Save
        </button>
      </div>
    </form>
  );
};

export default UpdateEmailForm;
