import React, { ReactNode } from "react";
import ChatLayout from "./npn";

const page = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <ChatLayout >
        {children}
      </ChatLayout>
    </>
  );
};

export default page;
