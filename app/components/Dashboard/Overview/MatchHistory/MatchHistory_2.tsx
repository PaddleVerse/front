import React from "react";
import { Rajdhani } from "next/font/google";
import OneGame_2 from "./OneGame_2";

const rajdhani = Rajdhani({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});
const MatchHistory_2 = () => {
  return (
    <div
      className="w-full rounded-md bg-[#101823] overflow-y-auto h-[700px] text-white flex flex-col overflow-x-hidden"
    >
      <div className="w-full p-6 sticky top-0 bg-[#101823] z-30">
        <h1 className={`sm:text-4xl text-2xl font-semibold ${rajdhani.className}`}>
          All Matches
        </h1>
      </div>
      <div className="w-full h-full px-6 flex flex-col gap-[12px] ml-1">
        <OneGame_2 status={"win"} />
        <OneGame_2 status={"lose"} />
        <OneGame_2 status={"win"} />
        <OneGame_2 status={"lose"} />
        <OneGame_2 status={"win"} />
        <OneGame_2 status={"lose"} />
        <OneGame_2 status={"win"} />
        <OneGame_2 status={"lose"} />
        <OneGame_2 status={"win"} />
        <OneGame_2 status={"lose"} />
      </div>
    </div>
  );
};

export default MatchHistory_2;
