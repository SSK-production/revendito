"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const BanUserForm = () => {
  const [isMounted, setIsMounted] = useState(false); // Pour vérifier si le composant est monté
  const [id, setId] = useState('');
  const [username, setUsername] = useState('');
  const [type, setType] = useState<'user' | 'company'>('user');
  const [bannTitle, setBannTitle] = useState('');
  const [reason, setReason] = useState<string[]>([]);
  const [duration, setDuration] = useState<number>(1);
  const [error, setError] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true); // Une fois monté, set le state
  }, []);

  // Fonction pour ajouter une raison
  const addReason = (newReason: string) => {
    if (newReason.trim()) {
      setReason((prev) => [...prev, newReason]);
    }
  };

  // Fonction pour gérer la soumission du formulaire
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    // Validation des entrées
    if (!id || !username || !bannTitle || reason.length === 0 || duration <= 0) {
      setError('Tous les champs doivent être remplis correctement.');
      return;
    }

    // Vérification du format de l'ID (UUID)
    const uuidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
    if (!uuidRegex.test(id)) {
      setError('L\'ID doit être au format UUID valide.');
      return;
    }

    try {
      const response = await fetch('/api/bans', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id,
          username,
          type,
          bannTitle,
          reason,
          duration,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage('Bannissement appliqué avec succès.');
        if (isMounted) {
          router.push('/path-to-redirect'); // Remplacez par votre route
        }
      } else {
        setError(data.error || 'Une erreur est survenue.');
      }
    } catch (error) {
      setError('Erreur lors de la communication avec le serveur.');
    }
  };

  if (!isMounted) return null; // Ne pas rendre le composant avant le montage côté client

  return (
    <div className="max-w-3xl mx-auto mt-6 p-6 bg-white border rounded-md shadow-md">
      <h1 className="text-2xl font-bold">Bannir un utilisateur ou une entreprise</h1>
      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">ID</label>
          <input
            type="text"
            value={id}
            onChange={(e) => setId(e.target.value)}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Nom d'utilisateur</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Type</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as 'user' | 'company')}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md"
            required
          >
            <option value="user">Utilisateur</option>
            <option value="company">Entreprise</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Titre du Bannissement</label>
          <input
            type="text"
            value={bannTitle}
            onChange={(e) => setBannTitle(e.target.value)}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Raisons du Bannissement</label>
          <input
            type="text"
            placeholder="Entrez une raison"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && (e.target as HTMLInputElement).value) {
                addReason((e.target as HTMLInputElement).value);
                (e.target as HTMLInputElement).value = '';
              }
            }}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md"
          />
          <div className="mt-2 space-x-2">
            {reason.map((r, index) => (
              <span key={index} className="inline-block bg-blue-200 text-blue-800 px-2 py-1 rounded-full text-xs">
                {r}
              </span>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Durée (en jours)</label>
          <input
            type="number"
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md"
            required
            min={1}
          />
        </div>

        <div className="mt-6">
          {error && <p className="text-red-500">{error}</p>}
          {successMessage && <p className="text-green-500">{successMessage}</p>}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-md"
          >
            Appliquer le bannissement
          </button>
        </div>
      </form>
    </div>
  );
};

export default BanUserForm;
