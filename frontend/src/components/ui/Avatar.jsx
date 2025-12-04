/* eslint-disable no-unused-vars */
import React from "react";
import { motion } from "framer-motion";
import { User, Zap } from "lucide-react";

const Avatar = ({ role, dark }) => {
  const isUser = role === "user";
  const icon = isUser ? User : Zap;

  const bgColor = isUser
    ? dark
      ? "bg-gray-400"
      : "bg-gray-700"
    : dark
    ? "bg-gray-700"
    : "bg-gray-300";

  const iconColor = isUser
    ? dark
      ? "text-gray-800"
      : "text-white"
    : dark
    ? "text-white"
    : "text-gray-700";

  return (
    <div
      className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-colors ${bgColor}`}
    >
      <motion.div
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className={iconColor}
      >
        {React.createElement(icon, { size: 18 })}
      </motion.div>
    </div>
  );
};

export default Avatar;
