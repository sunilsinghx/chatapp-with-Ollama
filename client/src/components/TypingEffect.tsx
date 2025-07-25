"use client";

import React, { useEffect, useState } from "react";

interface TypingEffectProps {
  text: string;
  isFinished?:boolean
}

const TypingEffect: React.FC<TypingEffectProps> = ({ text,isFinished}) => {
  const [showCursor, setShowCursor] = useState(true);

  // Cursor blink effect (only while typing)
  useEffect(() => {
    if (isFinished) {
      setShowCursor(false); 
      return;
    }

    const blink = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 500);

    return () => clearInterval(blink);
  }, [isFinished]);

  return (
    <span>
      {text}
      <span
        className={`inline-block ml-1 w-[0.7ch] h-[1.2em] bg-neutral-700 align-bottom ${
          showCursor ? "opacity-100" : "opacity-0"
        }`}
      ></span>
    </span>
  );
};


export const TypingIndicator: React.FC = () => {
  return (
    <div className="flex justify-start items-center m-2 space-x-1 h-[1.5rem]">
      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0s" }} />
      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }} />
    </div>
  );
};


export default TypingEffect;
