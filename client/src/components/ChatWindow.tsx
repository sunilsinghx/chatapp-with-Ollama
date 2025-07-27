"use client";

import React, { useEffect, useState, useRef } from "react";
import MessageBubble from "./MessageBubble";
import MessageInput from "./MessageInput";
import { TypingIndicator } from "./TypingEffect";
import { getChatsById, sendMessage, stopMessage } from "@/api/api";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

interface ChatWindowProps {
  chatId: string;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ chatId }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [loading,setLoading]=useState(false)
  const eventSourceRef = useRef<EventSource | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
   const [isFinished, setIsFinished] = useState(false);

  // Fetch chat messages on load or when chatId changes
  useEffect(() => {
    async function fetchMessages() {
      const data = await getChatsById({ chatId });
      setMessages(data);
    }
    fetchMessages();
  }, [chatId]);



  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  

  const sendMsg = async (message: string) => {
    const userMessage = {
      id: Date.now().toString(),
      role: "user" as const,
      content: message,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsStreaming(true);
    setLoading(true)
    setIsFinished(false)

    try {
      const res = await sendMessage({ chatId, message });

      if (!res?.body) {
        throw new Error("No response body");
      }

      setLoading(false)
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let assistantMessage = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done)
        {
          setIsFinished(true)
          break;
        } 

        const chunk = decoder.decode(value);
        assistantMessage += chunk;

        setMessages((prev) => {
          const last = prev[prev.length - 1];
          if (last?.role === "assistant") {
            return [
              ...prev.slice(0, -1),
              { ...last, content: assistantMessage },
            ];
          }

          return [
            ...prev,
            {
              id: Date.now().toString(),
              role: "assistant" as const,
              content: assistantMessage,
              timestamp: new Date().toISOString(),
            },
          ];
        });
      }
    } catch (error) {
      console.error("sendMsg error:", error);
    } finally {
      setIsStreaming(false);
    }
  };

  const stopStreaming = async () => {
    setIsStreaming(false);
    setLoading(false)
    await stopMessage({ chatId });
  };

  return (
    <main className="flex flex-col flex-1 bg-gray-100">
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((msg,i) => {
          return (
            <MessageBubble key={msg.id} role={msg.role} content={msg.content} isTyping={isStreaming && i===messages.length-1}
            isFinished ={isFinished}
            />
          );
        })}


        <div ref={messagesEndRef} />
      </div>

      <MessageInput
        onSend={sendMsg}
        onStop={stopStreaming}
        isStreaming={isStreaming}
        loading={loading}
      />
    </main>
  );
};

export default ChatWindow;
