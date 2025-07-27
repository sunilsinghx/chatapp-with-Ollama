"use client"

import React from 'react';
import ReactMarkdown from 'react-markdown';
import TypingEffect from "./TypingEffect";

interface MessageBubbleProps {
  role: 'user' | 'assistant';
  content: string;
  isTyping?: boolean;
  isFinished?:boolean
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ role, content, isTyping = false,isFinished }) => {
  const isUser = role === 'user';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`px-4 py-2 rounded-xl max-w-[70%] whitespace-pre-wrap transform transition-all duration-300 ease-out opacity-0 fade-in ${
          isUser
            ? 'bg-blue-600 text-white rounded-br-none translate-x-4'
            : 'bg-gray-300 text-gray-900 rounded-bl-none -translate-x-4'
        }`}
      >
         {isUser ? (
          content
        ) : isTyping ? (
          <TypingEffect text={content} isFinished={isFinished} />
        ) : (
          <ReactMarkdown>{content}</ReactMarkdown>
        )}
      </div>
    </div>
  );
};

export default MessageBubble;
