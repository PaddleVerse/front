import Image from "next/image";
import React from "react";

const ChatCard = () => {
  return (
    <div className="flex justify-between items-center lg:p-3 p-1 hover:bg-gray-800 rounded-lg relative ">
      <div className="sm:w-12 sm:h-12 h-16 w-16 relative flex flex-shrink-0">
        <Image
          width={100}
          height={100}
          className="shadow-md rounded-full w-full h-full object-cover"
          src="https://randomuser.me/api/portraits/women/87.jpg"
          alt="User2"
        />
        <div className="absolute bg-gray-900 p-1 rounded-full bottom-0 right-0">
          <div className="bg-green-500 rounded-full w-2 h-2"></div>
        </div>
      </div>
      <div className="flex-auto min-w-0 ml-4 mr-6 hidden md:block group-hover:block">
        <p>Sunny Leone</p>
        <div className="flex items-center text-sm text-gray-600">
          <div className="min-w-0">
            <p className="truncate">Ah, it was an awesome one night stand.</p>
          </div>
        </div>
      </div>
          <p className="ml-2 whitespace-no-wrap text-gray-600 text-sm sm:relative hidden">1 Feb</p>
      
    </div>
  );
};

export default ChatCard;
