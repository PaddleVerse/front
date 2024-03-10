import React from 'react'
import { Inter } from "next/font/google";
import { Button } from "@/components/ui/moving-border"
import Image from 'next/image'
import { AnimatedTooltip } from '@/components/ui/animated-tooltip'
import { getDate } from '@/app/utils'

const inter = Inter({ subsets: ["latin"] });


const Userstatus = ({target, status, recv, friendReq, removeFriend, handleSender, linkedFriends} : any) => {

  return (
    <div className="w-full border-red-500  flex sm:flex-row flex-col sm:flex-wrap justify-between sm:gap-0 gap-5 mt-10">
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
                  />
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
          <div className="2xl:w-[30%] sm:w-full border h-full"></div>
        </div>
  )
}

export default Userstatus