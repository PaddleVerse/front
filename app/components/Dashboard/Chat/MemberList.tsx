"use client";
import React, { FC, useContext, useEffect, useState } from "react";
import Image from "next/image";
import { channel, participants, participantWithUser, user } from "@/app/Dashboard/Chat/type";
import axios from "axios";
import { useRouter } from "next/navigation";

import { FaMicrophone } from "react-icons/fa6";
import { FaMicrophoneSlash } from "react-icons/fa6";
import { FaBan } from "react-icons/fa6";
import { FaChessKing } from "react-icons/fa6";
import { FaChessPawn } from "react-icons/fa6";
import toast from "react-hot-toast";
import { useGlobalState } from "../../Sign/GlobalState";
import { ipAdress } from "@/app/utils";

const MemberList = ({
  participant,
  exec,
  channel,
}: {
  participant: participantWithUser;
  exec: participants;
  channel: channel;
}) => {
  const router = useRouter();
  const { state, dispatch } = useGlobalState();

  const handleClick = () => {
    router.push(`/Dashboard/Profile?id=${participant.user?.id}`);
  };

  const handleBan = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.preventDefault();
    if (!exec) {
      toast.error("You cannot take privilage from yourself");
      return;
    }
    if (participant.role === "ADMIN") {
      toast.error("You cannot ban an admin");
      return;
    }
    const obj = {
      cid: exec.channel_id,
      uid: participant.user_id,
    };
    axios.post(`http://${ipAdress}:8080/ban/`, obj).then((res) => {
      state?.socket?.emit("ban", {
        roomName: channel.name,
        user: participant.user,
      });
    })
  };

  const handleKick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.preventDefault();
    if (!exec) {
      toast.error("You do not have privilage to kick");
      return;
    }
    if (participant.role === "ADMIN") {
      toast.error("You cannot kick an admin");
      return;
    }
    const obj = {
      channel: exec.channel_id,
      executor: exec.user_id,
    };
    axios
      .delete(`http://${ipAdress}:8080/participants/kick?target=${participant.user_id}&user=${exec.user_id}&channel=${channel!.id}`)
      .then((res) => {
        state?.socket?.emit("kick", {
          roomName: channel.name,
          user: participant.user,
        });
      })
      .catch((err) => {
      });
  };

  const handlePromoteDemote = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    e.preventDefault();
    if (!exec) {
      toast.error("you do not have privilage to promote/demote");
      return;
    }
    if (participant.role === "ADMIN") {
      toast.error("You cannot take privilage from admin");
      return;
    }
    const obj = {
      channel: exec.channel_id,
      executor: exec.user_id,
      participant: {
        role: participant.role === "MEMBER" ? "MOD" : "MEMBER",
      },
    };
    axios
      .put(`http://${ipAdress}:8080/participants/${participant.user_id}`, obj)
      .then((res) => {
        state?.socket?.emit("channelUpdate", {
          roomName: channel.name,
          user: participant.user,
        });
      })
      .catch((err) => {
      });
  };

  const handleMuteUnMute = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    e.preventDefault();
    if (!exec) {
      toast.error("You do not have privilage to mute/unmute");
      return;
    }
    if (participant.role === "ADMIN") {
      toast.error("You cannot mute an admin");
      return;
    }
    const obj = {
      channel: exec.channel_id,
      executor: exec.user_id,
      participant: {
        mute: participant.mute ? false : true,
      },
    };
    axios
      .put(`http://${ipAdress}:8080/participants/${participant.user_id}`, obj)
      .then((res) => {
        state?.socket?.emit("channelUpdate", {
          roomName: channel.name,
          user: participant.user,
        });
      })
      .catch((err) => {
      });
  };

  return (
    <div
      id="participant"
      className="text-white w-[70%] flex items-center justify-between"
    >
      <div className="flex items-center gap-2">
        <Image
          src={ participant.user?.picture ? participant.user?.picture : "/badge1.png"}
          width={40}
          height={40}
          alt="image"
          onClick={() => {
            handleClick();
          }}
          className="rounded-full aspect-square"
        />
        <div className="flex flex-col 2xl:text-md text-xs">
          <span>{participant.user?.name}</span>
          <span className="2xl:text-md text-[10px]">@{participant.user?.nickname}</span>
        </div>
      </div>
      <span>{participant.role.toLowerCase()}</span>
      <div className="flex gap-1 2xl:text-md text-xs">
        <div onClick={handleMuteUnMute}>
          {participant.mute ? (
            <FaMicrophoneSlash className="w-[20px] h-[20px]" />
          ) : (
            <FaMicrophone className="w-[20px] h-[20px]" />
          )}
        </div>
        <div onClick={handleBan} aria-disabled={exec ? false : true}>
          <Image src={"/Chat/ban.svg"} width={20} height={20} alt={"ban"} />
        </div>
        <div onClick={handleKick}>
          <Image src={"/Chat/kick.svg"} width={20} height={20} alt={"kick"} />
        </div>
        <div onClick={handlePromoteDemote} aria-disabled={exec ? false : true}>
          {participant.role === "ADMIN" || participant.role === "MOD" ? (
            <FaChessPawn className="w-[20px] h-[20px]" />
          ) : (
            <FaChessKing className="w-[20px] h-[20px]" />
          )}
        </div>
      </div>
    </div>
  );
};

export default MemberList;

// need to add something to the backend so when i kick a user or ban a user, the user is removed from the channel and from the room in the socket
