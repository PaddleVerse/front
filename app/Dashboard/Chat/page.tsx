"use client";
import { ChatCard } from "@/app/components/Dashboard/Chat/ChatCard";
import MiddleBuble from "@/app/components/Dashboard/Chat/LeftBubbles/MiddleBuble";
import { Inter } from "next/font/google";
import { LuPhone } from "react-icons/lu";
import { IoVideocamOutline } from "react-icons/io5";
import { IoIosInformationCircleOutline } from "react-icons/io";
import { CiCirclePlus } from "react-icons/ci";
import { MdOutlineAddPhotoAlternate } from "react-icons/md";
import { IoCameraOutline } from "react-icons/io5";
import { PiMicrophoneLight } from "react-icons/pi";
import { IoSendOutline } from "react-icons/io5";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useGlobalState } from "@/app/components/Sign/GlobalState";
import { Socket } from "socket.io-client";
import { channel, target, user } from "./type";
import MiddleBubbleRight from "@/app/components/Dashboard/Chat/RightBubbles/MiddleBubbleRight";
import { useForm } from "react-hook-form";

const inter = Inter({ subsets: ["latin"] });

export type message = {
  id?: number;
  channel_id?: number;
  sender_id?: number;
  sender_picture?: string;
  conversation_id?: number;
  content: string;
  content_type: string;
  createdAt: Date;
};

