import Image from 'next/image'
import React from 'react'

import { inter, rubik } from '@/app/utils/fontConfig'
import { cn } from '@/components/cn'
const Friends = () => {
  return (
    <div className='flex justify-between items-center'>
        <div className='flex gap-4 items-center'>
            <Image src='/b.png' alt='profile' width={50} height={50} className='rounded-full' />
            <div 
            className={cn('flex flex-col', inter.className)}
            >
                <span className='2xl:text-[17px]'>Abdelmottalib</span>
                <p className='text-[11px]'>@konami</p>
            </div>
        </div>
        <div 
        className={cn(`w-[25px] h-[25px] flex items-center justify-center text-white text-[11px] font-[400] rounded-full bg-[#BD3944]`, rubik.className)}
        >#1</div>
    </div>
  )
}

export default Friends