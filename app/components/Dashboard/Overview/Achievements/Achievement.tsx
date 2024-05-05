import Image from "next/image";
import { rajdhani } from "@/app/utils/fontConfig";
import React from "react";
import { cn } from "@/components/cn";
import achievements from "./Data";


const Achievement = ({data} : any) => {
  return (
    <div className=" w-full text-white flex items-center gap-2 p-2">
      <Image
        src={data?.image || "/achievements/first_win.png"}
        width={40}
        height={40}
        alt="badge"
        className="w-auto h-auto rounded-full object-cover"
      ></Image>
      <div className="flex flex-col w-full">
        <h1 className={cn("text-[14px] font-[500]", rajdhani.className)}>
          {data?.title || ""}
        </h1>
        <p className="text-[10px] text-buttonGray">{data?.description || ""}</p>
      </div>
    </div>
  );
};

export default Achievement;
