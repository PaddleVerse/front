'use client'
import React, { useEffect, useState } from 'react';
import { useGlobalState } from '@/app/components/Sign/GlobalState'
import PlayerCard from './PlayerCard';


const MatchMakingCard = ({ gameMode, turnOff }: { gameMode: string, turnOff: () => void }) => {
    const { state } = useGlobalState();
    const { user, socket} = state;


    useEffect(() => {
        socket?.emit('matchMaking', { id : user?.id })
    } , [socket])

    return (
        <div className="fixed top-0 left-0 flex items-center justify-center w-full h-full bg-black bg-opacity-50">
            <div className="relative bg-[#ffffff37] backdrop-blur w-[40%] h-[40%] rounded-xl p-4">
                <button onClick={turnOff} className="absolute top-2 right-4 text-xl text-white">X</button>
                <div className='flex justify-center items-center w-full h-full gap-4'>
                    { user && <PlayerCard name={user?.name} img={user?.picture} /> }
                    <h1 className='text-3xl text-white'>VS</h1>
                    <PlayerCard name='XXXXX' img={null} />
                </div>
            </div>
        </div>
    );
};

export default MatchMakingCard;