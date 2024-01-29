import Image from "next/image";
import { Plus_Jakarta_Sans } from "next/font/google";

import React from "react";

const plusjakarta = Plus_Jakarta_Sans({subsets:["latin"], weight:["300","400","500","700"]})

const PlacingElement = () => {
  return (
    <div className=" flex gap-[7px] items-center h-full relative pb-[20px]">
      <div className="flex flex-col items-center text-white gap-4">
        <div className="w-[100px] h-[100px] rounded-full overflow-hidden mt-20  border-[3px] border-progressIndicator "
        >
          <Image
            src="/leaderboard/2.jpeg"
            width={100}
            height={100}
            alt="image"
            style={{objectFit:"cover"}}
            className="rounded-full"
          />
          <div className={`absolute bottom-[62px] left-[38px] flex items-center justify-center bg-progressIndicator w-6 h-6 rounded-full text-[12px] ${plusjakarta.className}`}>
            2
          </div>
        </div>
        <div className="text-[11px] flex flex-col items-center">
          <div>leo</div>
          <div>42pts</div>
        </div>
      </div>
      <div className="flex flex-col items-center text-white gap-4">
        <div className="w-[120px] h-[120px] rounded-full overflow-hidden  border-[3px] border-progressIndicator ">
          <Image
            src="/leaderboard/1st.jpeg"
            width={120}
            height={120}
            alt="image"
            style={{objectFit:"cover"}}
            className="rounded-full"
          />
          <div className={`absolute bottom-[92px] left-[157px] flex items-center justify-center bg-progressIndicator w-6 h-6 text-white rounded-full text-[12px] ${plusjakarta.className}`}>
            1
          </div>
        </div>
        <div className="text-[11px] flex flex-col items-center">
          <div>leo</div>
          <div>42pts</div>
        </div>
      </div>
      <div className="flex flex-col items-center text-white gap-4">
        <div className="w-[100px] h-[100px] rounded-full overflow-hidden mt-20 border-[3px] border-progressIndicator">
          <Image
            src="/b.png"
            width={100}
            height={100}
            alt="image"
            style={{objectFit:"cover"}}
            className="rounded-full "
          />
          <div className={`absolute bottom-[57px] left-[272px] flex items-center justify-center bg-progressIndicator w-6 h-6 text-white rounded-full text-[12px] ${plusjakarta.className}`}>
            3
          </div>
        </div>
        <div className="text-[11px] flex flex-col items-center" >
          <div>leo</div>
          <div>42pts</div>
        </div>
      </div>
    </div>
  );
};

export default PlacingElement;
