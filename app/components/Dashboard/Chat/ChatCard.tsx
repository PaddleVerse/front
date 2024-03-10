import Image from "next/image";
import React from "react";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { message } from "@/app/Dashboard/Chat/page";

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
  return (
    <div
      className="flex justify-between items-center lg:p-3 p-1 hover:bg-gray-800 rounded-lg relative "
      onClick={(e) => {
        if (props.value.user === false) {
          props.setTargetChannel(props.value);
          props.setTargetUser(null);
        } else {
          props.setTargetUser(props.value);
          props.setTargetChannel(null);
        }
        props.setUpdate(true);
        e.preventDefault();
      }}
    >
      <div className="sm:w-12 sm:h-12 h-16 w-16 relative flex flex-shrink-0">
        <img
          className="shadow-md rounded-full w-full h-full object-cover"
          src={
            props.value.picture ||
            "https://randomuser.me/api/portraits/women/87.jpg"
          }
          alt="User2"
        />
        <div className="absolute bg-gray-900 p-1 rounded-full bottom-0 right-0">
          {/*here we check the status of the user if he is online or not */}
          {props.value.user &&
            (props.value.status === "ONLINE" ? (
              <div className="bg-green-500 rounded-full w-2 h-2"></div>
            ) : (
              <div className="bg-red-500 rounded-full w-2 h-2"></div>
            ))}
        </div>
      </div>
      <div className="flex-auto min-w-0 ml-4 mr-6 hidden md:block group-hover:block">
        <p>{props.value.name}</p>
        <div className="flex items-center text-sm text-gray-600">
          <div className="min-w-0">
            <p className="truncate">
              {msg && msg.length > 0 && msg[msg.length - 1]?.content}
            </p>
          </div>
        </div>
      </div>
      <p className="ml-2 whitespace-no-wrap text-gray-600 text-sm sm:relative hidden">
        Feb 1
      </p>
    </div>
  );
};

export default ChatCard;
