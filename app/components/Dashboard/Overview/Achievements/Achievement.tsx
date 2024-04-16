import Image from "next/image";
import { rajdhani } from "@/app/utils/fontConfig";
import React from "react";
import { cn } from "@/components/cn";

const Achievement = () => {
  return (
    <div className=" w-full text-white flex items-center gap-2 p-2">
      <Image
        src={"/badge2_c.png"}
        width={40}
        height={40}
        alt="badge"
        className="w-auto h-auto"
      ></Image>
      <div className="flex flex-col w-full">
        <h1 className={cn("text-[14px] font-[500]", rajdhani.className)}>
          FIRST WIN
        </h1>
        <p className="text-[10px] text-buttonGray">a good way to start</p>
      </div>
    </div>
  );
};

export default Achievement;
