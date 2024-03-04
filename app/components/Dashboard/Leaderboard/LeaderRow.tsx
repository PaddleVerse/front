'use client';
import React from "react";
import FormElement from "./FormElement";
import { useGlobalState } from "../../Sign/GlobalState";
import { useRouter } from "next/navigation";
interface Props {
  user : any
}

const LeaderRow = ({user}: Props) => {
  const router = useRouter();
  const {state} = useGlobalState();
  const User : any= state.user;

  const handleClick = () => {
    router.push(`/Dashboard/Profile?id=${user.id}`);
  }
  return (
    <tr className={`${User.id == user.id ? "bg-red-500/[0.18]" : "bg-leaderboarddiv"} text-white sm:text-[12px] text-[10px] cursor-pointer`} onClick={handleClick}>
      <td scope="row" className=" sm:py-[7px] font-medium text-center">
        {user.id}
      </td>
      <td className="sm:py-[7px] text-[13px] flex items-center gap-2 font-[500] text-center">
        <img
          src={user.picture}
          alt="image"
          className="w-6 h-7 rounded-full object-cover md:w-7 sm:mt-0 mt-[8px]"
        />
        <span className=" lg:hidden xl:inline sm:inline hidden">
          { user.name }
        </span>
      </td>
      <td className=" sm:py-[7px] pl-2 text-[12px]">67pts</td>
      <td className=" sm:py-[7px] pl-2 text-[12px]">3</td>
      <td className=" sm:py-[7px] pl-2 text-[12px]">5</td>
      <td className="  sm:py-[7px] pl-4 text-[12px]">2.2</td>
      <td className=" pr-[10px]">
        <div className="flex justify-between">
          {Array.from({ length: 10 }, (_, index) => (
            <FormElement key={index} />
          ))}
        </div>
      </td>
    </tr>
  );
};

export default LeaderRow;
