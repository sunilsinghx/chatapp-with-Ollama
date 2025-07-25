"use client";
import { Chat } from "@/app/page";
import React from "react";

interface ChatSidebarProps {
  chats: Chat[];
  activeChatId: string | null;
  onSelectChat: (id: string) => void;
  onNewChat: () => void;
}

const ChatSidebar: React.FC<ChatSidebarProps> = ({
  chats,
  activeChatId,
  onSelectChat,
  onNewChat,
}) => {
  return (
    <aside className="w-72 bg-gray-900 text-white flex flex-col p-4">
      <button
        onClick={onNewChat}
        className="mb-4 px-4 py-2 rounded bg-blue-600 hover:bg-blue-700"
      >
        New Chat
      </button>

      <nav className="flex-1 overflow-y-auto">
        <ul>
          {chats?.map((chat,i) => (
            <li
              key={chat.id+"-"+i}
              onClick={() => onSelectChat(chat.id)}
              className={`p-2 rounded cursor-pointer text-neutral-200 m-1 ${
                chat.id === activeChatId ? "bg-gray-500" : "hover:bg-gray-700"
              }`}
            >

              {chat.title?.length > 30
                ? chat.title.slice(0, 30) + "..."
                : chat.title
                ? chat.title
                : "New Chat"}{" "}
              -{" "}
              {new Date(chat?.created_at || Date.now()).toLocaleDateString(
                "en-US",
                {
                  month: "short",
                  day: "numeric",
                  // year: "numeric",
                }
              )}
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default ChatSidebar;
