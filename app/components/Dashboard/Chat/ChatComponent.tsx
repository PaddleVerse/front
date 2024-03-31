import { message } from "@/app/Dashboard/Chat/type";
import React, { useEffect, useRef, useState } from "react";
import MiddleBubbleRight from "./RightBubbles/MiddleBubbleRight";
import MiddleBuble from "./LeftBubbles/MiddleBuble";
import { useGlobalState } from "../../Sign/GlobalState";
import { useParams } from "next/navigation";
import toast from "react-hot-toast";
import axios from "axios";

const ChatComponent = ({
  handlers,
  us,
  channel,
  globalStateUserId,
}: {
  handlers: any;
  us: boolean;
  channel: boolean;
  globalStateUserId: number;
}) => {
  const [messages, setMessages] = useState<message[]>([]);
  const p = useParams();
  const { state, dispatch } = useGlobalState();
  const { socket, user } = state;
  const containerRef = useRef(null);

  useEffect(() => {
    if (user) {
      const fetchDataChannel = async () => {
        try {
          const mes = await axios.get(
            `http://localhost:8080/channels/messages/${p?.id!}?uid=${user?.id!}`
          );
          setMessages(mes.data);
        } catch (error) {
          toast.error("failed to fetch messages");
        }
      };
      const fetchDataDM = async () => {
        try {
          const mes = await axios.get(
            `http://localhost:8080/conversations/messages?uid1=${p?.id!}&uid2=${user?.id!}`
          );
          setMessages(mes.data);
        } catch (error) {
          toast.error("failed to fetch messages");
        }
      };
      if (channel) {
        fetchDataChannel();
      } else {
        fetchDataDM();
      }
    }
  }, []);

  useEffect(() => {
    socket.on("update", (data: any) => {
      if (channel) {
        const fetchDataChannel = async () => {
          try {
            const mes = await axios.get(
              `http://localhost:8080/channels/messages/${p?.id!}?uid=${user?.id!}`
            );
            setMessages(mes.data);
          } catch (error) {
            toast.error("failed to fetch messages");
          }
        };
        fetchDataChannel();
      }
      else if (us) {
        const fetchDataDM = async () => {
          try {
            const mes = await axios.get(
              `http://localhost:8080/conversations/messages?uid1=${p?.id!}&uid2=${user?.id!}`
            );
            setMessages(mes.data);
          } catch (error) {
            toast.error("failed to fetch messages");
          }
        };
        fetchDataDM();
      }
    })
  }, [socket]);

  useEffect(() => {
    const container: any = containerRef.current;
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
    console.log("container", container);
  }, [messages])


  console.log("container ref",containerRef);

  if (messages.length === 0) {
    return (
      <div
        className="w-full h-full overflow-y-scroll no-scrollbar"
        {...handlers}
      >
        <div className="flex flex-row justify-start overflow-y-auto">
          <div className="text-sm text-gray-700 grid grid-flow-row gap-2 w-full">
            <p className="text-center text-gray-500">No messages yet</p>
          </div>
        </div>
      </div>
    );
  }


  return (
    <div
      className="w-full h-full overflow-y-scroll no-scrollbar"
      {...handlers}
      ref={containerRef}
    >
      <div className="flex flex-row justify-start overflow-y-auto">
        <div className="text-sm text-gray-700 grid grid-flow-row gap-2 w-full">
          {messages.map((value, key: any) => {
            if (value.sender_id === globalStateUserId) {
              return <MiddleBubbleRight message={value} key={key} />;
            } else {
              return (
                <MiddleBuble
                  message={value}
                  key={key}
                  showProfilePic={
                    (!messages[key + 1] ||
                      messages[key + 1].sender_id !== value.sender_id) &&
                    value &&
                    value.sender_picture
                  }
                  picture={messages[key].sender_picture}
                />
              );
            }
          })}
        </div>
      </div>
      <p className="p-4 text-center text-sm text-gray-500">
        {messages[messages.length - 1].createdAt.toString().substring(0, 10) +
          " at " +
          messages[messages.length - 1].createdAt.toString().substring(11, 16)}
      </p>
    </div>
  );
};

export default ChatComponent;
