import React from "react";
import { Roboto } from "next/font/google";
import Image from "next/image";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
});
const OneGame_2 = () => {
  return (
    <div className="rounded-md w-full h-[70px]  bg-gradient-to-r from-[#172234] via-[#172234] to-[#172234] flex items-center justify-between px-4">
      <div className="flex items-center justify-between w-[42%]">
        <div>
          <Image
            src="/b.png"
            width={50}
            height={50}
            alt="img"
            className="rounded-full"
          />
        </div>
        <div className="flex flex-col items-center justify-center leading-5">
          <span className="text-[18px] font-semibold tracking-widest">
            13:5
          </span>
          <span className={`text-[#647087] text-[14px] font-semibold`}>
            Ascent - 7m
          </span>
        </div>
        <div className="flex flex-col items-center justify-center leading-5">
          <span className="text-[#24D8AF] font-semibold text-[20px] tracking-tighter">
            2.00KD
          </span>
          <span className="text-[#647087] text-[13px]">15 / 25 / 3</span>
        </div>
        <div className="flex flex-col items-start leading-5">
          <span className="text-[#24D8AF] font-semibold text-[20px] tracking-tighter">
            55%
          </span>
          <span className="text-[#647087] text-[13px]">Headshot %</span>
        </div>
        <div className="flex flex-col">
          <span className="text-white font-semibold text-[20px] tracking-tight">
            149 Combat Score
          </span>
          <div className="flex gap-2 items-center">
            <span className="text-[#EBAD40] font-[500] text-[14px] tracking-tight">
              MVP
            </span>
            <span>-</span>
            <span className="text-[#647087] text-[13px] font-semibold">
              Custom
            </span>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-center py-1 px-[11px] text-[15px] tracking-tight font-semibold rounded-md bg-[#202B43]">
        Mar 5, 2024
      </div>
      <div className="flex items-center justify-between w-[42%]">
        <div className="flex flex-col">
          <span className="text-white font-semibold text-[20px] tracking-tight">
            149 Combat Score
          </span>
          <div className="flex gap-2 items-center">
            <span className="text-[#EBAD40] font-[500] text-[14px] tracking-tight">
              MVP
            </span>
            <span>-</span>
            <span className="text-[#647087] text-[13px] font-semibold">
              Custom
            </span>
          </div>
        </div>
        <div className="flex flex-col items-start leading-5">
          <span className="text-[#24D8AF] font-semibold text-[20px] tracking-tighter">
            55%
          </span>
          <span className="text-[#647087] text-[13px]">Headshot %</span>
        </div>
        <div className="flex flex-col items-center justify-center leading-5">
          <span className="text-[#24D8AF] font-semibold text-[20px] tracking-tighter">
            2.00KD
          </span>
          <span className="text-[#647087] text-[13px]">15 / 25 / 3</span>
        </div>
        <div className="flex flex-col items-center justify-center leading-5">
          <span className="text-[18px] font-semibold tracking-widest">
            13:5
          </span>
          <span className={`text-[#647087] text-[14px] font-semibold`}>
            Ascent - 7m
          </span>
        </div>
        <div>
          <Image
            src="/b.png"
            width={50}
            height={50}
            alt="img"
            className="rounded-full"
          />
        </div>
      </div>
    </div>
  );
};

export default OneGame_2;
