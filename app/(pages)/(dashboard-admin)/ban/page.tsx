import { useState } from 'react';

interface UserData {
  id: string;
  username: string;
  email: string;
  entity: 'user' | 'company';
  isBanned: boolean;
  banReason: string[];
  banEndDate: Date;
}

const Home = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null); // Données utilisateur typées
  const [error, setError] = useState<string | null>(null);

  async function fetchUserData() {
    try {
      // Récupérer le token depuis les cookies
      const token = document.cookie.split('; ').find(row => row.startsWith('access_token'))?.split('=')[1];

      if (!token) {
        setError('Token manquant');
        return;
      }

      // Envoi de la requête pour vérifier le token
      const response = await fetch('/api/verify-token', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la vérification du token');
      }

      const data: UserData = await response.json();
      setUserData(data); // Mettre à jour l'état avec les données de l'utilisateur
      setModalVisible(true); // Afficher la modal
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Erreur inconnue'); // Gestion d'erreur
    }
  }

  function closeModal() {
    setModalVisible(false); // Fermer la modal
  }

  return (
    <div>
      <button onClick={fetchUserData}>Ouvrir la modal</button>

      {error && <p>{error}</p>}

      {modalVisible && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.7)' }}>
          <div style={{ backgroundColor: 'white', padding: '20px', margin: '100px auto', width: '50%' }}>
            <h2>Informations de l'Utilisateur</h2>
            {userData ? (
              <div>
                <p>ID : {userData.id}</p>
                <p>Nom d'utilisateur : {userData.username}</p>
                <p>Email : {userData.email}</p>
                <p>Entité : {userData.entity}</p>
                <p>Compte banni : {userData.isBanned ? 'Oui' : 'Non'}</p>
                {userData.isBanned && (
                  <>
                    <p>Raison du bannissement : {userData.banReason.join(', ')}</p>
                    <p>Date de fin du bannissement : {new Date(userData.banEndDate).toLocaleString()}</p>
                  </>
                )}
              </div>
            ) : (
              <p>Aucune donnée disponible</p>
            )}
            <button onClick={closeModal}>Fermer</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
