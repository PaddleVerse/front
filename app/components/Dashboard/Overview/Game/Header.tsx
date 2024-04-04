import React from "react";
import Image from "next/image";
import { inter, rajdhani } from "@/app/utils/fontConfig";
import { cn } from "@/components/cn";

const Header = () => {
  return (
    <div
      className={cn(
        `flex justify-between items-center text-white`,
        rajdhani.className
      )}
    >
      <div className="flex flex-col relative">
        <h1 className="font-[600] text-[24px]">Hello Andrew</h1>
        <p
          className={cn(
            "text-buttonGray",
            inter.className,
            "text-[13px] xl:w-auto md:w-[165px] sm:flex hidden truncate"
          )}
        >
          Ready to get started for an exciting new game? Choose a game-mode and
          click Play.
        </p>
      </div>
      <button
        className={cn(
          "flex items-center justify-center",
          rajdhani.className,
          "sm:py-3 sm:px-[65px] py-2 bg- px-5 rounded-md gap-2 border border-red-500"
        )}
      >
        <span className="font-[500]">Play</span>
        <Image
          src={"/nextPlay.svg"}
          width={20}
          height={20}
          alt="next to play image"
        />
      </button>
    </div>
  );
};

export default Header;
