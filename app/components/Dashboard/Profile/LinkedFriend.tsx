import Image from 'next/image'
import React from 'react'
import { useRouter } from 'next/navigation'
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
const LinkedFriend = (props : any) => {
  const router = useRouter();
  const handleClick = (id : any) => {
    router.push(`/Dashboard/Profile?id=${id}`);
  }
  return (
    <div className='flex justify-between items-center'>
        <div className='flex gap-4 items-center'>
            {/* <Image src={props.user?.picture || '/b.png'} alt='profile' width={50} height={50} className='rounded-full' /> */}
            <Image
              onClick={() => handleClick(props.user?.id)}
              alt='profile'
              height={50}
              width={50}
              src={props.user?.picture || '/b.png'}
              className="object-cover cursor-pointer !m-0 !p-0 object-top rounded-full h-[50px] w-[50px] border-2 group-hover:scale-105 group-hover:z-30 border-white  relative transition duration-500"
            />
            <div className={`flex flex-col ${inter.className}`}>
                <span className='2xl:text-[17px]'>{props.user?.name}</span>
                <p className='text-[11px]'>@{props.user?.username}</p>
            </div>
        </div>
        <div className={`w-[25px] h-[25px] flex items-center justify-center text-white text-[11px] ${rubik.className} font-[400] rounded-full bg-[#BD3944]`}>#{props?.index}</div>
    </div>
  )
}

export default LinkedFriend