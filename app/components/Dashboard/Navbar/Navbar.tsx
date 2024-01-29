"use client";
import React from "react";
import { usePathname } from "next/navigation";

const Navbar = () => {
  const pathname = usePathname();
  return (
    <div className="w-full flex justify-center "
    >
      <div
        className="w-[95%] h-14  bg-transparent rounded-b-sm md:flex hidden items-center"
        style={{
          backdropFilter: "blur(20px)",
          backgroundColor: "rgba(13, 9, 10, 0.7)",
        }}
      >
        <span className="text-gray-400 ml-10 text-[14px]">{pathname}</span>
      </div>
    </div>
  );
};

export default Navbar;
