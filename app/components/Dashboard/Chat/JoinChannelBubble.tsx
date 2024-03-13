import { channel, user } from "@/app/Dashboard/Chat/type";
import axios from "axios";
import React, { useState } from "react";
import { GoLock } from "react-icons/go";

interface TooltipProps {
  content: string;
  children: React.ReactNode;
  // Add more props as needed for customization
}

// const Tooltip: React.FC<TooltipProps> = ({ content, children }) => {
//   return (
//     <div className="tooltip-container" title={content}>
//       {children}
//     </div>
//   );
// };

const JoinChannelBubble = ({
  lock,
  channel,
  user,
  socket
}: {
  lock: boolean;
  channel: channel;
    user: user;
    socket: any;
}) => {
  const [hover, setHover] = useState(false);


  const handleClick = async () => {
    const participantObject = {

    };
    const res = await axios.post("http://localhost:8080/participants", participantObject);
    
    if (res.status === 200) {
      // socket.emit("joinRoom", { room: channel.name, user: user })
      console.log("Channel joined");
    }
  }

  return (
    <div className="flex ga-2 items-center col-start text-inherit relative" onClick={(e)=> console.log('clicked to join', channel.state)}>
      <img
        src="/badge1.png"
        alt="image"
        className="lg:w-[95px] lg:h-[95px] md:w-[80px] md:h-[80px]"
      />
      <div
        className="flex flex-col gap-1"
        onMouseEnter={(e) => setHover(true)}
        onMouseLeave={(e) => setHover(false)}
        title={channel.topic}
      >
        <h2 className="2xl:text-md xl:text-[15px] md:text-[14px]">
          {channel.name}
        </h2>
        {/* <Tooltip content={channel.topic}> */}
          <p className="text-gray-400 xl:text-sm truncate md:text-xs lg:max-w-full md:max-w-[120px]">
            {channel.topic.substring(0, 30) +
              (channel.topic.length > 30 && " ...")}
          </p>
        {/* </Tooltip> */}
      </div>
      {lock && (
        <GoLock className="absolute top-6 2xl:right-[91px] xl:right-[41px] lg:right-[35px] text-white hidden md:text-[14px] 2xl:text-[16px] lg:flex" />
      )}
    </div>
  );
};

export default JoinChannelBubble;
