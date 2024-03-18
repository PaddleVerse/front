/* eslint-disable @next/next/no-img-element */
'use client'
import React, { useEffect } from "react";
import { Inter } from "next/font/google";
import Image from "next/image";
import Coin from "../Stuff/Coin";
import { motion } from "framer-motion";
const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

interface Infos {
  title: string;
  image: string;
  description: string;
}
interface BigCardProps {
  infos: Infos;
  selected: string;
  handleClick: (infos: Infos) => void;
}
const BigCard = ({ infos, handleClick, selected}: BigCardProps) => {
  const handleCardClick = () => {
    setHover(true);
    handleClick(infos);
  };
  const [hover, setHover] = React.useState(false);
  const imageUrls = {
    first: `/${selected}/first.png`,
    second: `/${selected}/second.png`,
    third: `/${selected}/third.png`,
  };
  return (
    <div
      className={`w-[100%] h-[375px]  relative text-white ${inter.className} cursor-pointer rounded-lg `}
      onMouseOver={() => setHover(true)}
      onMouseOut={() => setHover(false)}
    >
      <Image
        src={`${
          infos.image === "first"
            ? imageUrls.first
            : infos.image === "second"
            ? imageUrls.second
            : imageUrls.third
        }`}
        alt="shop"
        fill
        sizes="h-auto w-auto"
        priority
        className="object-cover object-center rounded-lg"
        onClick={handleCardClick}
      />
      <motion.div
      initial={{opacity: 0}}
        animate={{opacity: hover ? 1 : 0}}
        transition={{duration: 0.4}}
      >
        <div className="absolute w-[70%] left-4 top-4">
          <h1 className="xl:text-[22px] text-[18px] font-[500]">
            {infos.title}
          </h1>
          <p className="text-[12px]">{infos.description}</p>
        </div>
        <div className="absolute bottom-4 right-4">
          <Coin size={"big"} />
        </div>
      </motion.div>
    </div>
  );
};

export default BigCard;
