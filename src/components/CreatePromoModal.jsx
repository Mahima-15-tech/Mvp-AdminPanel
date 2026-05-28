import { X, Plus, Minus } from "lucide-react";
import { createPortal } from "react-dom";
import { useState } from "react";
import api from "../api/axios";

export default function CreatePromoModal({ onClose, refresh }) {

  const [openDuration, setOpenDuration] = useState(false);
  const [duration, setDuration] = useState("Duration");
  const [code, setCode] = useState("");

  const durations = ["1 Month", "1 Year", "Unlimited"];

  const [emails, setEmails] = useState([""]);
  

  // ✅ DEFAULT MESSAGE
  const [message, setMessage] = useState(`We're glad to have you with us.

  This is a one-time code. Please use it within 3 days.
  After that, it expires.
  
  Code: [CODE]
  Valid for: [DURATION]
  
  Take care,
  Team SOLO`);

  // ➕ Add email
  const addEmail = () => {
    if (emails.length < 3) {
      setEmails([...emails, ""]);
    }
  };

  // ➖ Remove email
  const removeEmail = (index) => {
    const updated = emails.filter((_, i) => i !== index);
    setEmails(updated.length ? updated : [""]);
  };

  const handleSubmit = async () => {
    try {
  
      if (!code || duration === "Duration" || emails.length === 0) {
        alert("Please fill all fields");
        return;
      }
  
      const validEmails = emails.filter(e => e.trim() !== "");
  
      if (validEmails.length === 0) {
        alert("Add at least one email");
        return;
      }
  
      await api.post("/promo/create", {
        code,
        duration,
        emails: validEmails,
        message
      });
  
      alert("✅ Promo Created & Email Sent");
  
      refresh(); // ✅ yaha hona chahiye
  
      onClose();
  
    } catch (err) {
      console.log(err);
      alert("❌ Error creating promo");
    }
  };


  return createPortal(

    <div className="fixed inset-0 z-[1000] flex items-center justify-center figma-scrollbar">

      {/* OVERLAY */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/80 backdrop-blur-[0.5px]"
      />

      {/* MODAL */}
      <div className="relative z-10 bg-white w-[460px] rounded-3xl p-6 shadow-2xl">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-[24px] font-semibold text-[#002c3e]">
            Create Promo Code
          </h2>

          <button onClick={onClose}>
            <X className="text-[#a0a0a0]" size={20} />
          </button>
        </div>

        {/* GREY BOX */}
        <div className="bg-[#b6b9b3] rounded-2xl p-4 space-y-4">

          {/* TOP ROW */}
          <div className="flex gap-3">

          <input
  value={code}
  onChange={(e) => setCode(e.target.value)}
  placeholder="Promo Code"
  className="flex-1 bg-white text-[#5a6c7d] font-semibold rounded-full px-4 py-2 text-sm outline-none"
/>

            {/* DURATION */}
            <div className="relative">
              <button
                onClick={() => setOpenDuration(!openDuration)}
                className="bg-[#002c3e] text-white px-5 py-2 font-semibold rounded-full text-sm flex items-center gap-2"
              >
                {duration}

                <svg
                  className={`w-4 h-4 transition ${openDuration ? "rotate-180" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M7 10l5 5 5-5" strokeWidth="2"/>
                </svg>
              </button>

              {openDuration && (
                <div className="absolute top-12 right-0 bg-[#7f837f] text-white rounded-xl overflow-hidden z-50">
                  {durations.map((d) => (
                    <div
                      key={d}
                      onClick={() => {
                        setDuration(d);
                        setOpenDuration(false);
                      }}
                      className="px-6 py-2 hover:bg-[#6f736f] cursor-pointer"
                    >
                      {d}
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

          {/* EMAILS */}
          <div>
            <p className="text-sm text-white ml-4 mb-1 font-semibold">
              Emails
            </p>

            {emails.map((email, i) => {

const isLast = i === emails.length - 1;

// ✅ only last row clickable (jab < 3)
const canAdd = isLast && emails.length < 3;

// ✅ color logic
const isActive = i < emails.length - 1; // jo already used ho chuke

              return (
                <div key={i} className="flex items-center gap-2 mb-2">

                  <input
                    value={email}
                    onChange={(e) => {
                      const updated = [...emails];
                      updated[i] = e.target.value;
                      setEmails(updated);
                    }}
                    placeholder="user@email.com"
                    className="flex-1 bg-white rounded-full font-semibold px-4 py-2 text-sm text-[#5a6c7d] outline-none"
                  />

                  {/* ➕ ONLY LAST ACTIVE */}
                  <button
  onClick={addEmail}
  disabled={!canAdd}
  className={`w-9 h-9 rounded-full flex items-center justify-center
    ${isActive ? "bg-[#002c3e]" : "bg-[#7f9aa8]"}`}
>
  <Plus size={16} className="text-white" />
</button>

                  {/* ➖ */}
                  <button
  onClick={() => removeEmail(i)}
  className="w-9 h-9 bg-[#002c3e] rounded-full flex items-center justify-center"
>
  <Minus size={16} className="text-white" />
</button>

                </div>
              );
            })}
          </div>

        </div>

        {/* MESSAGE */}
        <div className="mt-4">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full bg-[#f5f5f5] text-[#5a6c7d] rounded-2xl px-4 py-3 text-sm outline-none resize-none h-[140px]"
          />
        </div>

        {/* ACTIONS */}
        <div className="flex justify-end gap-3 mt-6">

          <button
            onClick={onClose}
            className="px-6 py-2 rounded-full font-semibold bg-[#b6b9b3] text-white text-sm"
          >
            Cancel
          </button>

         <button
  onClick={handleSubmit}
  className="px-6 py-2 rounded-full font-semibold bg-[#002c3e] text-white text-sm"
>
  Send Code via Email
</button>

        </div>

      </div>
    </div>,

    document.body
  );
}