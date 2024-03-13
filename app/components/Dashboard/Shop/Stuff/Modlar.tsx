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
  image: string;
  description: string;
}

const Modlar = ({
  infos,
  selected,
  handleClick,
}: {
  infos: Infos;
  handleClick: (infos: null) => void;
  selected: string;
}) => {
  const imageUrls = {
    first: `/${selected}/first.png`,
    second: `/${selected}/second.png`,
    third: `/${selected}/third.png`,
  };
  return (
    <motion.div
      className="fixed inset-0 sm:flex hidden items-center justify-center bg-black bg-opacity-50 z-50"
      >
      <motion.div
        className="bg-black rounded-lg flex justify-center p-[50px] text-white gap-8  relative"
        initial={{ opacity: 0, scale: 0.75 }}
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
        // style={{ minWidth: 0, maxWidth: "80vw", maxHeight: "80vh" }}
      >
        <div className="relative">
          <Image
            src={`${
              infos.image === "first"
                ? imageUrls.first
                : infos.image === "second"
                ? imageUrls.second
                : imageUrls.third
            }`}
            alt="shop"
            sizes="width:auto height:auto"
            width={700}
            height={400}
            priority
            className="object-cover object-center w-auto h-auto"
            // sizes="(max-width: 100px) 100vw, 33vw"
          />
        </div>
        <div className={`flex flex-col ${rajdhani.className}  justify-between`}>
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
