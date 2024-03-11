/* eslint-disable @next/next/no-img-element */
import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { AiOutlineClose } from "react-icons/ai";

import { Rajdhani } from "next/font/google";
import Coin from "./Coin";

const rajdhani = Rajdhani({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});


interface Infos {
  title: string;
  description: string;
}

const Modlar = ({
  infos,
  handleClick,
}: {
  infos: Infos;
  handleClick: (infos: null) => void;
}) => {
  return (
    <motion.div
      className="fixed inset-0 sm:flex hidden items-center justify-center bg-black bg-opacity-50 z-10"
      initial={{ opacity: 0, scale: 0.75  }}
      animate={{
        opacity: 1,
        scale: 1,
        transition: {
          ease: "easeIn",
          duration: 0.15,
        },
      }}
      exit={{
        opacity: 0,
        scale: 0.75,
        transition: {
          ease: "easeIn",
          duration: 0.15,
        },
      }}
    >
      <motion.div
        className="bg-black rounded-lg flex justify-center p-[50px] text-white gap-8  relative"
        // style={{ minWidth: 0, maxWidth: "80vw", maxHeight: "80vh" }}
      >
        <div className="relative">
          <img
            src={`${
              infos.title === "Galactic Spinner"
                ? "/shop1Crop.png"
                : infos.title === "Ocean whisper"
                ? "/shop3Crop.png"
                : "/shop2Crop.png"
            }`}
            className="xl:w-[350px] md:w-[200px] w-[150px]  "
            alt="shop"
          />
        </div>
        <div
          className={`flex flex-col ${rajdhani.className}  justify-between`}
        >
          <div>
            <h1 className="xl:text-[31px] text-[18px] font-[600]">
              {infos.title}
            </h1>
            <p className="text-[18px] w-[450px] font-[500]">
              {infos.description}
            </p>
          </div>
          <div className="mt-[45px] self-end">
            <Coin size="big" />
          </div>
        </div>
        <div
          className="absolute top-2 right-2 cursor-pointer"
          onClick={() => handleClick(null)}
        >
          <AiOutlineClose size={30} />
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Modlar;
