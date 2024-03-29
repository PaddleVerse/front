"use client";
import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import MainOptions from "./MainOptions";
import { RxDashboard } from "react-icons/rx";
import { PiChatCircleTextLight, PiGameController } from "react-icons/pi";
import { LiaShoppingCartSolid } from "react-icons/lia";
import { IoIosSearch } from "react-icons/io";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useGlobalState } from "../../Sign/GlobalState";
import { set } from "react-hook-form";

const gameNames = ["Overview", "Leaderboard", "Settings"];

const Option = ({ label, expanded }: { label: string; expanded: boolean }) => {

  const [showElements, setShowElements] = useState(false);
  const [notifed, setNotifed] = useState(false);
  const pathname = usePathname();
  const lastSegment = pathname.split("/").pop();
  const router = useRouter();
  const { state } = useGlobalState();
  const { socket } = state;
  useEffect(() => {
    if (socket) {
      socket.on("update", () => {
        setNotifed(true);
      });
    }
  } , [socket]);



  const handleDashboardClick = () => {
    if (label === "Dashboard") {
      setShowElements(!showElements);
    }
    if (label === "Chat") {
      setNotifed(false);
      router.push("/Dashboard/Chat");
    }
    if (label === "Shop") {
      router.push("/Dashboard/Shop");
    }
    if (label === "Search") {
      router.push("/Dashboard/Search");
    }
    if (label === "Game") {
      router.push("/Dashboard/Game");
    }
  };
  return (
    <div className="relative overflow-visible">
      <motion.div onClick={handleDashboardClick}>
        <MainOptions
          label={label}
          showElements={showElements}
          expanded={expanded}
        >
          {label === "Dashboard" ? (
            <RxDashboard className="hover:bg-[#34202A]" />
          ) : label === "Chat" ? (
            <div className="relative"> 
              <PiChatCircleTextLight className="hover:bg-[#34202A]"/>
              {notifed && (
                <div className="absolute bg-[#34202A] p-1 rounded-full top-0 right-0">
                  <div className="bg-red-500 rounded-full w-[6px] h-[6px]"></div>
                </div>
              )}
            </div>
          ) : label === "Shop" ? (
            <LiaShoppingCartSolid className="hover:bg-[#34202A]" />
          ) : label === "Search" ? (
            <IoIosSearch className=" hover:bg-[#34202A]" />
          ) : label === "Game" ? (
            <PiGameController className="hover:bg-[#34202A]" />
          ) : (
          <RxDashboard />
          )}
        </MainOptions>
      </motion.div>
      {/* <AnimatePresence>
        {showElements && (
          <motion.div>
            <motion.img
              // className="filter-white"
              src="Union.svg"
              // className="border-red-500"
              alt="tree"
              initial={{
                height: 0,
                top: "58px",
                left: "20px",
                position: "absolute",
              }}
              animate={{
                height: 100,
                position: "absolute",
                top: expanded ? "58px" : "54px",
                left: expanded ? "40px" : "17px",
              }}
              exit={{
                // opacity: 0,
                y: -20,
                // x: 0,
                height: 0,
                transition: { duration: 0.7 },
              }}
              transition={{ duration: 0.29 }}
            />
          </motion.div>
        )}
      </AnimatePresence> */}
      <motion.div>
        {!expanded && showElements && (
          <motion.div
            className="absolute  top-[49px] left-[40px] bg-gradient-to-br from-optionMenu to-dashBack bg-optionMenu  h-[130px] rounded-2xl w-[150px]"
            animate={{ boxShadow: "20px white" }}
          ></motion.div>
        )}
        {gameNames.map((game, index) => (
          <AnimatePresence key={index}>
            {showElements && (
              <motion.div
                initial={{ opacity: 0, y: -20, x: 0, height: 0 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  x: 40,
                  height: 20,
                  marginTop: expanded ? 15 : 12,
                  paddingLeft: expanded ? "20px" : "0px",
                }}
                exit={{
                  opacity: 0,
                  y: -20,
                  x: 0,
                  height: 0,
                  marginTop: 0,
                  transition: { duration: 0.2, delay: index * 0.2 },
                }}
                transition={{ duration: 0.29, delay: index * 0.2 }}
                // className="border"
                // className="flex mb-2"
              >
                <Link href={`/Dashboard/${game === "Overview" ? "" : game}`}>
                  <span
                    className={`py-2 block ${!expanded ? 'ml-2':''} ${
                      lastSegment === game ||
                      (lastSegment === "Dashboard" && game === "Overview")
                        ? "bg-[#34202A] text-[#FF5866]"
                        : ""
                    }  w-32 rounded-lg cursor-pointer text-sm  pl-4 hover:bg-[#34202A] hover:text-[#FF5866] text-buttonGray `}
                  >
                    {game}
                  </span>
                </Link>
                <motion.div
                  initial={{
                    position: "absolute",
                    top: "-32px",
                    left: "0px",
                  }}
                  animate={{
                    position: "absolute",
                    top: expanded ? "32" : "-37px",
                    left: expanded ? "0px" : "-22px",
                  }}
                >
                  <Image
                    src={"/Vector.svg"}
                    width={13}
                    height={13}
                    alt="image"
                    className="z-0 h-auto w-auto"
                  ></Image>
                </motion.div>
                {/* {game} */}
              </motion.div>
            )}
          </AnimatePresence>
        ))}
      </motion.div>
    </div>
  );
};

export default Option;
