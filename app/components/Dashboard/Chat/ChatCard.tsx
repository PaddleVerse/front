import React from "react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import axios from "axios";
import { message } from "@/app/Dashboard/Chat/type";
import { getTime } from "@/app/utils";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useGlobalState } from "../../Sign/GlobalState";
export const ChatCard = (props: any) => {
  const [msg, setMessage] = useState<message | null>();
  const [update, setUpdate] = useState(false);
  const { state, dispatch } = useGlobalState();
  const router = useRouter();

  useEffect(() => {
    if (props.value.user) {
      const fetchData = async () => {
        try {
          const res = await axios.get(
            `http://localhost:8080/conversations/lastMessage?uid1=${props.value.id}&uid2=${props.self.id}`
          );
          setMessage(res.data);
        } catch (error) {
          toast.error("failed to fetch user message for user");
        }
      };
      fetchData();
    } else {
      const fetchData = async () => {
        try {
          const res = await axios.get(
            `http://localhost:8080/channels/messages/lastMessage/${props.value.id}?uid=${props.self.id}`
          );
          setMessage(res.data);
        } catch (error) {
          toast.error("failed to fetch messages for channel");
        }
      };
      fetchData();
    }
    return () => {};
  }, [props.value.id, props.self.id, props.value.user]);

  useEffect(() => {
    state?.socket?.on("dmupdate", (data: { user1: number; user2: number }) => {
      if (
        (props.value.id === data.user1 && props.self.id === data.user2) ||
        (props.value.id === data.user2 && props.self.id === data.user1)
      ) {
        const fetchData = async () => {
          try {
            const res = await axios.get(
              `http://localhost:8080/conversations/lastMessage?uid1=${data.user1}&uid2=${data.user2}`
            );
            setMessage(res.data);
          } catch (error) {
            toast.error("failed to fetch user message");
          }
        };
        fetchData();
      }
    });

    return () => {
      state?.socket?.off("dmupdate");
    };
  }, [state?.socket]);

  useEffect(() => {
    state?.socket?.on("channelupdate", (data: any) => {
      if (!props.value.user) {
        const fetchData = async () => {
          try {
            const res = await axios.get(
              `http://localhost:8080/channels/messages/lastMessage/${props.value.id}?uid=${props.self.id}`
            );
            console.log(res.data);
            setMessage(res.data);
          } catch (error) {
            toast.error("failed to get channel messages chatcard");
          }
        };
        fetchData();
      }
    });

    return () => {
      state?.socket?.off("channelupdate");
    };
  }, [state?.socket]);

  return (
    <motion.div
      className="flex justify-between items-center lg:p-3 p-1 hover:bg-gray-800 rounded-lg relative sm:w-auto w-full cursor-pointer transition-all duration-300 ease-in-out hover:shadow-lg"
      onClick={(e) => {
        e.preventDefault();
        if (props.value.user === false) {
          router.push(`/Dashboard/Chat/channel/${props?.value?.id}`);
        } else {
          router.push(`/Dashboard/Chat/dm/${props.value.id}`);
        }
        props.handleClick();
      }}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.25 * props.index }}
    >
      <div className="flex gap-4 w-full">
        <div className="sm:w-10 sm:h-12 h-10 w-10 relative flex flex-shrink-0 items-center">
          <img
            className="shadow-md rounded-full w-10 h-10 object-cover"
            src={props.value?.picture}
            alt="picture"
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
                  {msg && msg?.content?.length >= 10
                    ? msg?.content.slice(0, 10) + "..."
                    : msg
                    ? msg?.content
                    : null}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <p className="text-gray-400 text-sm ">
          {msg && getTime(msg.createdAt)}
        </p>
        <p className="ml-2 whitespace-no-wrap text-center text-gray-600 text-sm sm:relative ">
          Feb 1{/** this should change to get the date only */}
        </p>
      </div>
    </motion.div>
  );
};

export default ChatCard;
