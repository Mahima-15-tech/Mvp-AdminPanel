  import { useEffect, useState } from "react";
  import api from "../api/axios";

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

  // const [alerts,setAlerts] = useState([]); // filtered (table)
const [allAlerts,setAllAlerts] = useState([]); // full data (stats)

  /* ================= SEARCH DEBOUNCE ================= */
  useEffect(()=>{
  const delay = setTimeout(()=>{
  setSearch(searchInput);
  },400);

  return ()=>clearTimeout(delay);
  },[searchInput]);

  /* ================= FETCH ================= */
  useEffect(()=>{
  fetchAlerts();
  },[page,type,statusFilter,plan,search]);

  const fetchAlerts = async()=>{
    try{
      setLoading(true);
  
      // 👉 FILTERED (table)
      const res = await api.get("/admin/alert-monitoring",{
        params:{ page, type, status:statusFilter, plan, search }
      });
  
      setAlerts(res.data);
  
      // 👉 FULL DATA (stats ke liye)
      const fullRes = await api.get("/admin/alert-monitoring",{
        params:{ page:1, type:"ALL", status:"ALL", plan:"ALL", search:"" }
      });
  
      setAllAlerts(fullRes.data);
  
    }catch(err){
      console.error(err);
    }finally{
      setLoading(false);
    }
  };

  const scrollToSection = (id) => {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    };

  /* ================= SUMMARY ================= */

  const uniqueUsers = new Set(allAlerts.map(a=>a.phone));
const usersTriggered = uniqueUsers.size;

