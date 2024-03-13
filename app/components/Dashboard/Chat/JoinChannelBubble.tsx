import { channel, user } from "@/app/Dashboard/Chat/type";
import  Image  from "next/image";
import axios from "axios";
import React, { useState } from "react";
import { GoLock } from "react-icons/go";
import { Socket } from "socket.io-client";
import { Unlock } from "next/font/google";

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
  const [unlock, setUnlock] = useState(false);
  const handleClicks = async () => {
    const participantObject = {

    };
    const res = await axios.post(
      "http://localhost:8080/participants",
      participantObject
    );
    if (res.status === 200) {
      //here we emit to the server
      console.log("Channel joined");
    }
  };

  return (
    <div
      className="flex ga-2 items-center col-start text-inherit relative"
      onClick={(e) => console.log("clicked to join", channel.state)}
    >
      <Image
        width={100}
        height={100}
        src="/badge1.png"
        alt="image"
        className="lg:w-[95px] lg:h-[95px] md:w-[80px] md:h-[80px]"
      />
      <div className="flex flex-col gap-1" title={channel.topic}>
        <h2 className="2xl:text-md xl:text-[15px] md:text-[14px]">
          {channel.name}
        </h2>
        {unlock ? (
          <input
            type="text"
            className="left-0 top-[45px] rounded-md lp-2 w-[180px] bg-dashBack h-10 text-white "
          />
        ) : (
          <p className="text-gray-400 xl:text-sm truncate md:tex  t-xs lg:max-w-full md:max-w-[120px]">
            {channel.topic.substring(0, 30) +
              (channel.topic.length > 30 && " ...")}
            {/* a fun interactive group of people */}
          </p>
        )}
        {/* <p className="text-gray-400 xl:text-sm truncate md:text-xs lg:max-w-full md:max-w-[120px]">
        </p> */}
      </div>
      {lock && (
        <GoLock className="absolute top-6 2xl:right-[91px] xl:right-[41px] lg:right-[35px] text-white hidden md:text-[14px] 2xl:text-[16px] lg:flex" />
      )}
    </div>
  );
};

export default JoinChannelBubble;
