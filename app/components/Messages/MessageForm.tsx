"use client";
import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane, faSpinner, faUser } from "@fortawesome/free-solid-svg-icons";
import Pusher from "pusher-js";

interface ConversationIdProps {
  conversationId: string | null;
  userId: string | null;
}

const ChatInterface: React.FC<ConversationIdProps> = ({ conversationId, userId }) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<
    { content: string; senderUserId: string | null; senderCompanyId: string | null; sentAt: string }[]
  >([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // Configuration de Pusher côté client
  useEffect(() => {
    // Vérifie que les variables d'environnement existent
    if (!process.env.NEXT_PUBLIC_PUSHER_KEY || !process.env.NEXT_PUBLIC_PUSHER_CLUSTER) {
        console.error("Les variables d'environnement Pusher sont manquantes.");
        return;
    }

    // Initialisation de Pusher
    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY, {
        cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER,
    });

    // Abonnement au canal de conversation spécifique
    const channel = pusher.subscribe(`chat-${conversationId}`);
    channel.bind("new-message", (data) => {
        console.log("Nouveau message reçu :", data);
        setMessages((prevMessages) => [...prevMessages, data.newMessage]);
    });

    // Nettoyage lors de la désactivation du composant
    return () => {
        channel.unbind_all();
        channel.unsubscribe();
    };
}, [conversationId]);

  // Fetch messages function remains the same
  const fetchMessages = async () => {
    try {
      if (!conversationId) {
        setError("No conversation ID provided.");
        return;
      }

      setError(null);
      setLoading(true);
      const response = await fetch(`/api/messages/conversations?conversationId=${conversationId}`);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "An error occurred while fetching messages.");
      }

      const fetchedMessages = await response.json();
      setMessages(fetchedMessages);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error.");
    } finally {
      setLoading(false);
    }
  };

  // Updated send message function to use Socket.IO
  const sendMessage = async () => {
    try {
      if (!conversationId) {
        setError("No conversation ID provided or socket not connected.");
        return;
      }

      setError(null);

      const newMessage = {
        conversationId,
        content: message,
        senderUserId: userId,
        senderCompanyId: userId,
        sentAt: new Date().toISOString(),
      };

      // Emit the message through Socket.IO

      // Also send to API for persistence
      const response = await fetch(`/api/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newMessage),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "An error occurred while sending the message.");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error.");
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (message.trim() === "") return;

    await sendMessage();
    setMessage("");
  };

  // Updated Socket.IO effect to use our custom hook


  // Load initial messages
  useEffect(() => {
    if (conversationId) {
      fetchMessages();
    }
  }, [conversationId]);

  // Rest of the component remains the same
  return (
    <div className="flex flex-col h-[80vh] w-full max-w-5xl mx-auto bg-gray-100 shadow-lg rounded-lg overflow-hidden">
      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-white">
        {loading && (
          <div className="text-center">
            <FontAwesomeIcon icon={faSpinner} spin className="text-blue-500" />
          </div>
        )}
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${
              (msg.senderUserId === userId || msg.senderCompanyId === userId)
                ? "justify-end"
                : "justify-start"
            }`}
          >
            <div className="max-w-xs">
              <div
                className={`p-3 rounded-lg shadow text-white flex items-center space-x-2 ${
                  (msg.senderUserId === userId || msg.senderCompanyId === userId)
                    ? "bg-blue-500"
                    : "bg-orange-500 text-black"
                }`}
              >
                <FontAwesomeIcon icon={faUser} />
                <span>{msg.content}</span>
              </div>
              <p
                className={`text-xs text-gray-500 mt-1 ${
                  (msg.senderUserId === userId || msg.senderCompanyId === userId)
                    ? "text-right"
                    : "text-left"
                }`}
              >
                {new Date(msg.sentAt).toLocaleTimeString()}
              </p>
            </div>
          </div>
        ))}
        {messages.length === 0 && !loading && (
          <p className="text-gray-400 text-center">No messages yet. Start chatting!</p>
        )}
      </div>

      {/* Error Message */}
      {error && <p className="text-red-500 text-center p-2">{error}</p>}

      {/* Input Box */}
      <form
        onSubmit={handleSubmit}
        className="bg-gray-200 p-4 flex items-center space-x-4 border-t border-gray-300"
      >
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
          rows={2}
          className="flex-1 p-2 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="p-3 bg-blue-500 text-white rounded-full hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
        >
          <FontAwesomeIcon icon={faPaperPlane} />
        </button>
      </form>
    </div>
  );
};

export default ChatInterface;

