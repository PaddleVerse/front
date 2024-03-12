import React from "react";
import { motion } from "framer-motion";
import { Roboto } from "next/font/google";
import Image from "next/image";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
});
const OneGame_2 = ({status}:{status:string}) => {
  return (
    <motion.div className="rounded-md w-full h-[70px] cursor-pointer  bg-gradient-to-r bg-[#172234] flex items-center justify-between px-4"
      whileHover={{x:-10}}
    >
      <div className="flex items-center justify-between 2xl:w-[42%] w-[80%]">
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
          <span className="xl:text-[18px] sm:text-[15px] font-semibold tracking-widest">
            13:5
          </span>
          <span className={`text-[#647087] xl:text-[14px] sm:text-[11px] font-semibold`}>
            Ascent - 7m
          </span>
        </div>
        <div className="flex flex-col items-center justify-center leading-5">
          <span className={`${status === 'win' ? 'text-[#24D8AF]' :'text-[#FF4656]'} font-semibold xl:text-[20px] sm:text-[17px] tracking-tighter`}>
            2.00KD
          </span>
          <span className="text-[#647087] xl:text-[13px] text-[11px]">15 / 25 / 3</span>
        </div>
        <div className="flex flex-col items-start leading-5">
          <span className={`${status === 'win' ? 'text-[#24D8AF]' :'text-[#FF4656]'} font-semibold xl:text-[20px] sm:text-[17px] tracking-tighter`}>
            55%
          </span>
          <span className="text-[#647087] xl:text-[13px] text-[11px]">Headshot %</span>
        </div>
        <div className="flex flex-col">
          <span className="text-white font-semibold xl:text-[20px] sm:text-[17px] tracking-tight">
            149 Combat Score
          </span>
          <div className="flex gap-2 items-center">
            <span className="text-[#EBAD40] font-[500] xl:text-[14px] sm:text-[11px] tracking-tight">
              MVP
            </span>
            <span>-</span>
            <span className="text-[#647087] xl:text-[13px] text-[11px] font-semibold">
              Custom
            </span>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-center py-1 px-[11px] text-[15px] tracking-tight font-semibold rounded-md bg-[#202B43]">
        Mar 5, 2024
      </div>
      <div className="items-center justify-between w-[42%] hidden 2xl:flex">
        <div className="flex flex-col">
          <span className="text-white font-semibold xl:text-[20px] sm:text-[17px] tracking-tight">
            149 Combat Score
          </span>
          <div className="flex gap-2 items-center">
            <span className="text-[#EBAD40] font-[500] xl:text-[14px] sm:text-[11px] tracking-tight">
              MVP
            </span>
            <span>-</span>
            <span className="text-[#647087] xl:text-[13px] text-[11px] font-semibold">
              Custom
            </span>
          </div>
        </div>
        <div className="flex flex-col items-start leading-5">
          <span className={`${status === 'win' ? 'text-[#24D8AF]' :'text-[#FF4656]'} font-semibold xl:text-[20px] sm:text-[17px] tracking-tighter`}>
            55%
          </span>
          <span className="text-[#647087] xl:text-[13px] text-[11px]">Headshot %</span>
        </div>
        <div className="flex flex-col items-center justify-center leading-5">
          <span className={`${status === 'win' ? 'text-[#24D8AF]' :'text-[#FF4656]'} font-semibold xl:text-[20px] sm:text-[17px] tracking-tighter`}>
            2.00KD
          </span>
          <span className="text-[#647087] xl:text-[13px] text-[11px]">15 / 25 / 3</span>
        </div>
        <div className="flex flex-col items-center justify-center leading-5">
          <span className="xl:text-[18px] sm:text-[15px] font-semibold tracking-widest">
            13:5
          </span>
          <span className={`text-[#647087] xl:text-[14px] sm:text-[11px] font-semibold`}>
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
    </motion.div>
  );
};

export default OneGame_2;
