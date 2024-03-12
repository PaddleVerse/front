import React from "react";
import { Inter } from "next/font/google";
import { motion } from "framer-motion";
import JoinChannelBubble from "./JoinChannelBubble";
import { IoIosSearch } from "react-icons/io";
import { AiOutlineClose } from "react-icons/ai";

const inter = Inter({ subsets: ["latin"] });
const modalVariants = {
  open: {
    opacity: 1,
    scale: 1,
    transition: {
      ease: "easeOut",
      duration: 0.15,
    },
  },
  closed: {
    opacity: 0,
    scale: 0.75,
    transition: {
      ease: "easeIn",
      duration: 0.15,
    },
  },
};
const JoinChannel = ({ handleClick }: { handleClick: () => void }) => {
  return (
    <div className={`fixed inset-0 sm:flex hidden ${inter.className} items-center justify-center bg-black bg-opacity-50 z-50 text-white`}>
      <motion.div
        className="overflow-y-auto border border-rightArrowColor h-[70%] 2xl:w-[35%] xl:w-[55%] sm:w-[70%] px-10 py-16 flex flex-col bg-transparent rounded-xl"
        initial="closed"
        animate="open"
        exit="closed"
        variants={modalVariants}
        style={{
          backdropFilter: "blur(20px)",
          backgroundColor: "rgba(13, 9, 10, 0.4)",
        }}
      >
        <h1 className="text-3xl">Expand your horizon</h1>
        <div className="w-full relative mt-5">
          <input
            type="text"
            className="rounded-md text-black pl-8 w-full h-[45px] outline-none"
            placeholder="Search"
          />
          <IoIosSearch className="absolute top-[15px] left-[10px] text-gray-400" size={17} />
        </div>
        <div className=" grid-cols-2 grid mt-10 overflow-y-auto">
        {Array.from({ length: 20 }, (_, index) => (
          <JoinChannelBubble key={index} lock={true}/>
          ))}
        </div>
        <div className="absolute top-2 right-2 cursor-pointer">
          <AiOutlineClose size={30} onClick={() => handleClick()} />
        </div>
      </motion.div>
    </div>
  );
};

export default JoinChannel;
