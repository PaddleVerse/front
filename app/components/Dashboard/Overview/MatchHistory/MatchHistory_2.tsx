import React, { useEffect, useState } from "react";
import { rajdhani } from "@/app/utils/fontConfig";
import OneGame_2 from "./OneGame_2";
import { cn } from "@/components/cn";
import axios from "axios";
import { ipAdress } from "@/app/utils/index";
import { useGlobalState } from "@/app/components/Sign/GlobalState";

const MatchHistory_2 = () => {
  const { state, dispatch } = useGlobalState();
  const { user, socket } = state;
  const [data, setData] = useState<any[]>([]);
  const [enemyData, setEnemyData] = useState<any[]>([]);
  const [stats, setStats] = useState<number>(0);
  useEffect(() => {
    const data = axios
      .get(`http://${ipAdress}:8080/match/history/${user?.id}`)
      .then((res) => {
        setData(res.data);
        
        
      });
  }, [state]);
  
  // Calculate winner and loser streaks
  useEffect(() => {
    if (data && data.length > 0) {
      const enemyId =
        data[0].winner === user.id ? data[0].loser : data[0].winner;
      axios.get(`http://${ipAdress}:8080/user/${enemyId}`).then((res) => {
        setEnemyData(res.data);
        
      });
    }
  }, [data]);
  return (
    <div className="w-full rounded-md bg-primaryColor no-scrollbar overflow-y-auto h-[700px] text-white flex flex-col overflow-x-hidden">
      <div className="w-full p-6 sticky top-0 bg-primaryColor z-30">
        <h1
          className={cn(
            `sm:text-4xl text-2xl font-semibold`,
            rajdhani.className
          )}
        >
          All Matches
        </h1>
      </div>
      <div className="w-full h-full px-6 flex flex-col gap-[12px] ml-1">
        {data.length === 0 && (
          <div className="w-full h-full flex justify-center items-center">
            <h1 className="text-2xl">No matches yet</h1>
            </div>
            )}
        {data.map((item, index) => {
          const marginOfVictory = item.winner_score - item.loser_score;
          const averageScore = (item.winner_score + item.loser_score) / 2;

          //   let winner_streak = 1;
          //   let loser_streak = 1;
          //   if (index > 0) {
          //     console.log("data: ", data[index - 1])
          //     if (item.winner === data[index - 1].winner) {
          //       setWinnerStreak(data[index - 1].winnerStreak + 1);
          //       winner_streak = winnerStreak + 1;
          //     }
          //     if (item.loser === data[index - 1].loser) {
          //       setLoserStreak(data[index - 1].loserStreak + 1);
          //       loser_streak = loserStreak + 1;
          //     }
          //   }
          return (
            <OneGame_2
              status={item.winner === user.id ? "win" : "lose"}
              marginOfVictory={marginOfVictory}
              averageScore={averageScore}
              winnerStreak={item.winner_streak}
              loserStreak={1}
              key={index}
              item={item}
              // user={user}
              enemyData={enemyData}
            />
          );
        })}
        {/* <OneGame_2 status={"win"} />
        <OneGame_2 status={"lose"} />
        <OneGame_2 status={"win"} />
        <OneGame_2 status={"lose"} />
        <OneGame_2 status={"win"} />
        <OneGame_2 status={"lose"} />
        <OneGame_2 status={"win"} />
        <OneGame_2 status={"lose"} />
        <OneGame_2 status={"win"} />
        <OneGame_2 status={"lose"} /> */}
      </div>
    </div>
  );
};

export default MatchHistory_2;
