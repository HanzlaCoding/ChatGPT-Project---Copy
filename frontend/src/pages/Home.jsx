/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable no-unused-vars */
import React, { useState, useRef, useEffect, useCallback } from "react";
import Sidebar from "../components/sidebar/Sidebar";
import Header from "../components/layout/Header";
import ChatBody from "../components/chat/ChatBody";
import ChatInput from "../components/chat/ChatInput";
import { io } from "socket.io-client";
import { useSelector } from "react-redux";
import { chatAxios } from "../api/ChatInstance";

export default function App() {
  const [dark, setDark] = useState(true);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);
  const [socket, setSocket] = useState(null);

  const toggleDark = () => setDark((prev) => !prev);
  const titles = useSelector((state) => state.chat?.chat ?? []);
  const userId = titles.length > 0 ? titles[0]?.user : null;
  console.log("userId:", userId, "titles:", titles);

  const send = async (textToSend = input) => {
    console.log(input, textToSend);

    if (!textToSend.trim()) return;

    const userMsg = { role: "user", message: textToSend };
    setMessages((prev) => [...prev, userMsg]);
    console.log(userMsg, textToSend);

    console.log(titles);

    setInput("");
    setLoading(true);

    if (!socket) {
      console.warn("socket not connected yet");
      setLoading(false);
    } else {
      socket.emit("ai-message", {
        chatId: titles[0]?.id,
        message: textToSend,
      });

      socket.once("ai-message", (data) => {
        console.log("Received ai-message:", data);
        setMessages((prev) => [
          ...prev,
          { role: "assistant", message: data.reply },
        ]);
        setLoading(false);
      });
    }

    console.log(messages);
  };

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  useEffect(() => {
    let sock;
    try {
      sock = io("http://localhost:4000", { withCredentials: true });
      setSocket(sock);
    } catch (err) {
      console.log(err?.message ?? err);
    }

    return () => { 
      try {
        sock?.disconnect();
      } catch (_) {}
    };
  }, []);

  useEffect(() => {
    if (!userId) return; // wait until userId is available

    const loadMessages = async () => {
      try {
        const response = await chatAxios.get(`/messages/${userId}`, {
          withCredentials: true,
        });
        console.log("Loaded messages:", response.data);
        setMessages(response.data.messages)
      } catch (err) {
        console.error("Error loading messages:", err);
      }
    };

    loadMessages();
  }, [userId]);

  const handlePromptClick = (prompt) => {
    send(prompt);
  };

  return (
    <div
      className={`h-screen flex overflow-hidden relative transition-colors ${
        dark ? "bg-[#0d0d0f] text-gray-200" : "bg-gray-100 text-gray-900"
      }`}
      style={{
        fontFamily: "'Inter', 'Helvetica Neue', Helvetica, Arial, sans-serif",
      }}
    >
      <Sidebar dark={dark} toggleDark={toggleDark} />

      <div className="flex-1 flex flex-col">
        <Header dark={dark} />

        <ChatBody
          dark={dark}
          messages={messages}
          loading={loading}
          chatEndRef={chatEndRef}
          onPromptClick={handlePromptClick}
        />

        <ChatInput dark={dark} input={input} setInput={setInput} send={send} />
      </div>
    </div>
  );
}