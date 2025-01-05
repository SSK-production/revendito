"use client";
import React, { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane, faSpinner, faUser } from "@fortawesome/free-solid-svg-icons";
import Pusher from "pusher-js";

interface ConversationIdProps {
  conversationId: string | null;
  userId: string | null;
}

interface NewMessage {
  senderUserId: string | null;
  senderCompanyId: string | null;
  receiverUserId: string | null;
  receiverCompanyId: string | null;
  content: string;
  conversationId: string;
  vehicleOfferId: number | null;
  realEstateOfferId: number | null;
  commercialOfferId: number | null;
  sentAt: string;
}

const ChatInterface: React.FC<ConversationIdProps> = ({ conversationId, userId }) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<NewMessage[]>([]);
  const [receiverId, setReceiverId] = useState<string | null>(null);
  const [otherPersonName, setOtherPersonName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // Référence pour le conteneur des messages
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Fonction pour faire défiler vers le bas
  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  };

  // Configuration de Pusher côté client
  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_PUSHER_KEY || !process.env.NEXT_PUBLIC_PUSHER_CLUSTER) {
      console.error("Les variables d'environnement Pusher sont manquantes.");
      return;
    }

    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER,
    });

    const channel = pusher.subscribe(`chat-${conversationId}`);
    channel.bind("new-message", (data: { newMessage: NewMessage }) => {
      setMessages((prevMessages) => [...prevMessages, data.newMessage]);
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, [conversationId]);

  // Récupération des messages et identification de l'autre utilisateur
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

      // Identifier l'autre utilisateur
      if (fetchedMessages.length > 0) {
        const firstMessage = fetchedMessages[0];
        const isUser = firstMessage.senderUserId !== null;
        const otherUserId = isUser
          ? firstMessage.senderUserId === userId
            ? firstMessage.receiverUserId
            : firstMessage.senderUserId
          : firstMessage.senderCompanyId === userId
          ? firstMessage.receiverCompanyId
          : firstMessage.senderCompanyId;

        setReceiverId(otherUserId || null);

        const username = isUser
          ? firstMessage.senderUserId === userId
            ? firstMessage.receiverUser?.username
            : firstMessage.senderUser?.username
          : firstMessage.senderCompanyId === userId
          ? firstMessage.receiverCompany?.companyName
          : firstMessage.senderCompany?.companyName;

        setOtherPersonName(username || "Unknown");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error.");
    } finally {
      setLoading(false);
    }
  };

  // Charger les messages au montage
  useEffect(() => {
    if (conversationId) {
      fetchMessages();
    }
  }, [conversationId]);

  // Faire défiler vers le bas à chaque mise à jour des messages
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Envoi de message
  const sendMessage = async () => {
    try {
      if (!conversationId || !receiverId) {
        setError("Conversation ID or Receiver ID is missing.");
        return;
      }

      setError(null);

      const newMessage = {
        receiverId,
        offerId: null,
        offerType: null,
        content: message,
        otherPersonName: otherPersonName || "Unknown",
        Credentials: "include",
      };

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

  return (
    <div className="flex flex-col h-[90vh] w-full max-w-5xl mx-auto bg-gray-100 shadow-lg rounded-lg overflow-hidden">
      {/* Header avec le nom de l'autre personne */}
      <div className="bg-gray-200 text-black text-center py-3 font-semibold">
        {otherPersonName || "Loading..."}
      </div>

      {/* Conteneur des messages */}
      <div
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 bg-white"
      >
        {loading && (
          <div className="text-center">
            <FontAwesomeIcon icon={faSpinner} spin className="text-blue-500" />
          </div>
        )}
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${
              msg.senderUserId === userId ? "justify-end" : "justify-start"
            }`}
          >
            <div className="max-w-xs">
              <div
                className={`p-3 rounded-lg shadow text-white flex items-center space-x-2 ${
                  msg.senderUserId === userId ? "bg-blue-500" : "bg-orange-500 text-black"
                }`}
              >
                <FontAwesomeIcon icon={faUser} />
                <span>{msg.content}</span>
              </div>
              <p
                className={`text-xs text-gray-500 mt-1 ${
                  msg.senderUserId === userId ? "text-right" : "text-left"
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

      {error && <p className="text-red-500 text-center p-2">{error}</p>}

      {/* Formulaire d'envoi de message */}
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
