import React from "react";
import { getTime } from "@/app/utils";

const MiddleBubbleRight = (props: any) => {
  return (
    <div className="flex items-center group justify-end">
      <div className="px-4 rounded-2xl bg-white max-w-xs lg:max-w-md text-black">
        <p className="text-[14px] mt-2">
          {props.message.content}
        </p>
        <p className="text-[10px] text-gray-500 text-end mb-[2px]">
          {getTime(props.message.createdAt)}
        </p>
      </div>
    </div>
  );
};

export default MiddleBubbleRight;
