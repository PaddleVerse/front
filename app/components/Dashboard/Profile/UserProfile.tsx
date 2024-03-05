'use client';
import React, { use, useEffect, useState } from "react";
import { Rajdhani } from "next/font/google";
import { Inter } from "next/font/google";
import Image from "next/image";
import { useGlobalState } from "../../Sign/GlobalState";
import { Dropdown } from "./Dropdown";
import { Button } from "../../../../components/ui/moving-border"
import { AnimatedTooltip } from "../../../../components/ui/animated-tooltip";

import axios from "axios";

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
  }
];
 

const inter = Inter({ subsets: ["latin"] });

const UserProfile = ({target} : any) => {
  const {state} = useGlobalState();
  const [status, setStatus] = useState<string>("");
  const [recv, setRecv] = useState<string>("");
  const [is, setIs] = useState<boolean>(false);
  const [linkedFriends, setLinkedFriends] = useState<any[]>([]);

  const user : any = state.user;
  const socket : any= state.socket;


  const  getDate = (dateString: string): string  => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }


  useEffect(() => {

    socket?.on('refresh', () => { setIs((prev) => !prev) });

    return () => { socket?.off('refresh') };

  }, [socket]);


  useEffect(() => {
    axios.get(`http://localhost:8080/user/linked/${user?.id}/${target?.id}`)
    .then((res) => {
      setLinkedFriends(res.data);
    })
    .catch((err) => {
      console.log(err);
    });
  }, [user, target]);

  
  useEffect(() => {
    axios.get(`http://localhost:8080/friendship/status/${user?.id}/${target?.id}`)
    .then((res) => {
      if (res.data?.status === "PENDING" && res.data?.request === "SEND")
        setStatus(res.data?.status);
      else if (res.data?.status === "ACCEPTED")
        setStatus(res.data?.status);
      else if (res.data?.status === "BLOCKED" && res.data?.request === "SEND")
        setStatus(res.data?.status);
      else setStatus("");
    })
    .catch((err) => {
      console.log(err);
    });
  } , [target?.id, user?.id, is]);


  useEffect(() => {
    axios.get(`http://localhost:8080/friendship/status/${target?.id}/${user?.id}`)
    .then((res) => {
      if (res.data?.status === "PENDING" && res.data?.request !== "RECIVED")
        setRecv(res.data?.status);
      else if (res.data?.status === "ACCEPTED")
        setRecv(res.data?.status);
      else if (res.data?.status === "BLOCKED" && res.data?.request !== "RECIVED")
        setRecv(res.data?.status);
      else setRecv("");
    })
    .catch((err) => {
      console.log(err);
    });
  } , [target?.id, user?.id, is]);

  const handleSender = () => {
    switch(status) {
      case "PENDING":
      {
        socket.emit('cancelFriendRequest', {
          senderId: user?.id,
          reciverId : target?.id,
        });
        break;
      }
      case "ACCEPTED":
      {
        socket.emit('removeFriend', {
          senderId: user?.id,
          reciverId : target?.id,
          is : true
        });
        break;
      }
      default:
      {
        socket.emit('friendRequest', {
          senderId: user?.id,
          reciverId : target?.id,
        });
      }
    }
  }

  const friendReq = (str : string) => {
    socket?.emit(str, {
      senderId: target?.id,
      reciverId : user?.id,
    });
  }

  const removeFriend = () => {
    socket?.emit('removeFriend', {
      senderId: target?.id,
      reciverId : user?.id,
      is : false
    });
  }

  const blockUser = (str : string) => {
    socket.emit(str, {
      senderId: user?.id,
      reciverId : target?.id,
    });
  }

  return (
    <div
      className=" p-4 bg-transparent rounded-md "
      style={{
        backdropFilter: "blur(10px)",
        backgroundColor: "rgba(13, 9, 10, 0.3)",
      }}
    >
      <div className=" w-full h-full relative flex flex-col gap-5  rounded-md">
        <div className="w-full  h-[290px] relative">
          <Image
            src={target.banner_picture ? target.banner_picture : "/car1.jpg"}
            fill
            priority
            style={{objectFit:"cover"}}
            alt="bg"
            sizes="auto"
            className="z-[-1]"
          />
          <div className="absolute right-0 p-4"> 
          <Dropdown handleBlock={() => blockUser("blockFriend")} handleUnblock={() => blockUser("unblockFriend")} status={status} recv={recv} />
          </div>
          <div
            className="2xl:w-[170px] xl:w-[120px] xl:h-[200px] absolute 2xl:h-[250px]  bg-transparent rounded-md 2xl:-bottom-[120px] 2xl:left-[100px] p-2 text-white sm:bottom-[10px] sm:left-[50px] sm:w-[110px] sm:h-[170px] bottom-[10px] left-[20px] w-[80px] h-[150px]  "
            style={{
              backdropFilter: "blur(10px)",
              backgroundColor: "rgba(13, 9, 10, 0.3)",
            }}
          >
            <div
              className=" w-full h-full flex flex-col items-center bg-transparent rounded-md  gap-4"
              style={{
                backdropFilter: "blur(10px)",
                backgroundColor: "rgba(13, 9, 10, 0.3)",
              }}
            >
              <div className="w-full h-[60%]   relative">
                <Image
                  src={target.picture ? target.picture : "/b.png"}
                  alt="profile"
                  fill
                  style={{objectFit:"cover"}}
                  sizes="auto"
                  className="  rounded-md"
                />
              </div>
              <div className="flex flex-col items-center">
                <h2 className="mt-2 xl:text-[15px] text-[10px]">
                  {target.name}
                </h2>
                <span className="xl:text-[10px] text-[7px]">@{target.username}</span>
                <span className="xl:text-[10px] text-[7px]">400,000</span>
              </div>
            </div>
          </div>
        </div>
        <div className="w-full  border-red-500  flex sm:flex-row flex-col sm:flex-wrap justify-between sm:gap-0 gap-5">
          <div className="2xl:w-[35%] sm:w-[55%]  border-yellow-500 flex h-[250px]">
            <div
              className="w-full border-red-500 2xl:self-end 2xl:h-[40%] lg:h-[100%] py-2 px-4 bg-dashBack flex justify-between rounded-md 2xl:flex-row flex-col"
            >
              <div className="flex  2xl:w-[60%] sm:w-full items-center h-[40%] 2xl:h-auto  bg-dashBack rounded-md">
                <div className="relative">
                  <Image
                    src={"/badge1.png"}
                    width={200}
                    height={130}
                    alt="badge"
                    className="w-[80px]"
                  ></Image>
                </div>
                <div className="flex flex-col 2xl:w-[250px] w-[420px]">
                  <div className="flex items-center justify-between text-white">
                    <h1 className="ml-1 2xl:text-[15px] xl:text-[12px] sm:text-[11px] text-[14px]">
                      LVL 2
                    </h1>
                    <span className="2xl:text-xs text-[8px] text-buttonGray 2xl:mr-3 sm:mr-7 mr-7">
                      250/1000
                    </span>
                  </div>
                  <div className="sm:w-[95%] w-[91%] 2xl:w-full bg-progressBg rounded-full p-[1px] dark:bg-gray-700">
                    <div
                      className="bg-progressColor sm:h-2.5 h-2 rounded-full relative"
                      style={{ width: "45%" }}
                    >
                      <div className="absolute bg-progressIndicator w-4 h-4 rounded-full -right-2 sm:-top-[3px] -top-[4px]"></div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-row items-center justify-center mb-10 w-full">
                <AnimatedTooltip items={linkedFriends} />
              </div>
            </div>
          </div>
          <div className="2xl:w-[30%] sm:w-[40%]  border-orange-500  py-2 bg-dashBack flex  h-[250px]  px-2 rounded-md">
            <div className="flex flex-col w-full h-full relative justify-around gap-2  ">
              <div className="flex justify-around items-center">
                <div
                  className={` ${inter.className} flex flex-col text-white gap-1 relative`}
                >
                  <div className="flex items-center">
                    <span className="relative flex h-3 w-3 mr-2">
                      <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${ target?.status === "ONLINE" ? "bg-green-500" : "bg-gray-500" } opacity-75`}></span>
                      <span className={`relative inline-flex rounded-full h-3 w-3 ${ target?.status === "ONLINE" ? "bg-green-500" : "bg-gray-500" }`}></span>
                    </span>
                    <span className={`2xl:text-xs xl:text-[12px] sm:text-[11px] text-[13px] ${ target?.status === "ONLINE" ? "text-green-500" : "text-gray-500" }`}>
                      { target?.status === "ONLINE" ? "online" : "offline" }
                    </span>
                  </div>
                  {/* <div className={`absolute 2xl:left-2 xl:top-[6px] top-[9px]  w-[5px] h-[5px] rounded-full ${ target?.status === "ONLINE" ? "bg-green-500" : "bg-gray-500" }`}></div> */}
                  <span className="text-buttonGray 2xl:text-[15px] xl:text-[8px] sm:text-[8px] text-[13px]">
                    {getDate(target?.createdAt)}
                  </span>
                  <span className="text-buttonGray 2xl:text-[13px] xl:text-[12px] sm:text-[10px] text-[13px]">
                    public channels
                  </span>
                  <div className="flex gap-2">
                    <Image
                      src={"/group.svg"}
                      width={25}
                      height={25}
                      alt="group"
                    />
                    <Image
                      src={"/group.svg"}
                      width={25}
                      height={25}
                      alt="group"
                    />
                  </div>
                </div>
                <Image
                  src={"/badge2.png"}
                  width={170}
                  height={170}
                  alt="badge"
                  className="2xl:w-[180px] sm:-right-[20px] right-[0px] bottom-[25px] sm:bottom-[45px] xl:w-[120px]  2xl:right-[10px] 2xl:bottom-[100px] xl:-right-[15px] xl:bottom-[95px] lg:w-[95px]"
                />
              </div> 
              {
                recv && recv === "PENDING" ?
                  <div className="flex flex-row gap-4">
                    <Button
                      onClick={() => friendReq("acceptFriendRequest")}
                      borderRadius="1.75rem"
                      borderClassName=" bg-[radial-gradient(var(--green-500)_40%,transparent_60%)]"
                      className={`text-white border-slate-800 w-full sm:mt-0 mt-4 bg-green-500/[0.3]`}
                    >
                      ACCEPTE
                    </Button>
                    <Button
                      onClick={() => friendReq("rejectFriendRequest")}
                      borderRadius="1.75rem"
                      borderClassName=" bg-[radial-gradient(var(--red-500)_40%,transparent_60%)]"
                      className={`text-white border-slate-800 w-full sm:mt-0 mt-4  bg-red-500/[0.3]`}
                    >
                      REJECTE
                    </Button>
                  </div>
                  : recv && recv === "ACCEPTED" ?
                  <Button
                    onClick={removeFriend}
                    borderRadius="1.75rem"
                    borderClassName="bg-[radial-gradient(var(--red-500)_40%,transparent_60%)]"
                    className={`text-white border-slate-800 w-full sm:mt-0 mt-4  bg-red-500/[0.3]`}
                  >
                    REMOVE FRIEND
                  </Button>
                  : recv && recv === "BLOCKED" ? null
                  : status && status === "BLOCKED" ? null
                  : <Button
                    onClick={handleSender}
                    borderRadius="1.75rem"
                    borderClassName={status === "ACCEPTED" ? "bg-[radial-gradient(var(--red-500)_40%,transparent_60%)]" : ""}
                    className={`text-white border-slate-800 w-full sm:mt-0 mt-4  ${status === "PENDING" ? "bg-slate-800" : status === "ACCEPTED"  ? "bg-red-600/[0.3]"  : ""}`}
                    // className={` w-full h-auto sm:mt-0 mt-4 rounded-md ${status === "PENDING" ? "bg-gray-700" : status === "ACCEPTED"  ? "bg-red-900" : status === "BLOCKED" ? "hidden" : "bg-greenButton"} flex items-center justify-center 2xl:text-[24px] xl:text[22px] text-white font-[500] ${rajdhani.className} `}
                  >
                    {
                      status && status === "PENDING" ? "PENDING"
                      : status && status === "ACCEPTED" ? "REMOVE FRIEND"
                      : "ADD FRIEND"
                    }
                  </Button>
              }
            </div>
          </div>
          <div className="2xl:w-[30%] sm:w-[100%] border h-[250px]"></div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
