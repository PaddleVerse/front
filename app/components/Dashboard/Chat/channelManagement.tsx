"use client";
import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Input } from "@/components/ui/newinput";
import MemberList from "./MemberList";
import { useForm } from "react-hook-form";
import { participants } from "@/app/Dashboard/Chat/type";

const ChannelManagement = ({
  participants,
}: {
  participants: participants[];
}) => {
  const { register } = useForm();
  const topicInput = useRef<HTMLInputElement | null>(null);
  const channelNameInput = useRef<HTMLInputElement | null>(null);
  const [selectedOption, setSelectedOption] = useState("");

  const handleOptionChange = (event: any) => {
    setSelectedOption(event.target.value);
  };

	console.log(selectedOption);
  return (
    <motion.div
      className="w-full flex sm:h-[80%] h-auto sm:flex-row flex-col jutify-center items-center  sm:overflow-y-scroll "
      initial={{ opacity: 0, y: -120 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <div className="sm:w-[45%] w-[100%] h-full bg-transparent flex flex-col items-center justify-start pt-[120px] gap-10 sm:border-r-2">
        <Image
          src={"/badge1.png"}
          width={200}
          height={200}
          alt="channel picture"
        />
        <form
          action=""
          //   onSubmit={handleSubmit}
          className="flex flex-col w-[50%] items-center justify-center  gap-4"
        >
          <Input
            type="text"
            placeholder="change topic"
            {...register("topicInput", { required: false })}
            ref={topicInput}
            className="rounded-lg "
          />
          <Input
            type="text"
            placeholder="change channel name"
            {...register("channelNameInput", {
              required: false,
            })}
            ref={channelNameInput}
            className="rounded-lg "
          />
        </form>
        <fieldset className="flex gap-2 items-center flex-wrap">
          <label htmlFor="private" className="2xl:text-md text-sm">
            private
          </label>
          <input
            type="radio"
            name="access"
            id="private"
            value="private"
            onChange={handleOptionChange}
            checked={selectedOption === "private"}
          />
          <label htmlFor="public" className="2xl:text-md text-sm">
            public
          </label>
          <input
            type="radio"
            name="access"
            id="public"
            value="public"
            onChange={handleOptionChange}
            checked={selectedOption === "public"}
          />
          <label htmlFor="protected" className="2xl:text-md text-sm">
            protected
          </label>
          <input
            type="radio"
            name="access"
            id="protected"
            value="protected"
            onChange={handleOptionChange}
            checked={selectedOption === "protected"}
          />
        </fieldset>
        <form
          action=""
          //   onSubmit={handleSubmit}
          className="flex flex-col w-[50%] items-center justify-center"
        >
          <Input
            type="text"
            placeholder="change topic"
            {...register("topicInput", { required: false })}
            ref={topicInput}
            className="rounded-lg "
          />
          <button
            type="submit"
            className="py-2 px-5 bg-red-500 rounded-md mt-4"
          >
            Submit
          </button>
        </form>
      </div>
      <div className="sm:w-[45%] w-full h-full bg-transparent overflow-y-scroll ">
        <div className="mt-10  flex flex-col gap-4 items-center">
          {Array.from({ length: 50 }, (_, index) => (
            <MemberList key={index} />
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default ChannelManagement;


// still need form validation and submit logic depending on the selected option, and the participants management is to be added later