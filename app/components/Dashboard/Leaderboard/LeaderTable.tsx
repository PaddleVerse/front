"use client";
import React, { useState, useEffect, use } from "react";
import { Inter, Nerko_One } from "next/font/google";
import StandingRow from "./LeaderRow";
import axios from "axios";
import { useGlobalState } from "../../Sign/GlobalState";
import { cn } from "@/components/cn";
import LeaderRow from "./LeaderRow";
import { ipAdress } from "@/app/utils";

const inter = Inter({
  subsets: ["latin"],
  weight: ["100", "300", "400", "500", "700"],
});
const LeaderTable = () => {
  const [allusers, setAllUsers] = useState([]);
  const [users, setUsers] = useState([]);
  const { state } = useGlobalState();
  const user: any = state.user;
  useEffect(() => {
    if (user) {
      axios.get(`http://${ipAdress}:8080/user/range/${user.id}`).then((res) => {
        setUsers(res.data);
      });
    }
  }, [user]);
  useEffect(() => {
    axios.get(`http://${ipAdress}:8080/user`).then((res) => {
      const allUsers = res.data;
      allUsers.sort((a: any, b: any) => b.xp - a.xp);
      const currentUserIndex = allUsers.findIndex(
        //@ts-ignore
        (user) => user.id === state.user?.id
      );
      const start = Math.max(0, currentUserIndex - 5);
      const end = Math.min(allUsers.length - 1, currentUserIndex + 5);
      const nearbyUsers = allUsers.slice(start, end + 1);

      setAllUsers(nearbyUsers);
      console.log(nearbyUsers);
      setAllUsers(res.data);
    });
  }, []);

  return (
    <div className="">
      <div className="relative ">
        <table
          className={cn(
            `w-full rounded-lg text-left text-white font-light`,
            inter.className
          )}
        >
          <thead className="bg-[#462121] text-xs sm:text-sm text-white">
            <tr>
              <th
                scope="col"
                className="p-[5px] rounded-l-[8px]  sm:w-[7%] w-[7%] text-center"
              >
                Rank
              </th>
              <th scope="col" className="p-[5px] w-auto  ">
                Player
              </th>
              <th scope="col" className="p-[5px]  sm:w-[5%] sm:pl-[17px] pl-4">
                PL
              </th>
              <th
                scope="col"
                className="p-[5px]  text-[#15E5B4] sm:w-[5%] sm:pl-[7px] pl-[5px] "
              >
                W
              </th>
              <th
                scope="col"
                className="p-[5px]  sm:w-[5%] sm:pl-[7px] pl-[7px]"
              >
                L
              </th>
              <th
                scope="col"
                className="p-[5px]  sm:w-[5%] sm:pl-[17px] pl-[14px] rounded-r-[8px]"
              >
                W/L
              </th>
            </tr>
          </thead>
          <tbody className="">
            {users &&
              users.map((user: any, index: number) => {
                return <LeaderRow key={index} user={user} index={index} />;
              })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LeaderTable;
