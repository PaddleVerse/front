import React from "react";
import { GoLock } from "react-icons/go";

const JoinChannelBubble = ({ lock, handleClick }: { lock: boolean, handleClick:()=>void }) => {
  const [unlock, setUnlock] = React.useState(false);
  return (
    <div className="flex ga-2 items-center col-start text-inherit relative border">
      <img
        src="/badge1.png"
        alt="image"
        className="lg:w-[95px] lg:h-[95px] md:w-[80px] md:h-[80px]"
      />
      <div className="flex flex-col gap-1">
        <h2 className="2xl:text-md xl:text-[15px] md:text-[14px]">
          JOIN US NOW
        </h2>
        {unlock ? (
          <input
            type="text"
            className="left-0 top-[45px] rounded-md lp-2 w-[180px] bg-dashBack h-10 text-white "
          />
        ) : (
          <p className="text-gray-400 xl:text-sm truncate md:tex  t-xs lg:max-w-full md:max-w-[120px]">
            a fun interactive group of people
          </p>
        )}
      </div>
      {lock && (
        <div onClick={() => setUnlock(!unlock)}>
          <GoLock className="absolute top-6 2xl:right-[91px] xl:right-[41px] lg:right-[35px] text-white hidden md:text-[14px] 2xl:text-[16px] lg:flex" />
        </div>
      )}
      {/* {unlock &&<input type="text"  className="absolute left-0 top-[45px] rounded-md lp-2 w-[150px] h-10 text-black"/>} */}
    </div>
  );
};

export default JoinChannelBubble;
