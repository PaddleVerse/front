import React, { useEffect, useState } from "react";
import Image from "next/image";
import { participants, user } from "@/app/Dashboard/Chat/type";
import axios from "axios";
import { useRouter } from "next/navigation";

import { FaMicrophone } from "react-icons/fa6";
import { FaMicrophoneSlash } from "react-icons/fa6";
import { FaBan } from "react-icons/fa6";
import { FaChessKing } from "react-icons/fa6";
import { FaChessPawn } from "react-icons/fa6";

const MemberList = ({
  participant,
  exec,
}: {
  participant: participants;
  exec: participants;
}) => {
  const [user, setUser] = useState<user>();
  const router = useRouter();

  useEffect(() => {
    axios
      .get(`http://localhost:8080/user/${participant.user_id}`)
      .then((res) => {
        setUser(res.data);
      });
  }, [participant]);

  const handleClick = () => {
    router.push(`/Dashboard/Profile?id=${user?.id}`);
  };

  return (
    <div className="text-white w-[70%]  flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Image
          src={"/badge1.png"}
          width={40}
          height={40}
          alt="image"
          onClick={() => {
            handleClick();
          }}
        />
        <div className="flex flex-col 2xl:text-md text-xs">
          <span>{user?.name}</span>
          <span className="2xl:text-md text-[10px]">@{user?.nickname}</span>
        </div>
      </div>
      <span>{participant.role.toLowerCase()}</span>
      <div className="flex gap-1 2xl:text-md text-xs">
        <div
          onClick={(e) => {
            e.preventDefault();
            console.log("mute/unmute");
          }}
        >
          {participant.mute ? (
            <FaMicrophoneSlash className="w-[20px] h-[20px]" />
          ) : (
            <FaMicrophone className="w-[20px] h-[20px]" />
          )}
        </div>
        <div
          onClick={(e) => {
            e.preventDefault();
            console.log("ban");
          }}
        >
          <Image src={"/Chat/ban.svg"} width={20} height={20} alt={"ban"} />
        </div>
        <div
          onClick={(e) => {
            e.preventDefault();
            console.log("kick");
          }}
        >
          <Image src={"/Chat/kick.svg"} width={20} height={20} alt={"kick"} />
        </div>
        <div
          onClick={(e) => {
            e.preventDefault();
            console.log("promote/demote");
          }}
        >
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
