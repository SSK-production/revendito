"use client";
import { useEffect, useState } from "react";
import ConversationList from "@/app/components/Messages/ConversationList";
import axios from "axios";

const MessagesPage: React.FC = () => {
  const [id, setId] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const response = await axios.get("/api/auth", { withCredentials: true });
        setId(response.data.id);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to fetch user data.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserId();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-lg font-semibold">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-lg font-semibold text-red-500">{error}</p>
      </div>
    );
  }

  return (


        <ConversationList userId={id} />

  );
};

export default MessagesPage;
