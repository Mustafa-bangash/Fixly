
import { useCallback, useEffect, useState } from "react";
import socket from "../services/socket";

const API_URL = "http://localhost:5000/api";

export default function useConversationChat(conversationId) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [joined, setJoined] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!conversationId) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setMessages([]);
      setJoined(false);
      return;
    }

    let active = true;

    setMessages([]);
    setJoined(false);
    setLoading(true);
    setError("");

    const addMessage = (message) => {
      if (!active || message.conversationId !== conversationId) {
        return;
      }

      setMessages((previous) => {
        if (previous.some((item) => item.id === message.id)) {
          return previous;
        }

        return [...previous, message];
      });
    };

    const handleJoined = (data) => {
      if (data?.conversationId === conversationId) {
        setJoined(true);
      }
    };

    const handleError = (data) => {
      if (data?.event === "conversation:join") {
        setJoined(false);
      }

      setError(data?.message || "A chat error occurred.");
    };

    const joinRoom = () => {
      socket.emit("conversation:join", { conversationId });
    };

    socket.on("conversation:joined", handleJoined);
    socket.on("message:new", addMessage);
    socket.on("chat:error", handleError);

    if (socket.connected) {
      joinRoom();
    } else {
      socket.on("connect", joinRoom);
    }

    async function loadMessages() {
      try {
        const response = await fetch(
          `${API_URL}/conversations/${conversationId}/messages`,
          {
            method: "GET",
            credentials: "include",
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Unable to load messages.");
        }

        if (active) {
          setMessages((previous) => {
            const combined = [...data.messages, ...previous];
            const unique = new Map(
              combined.map((message) => [message.id, message])
            );

            return [...unique.values()].sort(
              (a, b) => new Date(a.sentAt) - new Date(b.sentAt)
            );
          });
        }
      } catch (err) {
        if (active) {
          setError(err.message || "Unable to load messages.");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadMessages();

    return () => {
      active = false;

      socket.off("conversation:joined", handleJoined);
      socket.off("message:new", addMessage);
      socket.off("chat:error", handleError);
      socket.off("connect", joinRoom);

      if (socket.connected) {
        socket.emit("conversation:leave", { conversationId });
      }
    };
  }, [conversationId]);

  const sendMessage = useCallback(
    (content) => {
      if (!conversationId) {
        setError("Please select a conversation first.");
        return;
      }

      if (!joined) {
        setError("The chat is not connected yet.");
        return;
      }

      if (!content.trim()) {
        setError("Please enter a message.");
        return;
      }

      setError("");

      socket.emit("message:send", {
        conversationId,
        content: content.trim(),
      });
    },
    [conversationId, joined]
  );

  return {
    messages,
    loading,
    joined,
    error,
    sendMessage,
  };
}
