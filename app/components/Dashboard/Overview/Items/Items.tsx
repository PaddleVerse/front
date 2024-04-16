import React from "react";
import Image from "next/image";
import { Rajdhani } from "next/font/google";

const rajdhani = Rajdhani({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});
const Items = () => {
  return (
    <div
      className="lg:w-[50%] w-full h-full bg-[#101823] rounded-md overflow-y-auto"
      // style={{
      //   backdropFilter: "blur(20px)",
      //   backgroundColor: "rgba(13, 9, 10, 0.7)",
      // }}
    >
      <div className="bg-[#101823] sticky top-0 z-10">
        <div className="flex items-center text-white  p-4 pb-2 ">
          <Image src="/itemsMenu.svg" width={40} height={40} alt={"image"} />
          <h1 className={`${rajdhani.className} text-[20px]`}>Items</h1>
        </div>
      </div>
      <div className="grid p-4 2xl:grid-cols-10  md:grid-cols-7 lg:grid-cols-5 grid-cols-4 mt-2">
        {Array.from({ length: 40 }, (_, index) => (
            <Image
              src="/badge2_c.png"
              width={0}
              height={0}
              alt={"image"}
              key={index}
              sizes="100vh 100vw"
              // style={{ width: "70px", height: "70px" }}
              className="w-[70px] h-[70px]"
            />
        ))}
      </div>
    </div>
  );
};

export default Items;
