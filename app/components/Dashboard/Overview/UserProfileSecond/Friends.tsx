import Image from 'next/image'
import React from 'react'

import { Inter } from 'next/font/google'
import { Rubik } from 'next/font/google'

const inter = Inter({
    subsets: ['latin'],
    weight: ['400', '500', '600', '700'],
    })
const rubik = Rubik({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
})
const Friends = () => {
  return (
    <div className='flex justify-between items-center'>
        <div className='flex gap-4 items-center'>
            <Image src='/b.png' alt='profile' width={50} height={50} className='rounded-full' />
            <div className={`flex flex-col ${inter.className}`}>
                <span className='2xl:text-[17px]'>Abdelmottalib</span>
                <p className='text-[11px]'>@konami</p>
            </div>
        </div>
        <div className={`w-[25px] h-[25px] flex items-center justify-center text-white text-[11px] ${rubik.className} font-[400] rounded-full bg-[#BD3944]`}>#1</div>
    </div>
  )
}

export default Friends