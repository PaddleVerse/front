import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { cn } from "@/components/cn";

const OneGame_2 = ({ status }: { status: string }) => {
  return (
    <motion.div
      className="rounded-md w-full md:h-[70px] bg-gradient-to-r bg-secondaryColor flex items-center justify-between px-4"
      whileHover={{ x: -5 }}
    >
      <div className="flex items-center justify-between 2xl:w-[42%] md:w-[80%] w-[88%]">
        <div className="relative w-[50px] h-[50px] md:flex hidden ">
          <Image
            src="/b.png"
            fill
            alt="img"
            sizes="w-auto h-auto"
            className={cn(
              "rounded-full ring-[2px]",
              status === "win" ? "ring-[#FF4656]" : "ring-mathHistoryGreenColor"
            )}
          />
        </div>
        <div className="flex flex-col items-center justify-center md:leading-5 leading-2">
          <span className="xl:text-[18px] md:text-[15px] text-[11px] font-semibold tracking-widest">
            13:5
          </span>
          <span
            className={`text-[#647087] text-[10px] md:text-clip truncate w-[50px] xl:text-[14px] md:text-[11px] font-semibold`}
          >
            Ascent
          </span>
        </div>
        <div className="flex flex-col items-center justify-center md:leading-5 leading-2">
          <span
            className={cn(
              "font-semibold xl:text-[20px] md:text-[17px] text-[12px] tracking-tighter",
              status === "win"
                ? "text-mathHistoryGreenColor"
                : "text-mainRedColor"
            )}
          >
            2.00KD
          </span>
          <span className="text-[#647087] xl:text-[13px] md:text-[11px] text-[8px]">
            15 / 25 / 3
          </span>
        </div>
        <div className="flex flex-col items-start md:leading-5 leading-2">
          <span
            className={cn(
              "font-semibold xl:text-[20px] md:text-[17px] text-[12px] tracking-tighter",
              status === "win"
                ? "text-mathHistoryGreenColor"
                : "text-mainRedColor"
            )}
          >
            55%
          </span>
          <span className="text-[#647087] xl:text-[13px] md:text-[11px] text-[8px]">
            Headshot%
          </span>
        </div>
        <div className="flex flex-col">
          <span className="text-white font-semibold xl:text-[20px] text-[12px] md:text-[17px] tracking-tight">
            149 Combat Score
          </span>
          <span className="text-[#EBAD40] font-[500] text-[8px] xl:text-[14px] md:text-[11px] tracking-tight">
            MVP
          </span>
        </div>
      </div>
      <div className="flex items-center md:w-auto w-[25px] justify-center py-1 md:px-[11px] md:text-[15px] text-[11px] tracking-tight font-semibold rounded-md md:bg-[#202B43]">
        Mar 5, 2024
      </div>
      <div className="items-center justify-between w-[42%] hidden 2xl:flex">
        <div className="flex flex-col">
          <span className="text-white font-semibold xl:text-[20px] md:text-[17px] tracking-tight">
            149 Combat Score
          </span>
          <div className="flex gap-2 items-center">
            <span className="text-[#EBAD40] font-[500] xl:text-[14px] md:text-[11px] tracking-tight">
              MVP
            </span>
            <span>-</span>
            <span className="text-[#647087] xl:text-[13px] text-[11px] font-semibold">
              Custom
            </span>
          </div>
        </div>
        <div className="flex flex-col items-start leading-5">
          <span
            className={cn(
              "font-semibold xl:text-[20px] md:text-[17px] text-[12px] tracking-tighter",
              status === "win"
                ? "text-mathHistoryGreenColor"
                : "text-mainRedColor"
            )}
          >
            55%
          </span>
          <span className="text-[#647087] xl:text-[13px] text-[11px]">
            Headshot %
          </span>
        </div>
        <div className="flex flex-col items-center justify-center leading-5">
          <span
            className={cn(
              "font-semibold xl:text-[20px] md:text-[17px] text-[12px] tracking-tighter",
              status === "win"
                ? "text-mathHistoryGreenColor"
                : "text-mainRedColor"
            )}
          >
            2.00KD
          </span>
          <span className="text-[#647087] xl:text-[13px] text-[11px]">
            15 / 25 / 3
          </span>
        </div>
        <div className="flex flex-col items-center justify-center leading-5">
          <span className="xl:text-[18px] md:text-[15px] font-semibold tracking-widest">
            13:5
          </span>
          <span
            className={`text-[#647087] xl:text-[14px] md:text-[11px] font-semibold`}
          >
            Ascent
          </span>
        </div>
        <div className="relative w-[50px] h-[50px]">
          <Image
            src="/b.png"
            fill
            alt="img"
            sizes="w-auto h-auto"
            className={cn(
              "rounded-full ring-[2px]",
              status === "win"
                ? "ring-mainRedColor"
                : "ring-mathHistoryGreenColor"
            )}
          />
        </div>
      </div>
    </motion.div>
  );
};

export default OneGame_2;
