'use cient';
import React from 'react'
import { useRouter } from 'next/navigation';

interface Props {
    user: any
}

const UserCard = ({user}: Props) => {
  const router = useRouter();
  const handleClick = () => {
    router.push(`/Dashboard/Profile?id=${user.id}`); 
  }
  return (
    <div className="flex flex-col items-center px-6 pt-4 pb-6 rounded-lg shadow-2xl backdrop-blur-[80px] bg-stone-950 bg-opacity-50">
      <img
        onClick={handleClick}
        loading="lazy"
        src={user.picture ? user.picture :"/friend.png"}
        alt="Profile"
        className="aspect-square w-[180px] h-[200px] object-cover rounded-md shadow-lg cursor-pointer hover:scale-105 transition duration-300 ease-in-out"
      />
      <div className="mt-5 text-lg text-white">{user.name}</div>
      <div className="text-xs text-white">@{user.username}</div>
    </div>
  )
}

export default UserCard