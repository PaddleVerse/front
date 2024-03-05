'use client';
import React from 'react'
import Image from 'next/image';

const UserSearchCard = ({user, handleClick} : any) => {
    
  return (
    <div className="text-white rounded-md p-2 xl:w-1/4 md:w-1/2 sm:w-full h-1/6 flex justify-start items-center cursor-pointer" onClick={() => handleClick(user?.id)}>
        <Image
          src="/friend.png"
          alt="Picture of the author"
          width={100}
          height={100}
          className='rounded-full w-[50px] h-[50px] object-cover'
        />
        <div className='ml-2'>
            <h1 className='text-md'>{user?.name}</h1>
            <div className='flex'>
                <p className='text-[10px] w-[30%] overflow-hidden'>@{user?.username}</p>
                <div className="flex items-center ml-2">
                    <span className="relative flex h-2 w-2 mr-2">
                      <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${ user?.status === "ONLINE" ? "bg-green-500" : "bg-gray-500" } opacity-75`}></span>
                      <span className={`relative inline-flex rounded-full h-2 w-2 ${ user?.status === "ONLINE" ? "bg-green-500" : "bg-gray-500" }`}></span>
                    </span>
                    <span className="2xl:text-xs xl:text-[10px] sm:text-[8px] text-[10px] text-gray-400">
                      1k friends
                    </span>
                  </div>
            </div>
        </div>
    </div>
  )
}

export default UserSearchCard