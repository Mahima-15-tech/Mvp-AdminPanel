import { useEffect, useState } from "react";
import api from "../../api/axios";

export default function SystemHealth() {

const [health,setHealth] = useState(null);

useEffect(()=>{

api.get("/admin/system-health")
.then(res=>setHealth(res.data))
.catch(()=>{

    setHealth({
        serverStatus:"Running",        // ✅ server ok
        smsStatus:"Disconnected",      // ❌ sms down
        failedSMS24h:3
        });

});

},[]);

if(!health) return null;

return(

<div className="space-y-10">

{/* STATUS CARDS */}

<div className="grid grid-cols-3 gap-6">

<StatusCard
  title="Server Status"
  value={health.serverStatus}
  status={health.serverStatus === "Running"}   // ✅ FIX
/>

<StatusCard
  title="SMS Service"
  value={health.smsStatus}
  status={health.smsStatus === "Connected"}    // ✅ correct
/>

<StatusCard
  title="Failed SMS (24h)"
  value={health.failedSMS24h}
  status={health.failedSMS24h < 5}
  failed
/>

</div>

</div>

);

}

/* ================= CARD ================= */
function StatusCard({ title, value, status, failed }) {
  return (
    <div
      className="
        bg-[#f5f5f5]
        rounded-[25px]
        p-6
        flex
        items-center
        justify-between
      "
    >
      <div>
        <p className="text-[16px] text-[#5a6c7d] font-semibold">
          {title}
        </p>

        <p
          className={`
            text-[48px]
            font-semibold
            mt-1
            ${failed ? "text-[#ee6a59]" : "text-[#002c3e]"}
          `}
        >
          {value}
        </p>
      </div>

      {/* STATUS DOT */}
      <div
        className={`
          w-[24px]
          h-[24px]
          rounded-full
          mt-6
          ${status ? "bg-[#9acd78]" : "bg-[#ee6a59]"}
        `}
      />
    </div>
  );
}