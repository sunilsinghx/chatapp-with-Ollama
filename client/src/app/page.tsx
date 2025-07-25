// import Image from "next/image";

// export default function Home() {
//   return (
//     <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
//     <div className="w-full max-w-5xl h-[600px] bg-white rounded-lg shadow-lg flex overflow-hidden">
//       {/* Sidebar */}
//       <aside className="w-72 bg-gray-900 text-white flex flex-col p-4">
//         {/* New Chat button */}
//         <button className="mb-4 px-4 py-2 rounded bg-blue-600 hover:bg-blue-700">
//           New Chat
//         </button>

//         {/* Chat list */}
//         <nav className="flex-1 overflow-y-auto">
//           <ul>
//             <li className="p-2 rounded hover:bg-gray-700 cursor-pointer">
//               Marketing Plan - Jul 24
//             </li>
//             {/* more chats */}
//           </ul>
//         </nav>
//       </aside>

//       {/* Chat main area */}
//       <main className="flex flex-col flex-1 bg-gray-100">
//         {/* Messages container */}
//         <div className="flex-1 overflow-y-auto p-6 space-y-4">
//           {/* User message bubble */}
//           <div className="flex justify-end">
//             <div className="bg-blue-600 text-white px-4 py-2 rounded-xl rounded-br-none max-w-[70%]">
//               Hi, how can I help you?
//             </div>
//           </div>

//           {/*  whiteSpace: 'pre-wrap' */}

//           {/* Bot message bubble */}
//           <div className="flex justify-start">
//             <div className="bg-gray-300 text-gray-900 px-4 py-2 rounded-xl rounded-bl-none max-w-[70%]">
//               Hello! What would you like to discuss today?
//             </div>
//           </div>

//           {/* Add more messages here */}
//         </div>

//         {/* Input area */}
//         <form className="p-4 flex gap-2 bg-white border-t">
//           <input
//             type=""
//             placeholder="Type your message..."
//             className="flex-1 border rounded px-3 py-2"
//           />
//           <button
//             type="submit"
//             className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
//           >
//             Send
//           </button>
//           <button
//             type="button"
//             className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
//           >
//             Stop
//           </button>
//         </form>
//       </main>
//     </div>
//   </div>

//   );
// }

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
