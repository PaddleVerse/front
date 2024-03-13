'use client';
import React,{useState,useEffect, use} from "react";
import { Inter } from "next/font/google";
import StandingRow from "./LeaderRow";
import axios from "axios";
import { useGlobalState } from "../../Sign/GlobalState";

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
          className={`${inter.className}  w-full rounded-lg  text-left text-white font-light`}
          // rules="none" 
        >
          <thead className="bg-[#202B43] text-xs sm:text-sm text-white">
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
              {/* <th scope="col" className="p-[5px] font-[300] xl:w-[31%] rounded-r-lg lg:w-[50%] md:w-[30%] w-[40%]">
                Form
              </th> */}
            </tr>
          </thead>
          <tbody className="">
              { users && users.map((user : any , index : number) =>
                {
                  return <StandingRow key={index} user={user} index={index} />
                }
              )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LeaderTable;
