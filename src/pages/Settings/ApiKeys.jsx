import { useState, useEffect } from "react";
import api from "../../api/axios";
import { Eye, EyeOff, Pencil } from "lucide-react";

export default function ApiKeys() {

const [data, setData] = useState({
  stripe: "",
  twilioSid: "",
  twilioToken: ""
});

const [temp, setTemp] = useState(data);
const [editing, setEditing] = useState(false);

const [show, setShow] = useState({
  stripe: false,
  twilioSid: false,
  twilioToken: false
});

/* ================= LOAD ================= */
useEffect(() => {
  fetchKeys();
}, []);

const fetchKeys = async () => {
  try {
    const res = await api.get("/admin/api-key");

    const keys = {
      stripe: res.data.stripe || "",
      twilioSid: res.data.twilioSid || "",
      twilioToken: res.data.twilioToken || ""
    };

    setData(keys);
    setTemp(keys);

  } catch (err) {
    console.log(err);
  }
};

/* ================= ACTIONS ================= */
const handleEdit = () => {
  setEditing(true);
  setTemp(data);
};

const handleSave = async () => {
  try {
    await api.post("/admin/api-keys", temp);
    setData(temp);
    setEditing(false);
  } catch (err) {
    console.log(err);
  }
};

const handleCancel = () => {
  setTemp(data);
  setEditing(false);
};

return (
<div className="flex justify-center mt-10">

  {/* OUTER BOX (same as broadcast) */}
  <div className="w-[554px] bg-[#f5f5f5] rounded-[28px] p-6">

    {/* HEADER */}
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-[#002c3e] font-semibold text-xl">
        Rotate API Keys
      </h2>
    </div>

    {/* INNER CARD */}
    <div className="bg-[#c2c5bf] rounded-2xl p-5 space-y-4">

      {/* STRIPE */}
      <Field
        label="Stripe Secret Key"
        value={editing ? temp.stripe : data.stripe}
        show={show.stripe}
        toggleShow={() => setShow(p => ({...p, stripe: !p.stripe}))}
        editing={editing}
        onChange={(v)=>setTemp({...temp, stripe:v})}
      />

      {/* TWILIO SID */}
      <Field
        label="Twilio Account SID"
        value={editing ? temp.twilioSid : data.twilioSid}
        show={show.twilioSid}
        toggleShow={() => setShow(p => ({...p, twilioSid: !p.twilioSid}))}
        editing={editing}
        onChange={(v)=>setTemp({...temp, twilioSid:v})}
      />

      {/* TWILIO TOKEN */}
      <Field
        label="Twilio Auth Token"
        value={editing ? temp.twilioToken : data.twilioToken}
        show={show.twilioToken}
        toggleShow={() => setShow(p => ({...p, twilioToken: !p.twilioToken}))}
        editing={editing}
        onChange={(v)=>setTemp({...temp, twilioToken:v})}
      />

    </div>

    {/* BOTTOM ACTIONS */}
    <div className="flex justify-between items-center mt-5">

      {/* LEFT EDIT ICON */}
      <button
        onClick={handleEdit}
        className="w-10 h-10 rounded-full bg-[#002c3e] flex items-center justify-center text-white"
      >
        <Pencil size={16}/>
      </button>

      {/* RIGHT BUTTONS */}
      <div className="flex gap-3">

        <button
          onClick={handleCancel}
          disabled={!editing}
          className={`
            px-6 py-2 rounded-full text-sm font-semibold
            ${editing
              ? "bg-[#b6b9b3] text-white"
              : "bg-[#b6b9b3] text-white opacity-50 cursor-not-allowed"}
          `}
        >
          Cancel
        </button>

        <button
          onClick={handleSave}
          disabled={!editing}
          className={`
            px-6 py-2 rounded-full text-sm font-semibold
            ${editing
              ? "bg-[#002c3e] text-white"
              : "bg-[#b6b9b3] text-white opacity-50 cursor-not-allowed"}
          `}
        >
          Save
        </button>

      </div>

    </div>

  </div>

</div>
);
}

/* ================= FIELD ================= */

function Field({
  label,
  value,
  show,
  toggleShow,
  editing,
  onChange
}) {
  return (
    <div>

      {/* LABEL */}
      <p className="text-white text-xs ml-3 font-medium mb-1">
        {label}
      </p>

      {/* INPUT */}
     <div className="relative w-full">

  <input
    type={show ? "text" : "password"}
    value={value}
    disabled={!editing}
    onChange={(e)=>onChange(e.target.value)}
    spellCheck={false}
    className="
      bg-[#f5f5f5]
      rounded-full
      px-4 py-2
      pr-16
      text-sm
      text-[#002c3e]
      outline-none
      disabled:opacity-80
      font-mono
    "
    style={{
      width: "60ch",   // 👈 THIS IS KEY (50 chars + padding safety)
      maxWidth: "100%",
      overflowX: "auto",
      whiteSpace: "nowrap"
    }}
  />

  {/* EYE ICON */}
  <button
    onClick={toggleShow}
    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#7f8f93]"
  >
    {show ? <EyeOff size={16}/> : <Eye size={16}/>}
  </button>

</div>

    </div>
  );
}