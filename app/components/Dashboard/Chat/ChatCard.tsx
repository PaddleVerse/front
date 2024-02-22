import { useEffect, useRef, useState } from "react";
import FriendsList from "./FriendsList";
import GroupList from "./GroupList";
import MessageCard from "./MessageCard";
import axios from "axios";

export const ChatCard = (props: any) => {
  return (
    <div className="flex justify-between items-center lg:p-3 p-1 hover:bg-gray-800 rounded-lg relative ">
      <div className="w-16 h-16 relative flex flex-shrink-0">
        <img
          className="shadow-md rounded-full w-full h-full object-cover"
          src={
            props.value.picture ||
            "https://randomuser.me/api/portraits/women/87.jpg"
          }
          alt="User2"
        />
        <div className="absolute bg-gray-900 p-1 rounded-full bottom-0 right-0">
          <div className="bg-green-500 rounded-full w-3 h-3"></div>
        </div>
      </div>
      <div className="flex-auto min-w-0 ml-4 mr-6 hidden md:block group-hover:block">
        <p>{props.value.name}</p>
        <div className="flex items-center text-sm text-gray-600">
          <div className="min-w-0">
            <p className="truncate">Ah, it was an awesome one night stand.</p>
          </div>
          <p className="ml-2 whitespace-no-wrap">1 Feb</p>
        </div>
      </div>
    </div>
  );
};

export const ChatHolder = (props: any) => {
  return (
    <section className="flex flex-col flex-none overflow-auto w-24 group lg:max-w-sm md:w-2/5 border-white border-2">
      <div className="header p-4 flex flex-row  items-center flex-none  justify-center">
        <div
          className="w-16 h-16 relative flex flex-shrink-0"
          style={{ filter: "invert(100%)" }}
        ></div>
        <p className="text-md font-bold hidden md:block group-hover:block">
          Messenger
        </p>
      </div>
      <div className=" p-4 flex-none">
        <form
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          <div className="relative">
            <label>
              <input
                className="rounded-full py-2 pr-6 pl-10 w-full border border-gray-800 focus:border-gray-700 bg-gray-800 focus:bg-gray-900 focus:outline-none text-gray-200 focus:shadow-md transition duration-300 ease-in"
                type="text"
                placeholder="Search Messenger"
              />
              <span className="absolute top-0 left-0 mt-2 ml-3 inline-block">
                <svg viewBox="0 0 24 24" className="w-6 h-6">
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

      <div className="contacts p-2 flex-1 overflow-y-scroll">
        {Array.isArray(props.chatList) &&
          props.chatList.map((value: any, key: any) => (
            <ChatCard key={key} value={value}></ChatCard>
          ))}
      </div>
    </section>
  );
};

export default ChatCard;
