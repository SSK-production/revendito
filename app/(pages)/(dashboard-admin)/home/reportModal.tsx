// Nouveau fichier: reportModal.tsx
import React from "react";

interface ReportModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (reason: string) => void;
}

const ReportModal: React.FC<ReportModalProps> = ({ isOpen, onClose, onSubmit }) => {
    const [reason, setReason] = React.useState("");

    if (!isOpen) return null;

    const handleSubmit = () => {
        if (reason.trim() === "") {
            alert("Veuillez fournir une raison pour le signalement.");
            return;
        }
        onSubmit(reason);
        setReason("");
    };

    return (
        <div className="modal-overlay fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-50 z-50">
            <div className="modal-container bg-white rounded-lg shadow-lg p-6 w-11/12 md:w-1/3">
                <h2 className="text-lg font-bold mb-4">Signaler une offre</h2>
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
