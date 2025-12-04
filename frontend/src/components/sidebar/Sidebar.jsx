/* eslint-disable no-unused-vars */
import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import UserProfileDropdown from "./UserProfileDropdown";
import { chatAxios } from "../../api/ChatInstance";
import { loadTitle } from "../../store/reducers/ChatSlice";
import { useDispatch, useSelector } from "react-redux";

const NavItem = ({ icon: Icon, label, dark }) => (
  <button
    className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm transition-colors ${
      dark
        ? "text-gray-300 hover:bg-gray-700/70"
        : "text-gray-700 hover:bg-gray-200"
    }`}
  >
    <Icon size={18} className="opacity-70" />
    <span className="truncate">{label}</span>
  </button>
);

const ChatHistoryItem = ({ label, dark }) => (
  <button
    className={`w-full text-left truncate px-3 py-2 rounded-xl text-sm transition-colors block ${
      dark
        ? "text-gray-400 hover:bg-gray-700/70"
        : "text-gray-700 hover:bg-gray-200"
    }`}
  >
    {label}
  </button>
);

const createChatTitle = async () => {
  const title = prompt("Enter chat title");
  if (!title?.trim()) return;

  try {
    const res = await chatAxios.post("/", { title }, { withCredentials: true });
    alert(res.data?.message ?? "✅ Chat created");
  } catch (err) {
    console.error("Error creating chat:", err);
    alert("❌ Failed to create chat");
  }
};


const Sidebar = ({ dark, toggleDark }) => {
  const dispatch = useDispatch();
  const titles = useSelector((state) => state.chat?.chat ?? []);
  console.log(titles);  

  useEffect(() => {
    const controller = new AbortController();

    const fetchTitles = async () => {
      try {
        const res = await chatAxios.get("/chat-titles", {
          withCredentials: true,
          signal: controller.signal,
        });

        const data = res.data?.title;
        const payload = Array.isArray(data) ? data : data ? [data] : [];

        if (payload.length > 0) {
          dispatch(loadTitle(payload));
        }
      } catch (err) {
        if (err?.name === "AbortError" || err?.code === "ERR_CANCELED") return;
        console.error("Error fetching chat titles:", err);
      }
    };

    fetchTitles();

    return () => controller.abort();
  }, [dispatch]);

  return (
    <motion.aside
      className={`fixed md:static top-0 left-0 h-screen w-64 shrink-0 backdrop-blur-md z-30 p-4 flex flex-col transition-colors ${
        dark ? "bg-[#1f1f1f] text-white" : "bg-white text-gray-900"
      }`}
    >
      {/* Top Actions */}
      <div className="space-y-1 mb-6">
        <button
          key="new-chat"
          onClick={createChatTitle}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
            dark
              ? "bg-gray-700/70 text-white hover:bg-gray-700/90"
              : "bg-gray-200 text-black hover:bg-gray-300"
          }`}
        >
          <Plus size={18} className="opacity-70" />
          <span className="truncate">New chat</span>
        </button>
      </div>

      {/* Chat History */}
      <div className="flex-1 overflow-y-auto pr-1">
        <h2
          className={`text-xs uppercase opacity-70 mb-2 tracking-widest px-3 ${
            dark ? "text-gray-400" : "text-gray-500"
          }`}
        >
          Chats
        </h2>

        <div
          className="space-y-1"
          style={{
            scrollbarWidth: "thin",
            scrollbarColor: dark ? "#374151 #1f2937" : "#d1d5db #f3f4f6",
          }}
        >
          {!titles || titles.length === 0 ? (
            <span className="px-3 text-sm text-gray-500">
              📭 No chats available
            </span>
          ) : (
            titles.map((item, i) => (
              <ChatHistoryItem
                key={`chat-${i}`}
                label={typeof item === "string" ? item : item?.title ?? item}
                dark={dark}
              />
            ))
          )}
        </div>
      </div>

      {/* User Profile */}
      <UserProfileDropdown dark={dark} toggleDark={toggleDark} />
    </motion.aside>
  );
};

export default Sidebar;