const smsSent = allAlerts.filter(a=>a.status==="SMS_SENT").length;
const smsPending = allAlerts.filter(a=>a.status==="SMS_PENDING").length;
const smsFailed = allAlerts.filter(a=>a.status==="FAILED").length;

  return(

  <div className="space-y-10">

  {/* ================= FILTER BAR ================= */}

  <div className="bg-[#B5B9B2] rounded-4xl px-8 py-5 flex items-center gap-6">

  <input
  type="text"
  placeholder="Search Users..."
  value={searchInput}
  onChange={(e)=>setSearchInput(e.target.value)}
  className="bg-white rounded-full px-6 py-3 w-[280px] outline-none text-[#5a6c7d]"
  />

  <div className="relative w-[180px]">

  <button
  onClick={()=>setOpenType(!openType)}
  className="bg-white px-5 py-3 rounded-full w-full flex justify-between items-center text-[#002c3e]"
  >
  {type === "ALL"
  ? "All Types"
  : type === "SOS"
  ? "SOS"
  : "Missed"}

  <span>⌄</span>
  </button>

  {openType && (
  <div className="absolute left-0 top-full mt-1 w-full bg-[#7f817d] rounded-xl shadow-md p-1 z-50">

  {[
  { label:"All Types", value:"ALL" },
  { label:"SOS", value:"SOS" },
  { label:"Missed", value:"MISSED_CHECKIN" }
  ].map(item=>(
  <div
  key={item.value}
  onClick={()=>{
  setType(item.value);
  setOpenType(false);
  }}
  className="px-3 py-1.5 text-[#f5f5f5] rounded-md cursor-pointer hover:bg-[#4c4e4a] transition"
  >
  {item.label}
  </div>
  ))}

  </div>
  )}

  </div>

  {/* ✅ STATUS DROPDOWN */}
  <div className="relative w-[180px]">

  <button
  onClick={()=>setOpenStatus(!openStatus)}
  className="bg-white px-5 py-3 rounded-full w-full flex justify-between items-center text-[#002c3e]"
  >
  {statusFilter === "ALL"
  ? "All Status"
  : statusFilter === "SMS_SENT"
  ? "Sent"
  : statusFilter === "SMS_PENDING"
  ? "Pending"
  : "Failed"}

  <span>⌄</span>
  </button>

  {openStatus && (
  <div className="absolute left-0 top-full mt-1 w-full bg-[#7f817d] rounded-xl shadow-md p-1 z-50">

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
  className="px-3 py-1.5 text-[#f5f5f5] rounded-md cursor-pointer hover:bg-[#4c4e4a] transition"
  >
  {item.label}
  </div>
  ))}

  </div>
  )}

  </div>

  <div className="relative w-[180px]">

  <button
  onClick={()=>setOpenPlan(!openPlan)}
  className="bg-white px-5 py-3 rounded-full w-full flex justify-between items-center text-[#002c3e]"
  >
  {plan === "ALL"
  ? "All Plans"
  : plan === "TRIAL"
  ? "Trial"
  : plan === "MONTHLY"
  ? "Monthly"
  : "Yearly"}

  <span>⌄</span>
  </button>

  {openPlan && (
  <div className="absolute left-0 top-full mt-1 w-full bg-[#7f817d] rounded-xl shadow-md p-1 z-50">

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
  className="px-3 py-1.5 text-[#f5f5f5] rounded-md cursor-pointer hover:bg-[#4c4e4a] transition"
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
  className="bg-[#002c3e] text-white px-10 py-3 rounded-full font-semibold"
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
  value={usersTriggered} 
  onClick={() => {
    setType("MISSED_CHECKIN");
    scrollToSection("alerts-table");
  }} 
/>

  <Card 
    label="SOS Alerts Sent" 
    value={smsSent} 
    onClick={() => {
      setStatusFilter("SMS_SENT");
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

    {loading ? (

      <div className="p-10 text-center text-gray-400">
        Loading alerts...
      </div>

    ) : (

      <table className="w-full text-[16px] table-fixed">

        {/* ✅ HEADER ALWAYS */}
        <thead className="bg-[#78bcc4] text-white">
  <tr>
    <th className="px-6 py-5 text-left w-[14%]">User ID</th>
    <th className="px-6 py-5 text-left w-[14%]">User Name</th>
    <th className="px-6 py-5 text-left w-[10%]">Plan</th>
    
    <th className="px-4 py-5 text-left w-[14%]">
      Alerts Type
    </th>

    <th className="px-4 py-5 text-left w-[18%] whitespace-nowrap">
      Alert Sent At
    </th>

    <th className="px-6 py-5 text-left w-[10%]">Status</th>
    <th className="px-6 py-5 text-left w-[10%] leading-tight">Alerts Sent</th>
    <th className="px-6 py-5 text-left w-[10%] leading-tight">Alert Credits</th>
  </tr>
</thead>

        <tbody className="text-[#5a6c7d]">

          {/* ✅ EMPTY STATE (FIXED LIKE USERS/REVENUE) */}
          {alerts.length === 0 ? (

<tr className="h-[140px]">
  <td className="px-6"></td>
  <td className="px-6"></td>
  <td className="px-6"></td>

  {/* ✅ PERFECT CENTER */}
  <td colSpan="2" className="px-6">
    <div className="flex flex-col  h-full  gap-2">
      
      <p className="text-lg leading-4  font-semibold text-[#5a6c7d]">
        No alert records found
      </p>

      <p className="text-sm text-[#a0a0a0]">
        Adjust your filters or search
      </p>

    </div>
  </td>

  <td className="px-6"></td>
  <td className="px-6"></td>
  <td className="px-6"></td>
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

                <tr
                  key={i}
                  className="border-b border-[#e5e5e5] hover:bg-[#f7f8f3] transition"
                >

                  <td className="px-6 py-4 font-medium">
                    {a.phone}
                  </td>

                  <td className="px-6 py-4 font-semibold">
                    {a.userName}
                  </td>

                  <td className="px-6 py-4">
                    {a.planType?.charAt(0) + a.planType?.slice(1).toLowerCase()}
                  </td>

                  <td className="px-4 py-4 font-semibold text-[#ee6a59]">
  {a.alertType === "MISSED_CHECKIN" ? "Missed" : a.alertType}
</td>
                  <td className="px-4 py-4">
  {formattedDate}
</td>
                  <td className={`px-6 py-4 font-semibold ${
                    a.status==="SMS_SENT"
                      ? "text-[#78bcc4]"
                      : "text-[#ee6a59]"
                  }`}>
                    {a.status==="SMS_SENT"
                      ? "Sent"
                      : a.status==="SMS_PENDING"
                      ? "Pending"
                      : "Failed"}
                  </td>

                  <td className="px-6 py-4">
                    {a.retryCount}
                  </td>

                  <td className="px-6 py-4">
                    {a.currentBalance}
                  </td>

                </tr>

              )

            })

          )}

        </tbody>

      </table>

    )}

  </div>

  {/* ================= PAGINATION ================= */}

  <div className="flex justify-center items-center gap-6">

  <button
  onClick={()=>setPage(p=>Math.max(p-1,1))}
  className="border-[#5a6c7d] border-2 text-[#5a6c7d] font-semibold px-6 py-2 rounded-full"
  >
  Back
  </button>

  <span className="text-[#5a6c7d] font-medium">
  Page {page}
  </span>

  <button
  onClick={()=>setPage(p=>p+1)}
  className="bg-[#002c3e] text-white px-6 py-2 rounded-full"
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