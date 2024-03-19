"use client";
import Image from "next/image";
import { motion } from "framer-motion";
import { ChatCard } from "@/app/components/Dashboard/Chat/ChatCard";
import MiddleBuble from "@/app/components/Dashboard/Chat/LeftBubbles/MiddleBuble";
import { AnimatePresence } from "framer-motion";
import { Inter } from "next/font/google";
import { IoIosInformationCircleOutline } from "react-icons/io";
import { CiCirclePlus } from "react-icons/ci";
import { CgAdd } from "react-icons/cg";
import { IoSendOutline } from "react-icons/io5";
import {
  FormEvent,
  FormEventHandler,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import axios from "axios";
import { useGlobalState } from "@/app/components/Sign/GlobalState";
import { channel, participants, target, user } from "./type";
import MiddleBubbleRight from "@/app/components/Dashboard/Chat/RightBubbles/MiddleBubbleRight";
import { useForm } from "react-hook-form";
import JoinChannel from "@/app/components/Dashboard/Chat/JoinChannel";
import { useSwipeable } from "react-swipeable";
import { promises } from "dns";
import toast from "react-hot-toast";

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
  const inputMessage = useRef<HTMLInputElement | null>(null);
  const topicInput = useRef<HTMLInputElement | null>(null);
  const channelNameInput = useRef<HTMLInputElement | null>(null);
  const [participants, setParticipants] = useState<participants[]>([]);
  const [showMessage, setShowMessage] = useState(false);
  const containerRef = useRef(null);
  const [online, setOnline] = useState(false);
  const { register } = useForm();
  const [update, setUpdate] = useState(false);
  const [chatList, setChatList] = useState([]);
  const [targetUser, setTargetUser] = useState<user | null>();
  const [targetChannel, setTargetChannel] = useState<channel | null>();
  const globalState = useGlobalState();
  const [messages, setMessages] = useState<message[] | null>(null);
  const [modlar, setModlar] = useState(false);
  const [channelManagement, setChannelManagement] = useState(false);
  useEffect(() => {
    if (globalState.state.user) {
      axios
        .get(`http://localhost:8080/chat/chatlist/${globalState.state.user.id}`)
        .then((res) => {
          setChatList(res.data);
        })
        .catch((error) => {
          console.log(error);
        });
      if (targetUser) {
        axios.get(`http://localhost:8080/user/${targetUser.id}`).then((res) => {
          setTargetUser(res.data);
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [globalState, update]);
  ///////////////////////////////////////////////////////////
  //press escape to close the modal
  const handleEscapeKeyPress = useCallback((e: any) => {
    if (e.key === "Escape") {
      setModlar(false);
    }
  }, []);

  useEffect(() => {
    document.addEventListener("keydown", handleEscapeKeyPress);

    return () => {
      document.removeEventListener("keydown", handleEscapeKeyPress);
    };
  }, [handleEscapeKeyPress]);
  ///////////////////////////////////////////////////////////
  useEffect(() => {
    globalState?.state?.socket?.on("ok", (data: any) => {
      if (data === null) return;
      setUpdate(true);
    });
    globalState?.state?.socket?.emit("refresh");
    return () => {
      globalState?.state?.socket?.off("ok");
    };
  }, [globalState?.state?.socket]);

  useEffect(() => {
    globalState?.state?.socket?.on("update", (data: any) => {
      console.log("recievec update from server");
      setUpdate(true);
    });
    return () => {
      globalState?.state?.socket?.off("ok");
    };
  }, [globalState?.state?.socket]);

  useEffect(() => {
    const container: any = containerRef.current;
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    globalState?.state?.socket?.on("message", (data: any) => {});
  }, [globalState?.state?.socket]);

  // useEffect(() => {
  //   if (socket.current) {
  //     socket.current.on("message", (data: any) => {
  //       if (targetUser) {
  //         if (data.sender_id === targetUser.id) {
  //           setUpdate(true);
  //         }
  //       }
  //       if (targetChannel) {
  //         if (data.channel_id === targetChannel.id) {
  //           setUpdate(true);
  //         }
  //       }
  //     });
  //   }
  //   return () => {
  //     if (socket.current) {
  //       socket.current.off("message");
  //     }
  //   };
  // }, [socket.current]);

  useEffect(() => {
    if (targetUser) {
      if (update) {
        const data = fetchMessagesForUser(targetUser.id);
        data.then((res) => {
          setMessages(res);
        });
      }
    }
    return () => {
      setUpdate(false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetUser, update]);

  useEffect(() => {
    if (targetChannel) {
      console.log("in channel");
      if (update) {
        const data = fetchMessagesForChannel(targetChannel.id);
        data.then((res) => {
          setMessages(res);
        });
        const part = fetchChannelParticipants(targetChannel.id);
        part.then((res) => {
          setParticipants(res);
        });
      }
      setUpdate(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetChannel, update]);

  const fetchChannelParticipants = async (
    id: number | undefined
  ): Promise<participants[]> => {
    const data = await axios
      .get(
        `http://localhost:8080/channels/participants/${id}?uid=${globalState.state.user.id}`
      )
      .then((res) => {
        return res.data;
      })
      .catch((error) => {
        console.log(error);
      });
    return data;
  };

  const fetchMessagesForUser = async (
    id: number | undefined
  ): Promise<message[]> => {
    const data = await axios
      .get(
        `http://localhost:8080/conversations?uid1=${id}&uid2=${globalState.state.user.id}`
      )
      .then((res) => {
        return res.data.messages;
      })
      .catch((error) => {
        console.log(error);
      });
    return data;
  };

  const fetchMessagesForChannel = (
    id: number | undefined
  ): Promise<message[]> => {
    const data = axios
      .get(
        `http://localhost:8080/channels/messages/${id}?uid=${globalState.state.user.id}`
      )
      .then((res) => {
        return res.data;
      })
      .catch((error) => {
        console.log(error);
      });
    return data;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (targetChannel) {
      const message = {
        message: {
          content: inputMessage.current!.value,
          content_type: "string",
          sender_id: globalState.state.user.id,
          sender_picture: globalState.state.user.picture,
        },
        channel: { name: targetChannel.name },
        user1: globalState.state.user.id,
      };
      await axios
        .post(`http://localhost:8080/message`, message)
        .then((res) => console.log(res.data))
        .catch((error) => {
          console.log(error);
          toast.error("failed to send message");
          return;
        });
      globalState?.state?.socket?.emit("channelmessage", {
        roomName: targetChannel.name,
        user: globalState?.state?.user,
      });
    }
    else if (targetUser) {
      await axios
        .post(`http://localhost:8080/message`, {
          message: {
            content: inputMessage.current!.value,
            content_type: "text",
            sender_id: globalState.state.user.id,
            sender_picture: globalState.state.user.picture,
          },
          user2: globalState.state.user.id,
          user1: targetUser.id,
        })
        .then((res) => console.log("sent"))
        .catch((error) => {
          console.log(error);
        });
      globalState?.state?.socket?.emit("dmmessage", {
        reciever: targetUser.id,
        sender: globalState.state.user.id,
      });
    }
    inputMessage.current!.value = "";
    setUpdate(true);
    return (e: FormEvent<HTMLFormElement>) => {};
  };
  const handleClick = () => {
    setModlar(false);
  };

  const handleSwitching = () => {
    setShowMessage(!showMessage);
  };
  function useWindowSize() {
    const [size, setSize] = useState(0);
    useLayoutEffect(() => {
      function updateSize() {
        setSize(window.innerWidth);
      }
      window.addEventListener("resize", updateSize);
      updateSize();
      return () => window.removeEventListener("resize", updateSize);
    }, []);
    return size;
  }
  const tablet = useWindowSize() < 769;
  const handlers = useSwipeable({
    onSwipedLeft: () => setShowMessage(true),
    onSwipedRight: () => setShowMessage(false),
  });



  return (
    <div className="w-[91%] mx-auto lg:h-full md:h-[92%] relative h-[80%] flex justify-center mt-5 overflow-hidden">
      <AnimatePresence>
        {modlar && (
          <JoinChannel
            handleClick={handleClick}
            user={globalState.state.user}
            socket={globalState.state.socket}
          />
        )}
      </AnimatePresence>
      <div className="lg:max-h-[95%] lg:w-[91%] w-full h-full ">
        <div
          className={`h-full w-full flex antialiased text-gray-200 bg-transparent rounded-xl ${inter.className}`}
          style={{
            backdropFilter: "blur(20px)",
            backgroundColor: "rgba(13, 9, 10, 0.7)",
          }}
        >
          <div className="flex-1 flex flex-col ">
            <main className="flex-grow flex flex-row min-h-0">
              <motion.section
                className={` flex flex-col flex-none overflow-auto ${
                  showMessage && tablet ? "invisible" : "visible"
                } group lg:max-w-[300px] md:w-2/5 no-scrollbar`}
                initial={{ display: "flex", width: "100%", opacity: 1 }}
                animate={{
                  display: showMessage && tablet ? "hidden" : "flex",
                  width: showMessage && tablet ? "0" : "100%",
                  opacity: showMessage && tablet ? 0 : 1,
                  transition: { duration: 0.25 },
                }}
              >
                <div className=" p-4 flex-none mt-4">
                  <p
                    className={`text-2xl font-bold md:block group-hover:block mb-4`}
                  >
                    Messages
                  </p>
                  <form onSubmit={(e) => e.preventDefault()}>
                    <div className="relative sm:block hidden">
                      <label>
                        <input
                          className="rounded-lg py-2 pr-6 pl-10 w-full bg-white focus:outline-none text-black focus:shadow-md transition duration-300 ease-in"
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
                <div className="flex flex-row justify-around w-full">
                  <p className="ml-8">
                    Join a{" "}
                    <span
                      onClick={() => setModlar(true)}
                      className="text-sky-500 cursor-pointer"
                    >
                      Public
                    </span>{" "}
                    Group Chat
                  </p>
                  <div>
                    <span className="">
                      <CgAdd />
                    </span>
                  </div>
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
                          swipe={setShowMessage}
                          index={key}
                          setTargetChannel={setTargetChannel}
                          setTargetUser={setTargetUser}
                          value={value}
                          self={globalState.state.user}
                          setUpdate={setUpdate}
                          update={update}
                          online={online}
                          setOnline={setOnline}
                          handleClick={handleSwitching}
                        ></ChatCard>
                      );
                    })}
                </div>
              </motion.section>
              {targetChannel || targetUser ? (
                <section className="flex flex-col flex-auto border-l border-gray-800 border">
                  <div className=" px-6 py-4 flex flex-row flex-none justify-between items-center shadow">
                    <div className="flex">
                      <div className="w-11 h-11 mr-4 relative flex flex-shrink-0">
                        <Image
                          className="shadow-md rounded-full w-full h-full object-cover"
                          src={
                            (targetUser && targetUser?.picture) || (targetChannel && targetChannel?.picture) || ""
                          }
                          width={100}
                          height={100}
                          alt=""
                        />
                      </div>
                      <div className="text-sm">
                        <p className="font-bold">
                          {targetUser ? targetUser.name : targetChannel!.name}
                        </p>
                        {/** needs to be fixed */}
                        {targetUser &&
                          (targetUser.status === "ONLINE" ? (
                            <p className="text-green-500">Online</p>
                          ) : (
                            <p className="text-gray-400">Offline</p>
                          ))}
                      </div>
                    </div>

                    <div className="flex items-center">
                      <div
                        className="block rounded-full  w-6 h-6 ml-4"
                        onClick={() => setChannelManagement(!channelManagement)}
                      >
                        <IoIosInformationCircleOutline className="w-full h-full text-white" />
                      </div>
                    </div>
                  </div>
                  <div
                    className=" p-4 flex-1 overflow-y-scroll no-scrollbar "
                    ref={containerRef}
                  >
                    {targetUser ? (
                      <div className="w-full h-full" {...handlers}>
                        <div className="flex flex-row justify-start overflow-y-auto">
                          <div className="text-sm text-gray-700 grid grid-flow-row gap-2 w-full">
                            {messages &&
                              messages.map((value, key: any) => {
                                if (
                                  value.sender_id === globalState.state.user.id
                                ) {
                                  return (
                                    <div className="" key={key}>
                                      <MiddleBubbleRight message={value} />
                                    </div>
                                  );
                                } else {
                                  return (
                                    <MiddleBuble
                                      message={value}
                                      key={key}
                                      showProfilePic={
                                        (!messages[key + 1] ||
                                          messages[key + 1].sender_id !==
                                            value.sender_id) &&
                                        value &&
                                        value.sender_picture
                                      }
                                      picture={messages[key].sender_picture}
                                    />
                                  );
                                }
                              })}
                          </div>
                        </div>
                        <p className="p-4 text-center text-sm text-gray-500">
                          {messages && messages.length > 0
                            ? messages[messages.length - 1].createdAt
                                .toString()
                                .substring(0, 10) +
                              " at " +
                              messages[messages.length - 1].createdAt
                                .toString()
                                .substring(11, 16)
                            : "No messages yet"}
                        </p>
                      </div>
                    ) : !channelManagement ? (
                      <div className="w-full h-full" {...handlers}>
                        <div className="flex flex-row justify-start overflow-y-auto">
                          <div className="text-sm text-gray-700 grid grid-flow-row gap-2 w-full">
                            {messages &&
                              messages.map((value, key: any) => {
                                if (
                                  value.sender_id === globalState.state.user.id
                                ) {
                                  return (
                                    <MiddleBubbleRight
                                      message={value}
                                      key={key}
                                    />
                                  );
                                } else {
                                  return (
                                    <MiddleBuble
                                      message={value}
                                      key={key}
                                      showProfilePic={
                                        (!messages[key + 1] ||
                                          messages[key + 1].sender_id !==
                                            value.sender_id) &&
                                        value &&
                                        value.sender_picture
                                      }
                                      picture={messages[key].sender_picture}
                                    />
                                  );
                                }
                              })}
                          </div>
                        </div>
                        <p className="p-4 text-center text-sm text-gray-500">
                          {messages && messages.length > 0
                            ? messages[messages.length - 1].createdAt
                                .toString()
                                .substring(0, 10) +
                              " at " +
                              messages[messages.length - 1].createdAt
                                .toString()
                                .substring(11, 16)
                            : "No messages yet"}
                        </p>
                      </div>
                    ) : (
                      <div className="w-full h-full bg-white flex juti items-center">
                        <div className="w-[45%] h-full bg-blue-400 flex flex-col">
                          <div>
                            <Image
                              src="/badge1.png"
                              alt="image"
                              width={100}
                              height={100}
                            />
                          </div>
                          <div>
                            <form
                              action=""
                              onSubmit={handleSubmit}
                              className="flex flex-col"
                            >
                              <input
                                type="text"
                                placeholder="change topic"
                                {...register("topicInput", { required: false })}
                                ref={topicInput}
                              />
                              <input
                                type="text"
                                placeholder="change channel name"
                                {...register("channelNameInput", {
                                  required: false,
                                })}
                                ref={channelNameInput}
                              />
                            </form>
                          </div>
                        </div>
                        <div className="w-[45%] h-[700px] bg-black flex flex-col gap-4 items-center overflow-y-scroll">
                          {/* {Array.from({ length: 50 }, (_, index) => (
                            <div className="w-full h-[250px] bg-red-500" key={index}></div>
                          ))} */}
                        </div>
                      </div>
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
