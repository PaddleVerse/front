'use client'
import React, { ReactNode, use, useEffect, useState } from "react";
import ChatLayout from "./npn";

const RootLayout = (props: any) => {
  // const [showMessage, setShowMessage] = useState(false);
  // props.params.newProp = "***************************************************************************************************************************************************************";

  return (
    <>
      <ChatLayout>
        {props.children}
      </ChatLayout>
    </>
  );
};

export default RootLayout;
