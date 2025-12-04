import React from "react";
import { motion } from "framer-motion";

const WelcomeScreen = ({ dark, onPromptClick }) => {
  const Prompts = [
    "Explain the Heisenberg Uncertainty Principle in simple terms",
    "Generate a Python script for a binary search tree",
    "Draft a professional email to a client about a project delay",
    "Compare and contrast React and Vue frameworks",
  ];

  return (
    <div className="flex flex-col items-center justify-center flex-1 transition-colors">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
        className="mb-8"
      >
        <h1
          className={`text-6xl md:text-8xl font-extrabold tracking-tight transition-colors`}
          style={{
            fontFamily: "'Inter', 'Helvetica Neue Display', sans-serif",
            background: dark
              ? "linear-gradient(to right bottom, #f3f4f6 30%, #a1a1a1 90%)"
              : "linear-gradient(to right bottom, #374151 30%, #111827 90%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          ChatGPT
        </h1>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="w-full max-w-2xl grid grid-cols-1 md:grid-cols-2 gap-4 px-4"
      >
        {Prompts.map((prompt, i) => (
          <motion.button
            key={i}
            whileHover={{ scale: 1.03, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onPromptClick(prompt)}
            className={`p-4 text-left rounded-xl text-sm transition-colors 
              ${dark ? "bg-gray-800 hover:bg-gray-700 text-white" : "bg-white text-gray-800 hover:bg-gray-50"}`}
          >
            {prompt}
          </motion.button>
        ))}
      </motion.div>
    </div>
  );
};

export default WelcomeScreen;