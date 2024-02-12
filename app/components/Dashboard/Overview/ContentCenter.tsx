'use client';
import React from "react";
import UserProfile from "./UserProfile/UserProfile";
import MatchHistory from "./MatchHistory/MatchHistory";
import Standing from "./Standing/Standing";
import Graph from "./Graph/Graph";
import UserProfileSecond from "./UserProfileSecond/UserProfileSecond";
import Achievements from "./Achievements/Achievements";
import Items from "./Items/Items";
import { useGlobalState } from "../../Sign/GlobalState";


const ContentCenter = () => {
  const { state } = useGlobalState();
  const user : any = state.user;

  return (
    <div className="w-[100%] mt-[50px] flex flex-col gap-10 items-center">
      <div className="xl:flex-row w-[94%] flex flex-col gap-7">
        <div className="flex flex-col w-full gap-8">
          {user &&  <UserProfileSecond user={user}/>}
          <div className="flex gap-4">
            <MatchHistory />
            <div className=" flex-col h-700px  flex-1 xl:flex hidden gap-4">
              <div className="w-full h-[49%]  border-red-500">
                <Items/>
              </div>
              <div className="w-full h-[49%] border border-green-500"></div>

            </div>
          </div>
        </div>
        <div className="flex flex-col xl:w-[20%] gap-7">
          <Achievements />
          <Standing />
          {/* <Graph /> */}
        </div>
      </div>
    </div>
  );
};

export default ContentCenter;
