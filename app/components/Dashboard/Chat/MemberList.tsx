import React from "react";
import Image from "next/image";
const MemberList = () => {
  return (
    <div className="text-white w-[70%]  flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Image src={"/badge1.png"} width={40} height={40} alt="image" />
        <div className="flex flex-col 2xl:text-md text-xs">
          <span>abdelmottalib</span>
          <span className="2xl:text-md text-[10px]">@konami</span>
        </div>
      </div>
      <span>role</span>
      <div className="flex gap-1 2xl:text-md text-xs">
        <div>ko</div>
        <div>ko</div>
        <div>ko</div>
        <div>ko</div>
      </div>
    </div>
  );
};

export default MemberList;
