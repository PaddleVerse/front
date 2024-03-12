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
        // <div className="w-full overflow-hidden relative h-full rounded-2xl p-10 bg-gradient-to-br from-blurredRed to-[#753b3b]">
        <div className="w-full overflow-hidden relative h-full rounded-2xl p-10 bg-black">
          <EditProfile />
        </div>
      ),
    },
    {
      title: "Security",
      value: "Security",
      content: (
        <div className="w-full overflow-hidden relative h-full rounded-2xl p-10 bg-black">
          <Security />
        </div>
      ),
    }
  ];
  return (
    <div
    className="h-[90%] w-[94%] rounded-md [perspective:1000px] relative flex flex-col items-center"
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