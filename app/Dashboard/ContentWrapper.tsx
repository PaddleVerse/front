'use client';
import React,{useState,useEffect} from 'react';
import Sidebar from "../components/Dashboard/Sidebar/Sidebar";
import Navbar from "../components/Dashboard/Navbar/Navbar";
import { useRouter } from 'next/navigation';
import {GlobalStateProvider} from "../components/Sign/GlobalState";
import V2fa from '../components/V2fa/V2fa';
import { ipAdress } from '@/app/utils';

interface Props {children: React.ReactNode;}

function ContentWrapper({ children }: Props) {

    const [isAuth, setIsAuth] = useState("false");
    const [id, setId] = useState(-1);
  
    const getCookie = (name: string) => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      
      if (parts.length === 2) {
        const cookieValue = parts.pop()?.split(';').shift();
        return cookieValue;
      } else {
        return undefined;
      }
    };
  
    const router = useRouter();
    useEffect(() => {
      if (typeof window === "undefined") {
        return;
      }

      // get the access token from the cookie
      const accessToken = getCookie("access_token");
      // alert(accessToken);
      if (accessToken)
      {
          fetch(`http://${ipAdress}:8080/auth/protected`, {
          method: 'GET',
          headers: {
              'Authorization': `Bearer ${accessToken}`
          }
          })
          .then(response => { return response.json(); })
          .then(data => {

            console.log("--->",data);
            
            if (!data || data?.error === "Unauthorized" || data?.message === "Unauthorized")
              router.push('/');
            else
            {
              setId(data?.id);
              if (data?.twoFa)
                setIsAuth("2fa");
              else
                setIsAuth("true");
            }
          })
          .catch(error => {
            console.error("Error during protected endpoint request", error);
          });
      }
      else
        router.push('/');
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