import React from 'react'
import PlacingElement from './PlacingElement'
import LeaderTable from './LeaderTable'

const LeaderBoard = () => {


  return (
    <div className='w-[89%]  mt-[50px] flex flex-col bg-dashBack'>
        <div className='w-full h-[250px] flex items-center justify-center '>
            <PlacingElement />
        </div>
        <div className='w-[95%] mx-auto'>
            <LeaderTable />
        </div>
      
    </div>
  )
}

export default LeaderBoard
