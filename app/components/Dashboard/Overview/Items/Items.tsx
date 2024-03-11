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
      className="w-[50%] h-full bg-transparent rounded-md overflow-y-auto"
      style={{
        backdropFilter: "blur(20px)",
        backgroundColor: "rgba(13, 9, 10, 0.7)",
      }}
    >
      <div className="bg-dashBack sticky top-0 z-10">
        <div className="flex items-center text-white  p-4 pb-2 ">
          <Image src="/itemsMenu.svg" width={40} height={40} alt={"image"} />
          <h1 className={`${rajdhani.className} text-[20px]`}>Items</h1>
        </div>
      </div>
      <div className="grid p-4 2xl:grid-cols-10 xl:grid-cols-5 mt-2">
        {Array.from({ length: 40 }, (_, index) => (
          <Image
            src="/badge2_c.png"
            width={70}
            height={70}
            alt={"image"}
            key={index}
          />
        ))}
      </div>
    </div>
  );
};

export default Items;
