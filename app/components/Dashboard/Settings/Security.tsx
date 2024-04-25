'use client'
import React, {  useEffect, useState } from 'react'
import { useGlobalState } from '../../Sign/GlobalState'
import Image from 'next/image'

import { cn } from "@/components/cn";
import { Label } from "@/components/ui/newlabel";
import { Input } from "@/components/ui/newinput";

import axios from 'axios'
import { useForm } from 'react-hook-form'
import EnterCode from './otp'
import { ipAdress } from '@/app/utils'

const Security = () => {
  const [qrcode, setQrcode] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [isCodeCorrect, setIsCodeCorrect] = useState(false);
  const { register, handleSubmit, reset } = useForm();
  const [is , setIs] = useState(false);
  const [isBlurred, setIsBlurred] = useState(false);
  const [isReset, setIsReset] = useState(false);

 
  const tmp_qrcode = "data:image/png;base64,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";
  const {state, dispatch} = useGlobalState()
  const {user} = state;

  const getCookie = (name: string) => {
    if (typeof window === 'undefined') return;
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    
    if (parts.length === 2) {
      const cookieValue = parts.pop()?.split(';').shift();
      return cookieValue;
    } else {
      return undefined;
    }
  };

  const accessToken = getCookie("access_token");

  const enable = () => {
    setShowPopup(true);
    axios.post(`http://${ipAdress}:8080/auth/2fa`, {
        userId : user?.id
    }, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    })
    .then(res => { setQrcode(res?.data?.Qr) ; setIsBlurred(false); })
    .catch(err => console.log(err))
  }
  
  useEffect(() => {
    if (!user?.twoFa)
      enable();
    else
      setIsBlurred(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  } , [user]);


  const onSubmit = (data : any) => {

    if (isBlurred) return;
    axios.post(`http://${ipAdress}:8080/auth/v2fa`, {
      token : data?.code,
      userId : user?.id
    }, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    })
    .then(res => {
      if (res?.data?.ok) { setIs(!is); setIsCodeCorrect(false); setIsReset(true);}
      else {setIsCodeCorrect(true); setIsReset(false);}
    })
    .catch(err => console.log(err))
    reset();
  }

  const disable = () => {
    axios.post(`http://${ipAdress}:8080/auth/disable2fa`, {
      userId : user?.id
    }, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    })
    .then(() => setIs(!is))
    .catch(err => console.log(err))
  }

  
  const refreshUser = async () => {
    try {
      const response : any = await axios.get(`http://${ipAdress}:8080/user/${user?.id}`);
      const usr = response.data;
      dispatch({type: 'UPDATE_USER', payload: usr});
    } catch (error) {
      console.error('Error fetching user', error);
    }
  }

  useEffect(() => {
    refreshUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [is]);


  return (
    <div className='flex flex-col gap-10 w-full'>
      <div className='flex flex-col gap-2 justify-start border-b-[0.1px] border-white pb-6'>
        <h1 className='text-xl text-white font-light'> Security </h1>
        <p className='text-[#c2c2c2] text-sm font-light'>Secure your account</p>
      </div>
      <div className='w-full'>
      <form >
          <div className='flex justify-between items-end gap-20'>
            <div className='flex flex-col gap-2 w-1/3'>
              <LabelInputContainer className="mb-4">
                <Label htmlFor="old password">Old password</Label>
                <Input id="old password" placeholder="Enter your old password" type="text"/>
              </LabelInputContainer>
            </div>
            <div className='flex flex-col gap-2 w-1/3'>
              <LabelInputContainer className="mb-4">
                <Label htmlFor="new password">New password</Label>
                <Input id="new password" placeholder="Enter your new password" type="text"/>
              </LabelInputContainer>
            </div>
          </div>
          <div className='flex flex-col mt-10 w-1/6'>
            <button type='submit' className='text-[#000000] font-light bg-white p-2 w-[80%] rounded-xl'>Submit</button>
          </div>
        </form>
      </div>
      <div>
        <div className='flex flex-col gap-2 justify-start border-b-[0.1px] border-white pb-6'>
          <h1 className='text-xl text-white font-light'> MFA </h1>
          <p className='text-[#c2c2c2] text-sm font-light'>Use an authenticator app  and scan the QR code, or <span className='text-red-600'>click here</span> to copy the code and setup manually.</p>
        </div>
        <div className='w-full'>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className='flex justify-between items-start gap-20'>
              <div className='flex flex-col justify-start items-start gap-2 w-1/2 mt-10'>
                <p className='text-[#c2c2c2] text-sm font-light'>Use a phone app like google Authenticator, Authy, LastPass Authenticator, or Microsoft Authenticator, etc.<br/> to get 2FA codes when prompted during sign-in.</p>
                <label className='text-white font-light'>Verify the code from the app.</label>

                <EnterCode register={register} isError={isCodeCorrect} reset={isReset}/>

                <div className='flex flex-row mt-10 w-1/2'>
                  <button type='submit'
                  className={`text-[#000000] font-light bg-white p-2 w-[80%] rounded-xl ${isBlurred ? 'blur' : ''}`}
                  disabled={isBlurred}
                  >
                    Submit
                  </button>
                  <button type='button'
                  className={`text-[#000000] font-light bg-red-600 p-2 w-[40%] ml-8 rounded-xl ${!isBlurred ? 'blur' : ''}`} 
                  onClick={isBlurred ? disable : undefined} 
                  disabled={!isBlurred}
                  >
                    Disable
                  </button>
                </div>
              </div>
              <div className='flex flex-col gap-2 w-1/3'>
              {
                qrcode ? <Image
                  src={qrcode && qrcode}
                  alt='qrcode'
                  width={400}
                  height={400}
                  className={`object-cover rounded-lg h-[240px] w-[240px] mt-10 ${isBlurred ? 'blur' : ''}`}
                />
                : <Image
                  src={tmp_qrcode}
                  alt='qrcode'
                  width={400}
                  height={400}
                  className='object-cover rounded-lg h-[240px] w-[240px] mt-10 blur'/>
              }
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Security


const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("flex flex-col space-y-2 w-full", className)}>
      {children}
    </div>
  );
};