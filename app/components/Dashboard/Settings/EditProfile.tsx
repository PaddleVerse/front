'use client';
import React, { useState } from 'react'
import Image from 'next/image'
import { useForm } from 'react-hook-form';
import { useGlobalState } from '../../Sign/GlobalState';

const EditProfile = () => {
  const { state } = useGlobalState();
  const { user } = state;

  const { register, handleSubmit } = useForm();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  
  const onSubmit = (data : any) => { };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files && event.target.files[0];
    if (file) {
      if (file.size > 15 * 1024 * 1024) {
        alert('File size exceeds 15MB.');
      } else {
        setSelectedFile(file);
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreview(reader.result as string);
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const handleSave = () => {
    console.log(selectedFile);
  }


  return (
    <div className='flex mx-20 my-20 flex-col w-full'>
      <div className='flex flex-col gap-2 justify-start'>
        <h1 className='text-xl text-white font-light'> Account </h1>
        <p className='text-[#c2c2c2] text-sm font-light'>Information necessary for your account</p>
      </div>

      <div className='mt-20 flex items-center justify-between w-full border-b-[0.5px] border-white pb-10'>
        <div className='flex items-center'>
          {user && <Image src={user?.picture} alt='profile' width={200} height={200} className="object-cover h-[120px] w-[120px] rounded-full" />}
          <div className='flex flex-col gap-1 ml-10'>
            <h1 className='text-md text-white font-light'>Profile Picture</h1>
            <p className='text-[#c2c2c2] text-sm font-light'>PNG, JPEG under 15MB</p>
          </div>
        </div>
        <div className=' flex gap-3'>
          <label htmlFor="uploadFile1"
            className="bg-gray-800 hover:bg-gray-700 text-white text-sm px-4 py-2.5 outline-none rounded w-max cursor-pointer mx-auto block font-[sans-serif]">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 mr-2 fill-white inline" viewBox="0 0 32 32">
              <path
                d="M23.75 11.044a7.99 7.99 0 0 0-15.5-.009A8 8 0 0 0 9 27h3a1 1 0 0 0 0-2H9a6 6 0 0 1-.035-12 1.038 1.038 0 0 0 1.1-.854 5.991 5.991 0 0 1 11.862 0A1.08 1.08 0 0 0 23 13a6 6 0 0 1 0 12h-3a1 1 0 0 0 0 2h3a8 8 0 0 0 .75-15.956z"
                data-original="#000000" />
              <path
                d="M20.293 19.707a1 1 0 0 0 1.414-1.414l-5-5a1 1 0 0 0-1.414 0l-5 5a1 1 0 0 0 1.414 1.414L15 16.414V29a1 1 0 0 0 2 0V16.414z"
                data-original="#000000" />
            </svg>
              Upload an image
            <input type="file" accept="image/*" id='uploadFile1' className="hidden" />
          </label>
          <button className='text-[#000000] font-light bg-[#c0c0c0a8] p-2 rounded-lg' onClick={handleSave}>Save</button>
        </div>
      </div>
      <div className='w-full'>
      <form onSubmit={handleSubmit(onSubmit)}>
          <div className='flex justify-between items-end gap-20 mt-10'>
            <div className='flex flex-col gap-2 w-1/3'>
              <label className='text-white font-light'>Name</label>
              <input
                type='text'
                placeholder='Name'
                className='bg-gray-800 px-4 py-2 rounded-2xl text-white font-light w-full'
                {...register('name')}
              />
            </div>
            <div className='flex flex-col gap-2 w-1/3'>
              <label className='text-white font-light'>Username</label>
              <input
                type='text'
                placeholder='Username'
                className='bg-gray-800 px-4 py-2 rounded-2xl text-white font-light w-full'
                {...register('username')}
              />
            </div>
            <div className='flex flex-col w-1/6'>
              <button type='submit' className='text-[#000000] font-light bg-white p-2 w-[80%] rounded-xl'>Save</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditProfile