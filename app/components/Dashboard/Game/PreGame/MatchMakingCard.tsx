"use client";
import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import { useGlobalState } from "@/app/components/Sign/GlobalState";
import PlayerCard from "./PlayerCard";
import axios from "axios";
import { ipAdress } from "@/app/utils";
import { AiOutlineClose } from "react-icons/ai";

const MatchMakingCard = ({
  gameMode,
  setCanPlay,
  setSelected
}: {
  gameMode: string;
  setCanPlay: (s:boolean) => void;
  setSelected: (s:string) => void;
}) => {
  const { state } = useGlobalState();
  const { user, socket } = state;
  const [otherPlayer, setOtherPlayer] = useState<any>(null);

  useEffect(() => {
    socket?.emit("matchMaking", { id: user?.id });

    socket?.on("start", (data: any) => {
      axios
        .get(`http://${ipAdress}:8080/user/${data?.id}`)
        .then((res) => {
          setOtherPlayer(res.data);
        })
        .catch(() => {});
    });
  }, [socket]);

  const onClose = () => {
    if (socket) {
      socket.emit("cancelMatchMaking");
    }
  }
  return (
    <div className="fixed inset-0 sm:flex hidden items-center justify-center bg-black bg-opacity-50 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.75 }}
        animate={{
          opacity: 1,
          scale: 1,
          transition: {
            ease: "easeIn",
            duration: 0.15,
          },
        }}
        exit={{ opacity: 0, scale: 0.75 }}
        className="relative bg-[#ffffff37] backdrop-blur 2xl:w-[25%] w-[450px] h-[450px] rounded-xl p-4 z-50"
      >
        <button
          onClick={()=> {
            setCanPlay(false);
            setSelected('')
          }
          }
          className="absolute top-2 right-4 text-xl text-white"
        >
        { !otherPlayer && <AiOutlineClose size={30} onClick={onClose} /> }
        </button>
        <div className="flex  justify-center items-center w-full h-full gap-4">
          <PlayerCard name={user?.name} img={user?.picture} />
          <h1 className="text-3xl text-white">VS</h1>

          <PlayerCard name={otherPlayer?.name} img={otherPlayer?.picture} />

        </div>
      </motion.div>
    </div>
  );
};

export default MatchMakingCard;
