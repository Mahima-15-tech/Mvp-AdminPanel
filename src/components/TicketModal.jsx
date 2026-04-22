import { useState } from "react";
import api from "../api/axios";
import { createPortal } from "react-dom";

export default function TicketModal({ ticket, onClose, refresh }) {

  const [status, setStatus] = useState(ticket?.status || "OPEN");
  const [priority, setPriority] = useState(ticket?.priority || "MEDIUM");
  const [reply, setReply] = useState("");
  const [messages, setMessages] = useState(ticket?.replies || []);

  const [openStatus, setOpenStatus] = useState(false);
  const [openPriority, setOpenPriority] = useState(false);

  
 

  const getSlaHours = () => {
    const created = new Date(ticket.createdAt);
    const now = new Date();
    return Math.floor((now - created) / (1000 * 60 * 60));
  };

  const statusColors = {
    OPEN: "#ee6a59",
    IN_PROGRESS: "#f6c663",
    RESOLVED: "#9acd78"
  };

  const formatLabel = (text) => {
    return text
      .toLowerCase()
      .replaceAll("_", " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());
  };

  const formatTime = (date) => {
    const d = new Date(date);
  
    const hours = d.getHours();
    const minutes = d.getMinutes().toString().padStart(2, "0");
  
    const ampm = hours >= 12 ? "PM" : "AM";
    const formattedHour = hours % 12 || 12;
  
    return `${formattedHour}:${minutes} ${ampm}`;
  };
  
  const formatDateLabel = (date) => {
    const d = new Date(date);
    const today = new Date();
  
    const isToday =
      d.toDateString() === today.toDateString();
  
    return isToday
      ? `Today, ${formatTime(d)}`
      : `Yesterday, ${formatTime(d)}`; // simple version
  };

  return createPortal(
    <div className="fixed inset-0 z-[1000] bg-black/80 backdrop-blur-[0.5px] flex items-center justify-center p-6">

      {/* MAIN CARD */}
      <div className="bg-white w-full pb-3 max-w-[40%] mx-auto rounded-[30px] overflow-hidden shadow-[0_30px_80px_rgba(0,0,0,0.3)] flex flex-col max-h-[82vh]">

        {/* HEADER */}
        <div className="px-8 pt-6 pb-4 relative border-b border-[#8a99a6]/40">

{/* TOP RIGHT CROSS */}
<button
  onClick={onClose}
  className="absolute top-4 right-8  w-9 h-9 rounded-full hover:bg-[#e5e7eb] flex items-center justify-center text-[#5a6c7d]"
>
  ✕
</button>

<div className="flex items-center justify-between">

  {/* LEFT (ICON + NAME + EMAIL) */}
  <div className="flex items-center gap-3">
    <span
      className="w-6 h-6 rounded-full"
      style={{ background: statusColors[status] }}
    />

    <div>
      <p className="font-semibold text-xl text-[#002c3e]">
        {ticket.userName || "Spencer Koh"}
      </p>
      <p className="text-sm text-[#5a6c7d]">
        {ticket.email}
      </p>
    </div>
  </div>

  {/* RIGHT (PRIORITY aligned with email) */}
  <div className="flex flex-col mr-3 items-end justify-center ">
    <span className="text-sm text-[#5a6c7d] font-semibold mt-6">
      {formatLabel(priority)}
    </span>
  </div>

</div>

</div>

        {/* SUBJECT */}
        <div className="px-8 py-4">
          <p className="text-sm font-semibold text-[#5a6c7d]">Subject</p>
          <p className="text-2xl font-semibold text-[#002c3e]">
            {ticket.subject}
          </p>
        </div>

        {/* CONTROLS */}
        <div className="px-8 ">

{/* FULL WIDTH CAPSULE */}
<div className="bg-[#b6b9b3] py-3 px-4 mb-4 rounded-3xl flex items-center justify-between w-full min-h-[48px]">

  {/* LEFT SIDE (STATUS + PRIORITY) */}
  <div className="flex items-center gap-3">

    {/* STATUS */}
    <div className="relative">
    <button
  onClick={() => {
    setOpenStatus(prev => {
      if (!prev) setOpenPriority(false);
      return !prev;
    });
  }}
  className="h-[40px] min-w-[140px] bg-[#002c3e] font-semibold text-white px-5 rounded-full text-sm flex items-center justify-between"
>
  {formatLabel(status)}

        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`w-4 h-4 transition ${openStatus ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 10l5 5 5-5" />
        </svg>
      </button>

      {openStatus && (
        <div className="absolute top-12 left-0 bg-[#6f736f] rounded-2xl p-2 shadow-[0_10px_25px_rgba(0,0,0,0.2)] w-[150px] z-50">
          {["OPEN", "IN_PROGRESS", "RESOLVED"].map(s => (
            <div
              key={s}
              onClick={() => {
                setStatus(s);
                setOpenStatus(false);
              }}
              className={`px-4 py-1.5 rounded-lg cursor-pointer text-white  text-sm
                ${status === s ? "bg-[#4f534f]" : "hover:bg-[#5f6360]"}
              `}
            >
            {formatLabel(s)}
            </div>
          ))}
        </div>
      )}
    </div>

    {/* PRIORITY */}
    <div className="relative">
    <button
  onClick={() => {
    setOpenPriority(prev => {
      if (!prev) setOpenStatus(false);
      return !prev;
    });
  }}
  className="h-[40px] min-w-[140px] bg-[#f5f5f5] font-semibold text-[#5a6c7d] px-5 rounded-full text-sm flex items-center justify-between"
>
  {formatLabel(priority)}

        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`w-4 h-4 transition ${openPriority ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 10l5 5 5-5" />
        </svg>
      </button>

      {openPriority && (
        <div className="absolute top-12 left-0 bg-[#6f736f] rounded-2xl p-2 shadow-[0_10px_25px_rgba(0,0,0,0.2)] w-[130px] z-50">
          {["LOW", "MEDIUM", "HIGH"].map(p => (
            <div
              key={p}
              onClick={() => {
                setPriority(p);
                setOpenPriority(false);
              }}
              className={`px-4 py-1.5 rounded-lg cursor-pointer text-white text-sm
                ${priority === p ? "bg-[#4f534f]" : "hover:bg-[#5f6360]"}
              `}
            >
              {formatLabel(p)}
            </div>
          ))}
        </div>
      )}
    </div>

  </div>

  {/* RIGHT SIDE (SLA) */}
  <div className="bg-white px-3 py-2  rounded-full text-sm text-[#5a6c7d] font-semibold whitespace-nowrap">
    SLA - {getSlaHours()}h
  </div>

</div>

</div>

        {/* CHAT */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4 bg-[#f5f5f5] custom-scroll">

          {/* USER MESSAGE */}
          <div className="bg-white px-6 ml-2.5 py-2 text-[#002c3e] font-medium rounded-3xl max-w-[70%] text-[13px]">
            {ticket.description}
          </div>

          <p className="text-[10px] text-[#5a6c7d] ml-9 -mt-3">
  {formatDateLabel(ticket.createdAt)}
</p>
          {/* REPLIES */}
          {messages.map((r, i) => {
            const isAdmin = r.sender === "ADMIN";

            return (
              <div key={i} className={`flex flex-col ${isAdmin ? "items-end" : "items-start"}`}>
  
              <div
                className={`px-5 py-2 text-[13px] max-w-[70%]
                ${isAdmin
                  ? "bg-[#002c3e] text-[#f5f5f5] font-medium rounded-3xl"
                  : "bg-white text-[#002c3e] rounded-2xl"
                }`}
              >
                {r.message}
              </div>
            
              {/* ✅ TIMESTAMP */}
              <p className="text-[10px] text-[#5a6c7d] mt-1 px-4">
                {formatDateLabel(r.createdAt)}
              </p>
            
            </div>
            );
          })}
        </div>

        {/* FOOTER */}
        <div className="px-8 py-4 bg-white ">

          <textarea
            value={reply}
            onChange={(e) => setReply(e.target.value)}
            placeholder="Write reply..."
            className="w-full  placeholder-shown:text-[#5a6c7d] text-[#5a6c7d] rounded-[20px] px-5 py-4 outline-none resize-none text-[13px] border border-[#8a99a6]"
          />

          <div className="flex justify-between items-center mt-2">

            {/* ATTACH */}
            <div className="w-12 h-12 -ml-1  rounded-full  flex items-center justify-center text-[#f5f5f5]">
            <img src="/clip.svg" alt="clip" />
            </div>

            <div className="flex gap-3">
            <button
  onClick={onClose}
  className="h-[40px] px-8 bg-[#b6b9b3] text-white font-semibold rounded-full"
>
  Cancel
</button>

              <button
                onClick={async () => {
                  if (!reply) return;
                  const newMsg = {
                    message: reply,
                    sender: "ADMIN",
                    createdAt: new Date() // ✅ important
                  };

                  setMessages(prev => [...prev, newMsg]); // instant UI
                  setReply("");

                  await api.post(`/support/${ticket._id}/reply`, { message: reply });

                  refresh();
                }}
                className="h-[40px] px-10 bg-[#002c3e] text-white font-semibold rounded-full"
              >
                Send
              </button>

            </div>
          </div>

        </div>

      </div>

    </div>,
    document.body
  );
}