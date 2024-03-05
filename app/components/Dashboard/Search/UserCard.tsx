'use cient';
import React from 'react'
import { useRouter } from 'next/navigation';
import { CardBody, CardContainer, CardItem } from '../../../../components/ui/3d-card';
import Image from 'next/image';

interface Props {
    user: any
}

const UserCard = ({user}: Props) => {
  const router = useRouter();
  const handleClick = () => {
    router.push(`/Dashboard/Profile?id=${user.id}`); 
  }
  return (
    <div onClick={handleClick} className='cursor-pointer'>
      <CardContainer className="inter-var">
        <CardBody className="relative group/card  hover:shadow-2xl hover:shadow-emerald-500/[0.1] bg-black border-red-500/[0.5] w-auto h-auto rounded-xl p-6 border">
          <CardItem translateZ="100" className="w-full mt-4">
            <Image
              src={user.picture ? user.picture :"/friend.png"}
              height="1000"
              width="1000"
              className="h-60 w-60 object-cover rounded-xl group-hover/card:shadow-xl"
              alt="thumbnail"
            />
          </CardItem>
          <div className="flex flex-col justify-between items-center mt-10">
            <CardItem
              translateZ={20}
              as="div"
              className="px-4 py-2 rounded-xl text-xs font-normal text-white"
            >
              {user?.name}
            </CardItem>
            <CardItem
              translateZ={20}
              as="div"
              className="px-4 py-2 rounded-xl bg-red-500/[0.4] text-white text-xs font-bold"
            >
              @{user?.username}
            </CardItem>
          </div>
        </CardBody>
      </CardContainer>
    </div>
    )
  }
  
  export default UserCard
  // <div className="flex flex-col items-center px-6 pt-4 pb-6 rounded-lg shadow-2xl backdrop-blur-[80px] bg-stone-950 bg-opacity-50">
  //   <img
  //     onClick={handleClick}
  //     loading="lazy"
  //     src={user.picture ? user.picture :"/friend.png"}
  //     alt="Profile"
  //     className="aspect-square w-[180px] h-[200px] object-cover rounded-md shadow-lg cursor-pointer hover:scale-105 transition duration-300 ease-in-out"
  //   />
  //   <div className="mt-5 text-lg text-white">{user.name}</div>
  //   <div className="text-xs text-white">@{user.username}</div>
  // </div>