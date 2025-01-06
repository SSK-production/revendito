import React, { useState } from "react";

interface UpdateProfileFormProps {
  initialData: {
    firstName: string;
    lastName: string;
    email: string;
    active: boolean;
    birthDate?: string;
    companyNumber?: string;
    city: string;
    country: string;
    street?: string;
  };
  onSave: (updatedData: {
    firstName: string;
    lastName: string;
    email: string;
    active: boolean;
    birthDate?: string;
    companyNumber?: string;
    city: string;
    country: string;
    street?: string;
  }) => void;
  onCancel: () => void;
}

const UpdateProfileForm: React.FC<UpdateProfileFormProps> = ({
  initialData,
  onSave,
  onCancel,
}) => {
  const [formData, setFormData] = useState(initialData);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-4">
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
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Email Verified
          </label>
          <input
            type="checkbox"
            name="active"
            checked={formData.active}
            onChange={handleCheckboxChange}
            className="h-5 w-5"
          />
        </div>
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
