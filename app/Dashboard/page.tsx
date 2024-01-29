'use client';
import Content from "../components/Dashboard/Overview/Content";
import Sidebar from "../components/Dashboard/Sidebar/Sidebar";
import {GlobalStateProvider} from "../components/Sign/GlobalState";
import React from "react";

const page = () => {
  return (
    <div className="h-full w-full flex flex-1 overflow-y-auto no-scrollbar">
      <div className="flex w-full h-full ">
        <GlobalStateProvider>
          <Content />
        </GlobalStateProvider>
      </div>
    </div>
  );
};

export default page;
