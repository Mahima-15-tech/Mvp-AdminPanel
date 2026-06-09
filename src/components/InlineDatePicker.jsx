import { useEffect, useRef, useState } from "react";
import DatePicker from "react-datepicker";
import { CalendarDays } from "lucide-react";
import "react-datepicker/dist/react-datepicker.css";

function InlineDatePicker({ value, onChange, label }) {

    const [open, setOpen] = useState(false);
    const [tempDate, setTempDate] = useState(value);
  
    const [showMonth, setShowMonth] = useState(false);
    const [showYear, setShowYear] = useState(false);
  
    const ref = useRef();
  
    const years = Array.from({ length: 50 }, (_, i) => 2000 + i);
    const months = [
      "Jan","Feb","Mar","Apr","May","Jun",
      "Jul","Aug","Sep","Oct","Nov","Dec"
    ];
  
    useEffect(() => {
      setTempDate(value);
    }, [value]);
  
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
      <div className="relative shrink-0 " ref={ref}>
  
        {/* INPUT (MATCH REVENUE EXACTLY) */}
        <div
          onClick={() => setOpen(!open)}
          className="
            flex items-center 
            bg-white rounded-full 
            overflow-hidden 
            cursor-pointer 
            hover:shadow-md 
            transition
            
          "
        >
  
          {/* LABEL */}
          <span className="px-4 py-3.5 text-white bg-[#002c3e] font-semibold text-sm">
            {label}
          </span>
  
          {/* DATE */}
          <div className="px-4 py-2 flex items-center gap-3 text-[#5a6c7d] text-sm min-w-[140px]">
  
            {value
              ? new Date(value).toLocaleDateString("en-GB").replaceAll("/", " | ")
              : "DD | MM | YY"
            }
  
            <CalendarDays size={16} className="text-[#5a6c7d] ml-auto" />
  
          </div>
  
        </div>
  
        {/* DROPDOWN (MATCH REVENUE POSITION + SIZE) */}
        {open && (
          <div className="
            absolute top-[55px] -left-6 
            z-50 
            bg-white rounded-2xl p-4 
            w-[260px] 
            shadow-[0_10px_30px_rgba(0,0,0,0.15)]
          ">
  
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
                  setTempDate(value);
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

export default InlineDatePicker;