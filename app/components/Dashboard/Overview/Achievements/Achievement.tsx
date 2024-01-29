import Image from "next/image";
import { Rajdhani } from "next/font/google";
import React from "react";

const rajdhani = Rajdhani({ subsets: ["latin"], weight: ["400", "500"] });
const Achievement = () => {
  return (
    <div className=" w-full text-white flex items-center gap-2 p-2">
      <Image
        src={"/badge2_c.png"}
        width={100}
        height={100}
        alt="badge"
        className="w-[40px]"
      ></Image>
      <div className="flex flex-col w-full">
        <h1 className={`text-[14px] font-[500] ${rajdhani.className}`}>FIRST WIN</h1>
        <p className="text-[8px] text-buttonGray">a good way to start</p>
      </div>
    </div>
  );
};

export default Achievement;
