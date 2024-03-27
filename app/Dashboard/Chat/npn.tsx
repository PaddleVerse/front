"use client";
import { motion } from "framer-motion";
import { ChatCard } from "@/app/components/Dashboard/Chat/ChatCard";
import { AnimatePresence } from "framer-motion";
import { Inter } from "next/font/google";
import { useCallback, useEffect, useLayoutEffect, useState } from "react";
import axios, { Axios, AxiosError } from "axios";
import { useGlobalState } from "@/app/components/Sign/GlobalState";
import JoinChannel from "@/app/components/Dashboard/Chat/JoinChannel";
import Image from "next/image";
import CreateChannel from "@/app/components/Dashboard/Chat/createChannel";
const inter = Inter({ subsets: ["latin"] });

const Page = ({ children }: { children: React.ReactNode }) => {
  const [showMessage, setShowMessage] = useState(false);
  const [online, setOnline] = useState(false);
  const [update, setUpdate] = useState(true);
  const [chatList, setChatList] = useState([]);
  const { state, dispatch } = useGlobalState();
  const [modlar, setModlar] = useState(false);
  const [createModlar, setCreateModlar] = useState(false);
  const { show } = state;
  useEffect(() => {
    !show && setShowMessage(false);
  }, [show]);

  useEffect(() => {
    if (state?.user) {
      axios
        .get(`http://localhost:8080/chat/chatlist/${state?.user?.id}`)
        .then((res) => {
          console.log("fetched chat list");
          setChatList(res.data);
        })
        .catch((error) => {
          console.log("failed to fetch chat list");
        });
    }
    return () => {
      setUpdate(false);
    };
  }, [state, update]);

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

  useEffect(() => {
    state?.socket?.on("ok", (data: any) => {
      if (data === null) return;
      setUpdate(true);
    });
    state?.socket?.emit("refresh");
    return () => {
      state?.socket?.off("ok");
    };
  }, [state?.socket]);

  useEffect(() => {
    state?.socket?.on("update", (data: any) => {
      console.log("update from server");
      setUpdate(true);
    });
    return () => {
      state?.socket?.off("update");
    };
  }, [state?.socket]);

  const handleClick = () => {
    setModlar(false);
  };

  const handleSwitching = () => {
    setShowMessage(!showMessage);
    dispatch({ type: "UPDATE_SHOW", payload: true });
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

  return (
    <div className="w-[91%] mx-auto lg:h-full md:h-[92%] relative h-[80%] flex justify-center mt-5 overflow-hidden">
      <AnimatePresence>
        {modlar ? (
          <JoinChannel handleClick={handleClick} user={state.user} />
        ) : createModlar ? (
          <CreateChannel handleClick={() => setCreateModlar(false)} />
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
                          value={value}
                          self={state.user}
                          online={online}
                          setOnline={setOnline}
                          handleClick={handleSwitching}
                        ></ChatCard>
                      );
                    })}
                </div>
              </motion.section>
              {children}
            </main>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
