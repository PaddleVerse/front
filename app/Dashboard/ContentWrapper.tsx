'use client';
import React,{useState,useEffect} from 'react';
import Sidebar from "../components/Dashboard/Sidebar/Sidebar";
import Navbar from "../components/Dashboard/Navbar/Navbar";
import { useRouter } from 'next/navigation';
import {GlobalStateProvider} from "../components/Sign/GlobalState";
import V2fa from '../components/V2fa/V2fa';
import { ipAdress, fetchData } from '@/app/utils';

interface Props {children: React.ReactNode;}

function ContentWrapper({ children }: Props) {

    const [isAuth, setIsAuth] = useState("false");
    const [id, setId] = useState(-1);
  
    
  
    const router = useRouter();
    useEffect(() => {
    fetchData(`http://${ipAdress}:8080/auth/protected`, "GET", null)
    .then((res : any) => {
      if (!res)
        router.push('/');
      const data = res?.data;
      if (!data || data?.error === "Unauthorized" || data?.message === "Unauthorized")
        router.push('/');
      else
      {
        setId(data?.id);
        setIsAuth(data.twoFa ? "2fa" : "true");
      }
    })
    .catch((error : any) => {
      console.log("Error during protected endpoint request", error);
      router.push('/');
    });
    }, [router]);

  return (
    <GlobalStateProvider>
        <div className="w-full h-full flex ">
            {
                isAuth === "true" ? 
                <>
                    <Sidebar />
                    <div className="w-full flex flex-col overflow-y-auto">
                        <Navbar />
                        {children}
                    </div>
                </>
                : isAuth === "2fa" ? 
                <V2fa setIsAuth={setIsAuth} userId={id}/>
                :
                <div className='w-full h-full flex justify-center items-center'>
                    <div className="loader animate-loader"></div>
                </div>
            }
        </div>
    </GlobalStateProvider>
  );
}

export default ContentWrapper;