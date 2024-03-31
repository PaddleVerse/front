import React from 'react'
import Image from 'next/image';
import { Inter, Rajdhani } from 'next/font/google'

const rajdhani = Rajdhani({
    subsets: ["latin"],
    weight: ["300", "400", "500", "700"],
  });
const inter = Inter({
    subsets: ["latin"],
    weight: ["300", "400", "500", "700"],
  });
const Header = () => {
  return (
    <div className={`  flex ${rajdhani.className} justify-between items-center text-white`}>
        <div className='flex flex-col relative'>
            <h1 className='font-[600] text-[24px]' >Hello Andrew</h1>
            <p className={`text-buttonGray ${inter.className} text-[13px] xl:w-auto md:w-[165px] sm:flex hidden truncate`}>Ready to get started for an exciting new game? Choose a game-mode and click Play.</p>
        </div>
        <button className={`flex items-center justify-center ${rajdhani.className} sm:py-3 sm:px-[65px] py-2 bg- px-5 rounded-md gap-2 border border-red-500`}>
            <span className='font-[500]'>Play</span>
            <Image src={'/nextPlay.svg'} width={20} height={20} alt='next to play image'/>
        </button>
    </div>
  )
}

export default Header
