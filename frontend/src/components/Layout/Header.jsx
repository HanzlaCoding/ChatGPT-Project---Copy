import React from "react";
import { motion } from "framer-motion";

const Header = ({ dark }) => {
  return (
    <header className={`h-14 flex items-center justify-between px-4 backdrop-blur-md z-20 transition-colors ${dark ? "bg-[#0d0d0f]/80" : "bg-white/80"}`}>
      <h1 className="text-sm font-medium opacity-80">ChatGPT</h1>
      <div className="flex items-center space-x-4">
        <motion.div
          whileHover={{ scale: 1.05 }}
          className={`text-xs px-3 py-1 rounded-full font-semibold transition-colors ${dark ? "bg-purple-700/50 text-purple-300" : "bg-purple-100 text-purple-700"}`}
        >
          Upgrade to Go
        </motion.div>
        <button className={`text-sm px-3 py-1 rounded-xl transition-colors ${dark ? "text-gray-400 hover:text-white" : "text-gray-600 hover:text-black"}`}>
          Share
        </button>
        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs ${dark ? "bg-gray-700 text-gray-400" : "bg-gray-300 text-gray-700"}`}>
          HS
        </div>
      </div>
    </header>
  );
};

export default Header;