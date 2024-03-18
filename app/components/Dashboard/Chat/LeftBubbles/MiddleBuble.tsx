import React from "react";
import { getTime } from "@/app/utils";
import Image from "next/image";

const MiddleBuble = (props: any) => {
  return (
    <div className="flex items-center group">
      <div className="w-8 h-8 relative flex flex-shrink-0 mr-4">
        {props.showProfilePic && (
          <Image
            className="shadow-md rounded-full w-full h-full object-cover"
            src={props.picture}
            alt=""
          />
        )}
      </div>
      <div className="px-4 rounded-2xl bg-white max-w-xs lg:max-w-md text-black">
        <p className="text-[14px] mt-2">
          {props.message.content}
        </p>
        <p className="text-[10px] text-gray-500 mb-[2px]">
          {getTime(props.message.createdAt)}
        </p>
      </div>
    </div>
  );
};

export default MiddleBuble;
