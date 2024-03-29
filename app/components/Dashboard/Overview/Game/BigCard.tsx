/* eslint-disable @next/next/no-img-element */
import React from "react";

import { Inter } from "next/font/google";
import { Rajdhani } from "next/font/google";
const rajdhani = Rajdhani({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});
const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
});

import { motion } from "framer-motion";

const BigCard = ({ gameMode }: { gameMode: string }) => {
  return (
    <div className=" 2xl:h-[850px] xl:h-[550px] h-[600px] sm:h-[700px] sm:w-[95%] w-[87%] overflow-hidden cursor-pointer rounded-lg relative">
      <motion.img
        src={`${
          gameMode === "1"
            ? "/game1.png"
            : gameMode === "2"
            ? "/game2.png"
            : gameMode === "3"
            ? "/game3.png"
            : "/game4.png"
        }`}
        // src={`/game1.png`}
        className="w-full h-full object-cover "
        alt="gameImage"
        initial={{ scale: 1 }}
        whileHover={{ scale: 1.15, rotate: 4 }}
        transition={{ duration: 0.5 }}
      />
      <div className="h-[25%] w-full bg-transparent absolute bottom-0 text-white flex flex-col 2xl:p-8 md:p-8 lg:p-4 p-4 2xl:gap-4 gap-2"
          style={{
            backdropFilter: "blur(5px)",
            backgroundColor: "rgba(13, 9, 10, 0.5)",
          }}
      >
        <h1 className={`${rajdhani.className} font-[600] 2xl:text-2xl text-lg`}>Gamemode</h1>
        <p className={`${inter.className} 2xl:text-md text-sm w-[95%] sm:w-auto`}>Information about the game mode, explain what the user can expect when they select this game mode</p>
        <div className="flex items-center gap-4">
          <img src="/queue.svg" alt="queue" className="2xl:w-[20px] 2xl:h-[20px] w-[14px] h-[14px]"/>
          <p className="2xl:text-md text-sm">Queue time: 2 mins</p>
        </div>
      </div>
    </div>
  );
};

export default BigCard;
