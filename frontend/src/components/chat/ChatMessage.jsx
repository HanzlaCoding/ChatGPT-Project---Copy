/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/static-components */
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Copy, ThumbsUp, ThumbsDown, RefreshCw, Edit } from "lucide-react";
import ReactMarkdown from "react-markdown";
import Avatar from "../ui/Avatar";

const ChatMessageActions = ({ dark }) => {
  const ActionButton = ({ icon: Icon, label }) => (
    <button
      className={`p-1 rounded-full transition-colors opacity-70 ${
        dark
          ? "text-gray-400 hover:text-white"
          : "text-gray-600 hover:text-black"
      }`}
      aria-label={label}
    >
      <Icon size={16} />
    </button>
  );

  return (
    <div
      className={`flex space-x-2 mt-2 ml-10 transition-colors ${
        dark ? "text-gray-500" : "text-gray-400"
      }`}
    >
      <ActionButton icon={Copy} label="Copy" />
      <ActionButton icon={ThumbsUp} label="Like" />
      <ActionButton icon={ThumbsDown} label="Dislike" />
      <ActionButton icon={RefreshCw} label="Regenerate" />
      <ActionButton icon={Edit} label="Edit" />
    </div>
  );
};

const ChatMessage = ({ role, message, dark }) => {
  const [isHovered, setIsHovered] = useState(false);
  const isUser = role === "user";

  return (
    <div
      className={`w-full flex transition-colors ${
        isUser ? "justify-end" : "justify-start"
      }`}
      onMouseEnter={() => !isUser && setIsHovered(true)}
      onMouseLeave={() => !isUser && setIsHovered(false)}
    >
      <div
        className={`flex items-start max-w-[80%] ${
          isUser ? "flex-row-reverse" : "flex-row"
        }`}
      >
        <Avatar role={role} dark={dark} />
        <div className="flex flex-col mx-3">
          <div
            className={`max-w-full px-4 py-2 rounded-2xl transition-colors text-sm 
            ${
              isUser
                ? dark
                  ? "bg-gray-200 text-black rounded-br-md"
                  : "bg-gray-800 text-white rounded-br-md"
                : dark
                ? "bg-[#282828] text-gray-200 rounded-tl-md"
                : "bg-white text-gray-800 rounded-tl-md"
            }`}
          >
            {isUser ? (
              <div className="whitespace-pre-wrap">{message}</div>
            ) : (
              <ReactMarkdown
                components={{
                  p: ({ node, ...props }) => (
                    <p className="mb-2 last:mb-0" {...props} />
                  ),
                  ul: ({ node, ...props }) => (
                    <ul className="list-disc list-inside mb-2" {...props} />
                  ),
                  ol: ({ node, ...props }) => (
                    <ol className="list-decimal list-inside mb-2" {...props} />
                  ),
                  li: ({ node, ...props }) => (
                    <li className="mb-1" {...props} />
                  ),
                  code: ({ node, inline, ...props }) =>
                    inline ? (
                      <code
                        className={`px-1 py-0.5 rounded ${
                          dark
                            ? "bg-gray-700 text-orange-300"
                            : "bg-gray-200 text-red-600"
                        }`}
                        {...props}
                      />
                    ) : (
                      <code
                        className={`block p-2 rounded mb-2 overflow-x-auto ${
                          dark
                            ? "bg-gray-900 text-orange-300"
                            : "bg-gray-100 text-gray-800"
                        }`}
                        {...props}
                      />
                    ),
                  blockquote: ({ node, ...props }) => (
                    <blockquote
                      className={`border-l-4 pl-3 my-2 italic ${
                        dark ? "border-gray-500" : "border-gray-400"
                      }`}
                      {...props}
                    />
                  ),
                  h1: ({ node, ...props }) => (
                    <h1 className="text-lg font-bold mb-2" {...props} />
                  ),
                  h2: ({ node, ...props }) => (
                    <h2 className="text-base font-bold mb-2" {...props} />
                  ),
                  h3: ({ node, ...props }) => (
                    <h3 className="text-sm font-bold mb-1" {...props} />
                  ),
                }}
              >
                {message}
              </ReactMarkdown>
            )}
          </div>
          {!isUser && isHovered && <ChatMessageActions dark={dark} />}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
