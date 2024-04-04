import React from "react";
import { rajdhani } from "@/app/utils/fontConfig";
import Image from "next/image";
import Achievement from "./Achievement";
import { cn } from "@/components/cn";

const Achievements = () => {
  return (
    <div className=" w-full  rounded-md p-3 h-auto bg-primaryColor">
      <div className="w-full text-white flex gap-2  items-center">
        <Image
          src="/achievements.svg"
          width={20}
          height={20}
          alt={"image"}
          className="w-auto h-auto"
        />
        <h1
          className={cn(
            "font-[500] xl:text-[20px] lg:text-[17px]",
            rajdhani.className
          )}
        >
          ACHIEVEMENTS
        </h1>
      </div>
      {Array.from({ length: 10 }, (_, index) => (
        <Achievement key={index} />
      ))}
    </div>
  );
};

export default Achievements;
