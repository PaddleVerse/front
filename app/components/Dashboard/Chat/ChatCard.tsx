import React from "react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import axios from "axios";
import { message } from "@/app/Dashboard/Chat/page";
import { getTime } from "@/app/utils";
import Image from "next/image";

export const ChatCard = (props: any) => {
  const [msg, setMessage] = useState<message[] | null>();
  useEffect(() => {
    if (props.value.user) {
      axios
        .get(
          `http://localhost:8080/conversations?uid1=${props.value.id}&uid2=${props.self.id}`
        )
        .then((res) => {
          setMessage(res.data.messages);
        });
    } else {
      axios
        .get(
          `http://localhost:8080/channels/messages/${props.value.id}?uid=${props.self.id}`
        )
        .then((res) => {
          setMessage(res.data);
        });
    }
  }, [props.value.id, props.self.id, props.value.user, props.update]);


  if (!msg) {
    return <div>Loading...</div>;
  }


  return (
    <motion.div
      className="flex justify-between items-center lg:p-3 p-1 hover:bg-gray-800 rounded-lg relative sm:w-auto w-full cursor-pointer transition-all duration-300 ease-in-out hover:shadow-lg"
      onClick={(e) => {
        if (props.value.user === false) {
          props.setTargetChannel(props.value);
          props.setTargetUser(null);
        } else {
          props.setTargetUser(props.value);
          props.setTargetChannel(null);
        }
        props.setUpdate(true);
        props.handleClick();
        e.preventDefault();
      }}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.25 * props.index }}
    >
      <div className="flex gap-4 w-full">
        <div className="sm:w-10 sm:h-12 h-10 w-10 relative flex flex-shrink-0 items-center">
          <Image
            className="shadow-md rounded-full w-10 h-10 object-cover"
            src={
              props.value?.picture ||
              "https://randomuser.me/api/portraits/women/87.jpg"
            }
            alt="User2"
          />
          <div className="absolute bg-gray-900 p-1 rounded-full bottom-0 right-0">
            {props.value.user &&
              (props.value.status === "ONLINE" ? (
                <div className="bg-green-500 rounded-full w-2 h-2"></div>
              ) : (
                <div className="bg-gray-400 rounded-full w-2 h-2"></div>
              ))}
          </div>
        </div>
        <div className="flex flex-col justify-between w-full">
          <p className="text-white">{props.value.name}</p>
          <div className="flex-auto min-w-0 ml-4 mr-6  md:block group-hover:block">
            <div className="flex items-center text-sm text-gray-400">
              <div className="min-w-0 flex justify-between w-full">
                <p className="">
                  {
                    (msg && msg.length > 0 && msg[msg.length - 1]?.content.length >= 10) ?
                    msg[msg.length - 1]?.content.slice(0, 10) + "..."
                    : (msg && msg.length > 0) ? msg[msg.length - 1]?.content
                    : null
                  }
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <p className="text-gray-400 text-sm ">
          {msg && msg.length > 0 && getTime(msg[msg.length - 1]?.createdAt)}
        </p>
        <p className="ml-2 whitespace-no-wrap text-center text-gray-600 text-sm sm:relative ">
          Feb 1{ /** this should change to get the date only */}
        </p>
      </div>
    </motion.div>
  );
};

export default ChatCard;
