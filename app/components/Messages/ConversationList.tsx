"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import MessageForm from "@/app/components/Messages/MessageForm";

interface ConversationListProps {
  userId: string | null;
}

interface Conversation {
  id: string;
  otherPersonName: string;
  conversationId: string;
  content: string;
  sentAt: string;
}

const ConversationList: React.FC<ConversationListProps> = ({ userId }) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showMessageForm, setShowMessageForm] = useState<boolean>(false);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      setError("User ID is required to fetch conversations.");
      return;
    }

    const fetchConversations = async () => {
      try {
        const response = await axios.get(`/api/messages?userId=${userId}`);
        if (response.data && Array.isArray(response.data.conversations)) {
          setConversations(response.data.conversations);
        } else {
          setError("Invalid data format.");
        }
      } catch {
        setError("Failed to load conversations.");
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();
  }, [userId]);

  const onSelectConversation = (id: string) => {
    setConversationId(id);
    setShowMessageForm(true); // Affiche le formulaire de message
  };

  const goBackToList = () => {
    setShowMessageForm(false); // Retour à la liste des conversations
  };

  if (loading) {
    return <div className="p-4 text-center">Loading conversations...</div>;
  }

  if (error) {
    return <div className="p-4 text-center text-red-500">{error}</div>;
  }

  if (conversations.length === 0) {
    return (
      <div className="p-4 text-center text-gray-500">
        No conversations found.
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen md:flex-row">
      {/* Liste des conversations */}
      <div
        className={`w-full md:w-1/3 border-r border-gray-200 ${
          showMessageForm ? "hidden md:block" : "block"
        }`}
      >
        <h2 className="p-4 text-lg font-semibold">Conversations</h2>
        <div className="conversation-list space-y-4 p-4">
          {conversations.map((conversation) => (
            <div
              key={conversation.id}
              className={`conversation-item p-4 bg-white shadow rounded-lg cursor-pointer hover:bg-gray-100 ${
                conversationId === conversation.id ? "bg-gray-200" : ""
              }`}
              onClick={() => onSelectConversation(conversation.conversationId)}
            >
              <h3 className="text-lg font-semibold">
                {conversation.otherPersonName}
              </h3>
              <p className="text-gray-600 truncate">{conversation.content}</p>
              <span className="text-sm text-gray-500">
                {new Date(conversation.sentAt).toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Formulaire de messages */}
      <div
        className={`w-full md:w-2/3 ${
          showMessageForm ? "block" : "hidden md:block"
        }`}
      >
        <div className="p-4">
          <button
            onClick={goBackToList}
            className="mb-4 text-blue-500 md:hidden"
          >
            Back to conversations
          </button>
          {conversationId ? (
            <MessageForm conversationId={conversationId} userId={userId} />
          ) : (
            <div className="p-4 text-center text-gray-500">
              Select a conversation to start messaging.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConversationList;
