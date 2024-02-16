'use client';
import React,{useState,useEffect} from 'react';
import Sidebar from "../components/Dashboard/Sidebar/Sidebar";
import Navbar from "../components/Dashboard/Navbar/Navbar";
import { useRouter } from 'next/navigation';
import {GlobalStateProvider} from "../components/Sign/GlobalState";

interface Props {children: React.ReactNode;}

function ContentWrapper({ children }: Props) {

    const [isAuth, setIsAuth] = useState(false);
  
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
          fetch("http://localhost:8080/auth/protected", {
          method: 'GET',
          headers: {
              'Authorization': `Bearer ${accessToken}`
          }
          })
          .then(response => { return response.json();})
          .then(data => {
            if (!data || data?.error === "Unauthorized" || data?.message === "Unauthorized")
              router.push('/');
            else
              setIsAuth(true);
          })
          .catch(error => {
            console.error("Error during protected endpoint request", error);
          });
      }
      else
        router.push('/');
    }, []);

  return (
    <GlobalStateProvider>
        <div className="w-full h-full flex">
            {
                isAuth ? 
                <>
                    <Sidebar />
                    <div className="w-full flex flex-col">
                        <Navbar />
                        {children}
                    </div>
                </>
                :
                <div className='w-full h-full flex justify-center items-center'>
                    <h1 className="text-white text-2xl">
                        Loading...
                    </h1>
                </div>
            }
        </div>
    </GlobalStateProvider>
  );
}

export default ContentWrapper;