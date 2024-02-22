'use client'
import React, {  useEffect, useState } from 'react'
import { useGlobalState } from '../../Sign/GlobalState'
import Popup from './Popup'
import axios from 'axios'
import { useForm } from 'react-hook-form'

const Security = () => {
  const [qrcode, setQrcode] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const { register, handleSubmit, reset } = useForm();
  const [is , setIs] = useState(false);

  

  const {state} = useGlobalState()
  const {user} = state;

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

  const accessToken = getCookie("access_token");

  const enable = () => {
    setShowPopup(true);
    axios.post("http://localhost:8080/auth/2fa", {
        userId : user?.id
    }, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    })
    .then(res => setQrcode(res?.data?.Qr))
    .catch(err => console.log(err))
  }

  const onSubmit = (data : any) => {
    reset();
    axios.post("http://localhost:8080/auth/v2fa", {
      token : data?.value,
      userId : user?.id
    }, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    })
    .then(res => console.log(res?.data?.ok))
    .catch(err => console.log(err))
  }

  useEffect(() => {
    
  } , [is]);
  return (
    <div className=''>
      <button
        onClick={enable}
        className='bg-gray-700 text-white font-bold py-2 px-4 rounded'
      >
        { user?.twoFa ? 'Disable 2fa' : 'Enable 2fa' }
      </button>
      <button onClick={enable}>Open Popup</button>
      {showPopup && (
        <Popup isVisible={showPopup} seter={setShowPopup} reset={reset}>
          <div className='flex flex-col items-center gap-4'>
            { qrcode && <img src={qrcode} alt='qrcode' /> }
            <form onSubmit={handleSubmit(onSubmit)}>
              <input
                type='text'
                autoComplete="off"
                {...register("value")}
                className="rounded-xl w-[80%] px-4 text-[#000000] font-semibold text-lg xm:text-xl md:text-2xl border-b-2 tracking-wider"
              />
              <button
                type="submit"
                className="mt-4 p-2 bg-green-500 hover:bg-green-700 text-white w-full rounded-md"
              >
                Submit
              </button>
            </form>
          </div>
        </Popup>
      )}
    </div>
  )
}

export default Security