"use client";
import { useEffect, useState } from "react";
import React from "react";
import BigCard from "./Cards/BigCard";
import SmallCard from "./Cards/SmallCard";
import Modlar from "./Stuff/Modlar";
import { motion, AnimatePresence } from "framer-motion";
import Header from "./Header";

import cardsData from './CardData'
const infos = [
  {
    title: "Galactic Spinner",
    description:
      "Unlock the mysteries of the universe with the Galactic Spinner! This celestial paddle will have you serving stars and striking with the force of a comet",
  },
  {
    title: "Ocean whisper",
    description:
      "Bring the serene power of the sea to your game with Ocean's Whisper. Its calming waves and fluid motion are perfect for strategic players who value grace and control.",
  },
  {
    title: "Dragon Breath",
    description:
      "Unleash the power of the mythical beast with Dragon's Breath. Dominate the table with fiery precision and scare your opponents with its fierce design.",
  },
];
interface Infos {
  title: string;
  description: string;
}
const Elements = () => {
  const handleClick = (e: any | null) => {
    console.log(e);
    setModelarInfos(e);
    setModelarOpen(!modelarOpen);
  };
  const [BigCardinfos, setBigCardInfos] = useState<Infos[]>(infos);
  const [selected, setSelected] = useState<string>('Paddle');
  const [modelarOpen, setModelarOpen] = React.useState(false);
  const [modelarInfos, setModelarInfos] = React.useState({
    title: "",
    description: "",
  });
  const handleHeaderSelect = (element:string) => {
    console.log(element);
    setSelected(element);
    const selectedElement = cardsData[element as keyof typeof cardsData];
    const bigCardInfos = Object.values(selectedElement.bigCard);
    setBigCardInfos(bigCardInfos);
  };
  return (
    <div className=" flex flex-col gap-5">
      <Header onSelect={handleHeaderSelect}/>
      <div
        className="w-full rounded-md bg-transparent 2xl:h-[1000px] sm:h-[950px] flex flex-col overflow-y-auto no-scrollbar"
        style={{
          backdropFilter: "blur(20px)",
          backgroundColor: "rgba(13, 9, 10, 0.7)",
        }}
      >
        <div className="flex flex-col w-full h-full relative 2xl:px-[65px] xl:px-[35px] sm:px-[20px] px-[10px]">
          <div className="w-full grid grid-flow-col-1 gap-7 sm:grid-cols-3 place-items-center mt-6">
            <BigCard infos={BigCardinfos[0]} handleClick={handleClick} selected={selected} element={'first'}/>
            <BigCard infos={BigCardinfos[1]} handleClick={handleClick} selected={selected} element={'second'} />
            <BigCard infos={BigCardinfos[2]} handleClick={handleClick} selected={selected} element={'third'} />
          </div>
          <div className="grid 2xl:grid-cols-5 xl:grid-cols-4 sm:grid-cols-3 grid-cols-1 gap-5 place-items-center mt-6">
            {Array.from({ length: 8 }, (_, index) => (
              <SmallCard key={index} />
            ))}
          </div>
          <AnimatePresence>
            {modelarOpen && (
              <Modlar infos={modelarInfos} handleClick={handleClick} />
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Elements;
