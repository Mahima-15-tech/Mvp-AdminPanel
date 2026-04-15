import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import ScrollToTop from "../components/ScrollToTop";
import { useState, useEffect } from "react";

export default function AdminLayout({ children }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const el = document.getElementById("main-scroll");

    const handleScroll = () => {
      setScrolled(el.scrollTop > 20);
    };

    el.addEventListener("scroll", handleScroll);
    return () => el.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="flex h-screen bg-[#f7f8f3] overflow-hidden">

      {/* Sidebar */}
      <Sidebar />

      {/* Right Side */}
      <div className="flex-1 flex flex-col">

        {/* Topbar */}
        <Topbar />

        {/* Curved Container */}
  {/* Curved Container */}
  <div className="flex-1 relative overflow-hidden">

{/* 🔹 MAIN BG */}
<div 
  className="
  absolute inset-0 
  bg-[#d8dbd6]
  rounded-tl-[90px]
  ml-4
  z-10
"
/>

{/* 🔥 REAL CURVE BORDER (same shape) */}
<div
  className={`
  absolute inset-0
  ml-4
  rounded-tl-[90px]
  pointer-events-none
  z-[999]

  ${
    scrolled
      ? "border-t-10 border-[#d8dbd6]/70 mix-blend-multiply"
      : "border-t-10 border-[#c6cbc3]"
  }
  `}
/>

{/* 🔹 SCROLL CONTENT */}
<div
  id="main-scroll"
  className="
  absolute
  inset-0
  ml-10
  pt-10
  px-10
  pb-10
  overflow-y-auto
  z-30
"
>
  {children}
</div>

</div>

      </div>

    </div>
  );
}