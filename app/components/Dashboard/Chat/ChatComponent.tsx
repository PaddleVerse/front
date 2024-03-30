import { message } from '@/app/Dashboard/Chat/type';
import React, { useEffect } from 'react'
import MiddleBubbleRight from './RightBubbles/MiddleBubbleRight';
import MiddleBuble from './LeftBubbles/MiddleBuble';

const ChatComponent = ({
  handlers,
  messages,
  globalStateUserId,
}: {
		handlers: any;
		messages: message[];
		globalStateUserId: number;
  }) => {
  console.log("hello from chat component")

  return (
    <div className="w-full h-full" {...handlers}>
      <div className="flex flex-row justify-start overflow-y-auto">
        <div className="text-sm text-gray-700 grid grid-flow-row gap-2 w-full">
          {messages &&
            messages.map((value, key: any) => {
              // console.log(value, key)
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
        {messages && messages.length > 0
          ? messages[messages.length - 1].createdAt
              .toString()
              .substring(0, 10) +
            " at " +
            messages[messages.length - 1].createdAt.toString().substring(11, 16)
          : "No messages yet"}
      </p>
    </div>
  );
};

export default ChatComponent