import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { inter } from "@/app/utils/fontConfig";
import { cn } from "@/components/cn";

const Coin = ({ size }: { size: string }) => {
  const [hover, setHover] = React.useState(false);
  const [owned, setOwned] = React.useState(false);
  const [equipped, setEquipped] = React.useState(false);

  const handleClick = () => {
    if (owned && equipped) {
      setEquipped(false);
    } else if (owned) {
      setEquipped(true);
    } else {
      setOwned(true);
    }
  };

  return (
    <motion.div
      className={cn(
        "rounded-md bg-shopButton relative cursor-pointer",
        inter.className,
        size === "small" && !owned ? "w-[88px] h-[40px]" : "w-[120px] h-[50px]"
      )}
      onMouseOver={() => setHover(true)}
      onMouseOut={() => setHover(false)}
      onClick={handleClick}
    >
      <AnimatePresence>
        <motion.span
          className={cn(
            "text-[20px] absolute",
            size === "big" || owned ? "left-8 top-[9px]" : "left-5 top-[5px]"
          )}
          key={owned ? "owned" : "not-owned"}
          initial={{ opacity: 1, x: 0 }}
          animate={{
            opacity: hover ? 0 : 1,
            x: hover ? 2 : owned && !equipped ? -12 : equipped ? -20 : 0,
          }}
          exit={{ opacity: 0 }}
        >
          {owned ? (equipped ? "EQUIPPED" : "OWNED") : "512"}
        </motion.span>
        <motion.span
          className={cn(
            "text-[20px] absolute",
            size === "big" || owned ? "left-8 top-[9px]" : "left-5 top-[5px]"
          )}
          key={equipped ? "equipped" : "not-equipped"}
          initial={{ opacity: 0, x: -10 }}
          animate={{
            opacity: hover ? 1 : 0,
            x: hover ? (owned && !equipped ? 0 : equipped ? -14 : 5) : 0,
          }}
          exit={{ opacity: 0 }}
        >
          {owned ? (equipped ? "UNEQUIP" : "EQUIP") : "BUY"}
        </motion.span>
        <motion.div
          className={cn(
            "absolute",
            size === "big" ? "right-8 top-[14px]" : "right-4 top-[11px]"
          )}
          animate={{
            opacity: hover || owned ? 0 : 1,
          }}
        >
          <Image
            src={"/ShopVec.svg"}
            width={16}
            height={16}
            alt="coin image"
            className="h-auto w-auto"
          />
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
};

export default Coin;
