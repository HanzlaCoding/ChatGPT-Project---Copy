import { motion } from "framer-motion";
import WelcomeScreen from "./WelcomeScreen";
import ChatMessage from "./ChatMessage";
import Avatar from "../ui/Avatar";
import React from "react";

const LoadingIndicator = ({ dark }) => {
  const dotVariants = {
    animate: {
      y: [0, -8, 0],
      transition: { duration: 0.6, repeat: Infinity },
    },
  };

  return (
    <div className="flex items-start gap-3">
      <Avatar role="assistant" dark={dark} />
      <div className="flex gap-2 mt-2">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            variants={dotVariants}
            animate="animate"
            transition={{ delay: i * 0.2 }}
            className={`w-2 h-2 rounded-full ${
              dark ? "bg-gray-400" : "bg-gray-600"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

const ChatBody = ({
  dark,
  messages,
  loading,
  initialLoading,
  chatEndRef,
  onPromptClick,
}) => {
  return (
    <div
      className="flex-1 flex flex-col overflow-y-auto"
      style={{
        scrollbarWidth: "thin",
        scrollbarColor: dark ? "#374151 #1f2937" : "#d1d5db #f3f4f6",
      }}
    >
      {initialLoading ? (
        <div className="flex items-center justify-center flex-1">
          <div className="flex gap-2">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.2 }}
                className={`w-3 h-3 rounded-full ${
                  dark ? "bg-gray-400" : "bg-gray-600"
                }`}
              />
            ))}
          </div>
        </div>
      ) : messages.length === 0 ? (
        <WelcomeScreen dark={dark} onPromptClick={onPromptClick} />
      ) : (
        <div className="p-6 space-y-6 max-w-4xl mx-auto w-full">
          {messages.map((m, i) => (
            <ChatMessage
              key={i}
              role={m.role}
              message={m.content ?? m.text}
              dark={dark}
            />
          ))}
          {loading && <LoadingIndicator dark={dark} />}
          <div ref={chatEndRef} />
        </div>
      )}
    </div>
  );
};

export default ChatBody;
