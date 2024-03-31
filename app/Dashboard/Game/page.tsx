import React from 'react'
import GameOptions from '@/app/components/Dashboard/Game/PreGame/GameOptions'
import Game from '@/app/components/Dashboard/Game/InGame/Game'
const page = () => {
  return (
    <div className='w-full flex justify-center mt-[50px]'>
      {/* <GameOptions />  */}
      <Game />
    </div>
  )
}

export default page
