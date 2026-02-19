import { useState, useEffect, useRef, useCallback } from "react";
import { useGetUserProfile } from "@/hooks/user/get/useGetUserProfile";
import { getUserRole } from "@/lib/auth";
import { sendDifyMessage } from "@/lib/dify";

export type Message = {
  role: "user" | "assistant";
  content: string;
};

export const useDifyChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [authToken, setAuthToken] = useState<string | null>(() => localStorage.getItem("token"));
  const { data: userProfile } = useGetUserProfile();
  const userId = userProfile?.id ?? "undefined";
  const userRole = getUserRole();
  const controllerRef = useRef<AbortController | null>(null);

  const messagesRef = useRef<Message[]>([]);
  const authTokenRef = useRef<string | null>(authToken);
  const userIdRef = useRef(userId);
  const userRoleRef = useRef(userRole);

  useEffect(() => {
    messagesRef.current = messages;
    authTokenRef.current = authToken;
    userIdRef.current = userId;
    userRoleRef.current = userRole;
  }, [messages, authToken, userId, userRole]);

  const saveChatHistory = useCallback(async (token: string) => {
    const msgs = messagesRef.current;
    if (msgs.length === 0) return;

    if (!userIdRef.current || userIdRef.current === "undefined") return;
    
    const payload: { history: Message[]; admin_id?: string; researcher_id?: string } = {
      history: msgs,
    };

    if (userRoleRef.current === "admin") {
      payload.admin_id = userIdRef.current;
    } else {
      payload.researcher_id = userIdRef.current;
    }

    const API_URL = import.meta.env.VITE_PUBLIC_API_URL;
    const res = await fetch(`${API_URL}/trl/chat-log`, {
      method: "POST",
      keepalive: true,
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error(`Failed to save chat history: ${res.status}`);
  }, []);

  useEffect(() => {
    return () => {
      controllerRef.current?.abort();
      const current = localStorage.getItem("token");
      if (!current && authTokenRef.current) {
        saveChatHistory(authTokenRef.current).catch(console.error);
      }
    };
  }, [saveChatHistory]);

  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === "token") {
        const current = event.newValue;
        if (current !== authToken) {
          if (!current && authToken) {
            saveChatHistory(authToken).catch(console.error);
          }
          setAuthToken(current);
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [authToken, saveChatHistory]);

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
    if (authToken && !isLoading && (messages.length > 0 || conversationId)) {
      const key = `dify_chat_history_${authToken}`;
      localStorage.setItem(key, JSON.stringify({ messages, conversationId }));
    }
  }, [messages, conversationId, authToken, isLoading]);

  const resetChat = useCallback(async () => {
    controllerRef.current?.abort();
    if (authTokenRef.current) {
      try {
        await saveChatHistory(authTokenRef.current);
        localStorage.removeItem(`dify_chat_history_${authTokenRef.current}`);
      } catch (error) {
        console.error("Failed to save history on reset:", error);
      }
    }
    setMessages([]);
    setConversationId(null);
    setIsLoading(false);
  }, [saveChatHistory]);

  const sendMessage = async (message: string) => {
    if (!message.trim()) return;
    controllerRef.current?.abort();
    const controller = new AbortController();
    controllerRef.current = controller;

    const userMsg: Message = { role: "user", content: message };
    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    try {
      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);
      
      let assistantMessage = "";

      await sendDifyMessage(
        message,
        conversationId,
        userId,
        controller.signal,
        {
          onMessage: (chunk, convId) => {
            if (convId) setConversationId(convId);
            assistantMessage += chunk;
            setMessages((prev) => {
              const newMessages = [...prev];
              const lastIdx = newMessages.length - 1;
              if (newMessages[lastIdx].role === "assistant") {
                newMessages[lastIdx] = { ...newMessages[lastIdx], content: assistantMessage };
              }
              return newMessages;
            });
          },
          onError: (error) => {
            throw error;
          }
        }
      );
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        return;
      }
      console.error("Chat Error:", error);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "ขออภัย เกิดข้อผิดพลาดในการเชื่อมต่อ" },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return { messages, isLoading, sendMessage, resetChat };
};