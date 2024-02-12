'use client'
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation'
import UserProfile from '@/app/components/Dashboard/Profile/UserProfile';
import axios from 'axios';

const Profile = () => {
  const searchParams = useSearchParams()
  const [targetUser, setTargetUser] = useState(null)
 
  const id = searchParams.get('id')
  useEffect(() => {
    axios.get(`http://localhost:8080/user/${id}`).then((res) => {
      setTargetUser(res.data)
    })
  } , [id])
  
  return (
    <div className="w-[100%] mt-[50px] flex flex-col gap-10 items-center">
    <div className="xl:flex-row w-[94%] flex flex-col gap-7">
      <div className="flex flex-col w-full gap-8">
        {targetUser && <UserProfile target={targetUser}/>}
      </div>
    </div>
  </div>
  );
};

export default Profile;
