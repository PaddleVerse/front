import React from "react";
import { rajdhani } from "@/app/utils/fontConfig";
import Image from "next/image";
import { cn } from "@/components/cn";

const Items = () => {
  return (
    <div className="lg:w-[50%] w-full h-full bg-primaryColor rounded-md overflow-y-auto no-scrollbar">
      <div className="bg-primaryColor sticky top-0 z-10">
        <div className="flex items-center text-white  p-4 pb-2 ">
          <Image src="/itemsMenu.svg" width={40} height={40} alt={"image"} />
          <h1 className={cn("font-[500] text-[20px]", rajdhani.className)}>
            Items
          </h1>
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
            className="w-[70px] h-[70px]"
          />
        ))}
      </div>
    </div>
  );
};

export default Items;
