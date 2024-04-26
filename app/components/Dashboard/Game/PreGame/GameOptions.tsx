'use client'
import React, { useEffect, useState } from 'react'
import Caroussel from './Caroussel'
import Header from './Header'
import { useGlobalState } from '@/app/components/Sign/GlobalState'
import Game from '@/app/components/Dashboard/Game/InGame/Game'


const GameOptions = () => {
  const [start, setStart] = useState(false)
  const { state } = useGlobalState();
  const { socket } = state;

  useEffect(() => {
    socket?.on('start', () => {
      setTimeout(() => {
        setStart(true)
      } , 1500);
    })

    socket?.on("leftRoom", () => {
      console.log('left room')
      setStart(false)
    });

    return () => {
      socket?.off('start');
      socket?.off('leftRoom');
    }
  } , [socket])

  if(start) {
    return <Game />
  }
  return (
    <div className='w-[94%] bg-[#101823]  py-[45px] px-[20px] sm:px-[150px] rounded-lg'>
      <Header />
      <Caroussel />
    </div>
  )
}

export default GameOptions
