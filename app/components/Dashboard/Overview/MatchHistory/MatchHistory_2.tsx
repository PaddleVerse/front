import React from "react";
import { rajdhani } from "@/app/utils/fontConfig";
import OneGame_2 from "./OneGame_2";
import { cn } from "@/components/cn";

const MatchHistory_2 = () => {
  return (
    <div className="w-full rounded-md bg-primaryColor no-scrollbar overflow-y-auto h-[700px] text-white flex flex-col overflow-x-hidden">
      <div className="w-full p-6 sticky top-0 bg-primaryColor z-30">
        <h1
          className={cn(
            `sm:text-4xl text-2xl font-semibold`,
            rajdhani.className
          )}
        >
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
