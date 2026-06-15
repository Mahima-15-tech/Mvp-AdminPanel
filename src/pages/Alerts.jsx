  import { useEffect, useState } from "react";
  import api from "../api/axios";
  import { useLocation } from "react-router-dom";

  export default function AdminAlertMonitoring() {

  const [alerts,setAlerts] = useState([]);
  const [page,setPage] = useState(1);
  const [loading,setLoading] = useState(true);

  const [type,setType] = useState("ALL");
  const [statusFilter,setStatusFilter] = useState("ALL");
  const [plan,setPlan] = useState("ALL");

  const [search,setSearch] = useState("");
  const [searchInput,setSearchInput] = useState("");

  const [openStatus,setOpenStatus] = useState(false); // ✅ FIX

  const [openType,setOpenType] = useState(false);
  const [openPlan,setOpenPlan] = useState(false);

  const [totalPages, setTotalPages] = useState(1);

  const location = useLocation();

  const [stats,setStats] = useState({});

  const [openDropdown, setOpenDropdown] = useState(null);

  const fetchStats = async () => {
    const res = await api.get("/admin/alert-stats"); // ❌ NO params
    setStats(res.data);
  };
// ✅ table ke liye
useEffect(()=>{
  fetchAlerts();
},[page,type,statusFilter,plan,search]);

// ✅ stats ke liye (only once load)
useEffect(()=>{
  fetchStats();
},[]);

useEffect(() => {
  const params = new URLSearchParams(location.search);
  const status = params.get("status");

  if (status) {
    setStatusFilter(status);

    // 🔥 DIRECT FETCH (refresh jaisa feel)
    fetchAlertsDirect(status);

    setTimeout(() => {
      scrollToSection("alerts-table");
    }, 200);
  }
}, [location.search]);

const fetchAlertsDirect = async (status) => {
  try {
    setLoading(true);

    const res = await api.get("/admin/alert-monitoring", {
      params: {
        page: 1,
        limit: 5,
        type,
        status: status,
        plan,
        search
      }
    });

    setAlerts(res.data.data || []);
    setTotalPages(res.data.totalPages || 1);
    setPage(1);

  } catch (err) {
    console.error(err);
  } finally {
    setLoading(false);
  }
};

  // const [alerts,setAlerts] = useState([]); // filtered (table)
const [allAlerts,setAllAlerts] = useState([]); // full data (stats)

  /* ================= SEARCH DEBOUNCE ================= */
  useEffect(()=>{
  const delay = setTimeout(()=>{
  setSearch(searchInput);
  },400);

  return ()=>clearTimeout(delay);
  },[searchInput]);



  const fetchAlerts = async () => {
    try {
      setLoading(true);
  
      const start = Date.now(); // 👈 add this
  
      const res = await api.get("/admin/alert-monitoring", {
        params: { 
          page, 
          limit: 5,  
          type, 
          status: statusFilter, 
          plan, 
          search 
        }
      });
      
      // ✅ correct handling
      setAlerts(res.data.data || []);
      setTotalPages(res.data.totalPages || 1);
  
      // 👇 ensure loader at least 400ms dikhe
      const delay = 400 - (Date.now() - start);
      if (delay > 0) {
        await new Promise(r => setTimeout(r, delay));
      }
  
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const safeTotalPages = totalPages > 0 ? totalPages : 1;
const safePage = Math.min(page, safeTotalPages);

useEffect(() => {
  if (alerts.length === 0) {
    setPage(1);
  }
}, [alerts]);

  const scrollToSection = (id) => {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    };

  /* ================= SUMMARY ================= */

  const usersTriggered = stats.usersTriggered || 0;
  const smsSent = stats.smsSent || 0;
  const smsPending = stats.smsPending || 0;
  const smsFailed = stats.smsFailed || 0;
  return(

  <div className="space-y-10">

  {/* ================= FILTER BAR ================= */}

  <div className="bg-[#B5B9B2] rounded-4xl px-6 py-4 flex items-center gap-2 whitespace-nowrap">

  <input
  type="text"
  placeholder="Search Users..."
  value={searchInput}
  onChange={(e)=>setSearchInput(e.target.value)}
  className="bg-white rounded-full px-5 py-3 w-[260px] outline-none text-[#5a6c7d]"
  />

  <div className="relative ">

  <button
  onClick={() => setOpenDropdown(openDropdown === "type" ? null : "type")}
  className="
  bg-white
  rounded-full
  px-5
  py-3
  font-semibold
  text-[#5a6c7d]
  inline-flex
  items-center
  gap-2
"
  >
  {type === "ALL"
  ? "All Types"
  : type === "SOS"
  ? "SOS"
  : "Missed"}

<svg
  xmlns="http://www.w3.org/2000/svg"
  className={`w-6 h-6 transition ${openDropdown === "type" ? "rotate-180" : ""}`}

  fill="none"
  viewBox="0 0 24 24"
  stroke="currentColor"
>
  <path
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth={2}
    d="M7 10l5 5 5-5"
  />
</svg>
  </button>

  {openDropdown === "type" && (
   <div className="
   absolute 
   top-13 
   left-0   /* ✅ FIX */
   w-full   /* ✅ SAME WIDTH AS BUTTON */
   bg-[#7f837f] 
   rounded-xl 
   overflow-hidden 
   z-50
 ">
  {[
  { label:"All Types", value:"ALL" },
  { label:"SOS", value:"SOS" },
  { label:"Missed", value:"MISSED_CHECKIN" }
  ].map(item=>(
  <div
  key={item.value}
  onClick={()=>{
  setType(item.value);
  setOpenDropdown(null);
  }}
  className="
  px-5        /* ✅ same horizontal padding */
  py-2 
  text-left   /* ✅ important */
  leading-4 
  hover:bg-[#6f736f] 
  cursor-pointer
"
  >
  {item.label}
  </div>
  ))}

  </div>
  )}

  </div>

  {/* ✅ STATUS DROPDOWN */}
  <div className="relative">

  <button
 onClick={() => setOpenDropdown(openDropdown === "status" ? null : "status")}
 className="
  bg-white
  rounded-full
  px-5
  py-3
  font-semibold
  text-[#5a6c7d]
  inline-flex
  items-center
  gap-2
"
  >
  {statusFilter === "ALL"
  ? "All Status"
  : statusFilter === "SMS_SENT"
  ? "Sent"
  : statusFilter === "SMS_PENDING"
  ? "Pending"
  : "Failed"}

<svg
  xmlns="http://www.w3.org/2000/svg"
  className={`w-6 h-6 transition ${openDropdown === "status" ? "rotate-180" : ""}`}
  fill="none"
  viewBox="0 0 24 24"
  stroke="currentColor"
>
  <path
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth={2}
    d="M7 10l5 5 5-5"
  />
</svg>
  </button>

  {openDropdown === "status" && (
   <div className="
   absolute 
   top-13 
   left-0   /* ✅ FIX */
   w-full   /* ✅ SAME WIDTH AS BUTTON */
   bg-[#7f837f] 
   rounded-xl 
   overflow-hidden 
   z-50
 ">

  {[
  { label:"All Status", value:"ALL" },
  { label:"Sent", value:"SMS_SENT" },
  { label:"Pending", value:"SMS_PENDING" },
  { label:"Failed", value:"FAILED" }
  ].map(item=>(
  <div
  key={item.value}
  onClick={()=>{
  setStatusFilter(item.value);
  setOpenStatus(false);
  }}
  className="
  px-5        /* ✅ same horizontal padding */
  py-2 
  text-left   /* ✅ important */
  leading-4 
  hover:bg-[#6f736f] 
  cursor-pointer
"
  >
  {item.label}
  </div>
  ))}

  </div>
  )}

  </div>

  <div className="relative ">

  <button
  onClick={() => setOpenDropdown(openDropdown === "plan" ? null : "plan")}
  className="
  bg-white
  rounded-full
  px-5
  py-3
  font-semibold
  text-[#5a6c7d]
  inline-flex
  items-center
  gap-2
"
  >
  {plan === "ALL"
  ? "All Plans"
  : plan === "TRIAL"
  ? "Trial"
  : plan === "MONTHLY"
  ? "Monthly"
  : "Yearly"}

<svg
  xmlns="http://www.w3.org/2000/svg"
  className={`w-6 h-6 transition ${openDropdown === "plan" ? "rotate-180" : ""}`}
  fill="none"
  viewBox="0 0 24 24"
  stroke="currentColor"
>
  <path
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth={2}
    d="M7 10l5 5 5-5"
  />
</svg>
  </button>

  {openDropdown === "plan" && (
 <div className="
 absolute 
 top-13 
 left-0   /* ✅ FIX */
 w-full   /* ✅ SAME WIDTH AS BUTTON */
 bg-[#7f837f] 
 rounded-xl 
 overflow-hidden 
 z-50
">
  {[
  { label:"All Plans", value:"ALL" },
  { label:"Trial", value:"TRIAL" },
  { label:"Monthly", value:"MONTHLY" },
  { label:"Yearly", value:"YEARLY" }
  ].map(item=>(
  <div
  key={item.value}
  onClick={()=>{
  setPlan(item.value);
  setOpenPlan(false);
  }}
  className="px-6 py-2 leading-4 hover:bg-[#6f736f] cursor-pointer"
  >
  {item.label}
  </div>
  ))}

  </div>
  )}

  </div>

  <button
  onClick={()=>{
  setType("ALL");
  setStatusFilter("ALL");
  setPlan("ALL");
  setSearch("");
  setSearchInput("");
  setPage(1);
  }}
  className="
  bg-[#002c3e]
  text-white
  px-5
  py-3
  rounded-full
  font-semibold
"
  >
  Reset
  </button>

  </div>

  {/* ================= SUMMARY ================= */}

  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">

  <Card 
  label="Users Triggered" 
  value={usersTriggered} 
  onClick={() => {
    setType("ALL");
    setStatusFilter("ALL");
    scrollToSection("alerts-table");
  }} 
/>

<Card 
  label="Missed Alert Sent" 
  value={stats.missedSent || 0} 
  onClick={() => {
    setType("MISSED_CHECKIN"); // ✅ already ok
    setStatusFilter("SMS_SENT"); // ✅ ADD THIS
    scrollToSection("alerts-table");
  }} 
/>

<Card 
  label="SOS Alerts Sent" 
  value={stats.sosSent || 0}
  onClick={() => {
    setType("SOS");              // ✅ ADD THIS
    setStatusFilter("SMS_SENT"); // ✅ already
    scrollToSection("alerts-table");
  }} 
/>

  <Card 
    label="SMS Alerts Pending" 
    value={smsPending} 
    onClick={() => {
      setStatusFilter("SMS_PENDING");
      scrollToSection("alerts-table");
    }} 
  />

  <Card 
    label="SMS Alerts Failed" 
    value={smsFailed} 
    error
    onClick={() => {
      setStatusFilter("FAILED");
      scrollToSection("alerts-table");
    }} 
  />

  </div>

  {/* ================= TABLE ================= */}

  <div id="alerts-table" className="bg-white rounded-[30px] overflow-hidden border border-[#e6e6e6]">

<table className="w-full text-[16px] table-fixed">

<thead className="bg-[#78bcc4] text-white">
  <tr>
    <th className="px-6 py-5 text-left w-[14%]">User ID</th>
    <th className="px-6 py-5 text-left w-[14%]">User Name</th>
    <th className="px-6 py-5 text-left w-[10%]">Plan</th>
    <th className="px-4 py-5 text-left w-[14%]">Alerts Type</th>
    <th className="px-4 py-5 text-left w-[18%]">Alert Sent At</th>
    <th className="px-6 py-5 text-left w-[10%]">Status</th>
    <th className="px-6 py-5 text-left w-[10%]">Alerts Sent</th>
    <th className="px-6 py-5 text-left w-[10%]">Alert Credits</th>
  </tr>
</thead>

<tbody className="text-[#5a6c7d]">

{loading ? (

  <tr>
    <td colSpan="8">
      <div className="p-10 text-center text-gray-400">
        Loading alerts...
      </div>
    </td>
  </tr>

) : alerts.length === 0 ? (

  <tr className="h-[160px]">
    <td colSpan="8">
      <div className="flex flex-col items-center justify-center gap-2">
        <p className="text-lg font-semibold">No alert records found</p>
        <p className="text-sm text-[#a0a0a0]">
          Adjust your filters or search
        </p>
      </div>
    </td>
  </tr>

) : (

  alerts.map((a,i)=>{

    const date = new Date(a.createdAt);

    const formattedDate =
      date.toLocaleDateString("en-GB") +
      " | " +
      date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true
      });

    return(
      <tr key={i} className="border-b border-[#e5e5e5] hover:bg-[#f7f8f3] transition">

        <td className="px-6 py-4 font-medium">{a.phone}</td>
        <td className="px-6 py-4 font-semibold">{a.userName}</td>
        <td className="px-6 py-4">
          {a.planType?.charAt(0) + a.planType?.slice(1).toLowerCase()}
        </td>
        <td className="px-4 py-4 font-semibold text-[#ee6a59]">
          {a.alertType === "MISSED_CHECKIN" ? "Missed" : a.alertType}
        </td>
        <td className="px-4 py-4">{formattedDate}</td>
        <td className={`px-6 py-4 font-semibold ${
          a.status==="SMS_SENT" ? "text-[#78bcc4]" : "text-[#ee6a59]"
        }`}>
          {a.status==="SMS_SENT"
            ? "Sent"
            : a.status==="SMS_PENDING"
            ? "Pending"
            : "Failed"}
        </td>
        <td className="px-6 py-4">{a.retryCount}</td>
        <td className="px-6 py-4">{a.currentBalance}</td>

      </tr>
    )
  })

)}

</tbody>

</table>
</div>

  {/* ================= PAGINATION ================= */}

  <div className="flex justify-center items-center gap-6 mt-8">

  <button
    disabled={safePage === 1}
    onClick={() => setPage(p => Math.max(p - 1, 1))}
    className="px-6 py-2 rounded-full border text-[#5a6c7d] border-[#5a6c7d] disabled:opacity-40"
  >
    Back
  </button>

  <span className="text-[#5a6c7d] font-medium">
    Page {safePage} of {safeTotalPages}
  </span>

  <button
    disabled={safePage === safeTotalPages}
    onClick={() => setPage(p => Math.min(p + 1, safeTotalPages))}
    className="px-6 py-2 rounded-full bg-[#002c3e] text-white disabled:opacity-40"
  >
    Next
  </button>

</div>

  </div>
  );
  }

  /* ================= CARD ================= */

  function Card({ label, value, error, onClick }) {
    return (
      <div
        onClick={onClick}
        className="
          bg-[#f5f5f5] 
          rounded-4xl 
          px-4   py-7
  
          h-37                /* ✅ FIXED HEIGHT */
          flex flex-col justify-between   /* ✅ ALIGNMENT FIX */
  
          cursor-pointer 
          transition-all duration-200 
          hover:scale-[1.03] hover:shadow-md
        "
      >
        {/* LABEL */}
        <p className="
          text-[#5a6c7d] 
          text-[16px]              
          font-semibold
          leading-[18px]
  
          h-[36px]               
          line-clamp-2            
        ">
          {label}
        </p>
  
        {/* VALUE */}
        <p
          className={`
            text-[48px]           
            font-semibold
            leading-none          
  
            ${error ? "text-[#ee6a59]" : "text-[#002c3e]"}
          `}
        >
          {value}
        </p>
      </div>
    );
  }