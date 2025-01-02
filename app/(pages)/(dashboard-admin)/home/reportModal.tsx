import React, { useState } from "react";

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (
    reason: string,
    userId: string | null,
    offerId: number | null,
    offerTitle: string | null,
    offerCategory: string,
    entity: string | null // Ajout de l'argument entity ici
  ) => void;
  userId: string | null;
  offerId: string | null;
  offerTitle: string | null;
  offerCategory: string;
  entity: string | null; // Ajout de l'argument entity ici
}

const ReportModal: React.FC<ReportModalProps> = ({ isOpen, onClose, onSubmit, userId, offerId, offerTitle, offerCategory, entity }) => {
  const [reason, setReason] = useState<string>("");

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (!reason.trim()) {
      alert("Veuillez fournir une raison pour le signalement.");
      return;
    }
  
    if (!userId || !offerId || !offerTitle || !offerCategory || !entity) {
      alert("Des informations sont manquantes pour soumettre le signalement.");
      return;
    }
  
    onSubmit(reason, userId, parseInt(offerId), offerTitle, offerCategory, entity); // Passez entity ici
    setReason(""); // Réinitialise le champ de texte après soumission
  };
  
  

  return (
    <div className="modal-overlay fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-50 z-50">
      <div className="modal-container bg-white rounded-lg shadow-lg p-6 w-11/12 md:w-1/3">
        <h2 className="text-lg font-bold mb-4">Signaler l'offre "{offerTitle}"</h2>

        <div className="mb-4">
          <p><strong>ID de l'utilisateur :</strong> {userId}</p>
          <p><strong>user rank : </strong>{entity}</p>
          <p><strong>ID de l'offre :</strong> {offerId}</p>
        </div>

        <textarea
          className="w-full h-32 border border-gray-300 rounded-lg p-2"
          placeholder="Expliquez la raison du signalement"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        />
        <div className="flex justify-end mt-4 gap-2">
          <button
            className="bg-gray-300 text-gray-700 rounded-lg px-4 py-2"
            onClick={onClose}
          >
            Annuler
          </button>
          <button
            className="bg-red-500 text-white rounded-lg px-4 py-2"
            onClick={handleSubmit}
          >
            Soumettre
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportModal;