const Page = () => {
  const [update, setUpdate] = useState(false);
  const [chatList, setChatList] = useState([]);
  const [targetUser, setTargetUser] = useState<user | null>();
  const [targetChannel, setTargetChannel] = useState<channel | null>();
  const globalState = useGlobalState();
  const [messages, setMessages] = useState<message[] | null>(null);
  const socket = useRef<Socket | null>(null);
  useEffect(() => {
    if (globalState.state.user) {
      socket.current = globalState.state.socket;
      axios
        .get(`http://localhost:8080/chat/chatlist/${globalState.state.user.id}`)
        .then((res) => {
          setChatList(res.data);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [globalState]);
  return (
    <div className="w-full lg:h-full md:h-[92%] h-[97%] flex justify-center mt-5">
      <div className="lg:h-[91%] lg:w-[91%] w-full h-full">
        <div
          className={`h-full w-full flex antialiased text-gray-200 bg-transparent rounded-xl ${inter.className}`}
          style={{
            backdropFilter: "blur(20px)",
            backgroundColor: "rgba(13, 9, 10, 0.7)",
          }}
        >
          <div className="flex-1 flex flex-col">
            <main className="flex-grow flex flex-row min-h-0">
              <section className="flex flex-col flex-none overflow-auto w-24 group lg:max-w-sm md:w-2/5 no-scrollbar">
                <div className="py-4 sm:flex flex-row hidden  items-center flex-none  justify-start">
                  <div
                    className="w-16 h-16 relative flex flex-shrink-0"
                    style={{ filter: "invert(100%)" }}
                  ></div>
                  <p
                    className={`text-2xl font-bold hidden md:block group-hover:block`}
                  >
                    Messenger
                  </p>
                </div>
                <div className=" p-4 flex-none">
                  <form onSubmit={(e) => e.preventDefault()}>
                    <div className="relative sm:block hidden">
                      <label>
                        <input
                          className="rounded-lg py-2 pr-6 pl-10 w-full border border-gray-800 focus:border-gray-700 bg-gray-800 focus:bg-gray-900 focus:outline-none text-gray-200 focus:shadow-md transition duration-300 ease-in"
                          type="text"
                          placeholder="Search Messenger"
                        />
                        <span className="absolute top-[4px] left-0 mt-2 ml-3 inline-block">
                          <svg viewBox="0 0 24 24" className="w-4 h-4">
                            <path
                              fill="#bbb"
                              d="M16.32 14.9l5.39 5.4a1 1 0 0 1-1.42 1.4l-5.38-5.38a8 8 0 1 1 1.41-1.41zM10 16a6 6 0 1 0 0-12 6 6 0 0 0 0 12z"
                            />
                          </svg>
                        </span>
                      </label>
                    </div>
                  </form>
                </div>

                <div
                  className="contacts p-2 flex-1 overflow-y-scroll"
                  onClick={(e) => {
                    e.preventDefault();
                  }}
                >
                  {Array.isArray(chatList) &&
                    chatList.map((value: any, key: any) => {
                      return (
                        <ChatCard
                          key={key}
                          setTargetChannel={setTargetChannel}
                          setTargetUser={setTargetUser}
                          value={value}
                          self={globalState.state.user}
                          setMessages={setMessages}
                        ></ChatCard>
                      );
                    })}
                </div>
              </section>
              {/** here we display the messages and stuff, gonna do it after properly fetching data */}
              {targetChannel || targetUser ? (
                <section className="flex flex-col flex-auto border-l border-gray-800">
                  <div className=" px-6 py-4 flex flex-row flex-none justify-between items-center shadow">
                    <div className="flex">
                      <div className="w-11 h-11 mr-4 relative flex flex-shrink-0">
                        {/* this image needs to be filled with the target user */}
                        <img
                          className="shadow-md rounded-full w-full h-full object-cover border-2"
                          src={
                            (targetUser && targetUser.picture) ||
                            "https://randomuser.me/api/portraits/women/33.jpg"
                          }
                          alt=""
                        />
                      </div>
                      <div className="text-sm">
                        <p className="font-bold">
                          {targetUser ? targetUser.name : targetChannel!.name}
                        </p>
                        {/**here goes the online status */}
                        {targetUser &&
                          (false ? (
                            <p className="text-green-500">Online</p>
                          ) : (
                            <p className="text-red-500">Offline</p>
                          ))}
                      </div>
                    </div>

                    <div className="flex items-center">
                      <div className="block rounded-full  w-5 h-5">
                        <LuPhone className="w-full h-full text-green-500" />
                      </div>
                      <div className="block rounded-full  w-6 h-6 ml-4">
                        <IoVideocamOutline className="w-full h-full text-green-500" />
                      </div>
                      <div className="block rounded-full  w-6 h-6 ml-4">
                        <IoIosInformationCircleOutline className="w-full h-full text-green-500" />
                      </div>
                    </div>
                  </div>
                  <div className="chat-body p-4 flex-1 overflow-y-scroll no-scrollbar">
                    <div className="flex flex-row justify-start">
                      <div className="text-sm text-gray-700 grid grid-flow-row gap-2 w-full">
                        {messages &&
                          messages.map((value, key: any) => {
                            if (value.sender_id === globalState.state.user.id) {
                              return (
                                <div className="" key={key}>
                                  <MiddleBubbleRight message={value.content} />
                                </div>
                              );
                            } else {
                              return (
                                <MiddleBuble
                                  message={value.content}
                                  key={key}
                                  showProfilePic={
                                    (!messages[key + 1] ||
                                      messages[key + 1].sender_id !==
                                        value.sender_id) &&
                                    value &&
                                    value.sender_picture
                                      ? true
                                      : false
                                  }
                                  picture={value.sender_picture}
                                />
                              );
                            }
                          })}
                      </div>
                    </div>
                    <p className="p-4 text-center text-sm text-gray-500">
                      {messages && messages.length > 0
                        ? messages[messages.length - 1].createdAt.toString().substring(0, 10) + " at " + messages[messages.length - 1].createdAt.toString().substring(11, 16)
                        : "No messages yet"}
                    </p>
                  </div>
                  <div className="chat-footer flex-none">
                    <div className="flex flex-row items-center p-4">
                      <button
                        type="button"
                        className="flex flex-shrink-0 focus:outline-none mx-2  text-green-600 hover:text-green-700 w-6 h-6 "
                      >
                        <CiCirclePlus className="w-full h-full" />
                      </button>
                      <button
                        type="button"
                        className="flex flex-shrink-0 focus:outline-none mx-2  text-green-600 hover:text-green-700 w-6 h-6"
                      >
                        <MdOutlineAddPhotoAlternate className="w-full h-full" />
                      </button>
                      <button
                        type="button"
                        className="flex flex-shrink-0 focus:outline-none mx-2 text-green-600 hover:text-green-700 w-6 h-6"
                      >
                        <IoCameraOutline className="w-full h-full" />
                      </button>
                      <button
                        type="button"
                        className="flex flex-shrink-0 focus:outline-none mx-2  text-green-600 hover:text-green-700 w-6 h-6"
                      >
                        <PiMicrophoneLight className="w-full h-full" />
                      </button>
                      <div className="relative flex-grow">
                        <label>
                          <input
                            className="rounded-lg py-2 pl-3 pr-10 w-full border border-gray-800 focus:border-gray-700 bg-gray-800 focus:bg-gray-900 focus:outline-none text-gray-200 focus:shadow-md transition duration-300 ease-in"
                            type="text"
                            placeholder="Aa"
                          />
                          <button
                            type="button"
                            className="absolute top-0 right-0 mt-2 mr-3 flex flex-shrink-0 focus:outline-none  text-green-600 hover:text-green-700 w-6 h-6"
                          >
                            <IoSendOutline className="w-full h-full" />
                          </button>
                        </label>
                      </div>
                    </div>
                  </div>
                </section>
              ) : (
                <div>is empty</div>
              )}
            </main>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
