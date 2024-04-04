"use client";
import React, { use, useEffect, useState } from "react";
import Image from "next/image";
import { useGlobalState } from "../../Sign/GlobalState";
import { Dropdown } from "./Dropdown";
import { PinContainer } from "@/components/ui/3d-pin";
import { motion } from "framer-motion";
import axios from "axios";
import Userstatus from "./Userstatus";
import { rajdhani } from "@/app/utils/fontConfig";
import LinkedFriend from "./LinkedFriend";
import { cn } from "@/components/cn";

const people = [
  {
    id: 1,
    name: "John Doe",
    username: "Software Engineer",
    picture:
      "https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=3387&q=80",
  },
  {
    id: 2,
    name: "Robert Johnson",
    username: "Product Manager",
    picture:
      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YXZhdGFyfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60",
  },
  {
    id: 3,
    name: "Jane Smith",
    username: "Data Scientist",
    picture:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8YXZhdGFyfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60",
  },
  {
    id: 4,
    name: "Emily Davis",
    username: "UX Designer",
    picture:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGF2YXRhcnxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60",
  },
  {
    id: 5,
    name: "Tyler Durden",
    username: "Soap Developer",
    picture:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=3540&q=80",
  },
  {
    id: 6,
    name: "Dora",
    username: "The Explorer",
    picture:
      "https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=3534&q=80",
  },
];

