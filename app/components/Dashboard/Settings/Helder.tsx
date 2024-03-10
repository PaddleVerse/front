'use client';
import React, { useState } from 'react'
import Sidebar from './Sidebar'
import EditProfile from './EditProfile'
import Security from './Security'
import { Tabs } from "@/components/ui/tabs";
import Image from 'next/image';

const Helder = () => {
  const [current, setCurrent] = useState('My profile');
  const tabs = [
    {
      title: "My profile",
      value: "My profile",
      content: (
        <div className="w-full overflow-hidden relative h-full rounded-2xl p-10 bg-gradient-to-br from-blurredRed to-[#753b3b]">
          <EditProfile />
        </div>
      ),
    },
    {
      title: "Security",
      value: "Security",
      content: (
        <div className="w-full overflow-hidden relative h-full rounded-2xl p-10 bg-gradient-to-br from-blurredRed to-[#753b3b]">
          <Security />
        </div>
      ),
    }
  ];
  return (
    // <div className='w-[94%] bg-transparent [perspective:1000px] relative b flex flex-col items-start justify-start sm:h-[90%] xl:h-[98%] h-[98%] rounded-lg'
    // style={{
    //   backdropFilter: "blur(20px)",
    //   backgroundColor: "rgba(13, 9, 10, 0.7)",
    // }}
    // >
    // <Sidebar current={current} setCurrent={setCurrent} />
    // <div className='flex mt-[40px] w-full'>
    //   {current === 'My profile' && <EditProfile />}
    //   {current === 'Security' && <Security />}
    // </div>
    // </div>
    <div
    className="h-[90%] w-[94%] [perspective:1000px] relative b flex flex-col items-start justify-start"
    style={{
        backdropFilter: "blur(20px)",
        backgroundColor: "rgba(13, 9, 10, 0.7)",
      }}
    >
      <Tabs tabs={tabs} />
    </div>
  )
}

export default Helder