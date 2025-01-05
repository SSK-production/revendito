import React, { useState } from 'react';
import axios from 'axios';
import { FaTimesCircle, FaPaperPlane } from 'react-icons/fa';

interface MessageModalProps {
    show: boolean;
    handleClose: () => void;
    receiverId: string | null;
    offerId: number | null;
    offerType: string;
    otherPersonName: string;
}

const MessageModal: React.FC<MessageModalProps> = ({ show, handleClose, receiverId, offerId, offerType, otherPersonName }) => {
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const onSend = async () => {
        if (!message.trim()) {
            setError("Le message ne peut pas être vide.");
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const response = await axios.post('/api/messages', {
                receiverId,
                offerId,
                offerType,
                content: message,
                otherPersonName,
                credentials: "include",
            });

            console.log("Message envoyé avec succès :", response.data);
            setMessage('');
            handleClose();
        } catch (err) {
            console.error("Erreur lors de l'envoi du message :", err);
            setError("Une erreur est survenue lors de l'envoi du message.");
        } finally {
            setIsLoading(false);
        }
    };

    if (!show) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
            {/* Overlay */}
            <div
                className="fixed inset-0 bg-black bg-opacity-50"
                onClick={handleClose}
            ></div>

            {/* Modal */}
            <div className="bg-white rounded-lg shadow-lg max-w-lg w-full relative z-10">
                {/* Header */}
                <div className="flex justify-between items-center p-4 border-b">
                    <h3 className="text-xl font-semibold text-gray-800">
                        Envoyer un message
                    </h3>
                    <button
                        onClick={handleClose}
                        className="text-gray-400 hover:text-gray-600 focus:outline-none"
                    >
                        <FaTimesCircle className="w-6 h-6" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-4 space-y-4">
                    <textarea
                        rows={4}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Écrivez votre message ici..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        disabled={isLoading}
                    />
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                </div>

                {/* Footer */}
                <div className="flex justify-end items-center p-4 border-t space-x-2">
                    <button
                        onClick={handleClose}
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 focus:outline-none"
                        disabled={isLoading}
                    >
                        <FaTimesCircle className="w-5 h-5 inline-block mr-1" />
                        Annuler
                    </button>
                    <button
                        onClick={onSend}
                        className={`px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none ${
                            isLoading ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                        disabled={isLoading}
                    >
                        <FaPaperPlane className="w-5 h-5 inline-block mr-1" />
                        {isLoading ? "Envoi..." : "Envoyer"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MessageModal;
