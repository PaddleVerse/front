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
import toast from "react-hot-toast";
import { useGlobalState } from "../../Sign/GlobalState";
import BottomGradient from "@/components/ui/bottomGradiant";

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

const CreateChannel = ({ handleClick }: { handleClick: () => void }) => {
  const { state, dispatch } = useGlobalState();
  const password = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const topic = useRef<HTMLInputElement>(null);
  const name = useRef<HTMLInputElement>(null);
  const [channelAppearence, setChannelAppearence] = useState(false);
  const { register } = useForm();

  const validateForm = () => {
    if (name.current!.value!.trim().length < 3) {
      toast.error("Name must be at least 3 characters long.");
      return false;
    }
    if (
      password.current!.value!.match(/(["'><])/) ||
      name.current!.value!.match(/(['"><])/)
    ) {
      toast.error("you sneaky bastard");
      return false;
    }
    return true;
  };

  const handleCreateChannel = async () => {
    if (!validateForm()) return;
    const channelObject = {
      channel: {
        name: name.current!.value,
        key: password.current!.value ? password.current!.value : null,
        state: channelAppearence
          ? "private"
          : password.current!.value
          ? "protected"
          : "public",
      },
      user: state?.user,
    };
    try {
      if (file) {
        if (!file.type.startsWith("image/")) {
          toast.error("Please select an image file.");
          return;
        }
      }
      const ret = await axios.post(
        "http://localhost:8080/channels",
        channelObject
      );
      if (file) {
        const formData = new FormData();
        formData.append("image", file);
        try {
          const picture = await axios.post(
            `http://localhost:8080/channels/image?channel=${ret.data.id}&user=${state?.user.id}`,
            formData,
            {
              headers: { "Content-Type": "multipart/form-data" },
            }
          );
        } catch (error) {
          toast.error("error in uploading image, using the default image");
        }
      }
      state?.socket.emit("joinRoom", {
        roomName: ret?.data?.name,
        user: state?.user,
        type: "self",
      });
    } catch (error) {
      toast.error("error in creating channel");
      return;
    }
    handleClick();
  };
  return (
    <div
      className={`fixed inset-0 sm:flex hidden ${inter.className} items-center justify-center bg-black bg-opacity-50 z-50 text-white`}
    >
      <motion.div
        className="overflow-y-auto scroll border border-red-500/[0.3] h-[60%] 2xl:w-[35%] xl:w-[55%] sm:w-[70%] flex flex-col bg-transparent rounded-xl p-[150px] gap-5"
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
        <div>
          <label
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            typeof="file_input"
          >
            Upload file
          </label>
          <input
            className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
            type="file"
            accept="image/*"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                if (!e.target.files[0].type.startsWith("image/")) {
                  toast.error("Please select an image file.");
                  return;
                }
                setFile(e.target.files[0]);
              }
            }}
          />
        </div>
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
          onSubmit={(e) => {
            e.preventDefault();
            handleCreateChannel();
          }}
        >
          <label htmlFor="Name">Name</label>
          <Input
            placeholder="channel name"
            {...register("name", { required: true })}
            ref={name}
            className="rounded-lg"
          />
          <label htmlFor="Password" className="mt-5">
            Passowrd (optional)
          </label>
          <Input
            type="text"
            placeholder="password"
            {...register("password", { required: false })}
            ref={password}
            className="rounded-lg"
          />
          <label htmlFor="Password" className="mt-5">
            topic (optional)
          </label>
          <Input
            type="text"
            placeholder="topic"
            {...register("topic", { required: false })}
            ref={topic}
            className="rounded-lg"
          />
          <div className="flex flex-row justify-around mt-5">
            <button
              className="w-[45%] bg-gradient-to-br relative group/btn from-zinc-900 to-zinc-900 block bg-zinc-800  text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
              type="button"
              onClick={handleClick}
            >
              Cancel
              <BottomGradient />
            </button>
            <button
              className="bg-gradient-to-br relative group/btn from-zinc-900 to-zinc-900 block bg-zinc-800 w-[45%] text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
              type="submit"
            >
              Submit
              <BottomGradient />
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default CreateChannel;
