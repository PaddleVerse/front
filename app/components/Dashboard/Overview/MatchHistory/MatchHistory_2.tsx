import React from 'react'
import { Rajdhani } from 'next/font/google'
import OneGame_2 from './OneGame_2'


const rajdhani = Rajdhani({ subsets: ['latin'], weight: ['400', '500', '600', '700'] })
const MatchHistory_2 = () => {
  return (
        <div className="w-full rounded-md bg-transparent h-[700px] p-6 text-white flex flex-col gap-7"
        style={{
          backdropFilter: "blur(20px)",
          backgroundColor: "rgba(13, 9, 10, 0.5)",
        }}>
        <h1 className={`text-4xl font-semibold ${rajdhani.className}`}>All Matches</h1>
        <div className='w-full h-full flex flex-col gap-2 overflow-y-auto'>
          {Array(10).fill(10).map((_, i) => (
              <OneGame_2 key={i} />
          ))}
       </div>
    </div>
  )
}

export default MatchHistory_2