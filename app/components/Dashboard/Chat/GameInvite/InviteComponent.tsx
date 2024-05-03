"use client";

import { useGlobalState } from "@/app/components/Sign/GlobalState";
import React, { useContext, useEffect, useState } from "react";
import GameInvite from "./GameInvite";
import { user } from "@/app/Dashboard/Chat/type";
import Game from "../../Game/InGame/Game";
import { useRouter } from "next/navigation";

const InviteComponent = () => {
  const [modlar, setModlar] = useState(false);
  const [sender, setSender] = useState<user | null>(null);
  const [accept, setAccept] = useState(false);
  const [senderId, setSenderId] = useState<user | null>(null);
  const [roomId, setRoomId] = useState("");
  const { state, dispatch } = useGlobalState();
  const { socket, user } = state;
  const router = useRouter();

  useEffect(() => {
    console.log("InviteComponent", accept);
    socket?.on("acceptedGameInvite", (data: any) => {
      setAccept(true);
      setRoomId(data.roomId);
    });
    socket?.on("invited", (data: any) => {
      setTimeout(() => {
        setModlar(false);
      }, 10000);
      setSender(data.sender);
      setModlar(true);
    });
    socket?.on("gameOver", () => {
      setAccept(false);
      setModlar(false);
      setSender(null);
      setRoomId("");
    });
    return () => {
      socket?.off("invited");
      socket?.off("acceptedGameInvite");
      socket?.off("gameOver");
    };
  }, [socket]);

  if (accept) {
    router.push(`/Dashboard/Game?room=${roomId}`);
  }

  return (
    <div>
      {modlar && (
        <GameInvite
          sender={sender}
          onDecline={() => setModlar(false)}
          onAccept={() => {
            socket?.emit("gameInvite", { sender: sender, receiver: user });
            setModlar(false);
          }}
        />
      )}
    </div>
  );
};

export default InviteComponent;
