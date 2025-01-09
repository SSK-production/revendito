import React, { useState } from "react";

interface UpdateProfileFormProps {
  initialData: {
    entity: string;
    username?: string | null;
    companyName?: string | null;
    firstName?: string;
    lastName?: string;
    birthDate?: string;
    companyNumber?: string;
    city: string;
    country: string;
    street?: string;
  };
  onSave: (updatedData: {
    entity: string;
    username?: string | null;
    companyName?: string | null;
    firstName?: string;
    lastName?: string;
    birthDate?: string;
    companyNumber?: string;
    city: string;
    country: string;
    street?: string;
    password: string;
  }) => void;
  onCancel: () => void;
}

const UpdateProfileForm: React.FC<UpdateProfileFormProps> = ({
  initialData,
  onSave,
  onCancel,
}) => {
  const [formData, setFormData] = useState(initialData);
  const [password, setPassword] = useState<string>(""); // Champ de validation par mot de passe
  const [passwordError, setPasswordError] = useState<string | null>(null); // Gestion des erreurs de mot de passe

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation du mot de passe
    if (!password) {
      setPasswordError("Please enter your password to confirm changes.");
      return;
    }

    setPasswordError(null);
    onSave({ ...formData, password });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-4">
        {/* Champs du profil */}
        {formData.entity === 'user' && (
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Username
            </label>
            <input
              type="text"
              name="username"
              value={formData.username || ""}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>
        )}
        {formData.entity === 'company' && (
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Company Name
            </label>
            <input
              type="text"
              name="companyName"
              value={formData.companyName || ""}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>
        )}
        {formData.entity === 'user' && (
        <div>
        <label className="block text-sm font-medium text-gray-700">
          Firstname
        </label>
        <input
          type="text"
          name="firstName"
          value={formData.firstName}
          onChange={handleInputChange}
          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
        />
      </div>  
        )}
        {formData.entity === 'user' &&(
          <div>
          <label className="block text-sm font-medium text-gray-700">
            Lastname
          </label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
          />
        </div>
        )}
        
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Birth Date
          </label>
          <input
            type="date"
            name="birthDate"
            value={formData.birthDate || ""}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
          />
        </div>
        {formData.entity === 'company' && (
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Company Number
            </label>
            <input
              type="text"
              name="companyNumber"
              value={formData.companyNumber || ""}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>
        )}
        <div>
          <label className="block text-sm font-medium text-gray-700">City</label>
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Country
          </label>
          <input
            type="text"
            name="country"
            value={formData.country}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
          />
        </div>
        {formData.entity === 'company' && (
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Street
            </label>
            <input
              type="text"
              name="street"
              value={formData.street || ""}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>
        )}

        {/* Champ de validation par mot de passe */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Password Confirmation
          </label>
          <input
            type="password"
            name="password"
            value={password}
            onChange={handlePasswordChange}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
              passwordError
                ? "border-red-500 focus:ring-red-400"
                : "border-gray-300 focus:ring-green-400"
            }`}
            placeholder="Enter your password to confirm changes"
          />
          {passwordError && (
            <p className="mt-1 text-sm text-red-500">{passwordError}</p>
          )}
        </div>
      </div>
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
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Save
        </button>
      </div>
    </form>
  );
};

export default UpdateProfileForm;
