import React from "react";

const ChatCard = () => {
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

export default ChatCard;
