'use client'
import React, { useState } from 'react';
import { motion } from 'framer-motion';

const menuItems = ['Paddle', 'Ball', 'Table', 'Map'];

const Header = ({onSelect}:{onSelect:(e:string)=>void}) => {
  const [selected, setSelected] = useState<number>(0);

  const handleItemClick = (index:number) => {
    setSelected(index);
    onSelect(menuItems[index]);
  };

  return (
    <div
      className="h-[61px] pl-2 rounded-lg w-full grid place-items-start items-center border text-white bg-transparent"
      style={{
        backdropFilter: "blur(7px)",
        backgroundColor: "rgba(13, 9, 10, 0.7)",
      }}
    >
      <div className="flex justify-evenly">
        {menuItems.map((el, i) => (
          <MenuItem
            key={i}
            text={el}
            selected={selected === i}
            onClick={() => handleItemClick(i)}
          />
        ))}
      </div>
    </div>
  );
};

const MenuItem = ({ text, selected, onClick }:{text:string, selected:boolean, onClick:()=>void}) => (
  <div className='relative m-2'>
    <motion.div
      className="cursor-pointer"
      onClick={onClick}
      animate={{ opacity: selected ? 1 : 0.5 }}
    >
      {text}
    </motion.div>
    {selected && (
      <motion.div
        className="absolute -bottom-[8px] left-0 w-full h-[4px] rounded-sm bg-redValorant opacity-100"
        layoutId="underline"
      />
    )}
  </div>
);

export default Header;