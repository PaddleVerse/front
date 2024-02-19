'use client';
import React, { useEffect, useState } from "react";
import { Rajdhani } from "next/font/google";
import { Inter } from "next/font/google";
import Image from "next/image";
import { useGlobalState } from "../../Sign/GlobalState";
import { Dropdown } from "./Dropdown";

import axios from "axios";

const inter = Inter({ subsets: ["latin"] });
const rajdhani = Rajdhani({ subsets: ["latin"], weight: ["400", "500"] });

const UserProfile = ({target} : any) => {
  const {state} = useGlobalState();
  const [status, setStatus] = useState<string>("");
  const [recv, setRecv] = useState<string>("");
  const [is, setIs] = useState<boolean>(false);

  const user:any = state.user;
  const socket : any= state.socket;

  useEffect(() => {

    socket?.on('refresh', (data: any) => { setIs(prv => !prv); });
    return () => {
        socket?.off('refresh');
    };
  }, [socket]);




  useEffect(() => {
    axios.get(`http://localhost:8080/friendship/status/${user?.id}/${target?.id}`)
    .then((res) => {
      setStatus(res.data);
    })
    .catch((err) => {
      console.log(err);
    });
  } , [target?.id, user?.id, is]);


  useEffect(() => {
    axios.get(`http://localhost:8080/friendship/status/${target?.id}/${user?.id}`)
    .then((res) => {
      setRecv(res.data);
    })
    .catch((err) => {
      console.log(err);
    });
  } , [target?.id, user?.id, is]);


  const addFriend = () => {
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

  const acceptFriend = () => {
    socket?.emit('acceptFriendRequest', {
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

  const rejectFriend = () => {
    socket?.emit('rejectFriendRequest', {
      senderId: target?.id,
      reciverId : user?.id,
    });
  }

  const blockUser = () => {
    socket.emit('blockFriend', {
      senderId: user?.id,
      reciverId : target?.id,
    });
  }

  const unblockUser = () => {
    socket.emit('unblockFriend', {
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
          <Dropdown handleBlock={blockUser} handleUnblock={unblockUser} status={status} recv={recv} />
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
              className="w-full  border-green-500  2xl:self-end 2xl:h-[40%] lg:h-[100%]  py-2 px-4 bg-dashBack flex justify-between rounded-md 2xl:flex-row flex-col"
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
              <div className="  2xl:w-[30%] w-full h-[40%] 2xl:h-auto bg-dashBack rounded-md border"></div>
            </div>
          </div>
          <div className="2xl:w-[30%] sm:w-[40%]  border-orange-500  py-2 bg-dashBack flex  h-[250px]  px-2 rounded-md">
            <div className="flex flex-col w-full h-full relative justify-around gap-2  ">
              <div className="flex  justify-around items-center ">
                <div
                  className={` ${inter.className} flex flex-col text-white gap-1 relative`}
                >
                  <span className="text-buttonGray 2xl:text-xs xl:text-[12px] sm:text-[11px] ml-[8px] 2xl:ml-4 xl:ml-2 text-[13px]">
                    online
                  </span>
                  <div className="absolute 2xl:left-2 xl:top-[6px] top-[9px]  w-[5px] h-[5px] rounded-full bg-green-500"></div>
                  <h1 className="2xl:text-[17px] xl:text-[15px] text-[15px]">
                    Andrew
                  </h1>
                  <span className="text-buttonGray 2xl:text-[15px] xl:text-[8px] sm:text-[8px] text-[13px]">
                    02-01-2024
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
                    <button
                      onClick={acceptFriend}
                      className={`w-full h-auto sm:mt-0 mt-4 rounded-md bg-greenButton  flex items-center justify-center 2xl:text-[24px] xl:text[22px] text-white font-[500] ${rajdhani.className} `}
                    >
                      ACCEPTE
                    </button>
                    <button
                      onClick={rejectFriend}
                      className={`w-full h-auto sm:mt-0 mt-4 rounded-md bg-red-900  flex items-center justify-center 2xl:text-[24px] xl:text[22px] text-white font-[500] ${rajdhani.className} `}
                    >
                      REJECTE
                    </button>
                  </div>
                  : recv && recv === "ACCEPTED" ?
                  <button
                    onClick={removeFriend}
                    className={`w-full h-auto sm:mt-0 mt-4 rounded-md bg-red-900 flex items-center justify-center 2xl:text-[24px] xl:text[22px] text-white font-[500] ${rajdhani.className} `}
                  >
                    REMOVE FRIEND
                  </button>
                  : recv && recv === "BLOCKED" ? null
                  :
                  <button
                    onClick={addFriend}
                    className={`w-full h-auto sm:mt-0 mt-4 rounded-md ${status === "PENDING" ? "bg-gray-700" : status === "ACCEPTED"  ? "bg-red-900" : status === "BLOCKED" ? "hidden" : "bg-greenButton"} flex items-center justify-center 2xl:text-[24px] xl:text[22px] text-white font-[500] ${rajdhani.className} `}
                  >
                    {
                      status && status === "PENDING" ? "PENDING"
                      : status && status === "ACCEPTED" ? "REMOVE FRIEND"
                      : "ADD FRIEND"
                    }
                  </button>
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
