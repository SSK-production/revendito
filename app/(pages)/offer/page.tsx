'use client';
import React, { useState } from 'react';

const VehicleOfferForm = () => {
  const [formData, setFormData] = useState({
    title: "Voiture d'occasion",
    description: "Une belle voiture en très bon état.",
    price: 15000.5,
    city: "Paris",
    country: "France",
    model: "Tesla Model 3",
    year: 2021,
    mileage: 15000,
    fuelType: "Electric",
    color: "Rouge",
    transmission: "Automatic",
    subCategoryId: 1,
  });

  const [responseMessage, setResponseMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      const response = await fetch('/api/vehicle', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Pour envoyer les cookies automatiquement
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        setResponseMessage('Offer created successfully: ' + JSON.stringify(data));
      } else {
        const errorData = await response.json();
        setErrorMessage('Error: ' + JSON.stringify(errorData.error));
      }
    } catch (error) {
      setErrorMessage('Unexpected error occurred: ' + error.message);
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: name === 'price' || name === 'year' || name === 'mileage' || name === 'subCategoryId' ? +value : value,
    }));
  };

  return (
    <div>
      <h1>Créer une offre de véhicule</h1>
      <form onSubmit={handleSubmit}>
        {Object.entries(formData).map(([key, value]) => (
          <div key={key}>
            <label>
              {key.charAt(0).toUpperCase() + key.slice(1)}:
              <input
                type={typeof value === 'number' ? 'number' : 'text'}
                name={key}
                value={value}
                onChange={handleChange}
                required={key !== 'description'} // Rendre facultatif le champ description
              />
            </label>
          </div>
        ))}
        <button type="submit">Soumettre</button>
      </form>
      {responseMessage && <p style={{ color: 'green' }}>{responseMessage}</p>}
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
    </div>
  );
};

export default VehicleOfferForm;
