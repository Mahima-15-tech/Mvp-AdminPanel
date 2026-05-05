import { useState } from "react";
import {  useEffect } from "react";
import api from "../api/axios";

export default function Broadcast() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  const [tab, setTab] = useState("recent");
  


  const sendMessage = async () => {
    if (!message) return;
  
    try {
      await api.post("/broadcast/send", {
        title: "Broadcast",
        message,
      });
  
      setMessage("");
      fetchMessages(); 
  
    } catch (err) {
      console.log(err);
    }
  };

  const fetchMessages = async () => {
    try {
      const res = await api.get(`/broadcast?type=${tab}`);
      setMessages(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [tab]);

  return (
    <div className="h-full w-full px-10 pt-8">


      {/* CENTER BOX */}
      <div className="flex justify-center">

      <div className="w-[520px] h-[450px] bg-[#f5f5f5] rounded-[28px] px-6 py-6 flex flex-col justify-between">
          {/* TOP BAR */}
          <div className="flex justify-between items-center">
            <h2 className="text-[#002c3e] font-semibold text-xl ">
              Compose
            </h2>

            <span className="text-[#5a6c7d] text-xs mt-1.5 font-semibold">
              Recipients | All SOLO Users
            </span>
          </div>

      
          {/* MESSAGE LIST */}
          <div className="bg-[#c2c5bf] mt-4 rounded-xl p-3 h-[220px]  overflow-y-auto space-y-4 figma-scrollbar">

            {messages.map((m, i) => {
              const isRecent =
                new Date() - new Date(m.createdAt) < 24 * 60 * 60 * 1000;

              return (
                <div key={i}>
                <div
                  className={`rounded-2xl px-5 py-3 mt-2 text-[12px] font-semibold leading-4  ${
                    isRecent
                      ? "bg-[#002c3e] text-[#f5f5f5]"
                      : "bg-[#7f9aa8] text-[#f5f5f5]"
                  }`}
                >
                  {m.message}
                </div>
              
                {/* TIMESTAMP */}
                <p className="text-[9px] text-[#5a6c7d] font-semibold   mt-1 ml-5">
                  {new Date(m.createdAt).toLocaleDateString()} |{" "}
                  {new Date(m.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
              );
            })}
          </div>

          {/* INPUT */}
          <div className="mt-4">
            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Enter message..."
              className="w-full px-4 py-6  rounded-2xl border border-[#CFD5DB] bg-white outline-none text-sm text-[#5a6c7d]"
            />
          </div>

          {/* BOTTOM */}
          <div className="flex justify-between items-center mt-4">

            {/* TOGGLE */}
            <div className="flex items-center gap-2  text-sm font-semibold ml-1 text-[#5a6c7d]">

              <span>Archive</span>

              <div
                onClick={() =>
                  setTab(tab === "recent" ? "archive" : "recent")
                }
                className={`w-18 h-8 rounded-full flex items-center px-0.5 cursor-pointer transition ${
                  tab === "recent"
                    ? "bg-[#002c3e]"
                    : "bg-[#d1d5db]"
                }`}
              >
                <div
                  className={`w-7 h-7 bg-white rounded-full transition ${
                    tab === "recent" ? "ml-auto" : "ml-0"
                  }`}
                />
              </div>

              <span>Recent</span>
            </div>

            {/* BUTTONS */}
            <div className="flex gap-2">

              <button className="px-6 py-2 rounded-full bg-[#b6b9b3] text-[#f5f5f5] text-sm font-semibold">
                Cancel
              </button>

              <button
                onClick={sendMessage}
                className="px-7 py-2 rounded-full bg-[#002c3e] text-white text-sm font-semibold"
              >
                Send
              </button>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
}