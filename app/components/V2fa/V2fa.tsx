"use client";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";


import SignButton from "../Sign/SignButton";
import EnterCode from "../Dashboard/Settings/otp";
import axios from "axios";
import { useState } from "react";


export default function V2fa({setIsAuth, userId} : any) {
  
  const { register, handleSubmit , reset} = useForm();
  const [is , setIs] = useState(false);

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

 const onSubmit = (data:any) => {
    if (userId === -1 || typeof window === "undefined") return;

    axios.post("http://localhost:8080/auth/v2fa", {
      token : data?.code,
      userId : userId
    }, {
      headers: {
        'Authorization': `Bearer ${getCookie("access_token")}`
      }
    })
    .then(res => {
      if (res?.data?.ok) setIsAuth("true");
      else setIs(true);
    })
  .catch(err => console.log(err))
  reset();
 };
  
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="md:w-[480px] pb-[40px] sm:pb-[50px] bg-dashBack flex flex-col items-center rounded-2xl md:rounded-lg w-[310px] xm:w-[370px] select-none ring-[0.2px] ring-red-500">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col justify-center items-center pt-10">
            <motion.h1
              className='text-redValorant lg:text-4xl md:text-3xl text-2xl font-semibold mb-2 sm:mb-0'
            >
              Two-Factor Authentication
            </motion.h1>
            <span className="w-4/5 bg-white border-[0.5px] mt-4"></span>
            <p className='w-4/5 text-[#c2c2c2] text-center text-sm font-light mt-4'>Use a phone app like google Authenticator, or Microsoft Authenticator, etc. to get 2FA codes when prompted during sign-in.</p>
            <label className='text-white font-light mt-4 mb-2'>Verify the code from the app.</label>
            <EnterCode register={register} isError={is} reset={false}/>
            <div className="w-full flex items-center justify-center">
              <SignButton p="SUBMIT" />
            </div>
          </div>
        </form>
        <span className="w-4/5 bg-white border mt-10"></span>
      </div>
    </div>
  );
}
