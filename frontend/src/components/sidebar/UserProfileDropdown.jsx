/* eslint-disable no-unused-vars */
import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import {
  CircleUser,
  Settings,
  Plus,
  ChevronDown,
  Sun,
  Moon,
} from "lucide-react";

const UserProfileDropdown = ({ dark, toggleDark }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const menuItems = [
    { name: "Profile", icon: CircleUser },
    { name: "Settings", icon: Settings },
    { name: "Upgrade your plan", icon: Plus, highlight: true },
  ];

  return (
    <div
      className="relative mt-4 pt-4 border-t border-gray-700/50"
      ref={dropdownRef}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center gap-2 p-2 rounded-xl text-sm transition-colors hover:bg-white/10"
      >
        <div className="shrink-0 w-8 h-8 rounded-full bg-gray-500 flex items-center justify-center text-xs">
          HS
        </div>
        <div className="flex-1 text-left">
          <p className="font-semibold text-white">Hanzila Shahid</p>
          <p className="text-xs text-gray-400">Free</p>
        </div>
        <ChevronDown size={16} className="text-gray-400" />
      </button>

      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.15 }}
          className={`absolute bottom-full left-0 mb-2 w-full origin-bottom-left rounded-xl backdrop-blur-md z-40 p-1 
            ${dark ? "bg-black/90 text-white" : "bg-white/90 text-gray-800"}`}
        >
          {menuItems.map((item, i) => (
            <button
              key={i}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                dark ? "hover:bg-gray-800" : "hover:bg-gray-100"
              } ${
                item.highlight
                  ? "font-bold text-green-400 hover:text-green-500"
                  : ""
              }`}
            >
              <item.icon size={16} />
              {item.name}
            </button>
          ))}
          <button
            onClick={() => {
              toggleDark();
              setIsOpen(false);
            }}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
              dark ? "hover:bg-gray-800" : "hover:bg-gray-100"
            }`}
          >
            {dark ? <Sun size={16} /> : <Moon size={16} />}
            {dark ? "Light Mode" : "Dark Mode"}
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
              dark ? "hover:bg-gray-800" : "hover:bg-gray-100"
            }`}
          >
            Log out
          </button>
        </motion.div>
      )}
    </div>
  );
};

export default UserProfileDropdown;
