'use client';
import React, { use, useEffect, useState } from "react";
import Image from "next/image";
import { useGlobalState } from "../../Sign/GlobalState";
import { Dropdown } from "./Dropdown";
import Userstatus from "./Userstatus";
import { PinContainer } from "@/components/ui/3d-pin";

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

const UserProfile = ({target} : any) => {
  const {state} = useGlobalState();
  const [status, setStatus] = useState<string>("");
  const [recv, setRecv] = useState<string>("");
  const [is, setIs] = useState<boolean>(false);
  const [linkedFriends, setLinkedFriends] = useState<any[]>([]);

  const user : any = state.user;
  const socket : any= state.socket;


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
  const blockUser = (str : string) => {
    socket.emit(str, {
      senderId: user?.id,
      reciverId : target?.id,
    });
  }
  const removeFriend = () => {
    socket?.emit('removeFriend', {
      senderId: target?.id,
      reciverId : user?.id,
      is : false
    });
  }


  return (
    <div
      className="p-4 bg-transparent rounded-md "
      style={{
        backdropFilter: "blur(10px)",
        backgroundColor: "rgba(13, 9, 10, 0.3)",
      }}
    >
      <div className=" w-full h-full relative flex flex-col gap-5 rounded-md">
        <div className="w-full h-[290px] relative">
          <PinContainer
              title={`${target?.name}'s Profile`}
              href="https://twitter.com/mannupaaji"
            >
              <div className="overflow-hidden h-[290px] w-full">
                <Image
                  src={target.banner_picture ? target.banner_picture : "/car1.jpg"}
                  fill
                  priority
                  style={{objectFit:"cover"}}
                  alt="bg"
                  sizes="auto"
                  className="z-[-1]"
                />
            </div>
          </PinContainer>
          <div className="absolute top-0 right-0 p-4 z-10 mt-9 mr-2"> 
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
        <Userstatus target={target} status={status} recv={recv} handleSender={handleSender} friendReq={friendReq} removeFriend={removeFriend} linkedFriends={linkedFriends} />
      </div>
    </div>
  );
};

export default UserProfile;
