import { useState, useEffect } from "react";
import { useGetUserProfile } from "@/hooks/user/get/useGetUserProfile";

export type Message = {
  role: "user" | "assistant";
  content: string;
};

export const useDifyChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [authToken, setAuthToken] = useState<string | null>(localStorage.getItem("token"));
  const { data: userProfile } = useGetUserProfile();
  const userId = userProfile?.id ?? "guest";

  useEffect(() => {
    const checkToken = () => {
      const current = localStorage.getItem("token");
      if (current !== authToken) {
        setAuthToken(current);
      }
    };
    const interval = setInterval(checkToken, 1000);
    return () => clearInterval(interval);
  }, [authToken]);

  useEffect(() => {
    if (authToken) {
      const key = `dify_chat_history_${authToken}`;
      const saved = localStorage.getItem(key);
      if (saved) {
        try {
          const data = JSON.parse(saved);
          setMessages(data.messages || []);
          setConversationId(data.conversationId || null);
        } catch (e) {
          console.error("Failed to load chat history", e);
          setMessages([]);
          setConversationId(null);
        }
      } else {
        setMessages([]);
        setConversationId(null);
      }
    } else {
      setMessages([]);
      setConversationId(null);
    }
  }, [authToken]);

  useEffect(() => {
    if (authToken && (messages.length > 0 || conversationId)) {
      const key = `dify_chat_history_${authToken}`;
      localStorage.setItem(key, JSON.stringify({ messages, conversationId }));
    }
  }, [messages, conversationId, authToken]);

  const sendMessage = async (message: string) => {
    if (!message.trim()) return;

    const userMsg: Message = { role: "user", content: message };
    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const API_KEY = "app-Go2DBhyyY6pL3S6l7bpxrmf1"; 
      const BASE_URL = "https://api.dify.ai/v1";

      const response = await fetch(`${BASE_URL}/chat-messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${API_KEY}`,
        },
        body: JSON.stringify({
          inputs: {},
          query: message,
          response_mode: "streaming",
          conversation_id: conversationId,
          user: userId,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) throw new Error("No reader available");

      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);
      
      let assistantMessage = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const jsonStr = line.slice(6);
            if (!jsonStr.trim()) continue;

            try {
              const data = JSON.parse(jsonStr);
              
              if (data.conversation_id) {
                setConversationId(data.conversation_id);
              }

              if (data.event === "message") {
                assistantMessage += data.answer;
                setMessages((prev) => {
                  const newMessages = [...prev];
                  const lastMsg = newMessages[newMessages.length - 1];
                  if (lastMsg.role === "assistant") {
                    lastMsg.content = assistantMessage;
                  }
                  return newMessages;
                });
              }
            } catch (e) {
              console.error("Error parsing JSON chunk", e);
            }
          }
        }
      }
    } catch (error) {
      console.error("Chat Error:", error);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "ขออภัย เกิดข้อผิดพลาดในการเชื่อมต่อ" },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return { messages, isLoading, sendMessage };
};