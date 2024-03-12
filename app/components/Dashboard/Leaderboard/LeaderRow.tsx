"use client";
import React from "react";
import FormElement from "./FormElement";
import { useGlobalState } from "../../Sign/GlobalState";
import { useRouter } from "next/navigation";
import Image from "next/image";
interface Props {
  user: any;
}

const LeaderRow = ({ user }: Props) => {
  const router = useRouter();
  const { state } = useGlobalState();
  const User: any = state.user;

  const handleClick = () => {
    router.push(`/Dashboard/Profile?id=${user.id}`);
  };
  return (
    <tr
      className={`${
        User.id == user.id ? "bg-[#743737]" : "bg-[#4e2525]"
      } text-white sm:text-[12px] text-[10px] cursor-pointer`}
      onClick={handleClick}
    >
      <td scope="row" className=" sm:py-[7px] font-medium text-[14px]">
        {user.id === 1 ? (
          <div className="flex items-center justify-center">
            <Image
              width={28}
              height={28}
              src="/1_leaderboard.svg"
              alt="image"
            />
          </div>
        ) : user.id === 2 ? (
          <div className="flex items-center justify-center">
            <Image
              width={28}
              height={28}
              src="/2_leaderboard.svg"
              alt="image"
            />
          </div>
        ) : user.id === 3 ? (
          <div className="flex items-center justify-center">
          <Image
            width={28}
            height={28}
            src='/3_leaderboard.svg'
            alt="image"
            
            />
        </div>
        ) : (
          <span className="flex items-center justify-center text-[17px] font-semibold">{user.id}</span>
          
        )}
      </td>
      <td className="sm:py-[7px] text-[13px] flex items-center gap-2 font-[500] text-center">
        <Image
          width={100}
          height={100}
          src={user.picture}
          alt="image"
          className="w-6 h-7 rounded-full object-cover md:w-7 sm:mt-0 mt-[8px]"
        />
        <span className=" lg:hidden xl:inline sm:inline hidden text-[14px]">
          {user.name}
        </span>
      </td>
      <td className=" sm:py-[7px] pl-2 text-[14px]">67pts</td>
      <td className=" sm:py-[7px] pl-2 text-[#15E5B4] text-[14px]">3</td>
      <td className=" sm:py-[7px] pl-2 text-[14px]">5</td>
      <td className="  sm:py-[7px] pl-4 text-[14px]">2.2</td>
      {/* <td className=" pr-[10px]">
        <div className="flex justify-between">
          {Array.from({ length: 10 }, (_, index) => (
            <FormElement key={index} />
          ))}
        </div>
      </td> */}
    </tr>
  );
};

export default LeaderRow;
