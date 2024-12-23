"use client";
import React, { useState } from "react";

const ChatInterface: React.FC = () => {
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState<string[]>([]);
    const [error, setError] = useState<string | null>(null);

    const sendMessage = async (messageContent: string) => {
        try {
            setError(null);

            // Données de l'exemple à ajuster selon votre cas
            const payload = {
                receiverId: "123", // Remplacez par l'ID du destinataire
                offerId: "456",    // ID de l'offre concernée
                offerType: "vehicle", // Type de l'offre (exemple: "vehicle")
                content: messageContent,
            };

            const response = await fetch("/api/messages", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(
                    errorData.error || "Une erreur s'est produite lors de l'envoi du message."
                );
            }

            const { newMessage } = await response.json();
            setMessages((prev) => [...prev, newMessage.content]);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Erreur inconnue.");
        }
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        if (message.trim() === "") return;

        await sendMessage(message);
        setMessage("");
    };

    return (
        <div className="flex flex-col h-[500px] w-full max-w-md mx-auto bg-gray-100 shadow-lg rounded-lg overflow-hidden">
            {/* Messages Container */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-white">
                {messages.map((msg, index) => (
                    <div
                        key={index}
                        className={`p-3 rounded-lg ${
                            index % 2 === 0 ? "bg-blue-100 self-start" : "bg-green-100 self-end"
                        }`}
                    >
                        {msg}
                    </div>
                ))}
                {messages.length === 0 && (
                    <p className="text-gray-400 text-center">No messages yet. Start chatting!</p>
                )}
            </div>

            {/* Error Message */}
            {error && <p className="text-red-500 text-center p-2">{error}</p>}

            {/* Input Box */}
            <form
                onSubmit={handleSubmit}
                className="bg-gray-200 p-4 flex items-center space-x-2"
            >
                <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type your message..."
                    rows={1}
                    className="flex-1 p-2 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                    type="submit"
                    className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
                >
                    Send
                </button>
            </form>
        </div>
    );
};

export default ChatInterface;
