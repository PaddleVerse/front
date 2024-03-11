import React from "react";
import Image from "next/image";
import Coin from "../Stuff/Coin";

const SmallCard = () => {
  return (
    <div className="w-full h-[365px]  relative text-white cursor-pointer rounded-lg">
      <Image
        src="/smallShop.png"
        fill
        alt="image"
        className="object-cover rounded-lg"
      />
      <div className="absolute bottom-2 right-2 ">
        <Coin size={"small"} />
      </div>
    </div>
  );
};

export default SmallCard;
