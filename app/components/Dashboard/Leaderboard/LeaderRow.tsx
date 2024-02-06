import Image from "next/image";
import React from "react";
import FormElement from "./FormElement";

interface Props {
  user : any
  index : number
}

const image =
  "https://preview.redd.it/dwhdw8qeoyn91.png?width=640&crop=smart&auto=webp&s=65176fb065cf249155e065b4ab7041f708af29e4";
const LeaderRow = ({user, index}: Props) => {
  return (
    <tr className=" bg-leaderboarddiv text-white sm:text-[12px] text-[10px]">
      <td scope="row" className=" sm:py-[7px] font-medium text-center">
        {index + 1}
      </td>
      <td className="sm:py-[7px] text-[13px] flex items-center gap-2 font-[500] text-center">
        <img
          src={user.picture}
          alt="image"
          className="w-6 rounded-full md:w-7 sm:mt-0 mt-[8px]"
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
