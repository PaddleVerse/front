import { useEffect, useRef, useState } from "react";
import FriendsList from "./FriendsList";
import GroupList from "./GroupList";
import MessageCard from "./MessageCard";
import axios from "axios";

export const ChatCard = () => {
  return (
    <div className="flex justify-between items-center lg:p-3 p-1 hover:bg-gray-800 rounded-lg relative ">
      <div className="w-16 h-16 relative flex flex-shrink-0">
        <img
          className="shadow-md rounded-full w-full h-full object-cover"
          src="https://randomuser.me/api/portraits/women/87.jpg"
          alt="User2"
        />
        <div className="absolute bg-gray-900 p-1 rounded-full bottom-0 right-0">
          <div className="bg-green-500 rounded-full w-3 h-3"></div>
        </div>
      </div>
      <div className="flex-auto min-w-0 ml-4 mr-6 hidden md:block group-hover:block">
        <p>Sunny Leone</p>
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

export const ChatHolder = () => {
  const [groupOrFriend, setGroupOrFriend] = useState<boolean>(true);
  const [friends, setFriends] = useState(null);
  // here i fetch the data to put in the friends list to later display
  // useEffect(() => {
  //   axios.get(`http://localhost:8080/friendship/`).then((data) => {
  //     console.log("got data");
  //     console.log("the data", data.data);
  //     setFriends(data.data);
  //   }).catch((error) => {
  //     console.error("got error");
  //     console.log(error);
  //   });
  // }, []);
  return (
    <>
      <div
        id="friends-groups-list"
        className="border-white border-2 h-full w-full lg:w-[20%] lg:pt-5 lg:pl-5"
      >
        <h1 className="text-3xl font-semibold">messages</h1>
        <div>
          <input type="text" placeholder="search" />
        </div>
        <div className="h-[5%] lg:w-[]">
          <button className="bg-black" onClick={()=>setGroupOrFriend(true)}>
            Friends
          </button>
          <button className="bg-black" onClick={()=>setGroupOrFriend(false)}>
            Groups
          </button>
        </div>
        {/* in here i should write a compomponent that is going to be responsible for rendering the user groups and his friends */}
        {groupOrFriend ? <FriendsList friendsList={friends} /> : <GroupList />}
      </div>
      <MessageCard />
    </>
  );
};

export default ChatCard;
