import React from 'react'
import { GoLock } from "react-icons/go";

const JoinChannelBubble = ({lock}:{lock:boolean}) => {
  return (
    <div className='flex ga-2 items-center col-start text-inherit relative'>
        <img src="/badge1.png" alt="image" className='lg:w-[95px] lg:h-[95px] md:w-[80px] md:h-[80px]'/>
        <div className='flex flex-col gap-1'>
            <h2 className='2xl:text-md xl:text-[15px] md:text-[14px]'>JOIN US NOW</h2>
            <p className='text-gray-400 xl:text-sm truncate md:text-xs lg:max-w-full md:max-w-[120px]'>a fun interactive group of people</p>
        </div>
        {lock && <GoLock className='absolute top-6 2xl:right-[91px] xl:right-[41px] lg:right-[35px] text-white hidden md:text-[14px] 2xl:text-[16px] lg:flex'/>}
    </div>
  )
}

export default JoinChannelBubble