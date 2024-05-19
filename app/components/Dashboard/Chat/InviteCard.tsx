import { channel, user } from "@/app/Dashboard/Chat/type";
import axios from "axios";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { useParams } from "next/navigation";
import InviteUser from "./InviteUser";
import { fetchData } from "@/app/utils";

const GetUsers = async (param: any) => {
  const users = await fetchData(`/channels/inviteList/${param?.id}`, "GET", null);
  return users ? users.data : users;
};

const InviteCard = ({ channel, user }: { channel: channel; user: user }) => {
  const param = useParams();
  const { data: users } = useQuery<user[]>({
    queryKey: ["inviteList"],
    queryFn: async () => GetUsers(param),
  });

  return (
    <AnimatePresence>
      <motion.div
        className="flex gap-2 items-center col-start text-inherit relative py-3 w-full justify-center"
        onClick={(e) => {
          e.preventDefault();
        }}
        initial={{ opacity: 0, y: -120 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
      >
        {users &&
          users?.map((u: user, key: any) => {
            return <InviteUser key={key} user={u} channel={channel} />;
          })}
      </motion.div>
    </AnimatePresence>
  );
};

export default InviteCard;
