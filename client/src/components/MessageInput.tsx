"use client";

import React, { useState } from "react";
import { TypingIndicator } from "./TypingEffect";

interface MessageInputProps {
  onSend: (message: string) => void;
  onStop: () => void;
  isStreaming: boolean;
  loading:boolean
}

const MessageInput: React.FC<MessageInputProps> = ({
  onSend,
  onStop,
  isStreaming,
  loading
}) => {
  const [input, setInput] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      onSend(input.trim());
      setInput("");
    }
  };

  return (
    <>
      {loading && (
        <div>
          <TypingIndicator />
        </div>
      )}
      <form
        onSubmit={handleSubmit}
        className="p-4 flex gap-2 bg-white border-t"
      >
        <input
          type="text"
          placeholder="Type your message..."
          className="flex-1 border rounded px-3 py-2 outline-none"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={isStreaming}
        />
        <button
          type="submit"
          disabled={isStreaming}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          Send
        </button>
        {isStreaming && (
          <button
            type="button"
            onClick={onStop}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            🚫Stop
          </button>
        )}
      </form>
    </>
  );
};

export default MessageInput;