const UserProfile = ({ target }: any) => {
  const { state } = useGlobalState();
  const [status, setStatus] = useState<string>("");
  const [recv, setRecv] = useState<string>("");
  const [is, setIs] = useState<boolean>(false);
  const [linkedFriends, setLinkedFriends] = useState<any[]>([]);

  const user: any = state.user;
  const socket: any = state.socket;

  useEffect(() => {
    socket?.on("refresh", () => {
      setIs((prev) => !prev);
    });

    return () => {
      socket?.off("refresh");
    };
  }, [socket]);

  useEffect(() => {
    axios
      .get(`http://localhost:8080/user/linked/${user?.id}/${target?.id}`)
      .then((res) => {
        setLinkedFriends(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [user, target]);

  useEffect(() => {
    axios
      .get(`http://localhost:8080/friendship/status/${user?.id}/${target?.id}`)
      .then((res) => {
        if (res.data?.status === "PENDING" && res.data?.request === "SEND")
          setStatus(res.data?.status);
        else if (res.data?.status === "ACCEPTED") setStatus(res.data?.status);
        else if (res.data?.status === "BLOCKED" && res.data?.request === "SEND")
          setStatus(res.data?.status);
        else setStatus("");
      })
      .catch((err) => {
        console.log(err);
      });
    axios
      .get(`http://localhost:8080/friendship/status/${target?.id}/${user?.id}`)
      .then((res) => {
        if (res.data?.status === "PENDING" && res.data?.request !== "RECIVED")
          setRecv(res.data?.status);
        else if (res.data?.status === "ACCEPTED") setRecv(res.data?.status);
        else if (
          res.data?.status === "BLOCKED" &&
          res.data?.request !== "RECIVED"
        )
          setRecv(res.data?.status);
        else setRecv("");
      })
      .catch((err) => {
        console.log(err);
      });
  }, [target?.id, user?.id, is]);

  const handleSender = () => {
    switch (status) {
      case "PENDING": {
        socket.emit("cancelFriendRequest", {
          senderId: user?.id,
          reciverId: target?.id,
        });
        break;
      }
      case "ACCEPTED": {
        socket.emit("removeFriend", {
          senderId: user?.id,
          reciverId: target?.id,
          is: true,
        });
        break;
      }
      default: {
        socket.emit("friendRequest", {
          senderId: user?.id,
          reciverId: target?.id,
        });
      }
    }
  };

  const friendReq = (str: string) => {
    socket?.emit(str, {
      senderId: target?.id,
      reciverId: user?.id,
    });
  };
  const blockUser = (str: string) => {
    socket.emit(str, {
      senderId: user?.id,
      reciverId: target?.id,
    });
  };
  const removeFriend = () => {
    socket?.emit("removeFriend", {
      senderId: target?.id,
      reciverId: user?.id,
      is: false,
    });
  };

  return (
    <div className=" p-4 bg-[#101823] rounded-md ">
      <div className=" w-full h-full relative flex flex-col 2xl:gap-[80px] gap-12 rounded-md">
        <div className="w-full  h-[290px] relative">
          <PinContainer title="Overview" href="https://twitter.com/mannupaaji">
            <div className="overflow-hidden h-[290px] w-full">
              {target ? (
                <Image
                  src={
                    target?.banner_picture
                      ? target?.banner_picture
                      : "/car1.jpg"
                  }
                  fill
                  priority
                  style={{ objectFit: "cover" }}
                  alt="bg"
                  sizes="auto"
                  className="z-[-1] rounded-2xl"
                />
              ) : (
                <div className="flex items-center justify-center w-full h-full bg-gray-400 rounded  animate-pulse">
                  <svg
                    className="w-10 h-10 text-gray-300"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 20 18"
                  >
                    <path d="M18 0H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm4.376 10.481A1 1 0 0 1 16 15H4a1 1 0 0 1-.895-1.447l3.5-7A1 1 0 0 1 7.468 6a.965.965 0 0 1 .9.5l2.775 4.757 1.546-1.887a1 1 0 0 1 1.618.1l2.541 4a1 1 0 0 1 .028 1.011Z" />
                  </svg>
                </div>
              )}
            </div>
          </PinContainer>
          <div className="absolute top-0 right-0 p-4 z-10 mt-9 mr-2">
            <Dropdown
              handleBlock={() => blockUser("blockFriend")}
              handleUnblock={() => blockUser("unblockFriend")}
              status={status}
              recv={recv}
            />
          </div>
          <div className="2xl:w-[170px]  xl:w-[120px] xl:h-[200px] absolute 2xl:h-[250px]  bg-[#101823] rounded-md 2xl:-bottom-[120px] 2xl:left-[100px] p-2 text-white sm:bottom-[10px] sm:left-[50px] sm:w-[110px] sm:h-[170px] bottom-[10px] left-[20px] w-[80px] h-[150px]">
            <div className="w-full h-full flex flex-col items-center bg-[#101823] rounded-md gap-4">
              <div className="w-full h-[60%]   relative">
                {target ? (
                  <Image
                    src={target?.picture ? target?.picture : "/b.png"}
                    alt="profile"
                    fill
                    style={{ objectFit: "cover" }}
                    sizes="auto"
                    className="rounded-md"
                  />
                ) : (
                  <div className="flex items-center justify-center w-full h-full bg-gray-400 rounded  animate-pulse">
                    <svg
                      className="w-10 h-10 text-gray-300"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      viewBox="0 0 20 18"
                    >
                      <path d="M18 0H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm4.376 10.481A1 1 0 0 1 16 15H4a1 1 0 0 1-.895-1.447l3.5-7A1 1 0 0 1 7.468 6a.965.965 0 0 1 .9.5l2.775 4.757 1.546-1.887a1 1 0 0 1 1.618.1l2.541 4a1 1 0 0 1 .028 1.011Z" />
                    </svg>
                  </div>
                )}
              </div>
              {target ? (
                <div className="flex flex-col items-center">
                  <h2 className="mt-2 xl:text-[15px] text-[10px] text-center">
                    {target?.name}
                  </h2>
                  <span className="xl:text-[10px] text-[7px]">
                    @{target?.username}
                  </span>
                  <span className="xl:text-[10px] text-[7px]">400,000</span>
                </div>
              ) : (
                <div className="w-[80%] animate-pulse">
                  <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-700 w-full mb-4"></div>
                  <div className="h-2 bg-gray-300 rounded-full dark:bg-gray-700 w-full mb-2.5"></div>
                  <div className="h-2 bg-gray-300 rounded-full dark:bg-gray-700 mb-2.5"></div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="w-full   border-red-500 pb-5  flex sm:flex-row flex-col sm:flex-wrap 2xl:mt-0 mt-2 justify-between sm:gap-2 gap-5">
          <div className="2xl:w-[35%] sm:w-[55%]  border-yellow-500 flex sm:h-[250px]">
            <div className="w-full  border-green-500  2xl:self-end 2xl:h-[55%] lg:h-[100%] items-center bg-[#101823]  flex justify-between rounded-md 2xl:flex-row">
              <div className="flex   sm:w-full items-center  sm:h-[40%] h-full 2xl:h-full w-full bg-[#172234] rounded-md">
                <div className="relative">
                  <Image
                    src={"/badge1.png"}
                    width={150}
                    height={130}
                    alt="badge"
                    className="2xl:w-[150px] xl:w-[115px] md:w-[112px] w-[105px]"
                  ></Image>
                </div>
                <div className="flex flex-col 2xl:w-[100%] w-[420px] ">
                  <div className="flex items-center justify-between text-white">
                    <h1 className="ml-1 2xl:text-[17px] xl:text-[14px] font-[500] sm:text-[11px] text-[14px]">
                      LVL 2
                    </h1>
                    <span className="2xl:text-xs text-[8px] text-white 2xl:mr-3 sm:mr-7 mr-7">
                      250/1000
                    </span>
                  </div>
                  <div className="sm:w-[95%] w-[91%] 2xl:w-[98%] b bg-[#D6D6D6] rounded-full">
                    <motion.div
                      className="bg-[#FF4654] p-2 sm:h-2.5 h-2 rounded-full relative w-[45%]"
                      initial={{ width: "0%" }}
                      animate={{ width: "45%" }}
                      transition={{ duration: 1 }}
                    >
                      <div className="relative">
                        <div className="absolute 2xl:w-4 2xl:h-4 w-3 h-3  bg-[#FF4656] 2xl:-right-[13px] -right-[11px] top-[16px]  transform rotate-45"></div>
                      </div>
                      <div className="absolute bg-[#FF4656] w-10 h-6 rounded-sm -right-4 -bottom-[34px] text-white flex items-center justify-center text-[12px] text-center">
                        45%
                      </div>
                    </motion.div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Userstatus
            target={target}
            status={status}
            recv={recv}
            handleSender={handleSender}
            friendReq={friendReq}
            removeFriend={removeFriend}
          />
          <div
            className={cn(
              "2xl:w-[30%] p-5 text-white bg-[#172234] sm:w-[42%]  rounded-lg h-[250px] flex flex-col gap-4",
              rajdhani.className
            )}
          >
            <h1 className="2xl:text-3xl xl:text-2xl text-xl font-[600]">
              Linked Friends
            </h1>
            <div className="flex flex-col gap-1 overflow-y-auto">
              {linkedFriends &&
                linkedFriends?.map((user, i) => {
                  return (
                    <LinkedFriend user={user} key={user.id} index={i + 1} />
                  );
                })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
