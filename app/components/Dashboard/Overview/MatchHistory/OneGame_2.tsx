'use client'
import React, { use, useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { cn } from "@/components/cn";
import { useGlobalState } from "@/app/components/Sign/GlobalState";
import { ipAdress } from "@/app/utils";
import axios from "axios";
import { set } from "lodash";

const OneGame_2 = ({
  status,
  item,
  marginOfVictory,
  averageScore,
  winnerStreak,
  loserStreak,
  enemyData
}: {
  status: string;
  item: any;
  marginOfVictory: number;
  averageScore: number;
  winnerStreak: number;
  loserStreak: number;
  enemyData: any;
}) => {
// useEffect(() => {
//   const dateString = "2024-05-04T09:11:45.269Z";
// const date = new Date(dateString);

// const options = { month: 'short' as const, day: 'numeric' as const, year: 'numeric' as const };
// const formattedDate = date.toLocaleDateString('en-US', options);

// },[])
const { state, dispatch } = useGlobalState();
const { user, socket } = state;
const [userC, setUserC] = useState<any>(null);
useEffect(() => {
  const userId = user?.id;
  axios.get(`http://${ipAdress}:8080/user/${userId}`).then((res) => {
    setUserC(res.data);
  console.log(res.data);
  });
},[status])
// useEffect(() => {
//     const userId = user?.id;
//     axios.get(`http://${ipAdress}:8080/user/${userId}`).then((res) => {
//       setUser(res.data);
//     console.log(res.data);
//     });
// }, [status]);
  return (
    <motion.div
      className="rounded-md w-full md:h-[70px] bg-gradient-to-r bg-secondaryColor flex items-center justify-between px-4"
      whileHover={{ x: -5 }}
    >
      <div className="flex items-center justify-between 2xl:w-[42%] md:w-[80%] w-[88%]">
        <div className="relative w-[50px] h-[50px] md:flex hidden ">
          <Image
            src={user?.picture! || "/b.png"}
            fill
            alt="img"
            sizes="w-auto h-auto"
            className={cn(
              "rounded-full ring-[2px]",
              status === "lose"
                ? "ring-[#FF4656]"
                : "ring-mathHistoryGreenColor"
            )}
          />
        </div>
        <div className="flex flex-col  items-center justify-center md:leading-5 leading-2">
          <span className="xl:text-[18px] md:text-[15px] text-[11px] font-semibold tracking-widest">
            {status === "win" ? item.winner_score : item.loser_score}
          </span>
          <span
            className={`text-[#647087] ml-[10px] text-[10px] md:text-clip truncate w-[50px] xl:text-[14px] md:text-[11px] font-semibold`}
          >
            Score
          </span>
        </div>
        <div className="flex flex-col items-center justify-center md:leading-5 leading-2">
          <span
            className={cn(
              "font-semibold xl:text-[20px] md:text-[17px] text-[12px] tracking-tighter",
              status === "win"
                ? "text-mathHistoryGreenColor"
                : "text-mainRedColor"
            )}
          >
            {status === "win" ? marginOfVictory : -marginOfVictory}
          </span>
          <span className="text-[#647087] xl:text-[13px] md:text-[11px] text-[8px]">
            Ratio
          </span>
        </div>
        <div className="flex flex-col items-center md:leading-5 leading-2">
          <span
            className={cn(
              "font-semibold xl:text-[20px] md:text-[17px] text-[12px] tracking-tighter",
              status === "win"
                ? "text-mathHistoryGreenColor"
                : "text-mainRedColor"
            )}
          >
            {averageScore}%
          </span>
          <span className="text-[#647087] xl:text-[13px] md:text-[11px] text-[8px]">
            Average Score
          </span>
        </div>
        <div className="flex flex-col">
          <span className={cn(
            "text-white font-semibold xl:text-[20px] text-[12px] md:text-[17px] tracking-tight",
            status === "win"
              ? "text-mathHistoryGreenColor"
              : "text-mainRedColor"
          )}
          >
            {
              status === "win"
              ? winnerStreak: ""
            }
            {
              status === "win"
              ? " Wining streak": "Lost"
            }
          </span>
          {/* <span className="text-[#EBAD40] font-[500] text-[8px] xl:text-[14px] md:text-[11px] tracking-tight">
            MVP
          </span> */}
        </div>
      </div>
      <div className="flex items-center md:w-auto w-[25px] justify-center py-1 md:px-[11px] md:text-[15px] text-[11px] tracking-tight font-semibold rounded-md md:bg-[#202B43]">
        {
          item.start_time = new Date(item.start_time).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
        }
      </div>
      <div className="items-center justify-between w-[42%] hidden 2xl:flex">
        <div className="flex flex-col">
          <span className="text-white font-semibold xl:text-[20px] md:text-[17px] tracking-tight">
          <span className={cn(
            "text-white font-semibold xl:text-[20px] text-[12px] md:text-[17px] tracking-tight",
            status === "lose"
              ? "text-mathHistoryGreenColor"
              : "text-mainRedColor"
          )}
          >
            {
              status === "lose"
              ? user?.winner_streak: ""
            }
            {
              status === "lose"
              ? " Wining streak": "Lost"
            }
          </span>
          </span>
        </div>
        <div className="flex flex-col items-center leading-5">
          <span
            className={cn(
              "font-semibold xl:text-[20px] md:text-[17px] text-[12px] tracking-tighter",
              status === "win"
                ? "text-mainRedColor"
                : "text-mathHistoryGreenColor"
            )}
          >
            {averageScore}%
          </span>
          <span className="text-[#647087] xl:text-[13px] text-[11px]">
            Average Score
          </span>
        </div>
        <div className="flex flex-col items-center justify-center leading-5">
          <span
            className={cn(
              "font-semibold xl:text-[20px] md:text-[17px] text-[12px] tracking-tighter",
              status === "win"
                ? "text-mainRedColor"
                : "text-mathHistoryGreenColor"
            )}
          >
            {status === "lose" ? marginOfVictory : -marginOfVictory}
          </span>
          <span className="text-[#647087] xl:text-[13px] text-[11px]">
            Ratio
          </span>
        </div>
        <div className="flex flex-col items-center justify-center leading-5">
          <span className="xl:text-[18px] md:text-[15px] font-semibold tracking-widest">
            
            {status === "lose" ? item.winner_score : item.loser_score}

          </span>
          <span
            className={`text-[#647087] xl:text-[14px] md:text-[11px] font-semibold`}
          >
            Score
          </span>
        </div>
        <div className="relative w-[50px] h-[50px]">
          <Image
            src={enemyData?.picture! || "/b.png"}
            fill
            alt="img"
            sizes="w-auto h-auto"
            className={cn(
              "rounded-full ring-[2px]",
              status === "win"
                ? "ring-mathHistoryGreenColor"
                : "ring-mainRedColor"
            )}
          />
        </div>
      </div>
    </motion.div>
  );
};

export default OneGame_2;
