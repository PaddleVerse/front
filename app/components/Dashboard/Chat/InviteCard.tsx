import { channel, user } from "@/app/Dashboard/Chat/type";
import Image from "next/image";
import axios from "axios";
import React, { useRef, useState } from "react";
import { GoLock } from "react-icons/go";
import { Socket } from "socket.io-client";
import { useForm } from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";
import { useGlobalState } from "../../Sign/GlobalState";
import { useQueryClient } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";

const InviteCard = ({
  channel,
  //   handleClick,
  user,
}: {
  channel: channel;
  user: user;
  //   handleClick: () => void;
}) => {
  const [unlock, setUnlock] = useState(false);
  const { state, dispatch } = useGlobalState();
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
        here is the code to the thing
      </motion.div>
    </AnimatePresence>
  );
};

export default InviteCard;
