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
import { FaGamepad } from "react-icons/fa6";
import axios, { AxiosError } from "axios";
import toast from "react-hot-toast";
import { useSwipeable } from "react-swipeable";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import { channel, user } from "../../type";
import { Socket } from "socket.io-client";

const sendpicture = async (
  file: File,
  channel: channel | null,
  user1: user,
  user2: user | null,
  Socket: Socket
) => {
  if (!file) {
    return;
  }
  if (file) {
    if (!file.type.startsWith("image/")) {
      alert("Please select an image picture.");
      return;
    }
  }
  if (channel) {
    try {
      const formData = new FormData();
      formData.append("image", file);
      const pic = await axios.post(
        `http://localhost:8080/message/image?channel=${channel?.id}&sender=${user1.id}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      Socket?.emit("channelmessage", {
        roomName: channel.name,
        user: user1,
      });
    } catch (error) {
      toast.error("error in uploading image.");
    }
    return;
  }
  if (user2) {
    try {
      const formData = new FormData();
      formData.append("image", file);
      const pic = await axios.post(
        `http://localhost:8080/message/image?sender=${user1.id}&reciever=${user2.id}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      Socket?.emit("dmmessage", {
        reciever: user2?.id!,
        sender: user1?.id!,
      });
    } catch (error) {
      toast.error("error in uploading image");
    }
    return;
  }
};
import { fetchData, ipAdress } from "@/app/utils";
import { cn } from "@/components/cn";

const fetchTargetUser = async (parameters: any) => {
  if (parameters.subroute === "dm") {
    const user = await fetchData(`/user/${parameters!.id}`, "GET", null);
    if (!user) return;
    return user?.data;
  }
  return null;
};
const fetchTargetChannel = async (parameters: any) => {
  if (parameters.subroute === "channel") {
    const channel = await fetchData(`/channel/${parameters!.id}`, "GET", null);
    if (!channel) return;
    return channel.data;
  }
  return null;
};

const SendInvite = (self: user, target: user, socket: Socket) => {
  socket.emit("GameInvite", {
    sender: self,
    reciever: target,
  });
};

const Page = (props: any) => {
  const clt = useQueryClient();
  const router = useRouter();
  const param = useParams();
  const { register } = useForm();
  const [channelManagement, setChannelManagement] = useState(false);
  const { state, dispatch } = useGlobalState();
  const { user, socket } = state;
  const [file, setFile] = useState<File>();
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    if (inputMessage.current!.value.length > 2000) {
      toast.error("message is too long");
      return;
    }
    if (inputMessage.current!.value.trim() === "") {
      toast.error("message is empty");
      return;
    }
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
        await fetchData(`/message`, "POST", message);
        socket?.emit("channelmessage", {
          roomName: targetChannel.name,
          user: state?.user,
        });
      } catch (error) {
        toast.error("failed to send message to channel");
      }
    } else if (targetUser) {
      try {
        await fetchData(`/message`, "POST", {
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
        <section
          className="flex flex-col flex-auto border-l border-gray-800"
          {...handlers}
        >
          <div className=" px-6 py-4 flex flex-row flex-none justify-between items-center shadow">
            <div className="flex">
              <div className="w-11 h-11 mr-4 relative flex flex-shrink-0">
                <Image
                  className="shadow-md rounded-full w-full h-full object-cover"
                  height={100}
                  width={100}
                  src={
                    targetUser?.picture! || targetChannel?.picture! || "/a.png"
                  }
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
                <IoIosInformationCircleOutline className={cn(
                  "w-full h-full text-white",

                )}
                />
              </div>
            </div>
          </div>
          <div className=" p-4 flex-1 overflow-y-scroll no-scrollbar">
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
            className={`chat-footer flex-none${
              channelManagement && targetChannel ? "hidden" : ""
            }`}
          >
            <div className="flex flex-row items-center p-4">
              <div className="flex flex-shrink-0 focus:outline-none mx-2  text-white w-6 h-6 relative ">
                <input
                  type="file"
                  className="w-6 h-6 overflow-hidden  opacity-0 z-30"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      if (e.target.files[0].size > 25000) {
                        toast.error("file size too large");
                        return;
                      }
                      setFile(e.target.files[0]);
                      sendpicture(
                        e.target.files[0],
                        targetChannel!,
                        user!,
                        targetUser!,
                        socket
                      );
                    }
                  }}
                />
                <CiCirclePlus className="w-full h-full absolute z-20" />
              </div>
              {targetUser && (
                <button
                  type="button"
                  className="flex flex-shrink-0 focus:outline-none mx-2  text-white w-6 h-6"
                  onClick={(e) => {
                    SendInvite(user!, targetUser!, socket!);
                  }}
                >
                  <FaGamepad className="w-full h-full" />
                </button>
              )}
              <div className="relative flex-grow">
                <form onSubmit={(e) => handleSubmit(e)}>
                  <input
                    className="rounded-3xl py-[10px] pl-3 pr-10 w-full bg-[#1b1b1b] focus:ring-[1px] focus:ring-gray-500 focus:outline-none text-gray-200 focus:shadow-md transition duration-300 ease-in"
                    type="text"
                    ref={inputMessage}
                    placeholder="Aa"
                    {...(register("inputMessage"), { required: true })}
                    onChange={(e) => handleChange(e)}
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
