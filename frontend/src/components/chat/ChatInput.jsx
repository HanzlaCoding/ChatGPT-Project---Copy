import { useCallback } from "react";
import { motion } from "framer-motion";
import { Mic, Send } from "lucide-react";
import React from "react";

const ChatInput = ({ dark, input, setInput, send }) => {
  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        send();
      }
    },
    [send]
  );

  const handleInputChange = (e) => {
    setInput(e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = e.target.scrollHeight + "px";
  };

  return (
    <div
      className={`pt-4 pb-6 px-4 backdrop-blur-sm z-20 transition-colors ${
        dark ? "bg-[#0d0d0f]/90" : "bg-gray-100/90"
      }`}
    >
      <div
        className={`max-w-4xl mx-auto flex items-end p-2 rounded-2xl transition-colors ${
          dark ? "bg-[#1a1a1d]" : "bg-white shadow-inner"
        }`}
      >
        <textarea
          className={`flex-1 min-h-11 max-h-48 resize-none bg-transparent outline-none p-2 text-sm transition-colors ${
            dark ? "text-gray-200" : "text-gray-800"
          }`}
          placeholder="Ask anything"
          rows={1}
          value={input}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
        />
        <button
          className={`p-2 rounded-full transition-all shrink-0 ml-2 ${
            dark
              ? "bg-gray-700 hover:bg-gray-600 text-white"
              : "bg-gray-800 hover:bg-gray-700 text-white"
          }`}
        >
          <Mic size={18} />
        </button>
        <motion.button
          onClick={() => send()}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`p-2 rounded-full transition-all shrink-0 ml-2 ${
            dark
              ? "bg-gray-200 hover:bg-gray-50 text-black"
              : "bg-black hover:bg-gray-700 text-white"
          }`}
        >
          <Send size={18} />
        </motion.button>
      </div>
      <p
        className={`text-xs mt-2 text-center transition-colors ${
          dark ? "text-gray-500" : "text-gray-500"
        }`}
      >
        ChatGPT can make mistakes. Check important info.
      </p>
    </div>
  );
};

export default ChatInput;