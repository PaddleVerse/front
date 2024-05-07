'use client';
import React, { useState } from 'react'
import Image from 'next/image'
import { useForm } from 'react-hook-form';
import { useGlobalState } from '../../Sign/GlobalState';

import { cn } from "@/components/cn";
import { Label } from "@/components/ui/newlabel";
import { Input } from "@/components/ui/newinput";
import { ipAdress } from '@/app/utils';

import axios from 'axios';

const EditProfile = () => {
  const { state, dispatch } = useGlobalState();
  const { user } = state;

  const { register, handleSubmit, reset } = useForm();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  
  const refreshUser = async () => {
    try {
      const response : any = await axios.get(`http://${ipAdress}:8080/user/${user?.id}`);
      const usr = response.data;
      dispatch({type: 'UPDATE_USER', payload: usr});
    } catch (error) {
      console.error('Error fetching user', error);
    }
  }
  
  const onSubmit = (data : any) => { 
    axios.put(`http://${ipAdress}:8080/user/${user?.id}`, data)
    .then((res) => {

      if (res.data !== '')
      {
        refreshUser();
        reset();
      }
    })
    .catch((error) => {
      console.error('Error updating user', error);
    });
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) return; // Handle empty selection

    // Validate file type and size
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file.');
      return;
    }

    if (file.size > 15 * 1024 * 1024) { // 15MB
      alert('Image size must be less than 15MB.');
      return;
    }

    setSelectedFile(file);
    setPreview(URL.createObjectURL(file));
  };



  const handleUpload = async () => {
    if (!selectedFile) return;

    try {
      const formData = new FormData();
      formData.append('image', selectedFile);
      
      await axios.put(`http://${ipAdress}:8080/user/img/${user?.id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      refreshUser();
      setSelectedFile(null);
    } catch (error) {}
  };


  return (
    <div className='flex flex-col w-full'>
      <div className='flex flex-col gap-2 justify-start'>
        <h1 className='text-xl text-white font-light'> Account </h1>
        <p className='text-[#c2c2c2] text-sm font-light'>Information necessary for your account</p>
      </div>

      <div className='mt-20 flex items-center justify-between w-full border-b-[0.5px] border-white pb-10'>
        <div className='flex items-center'>
          {user && <Image priority src={preview || user?.picture} alt='profile' width={200} height={200} className="object-cover h-[120px] w-[120px] rounded-full" />}
          <div className='flex flex-col gap-1 ml-10'>
            <h1 className='sm:text-md text-sm text-white font-light sm:flex hidden'>Profile Picture</h1>
            <p className='text-[#c2c2c2] text-sm font-light sm:flex hidden'>PNG, JPEG under 15MB</p>
          </div>
        </div>
        <div className=' flex gap-3 sm:flex-row flex-col'>
          <label htmlFor="uploadFile1"
            className="bg-white hover:bg-gray-200 text-[#000000] text-sm px-4 py-2.5 outline-none rounded w-max cursor-pointer mx-auto block font-[sans-serif]">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 mr-2 fill-[#000000] inline" viewBox="0 0 32 32">
              <path
                d="M23.75 11.044a7.99 7.99 0 0 0-15.5-.009A8 8 0 0 0 9 27h3a1 1 0 0 0 0-2H9a6 6 0 0 1-.035-12 1.038 1.038 0 0 0 1.1-.854 5.991 5.991 0 0 1 11.862 0A1.08 1.08 0 0 0 23 13a6 6 0 0 1 0 12h-3a1 1 0 0 0 0 2h3a8 8 0 0 0 .75-15.956z"
                data-original="#000000" />
              <path
                d="M20.293 19.707a1 1 0 0 0 1.414-1.414l-5-5a1 1 0 0 0-1.414 0l-5 5a1 1 0 0 0 1.414 1.414L15 16.414V29a1 1 0 0 0 2 0V16.414z"
                data-original="#000000" />
            </svg>
              Upload an image
            <input type="file" accept="image/*" id='uploadFile1' className="hidden" onChange={handleFileChange}/>
          </label>
          <button className='text-[#000000] font-light bg-[#eeeeeecd] p-2 rounded-lg' onClick={handleUpload}>Save</button>
        </div>
      </div>
      <div className='w-full'>
      <form onSubmit={handleSubmit(onSubmit)}>
          <div className='flex justify-between items-end gap-20 mt-10'>
            <div className='flex flex-col gap-2 w-1/3'>
              <LabelInputContainer className="mb-4">
                <Label htmlFor="name">Name</Label>
                <Input id="name" placeholder="Enter your name" type="text" {...register('name')}/>
              </LabelInputContainer>
            </div>
            <div className='flex flex-col gap-2 w-1/3'>
              <LabelInputContainer className="mb-4">
                <Label htmlFor="nickname">Nickname</Label>
                <Input id="nickname" placeholder="Enter your nickname" type="text" {...register('nickname')}/>
              </LabelInputContainer>
            </div>
          </div>
          <div className='flex flex-col mt-10 w-1/6'>
            <button type='submit' className='text-[#000000] font-light bg-white p-2 sm:w-[80%] rounded-xl w-[100px]'>Submit</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditProfile

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