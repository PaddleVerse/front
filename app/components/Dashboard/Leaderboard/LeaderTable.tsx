'use client';
import React,{useState,useEffect, use} from "react";
import { Inter } from "next/font/google";
import StandingRow from "./LeaderRow";
import axios from "axios";

const inter = Inter({
  subsets: ["latin"],
  weight: ["100", "300", "400", "500", "700"],
});
const LeaderTable = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:8080/user").then((res) => {
      setUsers(res.data);
    });
  } , []);
  return (
    <div className="">
      <div className="relative  space-y-4">
        <table
          className={`${inter.className}  w-full  text-left text-white font-light border-separate border-spacing-y-2`}
        >
          <thead className="text-xs sm:text-sm text-gray-400  bg-dashBack ">
            <tr>
              <th scope="col" className="font-[300] sm:w-[3%] w-[7%] text-center">
                #
              </th>
              <th scope="col" className=" font-[300]">
                User
              </th>
              <th scope="col" className="font-[300] sm:w-[12%] sm:pl-[17px] pl-4">
                PL
              </th>
              <th scope="col" className="font-[300] sm:w-[7%] sm:pl-[7px] pl-[5px] ">
                W
              </th>
              <th scope="col" className="font-[300] sm:w-[7%] sm:pl-[7px] pl-[7px]">
                L
              </th>
              <th scope="col" className="font-[300] sm:w-[7%] sm:pl-[17px] pl-[14px]">
                W/L
              </th>
              <th scope="col" className="font-[300] xl:w-[31%] lg:w-[50%] md:w-[30%] w-[40%]">
                Form
              </th>
            </tr>
          </thead>
          <tbody className="">
              {users.map((user, index) => (
                <StandingRow index={index} user={user} key={index} />
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LeaderTable;
