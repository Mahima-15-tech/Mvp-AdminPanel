import { useEffect, useState } from "react";
import api from "../../api/axios";

export default function SystemHealth() {

  const [health, setHealth] = useState(null);

  useEffect(() => {
    api.get("/admin/system-health")
      .then(res => setHealth(res.data))
      .catch(() => {
        setHealth({
          smsStatus: "Disconnected",
          serverStatus: "Down",
          failedSMS24h: 0
        });
      });
  }, []);

  if (!health) return null;

  return (
    <div className="space-y-8">

     

      <div className="grid grid-cols-3 gap-6">

        <StatusCard
          title="SMS Service"
          value={health.smsStatus}
          status={health.smsStatus === "Connected"}
        />

        <StatusCard
          title="Server Status"
          value={health.serverStatus}
          status={health.serverStatus === "Running"}
        />

        <StatusCard
          title="Failed SMS (24h)"
          value={health.failedSMS24h}
          status={health.failedSMS24h < 5}
        />

      </div>
    </div>
  );
}

/* ===== STATUS CARD COMPONENT ===== */

function StatusCard({ title, value, status }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 transition hover:shadow-md">

      <p className="text-gray-400 text-xs uppercase tracking-wide">
        {title}
      </p>

      <div className="flex items-center justify-between mt-4">
        <p className="text-2xl font-semibold text-gray-800">
          {value}
        </p>

        <span
          className={`w-3 h-3 rounded-full ${
            status ? "bg-green-500 animate-pulse" : "bg-red-500"
          }`}
        />
      </div>
    </div>
  );
}