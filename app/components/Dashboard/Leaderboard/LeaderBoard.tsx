import React from "react";
import PlacingElement from "./PlacingElement";
import LeaderTable from "./LeaderTable";
import { rajdhani } from "@/app/utils/fontConfig";
import { cn } from "@/components/cn";
const LeaderBoard = () => {
  return (
    <div className="  sm:w-[61%] p-[2px]  w-[95%] h-[88%]  mt-[50px] from-[#dc5051] from-10% via-[#C2584F] via-15% to-transparent to-90% flex flex-col  bg-gradient-to-b rounded-xl">
      <div className=" rounded-xl h-full w-full bg-primaryColor]">
        <div className="w-[95%] mx-auto flex mt-10 flex-col gap-10 ">
          <h1
            className={cn(
              "text-white sm:text-[40px] text-[31px] font-semibold",
              rajdhani.className
            )}
          >
            Pong Leaderboard
          </h1>
          <LeaderTable />
        </div>
      </div>
    </div>
  );
};

export default LeaderBoard;
