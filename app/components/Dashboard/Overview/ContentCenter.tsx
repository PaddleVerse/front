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
        <div className="flex flex-col w-full gap-8 pb-[150px]">
          {user &&  <UserProfileSecond user={user}/>}
            <MatchHistory />
            <div className="w-full h-[450px] flex  border-red-500">
              <Items/>
              <div className="w-[50%] border flex text-white text-4xl"> GRAPH</div>
            </div>
          </div>
        <div className="flex flex-col xl:w-[20%] gap-7">
          <Achievements />
          <Standing />
        </div>
      </div>
    </div>
  );
};

export default ContentCenter;
