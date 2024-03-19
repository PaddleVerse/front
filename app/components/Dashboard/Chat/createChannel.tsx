import React, { useEffect, useRef, useState } from "react";
import { Inter } from "next/font/google";
import { motion } from "framer-motion";
import JoinChannelBubble from "./JoinChannelBubble";
import { IoIosSearch } from "react-icons/io";
import { AiOutlineClose } from "react-icons/ai";
import axios from "axios";
import { user } from "@/app/Dashboard/Chat/type";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/newinput";
import { Button } from "@/components/ui/moving-border";

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

const CreateChannel = ({
  handleClick,
  user,
  socket,
}: {
  handleClick: () => void;
  user: user;
  socket: any;
}) => {
  const password = useRef<HTMLInputElement>(null);
  const name = useRef<HTMLInputElement>(null);
  const [channelAppearence, setChannelAppearence] = useState(false);
  const { register } = useForm();

  return (
    <div
      className={`fixed inset-0 sm:flex hidden ${inter.className} items-center justify-center bg-black bg-opacity-50 z-50 text-white`}
    >
      <motion.div
        className="overflow-y-auto border border-red-500/[0.3] h-[70%] 2xl:w-[35%] xl:w-[55%] sm:w-[70%] flex flex-col bg-transparent rounded-xl p-[150px] gap-5"
        initial="closed"
        animate="open"
        exit="closed"
        variants={modalVariants}
        style={{
          backdropFilter: "blur(20px)",
          backgroundColor: "rgba(13, 9, 10, 0.4)",
        }}
      >
        <p className="text-3xl font-normal">Create a channel</p>
        <p className="text-">
          channels is where you and your friends can communicate as a group and
          you can have three types of channels, Public, private, and Protected.
        </p>

        <div className="inline-flex items-center cursor-pointer">
          <input type="checkbox" value="" className="sr-only" />
          <div
            className={`flex h-6 w-12 cursor-pointer ${
              !channelAppearence
                ? "bg-white justify-start"
                : "bg-green-500 justify-end"
            }  rounded-full  items-center border-2`}
            onClick={(e) => {
              e.preventDefault();
              setChannelAppearence(!channelAppearence);
            }}
          >
            <motion.div
              className={`w-5 h-5 rounded-full ${
                !channelAppearence ? "bg-green-500" : "bg-white"
              }`}
              layout
              transition={{ type: "spring", stiffness: 700, damping: 30 }}
            ></motion.div>
          </div>
          <motion.span
            className="ms-3 text-sm font-medium dark:text-gray-300"
            animate={{
              opacity: channelAppearence ? 1 : 1,
              x: channelAppearence ? 4 : 0,
            }}
            exit={{ opacity: 0, x: -10 }}
          >
            {!channelAppearence ? "Public" : "Private"}
          </motion.span>
        </div>

        <form
          className="flex flex-col gap-2"
          onSubmit={() => console.log("submit")}
        >
          <label htmlFor="Name">Name</label>
          <Input
            placeholder="channel name"
            {...register("name", { required: true })}
            ref={name}
            className="rounded-lg mb-5"
          />
          <label htmlFor="Password">Passowrd</label>
          <Input
            type="text"
            placeholder="password"
            {...register("password", { required: false })}
            ref={password}
            className="rounded-lg mb-5"
          />
          <div className="flex flex-row justify-around">
            <Button
              className="w-[45%]"
              borderRadius="10px"
              borderClassName=" bg-[radial-gradient(var(--green-500)_40%,transparent_60%)]"
            >
              cancel
            </Button>
            <Button
              className="w-[45%]"
              borderRadius="10px"
              borderClassName=" bg-[radial-gradient(var(--green-500)_40%,transparent_60%)]"
            >
              submit
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default CreateChannel;
