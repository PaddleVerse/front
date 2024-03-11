'use client'
import React, { useState } from 'react';
import { motion } from 'framer-motion';
const menuItems = ['Paddle', 'Ball', 'Table', 'Map'];

const Header = () => {
  const [selected, setSelected] = useState(0);
  return (
    <div className="h-[61px] pl-2 rounded-lg w-full grid place-items-start items-center text-white bg-transparent"
    style={{
      backdropFilter: "blur(7px)",
      backgroundColor: "rgba(13, 9, 10, 0.7)",
    }}
    >
      <div className="flex justify-evenly">
          {menuItems.map((el, i) => (
            <MenuItem 
              text={el} 
              key={i}
              // @ts-ignore
              selected={selected === i}
              onClick={() => setSelected(i)}
            /> 
          ))}
      </div>
    </div>)
}

const MenuItem = ({ text, selected, onClick }:{text:string, selected:number, onClick:()=>void}) => (
  <div className='relative m-2'>
    <motion.div 
      className="cursor-pointer" 
      onClick={onClick} 
      animate={{ opacity: selected ? 1 : .5}}
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
)
export default Header