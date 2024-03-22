"use client";
import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/newinput";
import MemberList from "./MemberList";
import { useForm } from "react-hook-form";
import { channel, participants, user } from "@/app/Dashboard/Chat/type";
import Image from "next/image";

const ChannelManagement = ({
  participants,
  channel,
  user,
}: {
  participants: participants[];
  channel: channel;
  user: user;
}) => {
  const [priviliged, setPriviliged] = useState<participants>(
    participants.filter(
      (participant) =>
        (participant.role === "ADMIN" || participant.role === "MOD") &&
        participant.user_id === user.id
    )[0]
  );
  const [picture, setPicture] = useState<File>();
  const { register } = useForm();
  const topicInput = useRef<HTMLInputElement | null>(null);
  const channelNameInput = useRef<HTMLInputElement | null>(null);
  const [selectedOption, setSelectedOption] = useState("");

  const handleOptionChange = (event: any) => {
    setSelectedOption(event.target.value);
  };
  return (
    <motion.div
      className="w-full flex sm:h-[80%] h-auto sm:flex-row flex-col jutify-center items-center  sm:overflow-y-scroll "
      initial={{ opacity: 0, y: -120 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <div className="sm:w-[45%] w-[100%] h-full bg-transparent flex flex-col items-center justify-start pt-[120px] gap-10 sm:border-r-2">
        <form
          action=""
          onSubmit={(e) => {
            e.preventDefault();
            console.log(picture);
          }}
          className="flex flex-col w-[50%] items-center justify-center  gap-4"
        >
          <div className="rounded-full overflow-hidden relative w-[200px] h-[200px]">
            <input
              type="file"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  console.log(e.target.files[0]);
                  setPicture(e.target.files[0]);
                }
              }}
              className="absolute opacity-0 z-30 w-full h-full cursor-pointer"
              disabled={priviliged ? false : true}
            />
            <Image
              src={channel.picture}
              width={200}
              height={200}
              alt="channel picture"
              className="absolute z-10 blur-sm"
            />

            <Image
              src={"/Chat/plusOverPicture.svg"}
              width={75}
              height={75}
              alt="channel picture"
              className="absolute top-[35%] left-[30%] z-20"
            />
          </div>
          <Input
            type="text"
            placeholder="change topic"
            {...register("topicInput", { required: false })}
            ref={topicInput}
            className="rounded-lg "
            disabled={priviliged ? false : true}
          />
          <Input
            type="text"
            placeholder="change channel name"
            {...register("channelNameInput", {
              required: false,
            })}
            ref={channelNameInput}
            className="rounded-lg "
            disabled={priviliged ? false : true}
          />
        </form>
        <fieldset
          className="flex gap-2 items-center flex-wrap"
          disabled={priviliged ? false : true}
        >
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
            disabled={priviliged ? false : true}
          />
          <button
            type="submit"
            className="py-2 px-5 bg-red-500 rounded-md mt-4"
            disabled={priviliged ? false : true}
          >
            Submit
          </button>
        </form>
      </div>
      <div className="sm:w-[45%] w-full h-full bg-transparent overflow-y-scroll ">
        <div className="mt-10  flex flex-col gap-4 items-center">
          {participants.map((participant, index) => {
            return <MemberList key={index} participant={participant} exec={priviliged} />;
          })}
        </div>
      </div>
    </motion.div>
  );
};

export default ChannelManagement;

// still need form validation and submit logic depending on the selected option, and the participants management is to be added later
