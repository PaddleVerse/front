"use client";
import ReactLoading from "react-loading";
import React, { FormEvent, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";

import { IoSendOutline } from "react-icons/io5";
import Image from "next/image";
import { OnlinePreview } from "@/app/components/Dashboard/Chat/onlinePreview";
import { IoIosInformationCircleOutline } from "react-icons/io";
import { useGlobalState } from "@/app/components/Sign/GlobalState";
import ChatComponent from "@/app/components/Dashboard/Chat/ChatComponent";
import ChannelManagement from "@/app/components/Dashboard/Chat/channelManagement";
import { CiCirclePlus } from "react-icons/ci";
import axios, { AxiosError } from "axios";
import toast from "react-hot-toast";
import { useSwipeable } from "react-swipeable";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import { channel, user } from "../../type";

const fetchTargetUser = async (parameters: any) => {
  if (parameters.subroute === "dm") {
    const user = await axios.get(
      `http://localhost:8080/user/${parameters?.id!}`
    );
    return user.data;
  }
  return null;
};
const fetchTargetChannel = async (parameters: any) => {
  if (parameters.subroute === "channel") {
    const channel = await axios.get(
      `http://localhost:8080/channels/${parameters!.id!}`
    );
    return channel.data;
  }
  return null;
};

const Page = (props: any) => {
  const clt = useQueryClient();
  const router = useRouter();
  const param = useParams();
  const { register } = useForm();
  const [channelManagement, setChannelManagement] = useState(false);
  const { state, dispatch } = useGlobalState();
  const { user, socket } = state;
  const [update, setUpdate] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const inputMessage = useRef<HTMLInputElement | null>(null);
  const { data: targetChannel } = useQuery<channel | null>({
    queryKey: ["targetChannel"],
    queryFn: () => fetchTargetChannel(param),
  });
  const { data: targetUser } = useQuery<user | null>({
    queryKey: ["targetUser"],
    queryFn: () => fetchTargetUser(param),
  });
 

  useEffect(() => {
    socket?.on("ok", (data: any) => {
      if (data === null) return;
      clt.invalidateQueries({ queryKey: ["targetUser", "targetChannel"] });
    });
    socket?.emit("refresh");
    return () => {
      socket?.off("ok");
    };
  }, [state?.socket]);

  const handlers = useSwipeable({
    onSwipedLeft: () => setShowMessage(true),
    onSwipedRight: () => {
      setShowMessage(false);
      router.push(`/Dashboard/Chat`);
      dispatch({ type: "UPDATE_SHOW", payload: false });
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    socket?.emit("typing", {
      reciever: targetUser,
      sender: user,
      roomName: targetChannel?.name,
      roomId: targetChannel?.id,
      type: targetUser ? "dm" : "channel",
    });
  }; 

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (targetChannel) {
      try {
        const message = {
          message: {
            content: inputMessage.current!.value,
            content_type: "string",
            sender_id: state.user.id,
            sender_picture: state.user.picture,
          },
          channel: { name: targetChannel.name },
          user1: state.user.id,
        };
        const res = await axios.post(`http://localhost:8080/message`, message);
        socket?.emit("channelmessage", {
          roomName: targetChannel.name,
          user: state?.user,
        });
      } catch (error) {
        toast.error("failed to send message to channel");
      }
    } else if (targetUser) {
      try {
        const res = await axios.post(`http://localhost:8080/message`, {
          message: {
            content: inputMessage.current!.value,
            content_type: "text",
            sender_id: state?.user?.id!,
            sender_picture: state?.user?.picture!,
          },
          user2: state.user.id,
          user1: targetUser.id,
        });
        socket?.emit("dmmessage", {
          reciever: targetUser?.id!,
          sender: state?.user?.id!,
        });
      } catch (error) {
        toast.error("failed to send message to friend");
      }
    }
    inputMessage.current!.value = "";
    return (e: FormEvent<HTMLFormElement>) => {};
  };

  return (
    <>
      {targetChannel || targetUser ? (
        <section className="flex flex-col flex-auto border-l border-gray-800" {...handlers}>
          <div className=" px-6 py-4 flex flex-row flex-none justify-between items-center shadow">
            <div className="flex">
              <div className="w-11 h-11 mr-4 relative flex flex-shrink-0">
                <Image
                  className="shadow-md rounded-full w-full h-full object-cover"
                  height={100}
                  width={100}
                  src={targetUser?.picture! || targetChannel?.picture!}
                  alt="user or channel picture"
                />
              </div>
              <div className="text-sm">
                <p className="font-bold">
                  {targetUser ? targetUser.name : targetChannel!.name}
                </p>
                {targetUser && <OnlinePreview status={targetUser!.status!} />}
              </div>
            </div>

            <div className="flex items-center">
              <div
                className="block rounded-full  w-6 h-6 ml-4"
                onClick={(e) => {
                  e.preventDefault();
                  setChannelManagement(!channelManagement);
                }}
              >
                <IoIosInformationCircleOutline className="w-full h-full text-white" />
              </div>
            </div>
          </div>
          <div
            className=" p-4 flex-1 overflow-y-scroll no-scrollbar "
          >
            {targetUser ? (
              <ChatComponent
                handlers={handlers}
                us={true}
                channel={false}
                globalStateUserId={user?.id!}
              />
            ) : !channelManagement ? (
              <ChatComponent
                handlers={handlers}
                us={false}
                channel={true}
                globalStateUserId={user?.id!}
              />
            ) : (
              <ChannelManagement
                channel={targetChannel!}
                user={user!}
                update={setUpdate}
              />
            )}
          </div>
          <div
            className={`chat-footer flex-none ${
              channelManagement && targetChannel ? "hidden" : ""
            }`}
          >
            <div className="flex flex-row items-center p-4">
              <button
                type="button"
                className="flex flex-shrink-0 focus:outline-none mx-2  text-white w-6 h-6 "
              >
                <CiCirclePlus className="w-full h-full" />
              </button>
              <div className="relative flex-grow">
                <form onSubmit={(e) => handleSubmit(e)}>
                  <input
                    className="rounded-3xl py-[10px] pl-3 pr-10 w-full bg-[#1b1b1b] focus:ring-[1px] focus:ring-gray-500 focus:outline-none text-gray-200 focus:shadow-md transition duration-300 ease-in"
                    type="text"
                    ref={inputMessage}
                    placeholder="Aa"
                    {...(register("inputMessage"), { required: true })}
                    onChange={(e)=> handleChange(e)}
                  />
                  <button
                    type="submit"
                    className="absolute top-0 right-0 mt-2 mr-3 flex flex-shrink-0 focus:outline-none  text-white hover:text-gray-300 w-6 h-6 "
                  >
                    <IoSendOutline className="w-full h-full " />
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>
      ) : (
        <div className="text-white"></div>
      )}
    </>
  );
};

export default Page;

// nneed to change somehting in terms of sockets and how it responds to new data or events
