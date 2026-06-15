import { useEffect, useState, useRef } from "react";
import api from "../api/axios";
import EmptyState from "../components/EmptyState";
import { useLocation } from "react-router-dom";

export default function SmsTracker(){

const [data,setData] = useState([]);
const [loading,setLoading] = useState(true);

const [search,setSearch] = useState("");
const [consent,setConsent] = useState("ALL");
const [status,setStatus] = useState("ALL");


const [page,setPage] = useState(1);

const [openRow, setOpenRow] = useState(null);

const [totalPages, setTotalPages] = useState(1);

const location = useLocation();

const params = new URLSearchParams(location.search);
const rangeParam = params.get("range");


const [stats,setStats] = useState({
  total:0,
  sent:0,
  pending:0,
  failed:0
});

const tableRef = useRef(null);

const handleCardClick = (type) => {
  setStatus(type);

  // scroll
  setTimeout(() => {
    tableRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  }, 100);
};

useEffect(() => {
  const params = new URLSearchParams(location.search);

  const statusParam = params.get("status");

  if (statusParam) {
    setStatus(statusParam);
    setPage(1); 

  
    fetchDataDirect(statusParam);

    setTimeout(() => {
      tableRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    }, 200);
  }

}, [location.search]);

const fetchDataDirect = async (statusParam) => {
  try {
    setLoading(true);

    const res = await api.get("/admin/sms-tracker", {
      params: {
        search,
        consent,
        status: statusParam,
        range: rangeParam,
        page: 1
      }
    });

    setData(res.data.data);
    setTotalPages(res.data.totalPages);

  } catch (err) {
    console.error(err);
  } finally {
    setLoading(false);
  }
};

const [dropdownPos, setDropdownPos] = useState({
  top: 0,
  left: 0
});

useEffect(() => {
  const close = () => setOpen(false);
  window.addEventListener("click", close);
  return () => window.removeEventListener("click", close);
}, []);

const safeTotalPages = totalPages > 0 ? totalPages : 1;
const safePage = Math.min(page, safeTotalPages);

useEffect(() => {
  if (data.length === 0) {
    setPage(1);
  }
}, [data]);

const fetchStats = async () => {
  const res = await api.get("/admin/sms-stats"); // 👈 new API
  setStats(res.data);
};

/* ================= FETCH ================= */

useEffect(() => {
  const handleClickOutside = () => {
    setOpenRow(null);
  };

  window.addEventListener("click", handleClickOutside);

  return () => {
    window.removeEventListener("click", handleClickOutside);
  };
}, []);

// table ke liye
useEffect(() => {
  const params = new URLSearchParams(location.search);
  const hasStatus = params.get("status");


  if (!hasStatus) {
    fetchData();
  }

}, [consent, status, page, search, location.search]);


useEffect(()=>{
  fetchStats();
},[]);

const fetchData = async()=>{

try{

  setLoading(true);
  setData([]); 

const res = await api.get("/admin/sms-tracker",{
params:{
search,
consent,
status,
range: rangeParam,
page
}
});

setData(res.data.data);
setTotalPages(res.data.totalPages);

}
catch(err){
console.error(err);
}
finally{
setLoading(false);
}

};


/* ================= SUMMARY ================= */

const total = stats.total;
const sent = stats.sent;
const pending = stats.pending;
const failed = stats.failed;


/* ================= DROPDOWN ================= */

const [open,setOpen] = useState(false);

const consentOptions = [
"All",
"Opted In",
"Opted Out",
"Pending"
];

const formatText = (text) => {
  if (!text) return "-";
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};


return(

<div className="space-y-10">

{/* ================= FILTER BAR ================= */}

<div
  className="
    bg-[#B5B9B2]
    rounded-4xl
    px-6
    py-4
    flex
    items-center
    gap-2
    overflow-x-auto   /* ✅ SCROLL instead of breaking */
  "
>

  {/* SEARCH */}
  <input
    type="text"
    placeholder="Search Recipient..."
    value={search}
    onChange={(e)=>setSearch(e.target.value)}
    className="
      bg-white
      rounded-full
      px-5
      py-3
      w-[260px]
      outline-none
      text-[#002c3e]
      shrink-0
    "
  />

  {/* CONSENT DROPDOWN */}
  <div className="relative shrink-0">

    <button
      onClick={(e)=>{
        e.stopPropagation();
        const rect = e.currentTarget.getBoundingClientRect();

        setDropdownPos({
          top: rect.bottom + 6,
          left: rect.left
        });

        setOpen(!open);
      }}
      className="
        bg-white
        text-[#5a6c7d]
        px-5
        py-3
        rounded-full
        font-semibold
        inline-flex
        items-center
        justify-between
        gap-2
        min-w-[140px]
      "
    >
      {consent === "ALL" ? "Consent" : consent}

      <svg
        xmlns="http://www.w3.org/2000/svg"
        className={`w-6 h-6 transition ${open ? "rotate-180" : ""}`}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 10l5 5 5-5"/>
      </svg>
    </button>

    {open && (
      <div
        className="
          fixed
          bg-[#7f837f]
          text-white
          rounded-xl
          shadow-xl
          py-2
          min-w-[160px]
          z-[9999]
        "
        style={{
          top: dropdownPos.top,
          left: dropdownPos.left
        }}
      >
        {consentOptions.map((opt)=>(
          <div
            key={opt}
            onClick={(e)=>{
              e.stopPropagation();
              setConsent(opt);
              setOpen(false);
            }}
            className="px-5 py-2 cursor-pointer hover:bg-[#6f736f]"
          >
            {opt}
          </div>
        ))}
      </div>
    )}

  </div>

  {/* STATUS BUTTONS */}
  {["Sent","Pending","Failed","Delivered"].map(s=>(
    <button
      key={s}
      onClick={()=>setStatus(s)}
      className={`
        px-5
        py-3
        rounded-full
        font-semibold
        shrink-0
        inline-flex
        items-center
        justify-center
        min-w-[110px]
        ${status===s
          ? "bg-[#002c3e] text-white"
          : "bg-white text-[#5a6c7d]"
        }
      `}
    >
      {s}
    </button>
  ))}

  {/* RESET */}
  <button
    onClick={()=>{
      setSearch("");
      setConsent("ALL");
      setStatus("ALL");
      setPage(1);

      setTimeout(()=>{ fetchData(); },0);
    }}
    className="
      bg-[#002c3e]
      text-white
      px-5
      py-3
      rounded-full
      font-semibold
      shrink-0
    "
  >
    Reset
  </button>

</div>


{/* ================= SUMMARY ================= */}

<div className="grid grid-cols-4 gap-6">
<Card 
  label="Users Triggered" 
  value={total}
  onClick={() => handleCardClick("ALL")}
/>

<Card 
  label="SMS Sent" 
  value={sent}
  onClick={() => handleCardClick("SENT")}
/>

<Card 
  label="SMS Pending" 
  value={pending}
  onClick={() => handleCardClick("PENDING")}
/>

<Card 
  label="SMS Failed" 
  value={failed}
  error
  onClick={() => handleCardClick("FAILED")}
/>

</div>



{/* ================= TABLE ================= */}

<div ref={tableRef} className="bg-white rounded-4xl overflow-visible">

<table className="w-full text-[15px] table-fixed">

<thead className="bg-[#78bcc4] text-white tracking-wide">
<tr>
<th className="px-6 py-4 text-left w-[16%]">Recipient</th>
<th className="px-6 py-4 text-left w-[14%]">Phone</th>
<th className="px-6 py-4 text-left w-[12%]">Consent</th>
<th className="px-3 py-4 text-left w-[10%]">Alerts Type</th>
<th className="px-9 py-4 text-left w-[18%]">Alert Sent At</th>
<th className="px-6 py-4 text-left w-[10%]">Status</th>
<th className="px-3 py-4 text-left w-[8%]">Attempts</th>
<th className="px-6 py-4 text-left w-[18%]">Failure Reason</th>
</tr>
</thead>

<tbody className="text-[#5a6c7d]">

{loading ? (

  <tr>
    <td colSpan="8">
      <div className="p-10 text-center text-gray-400">
        Loading SMS...
      </div>
    </td>
  </tr>

) : data.length === 0 ? (

  <tr className="h-[160px]">
    <td colSpan="8" className="px-6">
      <div className="flex flex-col items-center justify-center gap-2">
        <p className="text-lg font-semibold text-[#5a6c7d]">
          No SMS records found
        </p>
        <p className="text-sm text-[#a0a0a0]">
          Try adjusting filters or search
        </p>
      </div>
    </td>
  </tr>

) : (

  data.map((row,i)=>(

    <tr
      key={i}
      className="border-b border-[#e5e5e5] hover:bg-[#f7f8f3]"
    >

      <td className="px-6 py-4 font-semibold">{row.name}</td>
      <td className="px-6 py-4">{row.phone}</td>
      <td className="px-6 py-4">{row.consent}</td>

      <td className={`px-6 py-4 font-medium ${
        row.alertType==="MISSED" || row.alertType==="SOS"
          ? "text-[#ee6a59]"
          : ""
      }`}>
        {formatText(row.alertType)}
      </td>

      <td className="px-6 py-4 whitespace-nowrap">
        {(() => {
          const date = new Date(row.createdAt);
          return (
            date.toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short"
            }) +
            " | " +
            date.toLocaleTimeString("en-US", {
              hour: "numeric",
              minute: "2-digit",
              hour12: true
            })
          );
        })()}
      </td>

      <td className={`px-6 py-4 font-medium ${
        row.status==="SENT"
          ? "text-[#78bcc4]"
          : "text-[#ee6a59]"
      }`}>
        {formatText(row.status)}
      </td>

      <td className="px-6 py-4">
        {row.retryCount} | 5
      </td>

      <td className="px-6 py-4 max-w-[240px] relative">

        <div className="flex items-center gap-2">

          <span className="text-sm text-gray-600 truncate max-w-[150px]">
            {row.failureReason || "-"}
          </span>

          {row.failureReason && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setOpenRow(openRow === i ? null : i);
              }}
              className="text-blue-500 font-bold text-lg leading-none"
            >
              ⋯
            </button>
          )}

        </div>

        {openRow === i && (
          <div
            onClick={(e) => e.stopPropagation()}
            className="absolute right-0 top-10 bg-white border shadow-xl rounded-xl p-3 w-[260px] z-50 text-xs break-words"
          >
            {row.failureReason}
          </div>
        )}

      </td>

    </tr>

  ))

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

function Card({label,value,error,onClick}){

return(

<div 
  onClick={onClick}
  className="
    bg-[#f5f5f5]
    rounded-4xl
    px-8
    py-6
    cursor-pointer
    transition-all duration-200
    hover:scale-[1.03]
    hover:shadow-md
  "
>

<p className="text-[#5a6c7d] text-lg tracking-wide font-semibold">
{label}
</p>

<p className={`text-[48px] font-semibold mt-2 ${error ? "text-[#ee6a59]" : "text-[#002c3e]"}`}>
{value}
</p>

</div>

);

}