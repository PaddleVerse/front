'use client'
import React, { use, useEffect, useState } from 'react'
import Caroussel from './Caroussel'
import Header from './Header'
import { useGlobalState } from '@/app/components/Sign/GlobalState'
import Game from '@/app/components/Dashboard/Game/InGame/Game'
import { useParams, useSearchParams } from 'next/navigation'


const GameOptions = () => {
  const [start, setStart] = useState(false)
  const { state } = useGlobalState();
  const { socket } = state;
  const [roomId, setRoomId] = useState<string| null>();
  const [canPlay, setCanPlay] = useState(false)
  const [selected, setSelected] = useState("");
  const search = useSearchParams()

  useEffect(() => {
    setRoomId(search.get('room'))
  }, [search])

  
  useEffect(() => {
    if (!socket) return ;
    socket?.on  ('start', (data : any) => {
      setTimeout(() => {
        setStart(true)
        setRoomId(data.room)
      } , 1500);
    })
    
    socket?.on("leftRoom", () => {
      setCanPlay(false)
      setStart(false)
    });
    
    return () => {
      socket?.off('start');
      socket?.off('leftRoom');
    }
  } , [socket])
  
  useEffect(() => {
    if (!roomId) return ;
    setStart(true)
  }, [roomId])

  if (start) {
    return <Game roomId={roomId!} />;
  }
  return (
    <div className='w-[94%] bg-[#101823]  py-[45px] px-[20px] sm:px-[150px] rounded-lg'>
      <Header selected={selected} setCanPlay={setCanPlay}/>
      <Caroussel setSelected={setSelected} canPlay={canPlay} setCanPlay={setCanPlay}/>
    </div>
  )
}

export default GameOptions
