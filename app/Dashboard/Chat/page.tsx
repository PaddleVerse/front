'use client'
import ChatCard from "@/app/components/Dashboard/Chat/ChatCard";
import LastBuble from "@/app/components/Dashboard/Chat/LeftBubbles/LastBuble";
import MiddleBuble from "@/app/components/Dashboard/Chat/LeftBubbles/MiddleBuble";
import TopBuble from "@/app/components/Dashboard/Chat/LeftBubbles/TopBuble";
import LastBubbleRight from "@/app/components/Dashboard/Chat/RightBubbles/LastBubbleRight";
import MiddleBubbleRight from "@/app/components/Dashboard/Chat/RightBubbles/MiddleBubbleRight";
import TopBubbleRight from "@/app/components/Dashboard/Chat/RightBubbles/TopBubbleRight";
import React from "react";
import { Inter } from "next/font/google";
import { LuPhone } from "react-icons/lu";
import { IoVideocamOutline } from "react-icons/io5";
import { IoIosInformationCircleOutline } from "react-icons/io";
import { CiCirclePlus } from "react-icons/ci";
import { MdOutlineAddPhotoAlternate } from "react-icons/md";
import { IoCameraOutline } from "react-icons/io5";
import { PiMicrophoneLight } from "react-icons/pi";
import { IoSendOutline } from "react-icons/io5";
import { TbSend } from "react-icons/tb";
const inter = Inter({ subsets: ["latin"] });
const page = () => {
  return (
    <div className="w-full lg:h-full md:h-[92%] h-[97%] flex justify-center mt-5">
      {/* //   <div
    //     className="w-[89%]  mt-[50px] flex flex-col bg-transparent "
    //     style={{
    //       backdropFilter: "blur(20px)",
    //       backgroundColor: "rgba(13, 9, 10, 0.7)",
    //     }}
    //   > */}
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
              <section className="flex flex-col flex-none overflow-auto w-24 group lg:max-w-sm md:w-2/5 " >
                <div className="py-4 sm:flex flex-row hidden  items-center flex-none  justify-start">
                  <div
                    className="w-16 h-16 relative flex flex-shrink-0"
                    style={{ filter: "invert(100%)" }}
                  ></div>
                  <p className={`text-2xl font-bold hidden md:block group-hover:block`}>
                    Messenger
                  </p>
                </div>
                <div className=" p-4 flex-none">
                  <form onSubmit={(e)=>e.preventDefault()}>
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

                <div className=" p-2 flex-1 overflow-y-scroll">
                  {Array.from({ length: 15 }, (_, index) => (
                    <ChatCard key={index} />
                  ))}
                </div>
              </section>
              <section className="flex flex-col flex-auto border-l border-gray-800">
                <div className=" px-6 py-4 flex flex-row flex-none justify-between items-center shadow">
                  <div className="flex">
                    <div className="w-11 h-11 mr-4 relative flex flex-shrink-0">
                      <img
                        className="shadow-md rounded-full w-full h-full object-cover"
                        src="https://randomuser.me/api/portraits/women/33.jpg"
                        alt=""
                      />
                    </div>
                    <div className="text-sm">
                      <p className="font-bold">Scarlett Johansson</p>
                      <p className="text-green-500">Online</p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <div
                      className="block rounded-full  w-5 h-5"
                    >
                      <LuPhone className="w-full h-full text-green-500" />
                    </div>
                    <div
                      className="block rounded-full  w-6 h-6 ml-4"
                    >
                      <IoVideocamOutline className="w-full h-full text-green-500" />
                    </div>
                    <div
                      className="block rounded-full  w-6 h-6 ml-4"
                    >
                     <IoIosInformationCircleOutline className="w-full h-full text-green-500" />
                    </div>
                  </div>
                </div>
                <div className="chat-body p-4 flex-1 overflow-y-scroll">
                  <div className="flex flex-row justify-start">
                    <div className="w-8 h-8 relative flex flex-shrink-0 mr-4">
                      <img
                        className="shadow-md rounded-full w-full h-full object-cover"
                        src="https://randomuser.me/api/portraits/women/33.jpg"
                        alt=""
                      />
                    </div>
                    <div className=" text-sm text-gray-700 grid grid-flow-row gap-2">
                      <MiddleBuble />
                      <MiddleBuble />
                      <MiddleBuble />
                      <MiddleBuble />
                      <MiddleBuble />
                      <MiddleBuble />
                      <MiddleBuble />
                      <MiddleBuble />
                      <MiddleBuble />
                    </div>
                  </div>
                  <p className="p-4 text-center text-sm text-gray-500">
                    FRI 3:04 PM
                  </p>
                  <div className="flex flex-row justify-end">
                    <div className="messages text-sm text-white grid grid-flow-row gap-2">
                      <MiddleBubbleRight />
                      <MiddleBubbleRight />
                      <MiddleBubbleRight />
                      <MiddleBubbleRight />
                      <MiddleBubbleRight />
                      <MiddleBubbleRight />
                    </div>
                  </div>
                  <p className="p-4 text-center text-sm text-gray-500">
                    SAT 2:10 PM
                  </p>
                  <div className=" text-sm text-gray-700 grid grid-flow-row gap-2">
                    <MiddleBuble />
                  </div>
                  <p className="p-4 text-center text-sm text-gray-500">
                    12:40 PM
                  </p>
                  <div className="flex flex-row justify-end">
                    <div className="messages text-sm text-white grid grid-flow-row gap-2">
                      <MiddleBubbleRight />
                      <MiddleBubbleRight />
                      <MiddleBubbleRight />
                      <MiddleBubbleRight />
                      <MiddleBubbleRight />
                      <MiddleBubbleRight />
                    </div>
                  </div>
                </div>
                <div className="chat-footer flex-none">
                  <div className="flex flex-row items-center p-4">
                    <button
                      type="button"
                      className="flex flex-shrink-0 focus:outline-none mx-2 block text-green-600 hover:text-green-700 w-6 h-6 "
                    >
                      <CiCirclePlus className="w-full h-full" />
                    </button>
                    <button
                      type="button"
                      className="flex flex-shrink-0 focus:outline-none mx-2 block text-green-600 hover:text-green-700 w-6 h-6"
                    >
                      <MdOutlineAddPhotoAlternate className="w-full h-full" />
                    </button>
                    <button
                      type="button"
                      className="flex flex-shrink-0 focus:outline-none mx-2 block text-green-600 hover:text-green-700 w-6 h-6"
                    >
                      <IoCameraOutline className="w-full h-full" />
                    </button>
                    <button
                      type="button"
                      className="flex flex-shrink-0 focus:outline-none mx-2 block text-green-600 hover:text-green-700 w-6 h-6"
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
                          className="absolute top-0 right-0 mt-2 mr-3 flex flex-shrink-0 focus:outline-none block text-green-600 hover:text-green-700 w-6 h-6"
                        >
                        <IoSendOutline className="w-full h-full" />
                        </button>
                      </label>
                    </div>
                  </div>
                </div>
              </section>
            </main>
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
