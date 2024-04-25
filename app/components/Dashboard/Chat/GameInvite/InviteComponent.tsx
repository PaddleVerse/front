"use client";

import { useGlobalState } from "@/app/components/Sign/GlobalState";
import React, { useEffect, useState } from "react";
import GameInvite from "./GameInvite";
import { user } from "@/app/Dashboard/Chat/type";

const InviteComponent = () => {
  const [modlar, setModlar] = useState(false);
  const [sender, setSender] = useState<user | null>(null);
  const { state, dispatch } = useGlobalState();
  const { socket, user } = state;

  useEffect(() => {
    socket?.on("invited", (data: any) => {
      setTimeout(() => {
        setModlar(false);
      }, 10000);
      setSender(data.sender);
      setModlar(true);
	});
	  return () => {
		socket?.off("invited");  	
	  }
  }, [socket]);
  return <div>{modlar && <GameInvite sender={sender} />}</div>;
};

export default InviteComponent;
