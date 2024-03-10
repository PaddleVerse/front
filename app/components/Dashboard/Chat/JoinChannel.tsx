import React from 'react'
import JoinChannelBubble from './JoinChannelBubble'

import { AiOutlineClose } from "react-icons/ai";

const JoinChannel = ({handleClick}:{handleClick:()=>void}) => {
  return (
    <div className='fixed inset-0 sm:flex hidden items-center justify-center bg-black bg-opacity-50 z-50 text-white'>
        <div className='overflow-y-auto border h-[70%] 2xl:w-[35%] xl:w-[55%] sm:w-[70%] px-10 py-16 flex flex-col bg-transparent rounded-xl'
         style={{
            backdropFilter: "blur(20px)",
            backgroundColor: "rgba(13, 9, 10, 0.7)",
          }}
        >
            <h1 className='text-3xl'>Expand your horizon</h1>
            <input type="text" className='rounded-md text-black pl-8 h-[100px] outline-none mt-4' placeholder='Search'/>
            <div className=' grid-cols-2 grid justify-between mt-10 overflow-y-auto'>
                <JoinChannelBubble />
                <JoinChannelBubble />
                <JoinChannelBubble />
                <JoinChannelBubble />
                <JoinChannelBubble />
                <JoinChannelBubble />
                <JoinChannelBubble />
                <JoinChannelBubble />
                <JoinChannelBubble />
                <JoinChannelBubble />
                <JoinChannelBubble />
                <JoinChannelBubble />
                <JoinChannelBubble />
                <JoinChannelBubble />
                <JoinChannelBubble />
                <JoinChannelBubble />
                <JoinChannelBubble />
                <JoinChannelBubble />
                <JoinChannelBubble />
                <JoinChannelBubble />
                <JoinChannelBubble />
                <JoinChannelBubble />
                <JoinChannelBubble />
                <JoinChannelBubble />
                <JoinChannelBubble />
                <JoinChannelBubble />
                <JoinChannelBubble />
                <JoinChannelBubble />
                <JoinChannelBubble />
                <JoinChannelBubble />
                <JoinChannelBubble />
                <JoinChannelBubble />
                <JoinChannelBubble />
                <JoinChannelBubble />
                <JoinChannelBubble />
                <JoinChannelBubble />
                <JoinChannelBubble />
                <JoinChannelBubble />
                <JoinChannelBubble />
                <JoinChannelBubble />
            </div>
            <div
          className="absolute top-2 right-2 cursor-pointer"
        >
          <AiOutlineClose size={30} 
          onClick={()=>handleClick()}
          />
        </div>
        </div>
    </div>
  )
}

export default JoinChannel