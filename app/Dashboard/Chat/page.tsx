"use client";
import { motion } from "framer-motion";
import { ChatCard } from "@/app/components/Dashboard/Chat/ChatCard";
import { AnimatePresence } from "framer-motion";
import { Inter } from "next/font/google";
import { IoIosInformationCircleOutline } from "react-icons/io";
import { CiCirclePlus } from "react-icons/ci";
import { CgAdd } from "react-icons/cg";
import { IoSendOutline } from "react-icons/io5";
import {
  FormEvent,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import axios, { Axios, AxiosError } from "axios";
import { useGlobalState } from "@/app/components/Sign/GlobalState";
import { channel, participants, user, message } from "./type";
import { set, useForm } from "react-hook-form";
import JoinChannel from "@/app/components/Dashboard/Chat/JoinChannel";
import { useSwipeable } from "react-swipeable";
import toast from "react-hot-toast";
import { OnlinePreview } from "@/app/components/Dashboard/Chat/onlinePreview";
import ChannelManagement from "@/app/components/Dashboard/Chat/channelManagement";
import ChatComponent from "@/app/components/Dashboard/Chat/ChatComponent";
import Image from "next/image";
import CreateChannel from "@/app/components/Dashboard/Chat/createChannel";
import { useSearchParams, useRouter } from "next/navigation";
import { Search } from "lucide-react";
const inter = Inter({ subsets: ["latin"] });

const Page = () => {
  // const chatQuery  =  
  // const url = "http://localhost:8080/chat/1";
  // const router = useRouter(); // for later improvement when i want to add a chat id to the url
  const searchParam = useSearchParams();
  const { register } = useForm();
  const inputMessage = useRef<HTMLInputElement | null>(null);
  const [participants, setParticipants] = useState<participants[]>([]);
  const [showMessage, setShowMessage] = useState(false);
  const containerRef = useRef(null);
  const [online, setOnline] = useState(false);
  const [update, setUpdate] = useState(false);
  const [chatList, setChatList] = useState([]);
  const [targetUser, setTargetUser] = useState<user | null>(null);
  const [targetChannel, setTargetChannel] = useState<channel | null>(null);
  const globalState = useGlobalState();
  const [messages, setMessages] = useState<message[] | null>(null);
  const [modlar, setModlar] = useState(false);
  const [createModlar, setCreateModlar] = useState(false);
  const [channelManagement, setChannelManagement] = useState(false);
  // ill be addin a loading screen in the chat card while waiting for everything to update properly, and i will have to use pagination when getting that chat list from the server
  //test , remove the push method when creating a message in the server and see if the messages gets pushed automatically in the backed

  useEffect(() => {
    if (globalState?.state?.user) {
      // if (searchParam.get("id")) {

      // }
        axios
          .get(
            `http://localhost:8080/chat/chatlist/${globalState?.state?.user?.id}`
          )
          .then((res) => {
            setChatList(res.data);
          })
          .catch((error) => {});
    }
  }, [globalState, update]);
  ///////////////////////////////////////////////////////////
  //press escape to close the modal
  const handleEscapeKeyPress = useCallback((e: any) => {
    if (e.key === "Escape") {
      setModlar(false);
      setCreateModlar(false);
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
      setUpdate(true);
    });
    return () => {
      globalState?.state?.socket?.off("update");
    };
  }, [globalState?.state?.socket]);

  useEffect(() => {
    const container: any = containerRef.current;
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (targetUser) {
      if (update) {
        axios
          .get(`http://localhost:8080/user/${targetUser.id}`)
          .then((res) => {
            fetchMessagesForUser(targetUser.id).then((res) => {
              setMessages(res);
            });
            setTargetUser(res.data);
          })
          .catch((error) => {});
      }
    }
    return () => {
      setUpdate(false);
    };
  }, [targetUser, update]);

  // is updated to use the data i get from the chat list when including the other data in it
  useEffect(() => {
    if (update) {
      if (targetChannel) {
        if (update) {
          console.log("fetching messages for channel");
          const data = fetchMessagesForChannel(targetChannel.id);
          data
            .then((res) => {
              setMessages(res);
              const part = fetchChannelParticipants(targetChannel.id);
              part.then((res) => {
                setParticipants(res);
              });
            })
            .catch((error: AxiosError) => {});
        }
        setUpdate(false);
      }
    }
  }, [targetChannel, update]);

  const fetchChannelParticipants = async (
    id: number | undefined
  ): Promise<participants[]> => {
    const data = await axios
      .get(
        `http://localhost:8080/channels/participants/${id}?uid=${globalState.state.user.id}`
      )
      .then((res) => {
        if (res.status === 200) {
          return res.data;
        }
      })
      .catch((error: AxiosError) => {});

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
        if (res.status === 200) return res.data.messages;
      })
      .catch((error: AxiosError) => {});
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
      .catch((error: AxiosError) => {
        toast.error(`failed to fetch messages for ${targetChannel!.name}`);
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
        .then((res) => {})
        .catch((error) => {
          toast.error("failed to send message");
        });
      globalState?.state?.socket?.emit("channelmessage", {
        roomName: targetChannel.name,
        user: globalState?.state?.user,
      });
    } else if (targetUser) {
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
        .then((res) => {})
        .catch((error) => {
          toast.error("failed to send message");
        });
      globalState?.state?.socket?.emit("dmmessage", {
        reciever: targetUser.id,
        sender: globalState.state.user.id,
      });
      setUpdate(true);
    }
    inputMessage.current!.value = "";
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
        {modlar ? (
          <JoinChannel
            handleClick={handleClick}
            user={globalState.state.user}
            socket={globalState.state.socket}
          />
        ) : createModlar ? (
          <CreateChannel
            handleClick={() => setCreateModlar(false)}
            user={globalState.state.user}
            socket={globalState.state.socket}
          />
        ) : null}
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
                    <span className="" onClick={() => setCreateModlar(true)}>
                      <Image
                        width={24}
                        height={24}
                        src="/Chat/vector.svg"
                        alt="create svg"
                      />
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
                        <img
                          className="shadow-md rounded-full w-full h-full object-cover"
                          src={
                            (targetUser && targetUser.picture) ||
                            targetChannel?.picture
                          }
                          alt="user or channel picture"
                        />
                      </div>
                      <div className="text-sm">
                        <p className="font-bold">
                          {targetUser ? targetUser.name : targetChannel!.name}
                        </p>
                        {targetUser && (
                          <OnlinePreview status={targetUser!.status!} />
                        )}
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
                    ref={containerRef}
                  >
                    {targetUser ? (
                      <ChatComponent
                        handlers={handlers}
                        messages={messages!}
                        globalStateUserId={globalState.state.user.id}
                      />
                    ) : !channelManagement ? (
                      <ChatComponent
                        handlers={handlers}
                        messages={messages!}
                        globalStateUserId={globalState.state.user.id}
                      />
                    ) : (
                      <ChannelManagement
                        participants={participants}
                        channel={targetChannel!}
                            user={globalState.state!.user!}
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
