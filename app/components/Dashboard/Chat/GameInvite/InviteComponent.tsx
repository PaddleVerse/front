"use client";

import { useGlobalState } from "@/app/components/Sign/GlobalState";
import React, { useEffect, useState } from "react";
import GameInvite from "./GameInvite";
import { user } from "@/app/Dashboard/Chat/type";
import Game from "../../Game/InGame/Game";

const InviteComponent = () => {
  const [modlar, setModlar] = useState(false);
  const [sender, setSender] = useState<user | null>(null);
  const [accept, setAccept] = useState(false);
  const [senderId, setSenderId] = useState<user | null>(null);
  const [roomId, setRoomId] = useState("");
  const { state, dispatch } = useGlobalState();
  const { socket, user } = state;

  useEffect(() => {
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
    return () => {
      socket?.off("invited");
    };
  }, [socket]);

  if (accept) {
    return <Game roomId={roomId}></Game>;
  }

  return (
    <div>
      {modlar && (
        <GameInvite
          sender={sender}
          onDecline={() => setModlar(false)}
          onAccept={() => {
            socket?.emit("gameInvite", { sender: sender, receiver: user });

          }}
        />
      )}
    </div>
  );
};

export default InviteComponent;
