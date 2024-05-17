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
  const { socket, user } = state;
  const [roomId, setRoomId] = useState<string| null>();
  const [canPlay, setCanPlay] = useState(false)
  const [selected, setSelected] = useState("");

  useEffect(() => {
    setRoomId(state.GameInviteID);
  }, [state.GameInviteID]);

  
  useEffect(() => {
    if (!socket) return ;
    socket?.on('alreadyInGame', () => {
      setCanPlay(false);
    });

    socket?.on('start', (data : any) => {
      console.log(data?.room);
      setRoomId(data?.room);
      setTimeout(() => {
        setStart(true)
      } , 1500);
    })
    const emitLeaveRoom = () => {

      socket?.emit('gameOver', { userId : user?.id });
    }

    window.addEventListener('beforeunload', emitLeaveRoom);

    socket?.on("leftRoom", () => {
      setCanPlay(false)
      setStart(false)
      setRoomId(null)
    });

    socket?.on("otherUserLeft", () => {
      console.log('left room')
      setCanPlay(false)
      setStart(false)
    });
    
    return () => {
      socket?.off('start');
      socket?.off('leftRoom');
      socket?.off('alreadyInGame');
      window.removeEventListener('beforeunload', emitLeaveRoom);
    }
  } , [socket])
  
  // useEffect(() => {
  //   if (!roomId) return ;
  //   setStart(true)
  // }, [roomId])

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
