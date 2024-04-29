import React from 'react'
import GameOptions from '@/app/components/Dashboard/Game/PreGame/GameOptions'
import Game from '@/app/components/Dashboard/Game/InGame/Game'
const Page = () => {
  return (
    <div className='w-full h-screen flex justify-center items-center overflow-hidden'>
      <GameOptions />
    </div>
  );
};

export default Page;