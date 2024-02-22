'use client';
import React, { useState } from 'react'
import Sidebar from './Sidebar'
import EditProfile from './EditProfile'

const Helder = () => {
  const [current, setCurrent] = useState('My profile');
  return (
    <div className='w-[94%] bg-transparent flex sm:h-[95%] xl:h-[98%] h-[98%] rounded-lg'
    style={{
      backdropFilter: "blur(20px)",
      backgroundColor: "rgba(13, 9, 10, 0.7)",
    }}
    >
      <Sidebar current={current} setCurrent={setCurrent} />
      <div className='flex mt-[40px] w-full'>
        {current === 'My profile' && <EditProfile />}
        {current === 'Security' && <h1 className='text-white'>Security</h1>}
        {current === 'Preferences' && <h1 className='text-white'>Preferences</h1>}
      </div>
    </div>
  )
}

export default Helder