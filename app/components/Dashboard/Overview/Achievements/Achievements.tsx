import React from 'react'
import { Rajdhani } from 'next/font/google'
import Image from 'next/image'
import Achievement from './Achievement'

const rajdhani = Rajdhani({ subsets: ['latin'], weight: ['400', '500', '600', '700'] })
const Achievements = () => {
  return (
    <div className=' w-full  rounded-md p-3 h-auto bg-[#101823]'
    // style={{
    //     backdropFilter: "blur(20px)",
    //     backgroundColor: "rgba(13, 9, 10, 0.7)",
    //   }}
    >
        <div className='w-full text-white flex gap-2  items-center'>
            <Image src='/achievements.svg' width={20} height={20} alt={'image'} className='w-auto h-auto' />
            <h1 className={`${rajdhani.className} font-[500] xl:text-[20px] lg:text-[17px]`}>ACHIEVEMENTS</h1>
        </div>
        {Array.from({ length: 10 }, (_, index) => (

        <Achievement key={index}/>
          ))}
      
    </div>
  )
}

export default Achievements
