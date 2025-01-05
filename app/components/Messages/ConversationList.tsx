"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import MessageForm from "@/app/components/Messages/MessageForm";
import Pusher from "pusher-js";

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

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize] = useState<number>(3); // Nombre de conversations par page
  const [hasMore, setHasMore] = useState<boolean>(true);

  // Fonction pour récupérer les conversations avec pagination
  const fetchConversations = async (page: number) => {
    if (!userId) {
      setError("User ID is required to fetch conversations.");
      setLoading(false);
      return;
    }

    setLoading(true);

    try {
      const response = await axios.get(
        `/api/messages?userId=${userId}&page=${page}&pageSize=${pageSize}`
      );
      const newConversations = response.data.conversations || [];

      setConversations((prev) => {
        // Fusionner les nouvelles conversations avec les existantes en éliminant les doublons
        const merged = [...prev, ...newConversations].reduce(
          (unique, convo) => {
            if (!unique.some((c: Conversation) => c.conversationId === convo.conversationId)) {
              unique.push(convo);
            }
            return unique;
          },
          [] as Conversation[]
        );

        return merged;
      });

      // Si moins de conversations que le pageSize, on a atteint la fin
      if (newConversations.length < pageSize) {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Failed to fetch conversations:", error);
      setError("Failed to load conversations.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConversations(1); // Charger la première page au chargement
  }, [userId]);

  // Fonction pour charger plus de conversations
  const loadMoreConversations = () => {
    if (hasMore && !loading) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      fetchConversations(nextPage);
    }
  };

  // Abonnement à Pusher
  useEffect(() => {
    if (!userId) return;

    if (
      !process.env.NEXT_PUBLIC_PUSHER_KEY ||
      !process.env.NEXT_PUBLIC_PUSHER_CLUSTER
    ) {
      console.error("Les variables d'environnement Pusher sont manquantes.");
      return;
    }

    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER,
    });

    const channel = pusher.subscribe(`conversations-${userId}`);

    channel.bind("new-conversation", (newConversation: Conversation) => {
      setConversations((prev) => {
        const conversationIndex = prev.findIndex(
          (conversation) => conversation.conversationId === newConversation.id
        );
        console.log(newConversation);
        
        if (conversationIndex !== -1) {
          // Mise à jour et déplacement de la conversation mise à jour en tête
          const updatedConversations = [...prev];
          const updatedConversation = {
            ...updatedConversations[conversationIndex],
            ...newConversation, // Mise à jour des propriétés
          };

          // Supprimez l'ancienne conversation et ajoutez la mise à jour en tête
          updatedConversations.splice(conversationIndex, 1);
          return [updatedConversation, ...updatedConversations];
        }

        // Ajouter une nouvelle conversation en tête si elle n'existe pas
        return [newConversation, ...prev];
      });
    });

    return () => {
      channel.unbind("new-conversation");
      pusher.unsubscribe(`conversations-${userId}`);
    };
  }, [userId]);


  const onSelectConversation = (id: string) => {
    setConversationId(id);
    setShowMessageForm(true); // Affiche le formulaire de message
  };

  const goBackToList = () => {
    setShowMessageForm(false); // Retour à la liste des conversations
  };

  if (error) {
    return <div className="p-4 text-center text-red-500">{error}</div>;
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
            <div
                className="conversation-list space-y-2 p-2 overflow-y-auto h-full"
                style={{ maxHeight: "calc(100vh - 64px)" }} // Ajustez la hauteur disponible
            >
                {conversations.map((conversation) => {
                    const messageDate = new Date(conversation.sentAt);
                    const now = new Date();
                    const differenceInDays = Math.floor(
                        (now.getTime() - messageDate.getTime()) / (1000 * 60 * 60 * 24)
                    );

                    const displayDate =
                        differenceInDays > 1
                            ? `Il y a ${differenceInDays} jours`
                            : differenceInDays === 1
                            ? "Il y a 1 jour"
                            : messageDate.toLocaleTimeString([], {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                });

                    return (
                        <div
                            key={conversation.id}
                            className={`conversation-item p-3 bg-white shadow-sm rounded-md cursor-pointer hover:bg-gray-100 ${
                                conversationId === conversation.id ? "bg-gray-200" : ""
                            } flex items-center`}
                            onClick={() => onSelectConversation(conversation.conversationId)}
                        >
                            <div className="flex-1">
                                <h3 className="text-sm font-medium">
                                    {conversation.otherPersonName}
                                </h3>
                                <p className="text-xs text-gray-600 truncate">
                                    {conversation.content}
                                </p>
                            </div>
                            <span className="text-xs text-gray-400 whitespace-nowrap ml-2">
                                {displayDate}
                            </span>
                        </div>
                    );
                })}

                {hasMore && !loading && (
                    <button
                        onClick={loadMoreConversations}
                        className="w-full text-center py-2 text-blue-500"
                    >
                        Charger plus
                    </button>
                )}
                {loading && (
                    <div className="text-center text-gray-500 py-2">
                        Chargement...
                    </div>
                )}
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
                    Retour aux conversations
                </button>
                {conversationId ? (
                    <MessageForm conversationId={conversationId} userId={userId} />
                ) : (
                    <div className="p-4 text-center text-gray-500">
                        Sélectionnez une conversation pour commencer à discuter.
                    </div>
                )}
            </div>
        </div>
    </div>
);
  
};

export default ConversationList;
