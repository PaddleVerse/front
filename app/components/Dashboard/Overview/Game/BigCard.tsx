/* eslint-disable @next/next/no-img-element */
import React from "react";

const BigCard = ({ gameMode }: { gameMode: string }) => {
  return (
    <div className=" 2xl:h-[850px] xl:h-[550px] h-[600px] sm:h-[700px] sm:w-[95%] w-[87%]">
      <img
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
        className="w-full h-full object-cover rounded-lg"
        alt="gameImage"
      />
    </div>
  );
};

export default BigCard;
