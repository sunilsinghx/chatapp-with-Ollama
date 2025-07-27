"use client";

import React, { useState, useEffect } from "react";
import ChatSidebar from "../components/ChatSideBar";
import ChatWindow from "../components/ChatWindow";
import { createChat, getChats } from "@/api/api";

export interface Chat {
  id: string;
  title: string;
  created_at: string;
}

export default function Home() {
  const [chats, setChats] = useState<Chat[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);


  useEffect(() => {
    fetchChats();
  }, []);

  async function fetchChats() {
    const data = await getChats()
    setChats(data);
    if (data.length > 0) {
      setActiveChatId(data[0].id);
    }
  }

  const handleNewChat = async () => {
    await createChat()
    await fetchChats()

  };

  return (
    <div>
      <div className="flex items-center justify-center min-h-screen bg-gray-200 p-4">
        <div className="w-full max-w-5xl h-[600px] bg-white rounded-lg shadow-lg flex overflow-hidden">
          <ChatSidebar
            chats={chats}
            activeChatId={activeChatId}
            onSelectChat={setActiveChatId}
            onNewChat={handleNewChat}
          />
          {activeChatId ? (
            <ChatWindow chatId={activeChatId} />
          ) : (
            <div className="flex flex-1 justify-center items-center text-gray-800 text-lg">
              No Messages yet.....
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
