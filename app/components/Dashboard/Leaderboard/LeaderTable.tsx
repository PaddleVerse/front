'use client';
import React,{useState,useEffect, use} from "react";
import { Inter } from "next/font/google";
import StandingRow from "./LeaderRow";
import axios from "axios";
import { useGlobalState } from "../../Sign/GlobalState";
import { cn } from "@/components/cn";
import LeaderRow from "./LeaderRow";

const inter = Inter({
  subsets: ["latin"],
  weight: ["100", "300", "400", "500", "700"],
});
const LeaderTable = () => {
  const [users, setUsers] = useState([]);
  const {state} = useGlobalState();
  const user : any= state.user;
  useEffect(() => {
    if (user) {
      axios.get(`http://localhost:8080/user/range/${user.id}`).then((res) => {
        setUsers(res.data);
      })
    }
  } , [user]);

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
              <th scope="col" className="p-[5px] rounded-l-[8px]  sm:w-[7%] w-[7%] text-center">
                Rank
              </th>
              <th scope="col" className="p-[5px] w-auto  ">
                Player
              </th>
              <th scope="col" className="p-[5px]  sm:w-[5%] sm:pl-[17px] pl-4">
                PL
              </th>
              <th scope="col" className="p-[5px]  text-[#15E5B4] sm:w-[5%] sm:pl-[7px] pl-[5px] ">
                W
              </th>
              <th scope="col" className="p-[5px]  sm:w-[5%] sm:pl-[7px] pl-[7px]">
                L
              </th>
              <th scope="col" className="p-[5px]  sm:w-[5%] sm:pl-[17px] pl-[14px] rounded-r-[8px]">
                W/L
              </th>
            </tr>
          </thead>
          <tbody className="">
              { users && users.map((user : any , index : number) =>
                {
                  return <LeaderRow key={index} user={user} index={index} />
                }
              )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LeaderTable;
