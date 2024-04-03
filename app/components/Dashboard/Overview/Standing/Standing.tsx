import React from "react";
import Image from "next/image";
import { Rajdhani } from "next/font/google";
import StandingTable from "./StandingTable";

const rajdhani = Rajdhani({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});
const Standing = () => {
  return (
    <div
      className="w-full bg-primaryColor  flex flex-col gap-2 p-2 rounded-md"
      // style={{
      //   backdropFilter: "blur(20px)",
      //   backgroundColor: "rgba(13, 9, 10, 0.7)",
      // }}
    >
      <div className="flex text-white sm:gap-0 gap-1">
        <Image src="/standing.svg" width={40} height={40} alt={"standing"} />
        <h1
          className={`${rajdhani.className} lg:text-xl text-[20px] font-[500] text-lg self-end`}
        >
          STANDING
        </h1>
      </div>
      <StandingTable />
    </div>
  );
};

export default Standing;
