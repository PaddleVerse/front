import { channel, user } from "@/app/Dashboard/Chat/type";
import Image from "next/image";
import axios from "axios";
import React, { useRef, useState } from "react";
import { GoLock } from "react-icons/go";
import { Socket } from "socket.io-client";
import { useForm } from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";
import { useGlobalState } from "../../Sign/GlobalState";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { useParams } from "next/navigation";

const GetUsers = async (param: any) => {
  const users = await axios.get(
    `http://localhost:8080/channels/inviteList/${param?.id}`
  );
  return users.data;
};

const InviteCard = ({ channel, user }: { channel: channel; user: user }) => {
  const param = useParams();
  const { state, dispatch } = useGlobalState();
  const { data: users } = useQuery<user[]>({
    queryKey: ["inviteList"],
    queryFn: async () => GetUsers(param),
  });
  const clt = useQueryClient();


  return (
    <AnimatePresence>
      <motion.div
        className="flex gap-2 items-center col-start text-inherit relative py-3"
        onClick={(e) => {
          e.preventDefault();
        }}
        initial={{ opacity: 0, y: -120 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
		  >
			  {users && users.map((u: user, key: any) => {
				  return (
            <div key={key}>
              <div className="text-white w-[70%] flex items-center justify-between border">
                this is a user
              </div>
            </div>
          );
			  })
			  }
	  </motion.div>
    </AnimatePresence>
  );
};

export default InviteCard;
