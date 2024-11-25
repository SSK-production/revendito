"use client";
import React, { useState } from "react";
import { messaging } from "@/utils/interfaces/messagesInterfaces";

export default function Messaging() {
  const [message, setMessage] = useState<messaging>({
    id: 0, // Default value for id
    senderId: "",
    receiverId: "",
    content: "",
    sentAt: "", // Default empty string
    read: false, // Initially false
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setMessage((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    // Handle form submission (e.g., send the message to a server)
    console.log(message);

    // Clear the input field after sending the message
    setMessage((prevState) => ({
      ...prevState,
      content: "", // Clear the content after submission
    }));
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          <input
            type="text"
            id="content"
            name="content"
            value={message.content}
            onChange={handleChange}
          />
        </div>
        <div>
          <button type="submit">Send Message</button>
        </div>
      </form>
    </div>
  );
}
