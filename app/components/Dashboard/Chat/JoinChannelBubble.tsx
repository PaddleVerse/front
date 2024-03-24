import { channel, user } from "@/app/Dashboard/Chat/type";
import Image from "next/image";
import axios from "axios";
import React, { useRef, useState } from "react";
import { GoLock } from "react-icons/go";
import { Socket } from "socket.io-client";
import { useForm } from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";

const JoinChannelBubble = ({
  lock,
  channel,
  handleClick,
  user,
  socket,
}: {
  lock: boolean;
  channel: channel;
  user: user;
  handleClick: () => void;
  socket: Socket;
}) => {
  const lockRef = useRef<HTMLInputElement>(null);
  const { register } = useForm();
  const [unlock, setUnlock] = useState(false);
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (lock) {
      channel.key = lockRef.current?.value as string;
      const obj = {
        participant: {
          user_id: user.id,
          channel_id: channel.id,
        },
        user: user,
        channel: channel,
      };
      await axios.post(`http://localhost:8080/participants`, obj).then((res) => {
        toast.success(`you have joined ${channel.name}`)
        socket.emit("joinRoom", { user: user, roomName: channel.name });
      }).catch((err) => {
        toast(err.response.data.message);
      })
      
    } else {
      const obj = {
        participant: {
          user_id: user.id,
          channel_id: channel.id,
        },
        user: user,
        channel: channel,
      };
      await axios
      .post(`http://localhost:8080/participants`, obj)
      .then((res) => {
        toast.success(`you have joined ${channel.name}`)
          socket.emit("joinRoom", { user: user, roomName: channel.name });
        })
        .catch((err) => {
          toast(err.response.data.message);
        });
    }
    setUnlock(false);
  };
  return (
    <div
      className="flex ga-2 items-center col-start text-inherit relative"
      onClick={(e) => {
        e.preventDefault();
        if (lock) {
          setUnlock(true);
        } else {
          handleSubmit(e);
        }
      }}
    >
      <img
        src="/badge1.png"
        alt="image"
        className="lg:w-[95px] lg:h-[95px] md:w-[80px] md:h-[80px] rounded-full"
      />
      <div className="flex flex-col gap-1">
        <h2 className="2xl:text-md xl:text-[15px] md:text-[14px]">
          {channel.name}
        </h2>
        {unlock && lock ? (
          <form onSubmit={(e)=>handleSubmit(e)}>
            <input
              type="text"
              className="left-0 top-[45px] rounded-md lp-2 w-[180px] bg-dashBack h-10 text-white"
              {...register("lockRef", { required: true })}
              ref={lockRef}
            />
          </form>
        ) : (
          <p className="text-gray-400 xl:text-sm truncate md:tex  t-xs lg:max-w-full md:max-w-[120px]">
            {channel.topic?.substring(0, 30) +
              (channel.topic?.length > 30 ? " ..." : "")}
          </p>
        )}
      </div>
      {lock && (
        <div>
          <GoLock className="absolute top-6 2xl:right-[91px] xl:right-[41px] lg:right-[35px] text-white hidden md:text-[14px] 2xl:text-[16px] lg:flex" />
        </div>
      )}
    </div>
  );
};

export default JoinChannelBubble;
