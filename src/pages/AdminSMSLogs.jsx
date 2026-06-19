import { useEffect, useState , useRef } from "react";
import api from "../api/axios";
import { createPortal } from "react-dom";
// import CustomDatePicker from "../components/CustomDatePicker";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { CalendarDays } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function InlineDatePicker({ value, onChange, label }) {

  const [open, setOpen] = useState(false);
  const [tempDate, setTempDate] = useState(value);

  const [showMonth, setShowMonth] = useState(false);
  const [showYear, setShowYear] = useState(false);

  const [appleCommission, setAppleCommission] = useState(15);
const [googleCommission, setGoogleCommission] = useState(20);


  const ref = useRef();

  const years = Array.from({ length: 50 }, (_, i) => 2000 + i);
  const months = [
    "Jan","Feb","Mar","Apr","May","Jun",
    "Jul","Aug","Sep","Oct","Nov","Dec"
  ];

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
        setShowMonth(false);
        setShowYear(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={ref}>

      {/* INPUT */}
      <div
        onClick={() => setOpen(!open)}
        className="flex items-center bg-white rounded-full overflow-hidden cursor-pointer hover:shadow-md transition"
      >

        {/* LABEL */}
        <span className="px-4 py-3.5 text-white bg-[#002c3e] font-semibold text-sm">
          {label}
        </span>

        {/* DATE */}
        <div className="px-4 py-2 flex items-center gap-1 text-[#5a6c7d] text-sm min-w-[140px]">

          {value
            ? new Date(value).toLocaleDateString("en-GB").replaceAll("/", " | ")
            : "DD | MM | YY"
          }

          <CalendarDays size={16} className="text-[#5a6c7d] ml-auto" />

        </div>

      </div>

      {/* DROPDOWN */}
      {open && (
        <div className="absolute top-[55px] -left-6 z-50 bg-white rounded-2xl p-4 w-[260px] shadow-[0_10px_30px_rgba(0,0,0,0.15)]">

          <DatePicker
            selected={tempDate}
            onChange={(date) => setTempDate(date)}
            inline

            renderCustomHeader={({
              date,
              changeYear,
              changeMonth,
              decreaseMonth,
              increaseMonth,
            }) => (

              <div className="flex items-center justify-between mb-3">

                {/* LEFT */}
                <button
                  onClick={decreaseMonth}
                  className="w-8 h-8 rounded-full bg-[#f1f3f4] hover:bg-[#e5e7eb]"
                >
                  ←
                </button>

                {/* CENTER */}
                <div className="flex gap-2 relative">

                  {/* MONTH */}
                  <div className="relative">
                    <div
                      onClick={() => {
                        setShowMonth(!showMonth);
                        setShowYear(false);
                      }}
                      className="bg-[#f5f5f5] px-3 py-1 rounded-full text-sm font-semibold cursor-pointer"
                    >
                      {months[date.getMonth()]}
                    </div>

                    {showMonth && (
                      <div className="absolute top-10 left-0 bg-white shadow-lg rounded-xl max-h-40 overflow-y-auto z-50">
                        {months.map((m, i) => (
                          <div
                            key={m}
                            onClick={() => {
                              changeMonth(i);
                              setShowMonth(false);
                            }}
                            className="px-4 py-2 hover:bg-[#0cb4ab]/10 cursor-pointer"
                          >
                            {m}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* YEAR */}
                  <div className="relative">
                    <div
                      onClick={() => {
                        setShowYear(!showYear);
                        setShowMonth(false);
                      }}
                      className="bg-[#f5f5f5] px-3 py-1 rounded-full text-sm font-semibold cursor-pointer"
                    >
                      {date.getFullYear()}
                    </div>

                    {showYear && (
                      <div className="absolute top-10 left-0 bg-white shadow-lg rounded-xl max-h-40 overflow-y-auto z-50">
                        {years.map((y) => (
                          <div
                            key={y}
                            onClick={() => {
                              changeYear(y);
                              setShowYear(false);
                            }}
                            className={`px-4 py-2 cursor-pointer ${
                              y === date.getFullYear()
                                ? "bg-[#0cb4ab] text-white"
                                : "hover:bg-[#0cb4ab]/10"
                            }`}
                          >
                            {y}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                </div>

                {/* RIGHT */}
                <button
                  onClick={increaseMonth}
                  className="w-8 h-8 rounded-full bg-[#f1f3f4] hover:bg-[#e5e7eb]"
                >
                  →
                </button>

              </div>
            )}
          />

          {/* FOOTER */}
          <div className="flex justify-between mt-4">

            <button
              onClick={() => {
                setTempDate(null);
                setOpen(false);
              }}
              className="bg-[#B5B9B2] text-white px-5 py-2 rounded-full text-sm"
            >
              Cancel
            </button>

            <button
              onClick={() => {
                onChange(tempDate);
                setOpen(false);
              }}
              className="bg-[#002c3e] text-white px-5 py-2 rounded-full text-sm"
            >
              Confirm
            </button>

          </div>

        </div>
      )}

    </div>
  );
}



export default function AdminRevenue() {

const [data,setData] = useState([]);

const [month,setMonth] = useState("THIS_MONTH");
const [openMonth,setOpenMonth] = useState(false);

const [from,setFrom] = useState("");
const [to,setTo] = useState("");

const [openExport,setOpenExport] = useState(false);

const [page,setPage] = useState(1);
const [loading, setLoading] = useState(true);

const [summary, setSummary] = useState({
  gross: 0,
  net: 0,
  fee: 0
});

const [totalPages, setTotalPages] = useState(1);


const [highlightTable, setHighlightTable] = useState(false);
const [highlightSummary, setHighlightSummary] = useState(false);

const [commission, setCommission] = useState(15);

const [appleCommission, setAppleCommission] = useState(15);
const [googleCommission, setGoogleCommission] = useState(20);

const [showFullGross, setShowFullGross] = useState(false);
const [showFullNet, setShowFullNet] = useState(false);

const grossValue = 888899000.00;
const netValue = 6808.80;

const [showRefundModal, setShowRefundModal] = useState(false);
const [selectedTxn, setSelectedTxn] = useState(null);
const [refundReason, setRefundReason] = useState("");

const [showHistory, setShowHistory] = useState(false);
const [historyData, setHistoryData] = useState([]);



const safeTotalPages = totalPages > 0 ? totalPages : 1;
const safePage = Math.min(page, safeTotalPages);
const [totalCount, setTotalCount] = useState(0);


const paginatedData = data;

const fetchRefundHistory = async () => {
  try {
    console.log("CLICKED");

    const res = await api.get("/admin/refund-history");

    console.log(res.data);

    setHistoryData(res.data);
    setShowHistory(true);

  } catch (err) {
    console.log("ERROR:", err);
  }
};

const openRefundModal = (txn) => {
  setSelectedTxn(txn);
  setShowRefundModal(true);
};

useEffect(() => {
  if (data.length === 0) {
    setPage(1);
  }
}, [data]);

const titleMonth = () => {

  const now = new Date();

  if (month === "CUSTOM" && from && to) {
    return `${new Date(from).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    })} - ${new Date(to).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    })}`;
  }

  if (month === "THIS_MONTH") {
    return new Date(now.getFullYear(), now.getMonth(), 1)
      .toLocaleDateString("en-GB", { month: "short", year: "numeric" });
  }

  if (month === "LAST_MONTH") {
    return new Date(now.getFullYear(), now.getMonth() - 1, 1)
      .toLocaleDateString("en-GB", { month: "short", year: "numeric" });
  }

  if (month === "LAST_3") return "Last 3 Months";
  if (month === "YTD") return "Year to Date";

  return "All Time";
};

const exportCSV = ()=>{

    let csv = "Date,UserID,UserName,Plan,Gross,Net\n";
    
    data.forEach(r=>{
    csv += `${r.date},${r.userId},${r.userName},${r.plan},${r.gross},${r.net}\n`;
    });
    
    const blob = new Blob([csv]);
    
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement("a");
    
    a.href = url;
    a.download = "revenue.csv";
    
    a.click();
    
    };


    const exportPDF = ()=>{

        const doc = new jsPDF();
        
        const rows = data.map(r=>[
        new Date(r.date).toLocaleDateString(),
        r.userId,
        r.userName,
        r.plan,
        r.gross,
        r.net
        ]);
        
        autoTable(doc,{
        head:[["Date","UserID","UserName","Plan","Gross","Net"]],
        body:rows
        });
        
        doc.save("revenue.pdf");
        
        };

        const formatDate = (date) => {
          if (!date) return "";
        
          const d = new Date(date);
        
          const year = d.getFullYear();
          const month = String(d.getMonth() + 1).padStart(2, "0");
          const day = String(d.getDate()).padStart(2, "0");
        
          return `${year}-${month}-${day}`;
        };

/* ================= DUMMY DATA ================= */
const fetchRevenue = async () => {
  try {
    setLoading(true);   // ✅ START LOADING

    const res = await api.get("/admin/revenue", {
      params: {
        month,
        from: from ? formatDate(from) : "",
        to: to ? formatDate(to) : "",
        page
      }
    });

    setData(res.data.data);
    setSummary(res.data.summary);
    setTotalPages(res.data.totalPages);
    setTotalCount(res.data.totalCount);

  } catch (err) {
    console.error(err);
  } finally {
    setLoading(false);  // ✅ STOP LOADING
  }
};




/* ================= TOTAL ================= */

const grossTotal = summary.gross;
const netTotal = summary.net;


const scrollToTable = () => {
  const el = document.getElementById("revenue-table");
  if (el) {
    el.scrollIntoView({ behavior: "smooth", block: "start" });

    setHighlightTable(true);
    setTimeout(() => setHighlightTable(false), 2000);
  }
};

const scrollToSummary = () => {
  const el = document.getElementById("revenue-summary");
  if (el) {
    el.scrollIntoView({ behavior: "smooth", block: "start" });

    setHighlightSummary(true);
    setTimeout(() => setHighlightSummary(false), 2000);
  }
};



const AutoFitText = ({ text }) => {
  const ref = useRef(null);
  const [fontSize, setFontSize] = useState(20);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let size = 20; // starting size

    // reduce font until it fits
    while (el.scrollWidth > el.offsetWidth && size > 10) {
      size -= 1;
      el.style.fontSize = size + "px";
    }

    setFontSize(size);
  }, [text]);

  return (
    <span
      ref={ref}
      className="font-semibold whitespace-nowrap text-right block"
      style={{ fontSize }}
    >
      {text}
    </span>
  );
};


/* ================= MONTH OPTIONS ================= */

const months = [
    {label:"All Periods",value:"ALL"},
    {label:"This Month",value:"THIS_MONTH"},
    {label:"Last Month",value:"LAST_MONTH"},
    {label:"Last 3 Months",value:"LAST_3"},
    {label:"Year to Date",value:"YTD"}
    ];

    const formatCompact = (num) =>
  new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 2,
  }).format(num);

  const handleRefundConfirm = async () => {
    try {
      await api.post("/admin/refund", {
        paymentIntentId: selectedTxn.paymentIntentId,
        reason: refundReason
      });
  
      setShowRefundModal(false);
      setRefundReason("");
      fetchRevenue();
  
    } catch (err) {
      alert("Refund failed");
    }
  };
  

  useEffect(()=>{
    fetchRevenue();
  },[month, from, to, page]);
  

return(

<div className="space-y-10">


{/* ================= FILTER BAR ================= */}
<div className="bg-[#B5B9B2] rounded-4xl px-6 py-4 flex items-center gap-2 whitespace-nowrap">
{/* MONTH */}

<div className="relative">

<button
  onClick={() => setOpenMonth(!openMonth)}
  className="
  bg-[#002c3e]
  text-white
  px-5
  py-3
  rounded-full
  inline-flex
  items-center
  gap-2
  tracking-wide
  font-semibold
  whitespace-nowrap
  "
>
  {months.find(m => m.value === month)?.label}

  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={`w-6 h-6 transition ${openMonth ? "rotate-180" : ""}`}
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

{openMonth && (

<div className="absolute top-13  bg-[#7f837f] text-white rounded-xl overflow-hidden">

{months.map(m=>(

<div
key={m.value}
onClick={()=>{
setMonth(m.value);
setOpenMonth(false);
}}
className="px-6 py-2 leading-4 hover:bg-[#6f736f] cursor-pointer"
>

{m.label}

</div>

))}

</div>

)}

</div>


{/* EXPORT */}

<div className="relative">

<button
  onClick={() => setOpenExport(!openExport)}
  className="bg-[#f5f5f5] rounded-full px-5  py-3 font-semibold text-[#5a6c7d] inline-flex items-center gap-2"
>
  Export

  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={`w-6 h-6 transition ${openExport ? "rotate-180" : ""}`}
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

{openExport && (

<div className="absolute top-13 left-4 bg-[#7f837f] shadow-lg rounded-xl overflow-hidden z-50">

<div
onClick={()=>{
exportCSV();
setOpenExport(false);
}}
className="px-8 py-2 hover:bg-gray-800 cursor-pointer"
>
CSV
</div>

<div
onClick={()=>{
exportPDF();
setOpenExport(false);
}}
className="px-8 py-2 hover:bg-gray-800 cursor-pointer"
>
PDF
</div>

</div>

)}

</div>





<InlineDatePicker
value={from}
onChange={setFrom}
label="From"
/>

<InlineDatePicker
value={to}
onChange={setTo}
label="To"
/>
  


<button
onClick={()=>{
  setPage(1);        
  setMonth("CUSTOM");
}}
className="bg-[#002c3e] text-white px-5 font-semibold py-3 rounded-full"
>
Apply
</button>

<button
  onClick={()=>{
    setFrom("");
    setTo("");
    setMonth("ALL");
    setPage(1);

    window.location.reload(); // 🔥 full reload
  }}
  className="
    bg-white
    h-11 w-11
    rounded-full
    flex items-center justify-center
    shrink-0
  "
>
  <img src="/refreshicon.svg" className="w-10 h-10"/>
</button>

<button
  onClick={fetchRefundHistory}
  className="bg-[#002c3e] text-white px-3 font-semibold py-3 rounded-full ml-auto"
>
  Refund History
</button>

</div>


{/* ================= STATS ================= */}

<div className="grid grid-cols-4 gap-6">

<Card 
  label="Total Transactions" 
  value={totalCount} 
  onClick={scrollToTable}
/>

<Card 
  label="Gross Revenue" 
  value={`$${grossTotal.toFixed(2)}`} 
/>

<Card 
  label="Net Revenue" 
  value={`$${netTotal.toFixed(2)}`} 
  />

<Card 
  label="Stripe Fee" 
  value={`$${data.reduce((a,b)=>a+(b.fee || 0),0).toFixed(2)}`}
/>

</div>





{/* ================= TABLE ================= */}

<div 
  id="revenue-table"
  className={`bg-white rounded-4xl overflow-hidden border border-[#e6e6e6] transition-all duration-500 
  `}
>

<table className="w-full text-[15px]  table-fixed">

    {/* HEADER (unchanged) */}
    <thead className="bg-[#78bcc4] text-white">
  <tr>
  <th className="w-[18%] px-6 py-5 text-left">User Name</th>
    <th className="w-[16%] px-6 py-5 text-left">User ID</th>
    
    <th className="w-[16%] px-6 py-5 text-left">Date</th>
    <th className="w-[14%] px-6 py-5 text-left">Plan</th>
    <th className="w-[18%] px-6 py-5 text-left">Gross</th>
    <th className="w-[18%] px-6 py-5 text-left">Net</th>
    {/* <th className="w-[18%] px-6 py-5 text-left">Status</th> */}
<th className="w-[18%] px-6 py-5 text-left">Actions</th>
  </tr>
</thead>

<tbody className="text-[#5a6c7d]">

{/* ✅ LOADING */}
{loading ? (

  <tr>
    <td colSpan="7">
      <div className="p-10 text-center text-gray-400">
        Loading revenue...
      </div>
    </td>
  </tr>

) : data.length === 0 ? (

<tr className="h-[160px]">

<td colSpan="7" className="px-6 py-20 text-center">
  <div className="flex flex-col items-center justify-center gap-2">
    <p className="text-lg font-semibold text-[#5a6c7d]">
      No revenue data found
    </p>
    <p className="text-sm text-[#a0a0a0]">
      Try adjusting filters or date range
    </p>
  </div>
</td>

</tr>

) : (

paginatedData.map((r,i)=>(
  <tr
    key={i}
    className="border-b border-[#e5e5e5] hover:bg-[#f7f8f3]"
  >

<td className={`px-6 py-4 font-medium ${
      r.status === "REFUNDED" ? "text-[#b6b9b3]" : "text-[#5a6c7d]"
    }`}>
      {r.userName}
    </td>

    <td className={`px-6 py-4 font-medium ${
      r.status === "REFUNDED" ? "text-[#b6b9b3]" : "text-[#5a6c7d]"
    }`}>
      {r.userId}
    </td>

   

    <td className={`px-6 py-4 font-medium ${
      r.status === "REFUNDED" ? "text-[#b6b9b3]" : "text-[#5a6c7d]"
    }`}>
      {new Date(r.date).toLocaleDateString("en-GB",{
        day:"2-digit",
        month:"short",
        year:"numeric"
      })}
    </td>

    <td className={`px-6 py-4 font-medium ${
      r.status === "REFUNDED" ? "text-[#b6b9b3]" : "text-[#5a6c7d]"
    }`}>
      {r.plan === "TOPUP"
        ? "Top-up"
        : r.plan === "MONTHLY"
        ? "Monthly"
        : r.plan === "YEARLY"
        ? "Yearly"
        : r.plan}
    </td>

    <td className={`px-6 py-4 font-semibold text-[16px] ${
      r.status === "REFUNDED" ? "text-[#b6b9b3]" : "text-[#78bcc4]"
    }`}>
      ${r.gross.toFixed(2)}
    </td>

    <td className={`px-6 py-4 font-semibold text-[16px] ${
      r.status === "REFUNDED" ? "text-[#b6b9b3]" : "text-[#78bcc4]"
    }`}>
      ${r.net.toFixed(2)}
    </td>

    <td className="px-2 py-4 whitespace-nowrap">

      {r.status === "REFUNDED" ? (

        <span
          className="inline-flex items-center justify-center px-3 py-2 rounded-full text-sm font-semibold"
          style={{
            backgroundColor: "#f5a696",
            color: "#F5F5F5"
          }}
        >
          Refunded
        </span>

      ) : (

        <button
          onClick={() => openRefundModal(r)}
          className="inline-flex items-center justify-center px-5 py-2 rounded-full text-sm font-semibold"
          style={{
            backgroundColor: "#ee6a59",
            color: "#F5F5F5"
          }}
        >
          Refund
        </button>

      )}

    </td>

  </tr>
))

)}

</tbody>

  </table>

</div>

<div className="flex justify-center items-center gap-6 mt-6">

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

{/* ================= REVENUE SUMMARY ================= */}


{showHistory && createPortal(

<div className="fixed inset-0 z-[1000] bg-black/80 flex items-center justify-center">

  {/* ✅ MODAL BOX */}
  <div className="bg-white rounded-[30px] w-[1100px] max-h-[90vh] relative">

    {/* ✅ CROSS BUTTON (FIXED PERFECTLY) */}
    <button
  onClick={() => setShowHistory(false)}
  className="
    absolute 
    -top-16 right-3
    
    w-10 h-10
    flex items-center justify-center
    rounded-full
    text-white
    shadow-lg
    transition
    hover:scale-110
    z-20
  "
  style={{
    backgroundColor: "#78bcc4"
  }}
>
  ✕
</button>

    {/* ================= TABLE ================= */}
    <div className="overflow-auto max-h-[65vh]">

      <table className="w-full text-[15px] tracking-wide table-fixed">

        {/* HEADER */}
        <thead className="bg-[#78bcc4] text-white">
          <tr>
            <th className="w-[16%] px-6 py-5 text-left rounded-tl-[30px]">Date</th>
            <th className="w-[16%] px-6 py-5 text-left">User ID</th>
            <th className="w-[18%] px-6 py-5 text-left">User Name</th>
            <th className="w-[14%] px-6 py-5 text-left">Plan</th>
            <th className="w-[18%] px-1 py-5 text-left whitespace-nowrap">Refund Amount</th>
            <th className="w-[22%] px-6 py-5 text-left whitespace-nowrap">Request Reason</th>
            <th className="w-[14%] px-6 py-5 text-left rounded-tr-[30px]">Status</th>
          </tr>
        </thead>

        <tbody className="text-[#5a6c7d]">

          {historyData.length === 0 ? (

            <tr className="h-[160px]">
              <td colSpan="7" className="px-6 py-20 text-center">
                <p className="text-lg font-semibold">
                  No refund requests found
                </p>
              </td>
            </tr>

          ) : (

            historyData.map((h, i) => (

              <tr
              key={i}
              className={`border-b border-[#e5e5e5] ${
                i === historyData.length - 1 ? "border-b-0" : ""
              }`}
            >

                {/* DATE */}
                <td className="px-6 py-4 whitespace-nowrap font-medium">
                  {new Date(h.date).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric"
                  })}
                </td>

                {/* USER ID */}
                <td className="px-6 py-4 whitespace-nowrap font-medium ">
                  {h.userPhone || "-"}
                </td>

                {/* NAME */}
                <td className="px-6 py-4 font-medium ">
                  {h.userName}
                </td>

                {/* PLAN */}
                <td className="px-6 py-4 capitalize font-medium">
                  {h.plan === "topup"
                    ? "Top-up"
                    : h.plan?.toLowerCase()}
                </td>

                {/* AMOUNT */}
                <td className="px-6 py-4 font-semibold text-[#78bcc4]">
                  ${h.amount?.toFixed(2)}
                </td>

                {/* REASON */}
                <td className="px-6 py-4 font-medium">
                  {h.refundRequestedReason || "-"}
                </td>

                {/* STATUS */}
                <td className="px-6 py-4">

                  {h.status === "COMPLETED" && (
                    <span className="text-[#5a6c7d] font-medium">
                      Completed
                    </span>
                  )}

                  {h.status === "PENDING" && (
                    <span className="text-[#ee6a59] font-medium">
                      Pending
                    </span>
                  )}

                  {h.status === "FAILED" && (
                    <div className="flex items-center gap-2">

                      <span className="text-[#ee6a59] font-medium">
                        Refund Failed
                      </span>

                      <div className="w-5 h-5 rounded-full border-2 border-[#5a6c7d] flex items-center justify-center">
                        <div className="w-2.5 h-2.5 bg-[#78bcc4] rounded-full" />
                      </div>

                    </div>
                  )}

                </td>

              </tr>

            ))

          )}

        </tbody>

      </table>

    </div>

  </div>

</div>,

document.body
)}




{showRefundModal && createPortal(

  <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[1000]">

    {/* MODAL BOX */}
    <div className="bg-white rounded-[28px] w-[380px] p-8 shadow-[0_20px_40px_rgba(0,0,0,0.15)]">

      {/* TITLE */}
      <h2 className="text-xl font-semibold text-[#0b3c49] text-center mb-3">
        Approve Refund
      </h2>

      {/* TEXT */}
      <p className="text-[#5a6c7d] text-center mb-8 text-sm leading-relaxed">
        Are you sure you want to refund this user?
        <br />
        The amount will be credited via Stripe
      </p>

      {/* BUTTONS */}
      <div className="flex gap-4 justify-center">

        {/* CANCEL */}
        <button
          onClick={() => setShowRefundModal(false)}
          className="
            px-8 py-3
            rounded-full
            bg-[#bfc3be]
            text-white
            font-semibold
            hover:opacity-90
            transition
          "
        >
          Cancel
        </button>

        {/* CONFIRM */}
        <button
          onClick={handleRefundConfirm}
          className="
            px-8 py-3
            rounded-full
            bg-[#002c3e]
            text-white
            font-semibold
            hover:opacity-90
            transition
          "
        >
          Confirm
        </button>

      </div>

    </div>

  </div>,

  document.body
)}
</div>



);
}



/* ================= CARD ================= */

function Card({ label, value, error, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`
      bg-[#f5f5f5] rounded-4xl px-4 py-6
      ${onClick ? "cursor-pointer hover:scale-[1.03] hover:shadow-md" : ""}
      transition-all duration-200
      `}
    >
      <p className="text-[#5a6c7d] text-[16px] font-semibold">
        {label}
      </p>

      <p className={`text-[48px] font-semibold mt-2 ${
        error ? "text-[#ee6a59]" : "text-[#002c3e]"
      }`}>
        {value}
      </p>
    </div>


  );
}