import React from 'react'
import PlacingElement from './PlacingElement'
import LeaderTable from './LeaderTable'
import { Rajdhani } from 'next/font/google'
const rajdhani = Rajdhani({ subsets: ['latin'], weight: ['400', '500', '600', '700'] })
const LeaderBoard = () => {


  return (
    <div className='sm:w-[90%] w-[95%] h-[88%]  mt-[50px] flex flex-col rounded-xl'
    style={{
      backdropFilter: "blur(20px)",
      backgroundColor: "rgba(13, 9, 10, 0.7)",
    }}>
        {/* <div className='w-full h-[250px] flex items-center justify-center '>
            <PlacingElement />
        </div> */}
        <div className='w-[95%] mx-auto flex mt-10 flex-col gap-10'>
          <h1 className={`${rajdhani.className} text-white sm:text-[40px] text-[31px] font-semibold`}>Pong Leaderboard</h1>
            <LeaderTable />
        </div>
    </div>
  )
}

export default LeaderBoard
