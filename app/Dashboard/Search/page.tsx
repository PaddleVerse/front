'use client';
import React, { useRef,useState, useEffect } from 'react';
import UserCard from '../../components/Dashboard/Search/UserCard';
import SearchBarPop from '../../components/Dashboard/Search/SearchBarPop';
import { FaCaretLeft, FaCaretRight } from "react-icons/fa6";
import axios from 'axios';
import { useGlobalState } from '@/app/components/Sign/GlobalState';


const Search = () => {
  const containerRef_1:any = useRef(null);
  const containerRef_2:any = useRef(null);
  const [users , setUsers] = useState([]);
  const {state} = useGlobalState();
  const user : any= state.user;


  useEffect(() => {
    if (user)
    {
      axios.get('http://localhost:8080/user')
        .then(res => {
          const filteredUsers = res.data.filter((item:any) => item.id !== user.id);
          setUsers(filteredUsers);
        })
    }
  }, [user]);

  const handleScroll_1 = (scrollOffset :any) => {
    if (containerRef_1.current)
    {
      const currentScrollLeft = containerRef_1.current.scrollLeft;
      containerRef_1.current.scrollTo({
        left: currentScrollLeft + scrollOffset * 2,
        behavior: 'smooth',
      });
    }
  };

  const handleScroll_2 = (scrollOffset :any) => {
    if (containerRef_2.current)
    {
      const currentScrollLeft = containerRef_2.current.scrollLeft;
      containerRef_2.current.scrollTo({
        left: currentScrollLeft + scrollOffset * 2,
        behavior: 'smooth',
      });
    }
  }

  return (
    <div className='relative container mx-auto max-w-auto overflow-y-auto z-40'>
      <SearchBarPop />
      <div className='mt-20'>
        <h1 className='text-3xl text-white mt-10 font-mono'>RECOMMENDED</h1>
        <div className="flex flex-col bg-inherit relative">
        {/* <button className="hidden sm:flex absolute justify-center items-center left-0 top-0 h-full backdrop-blur-md text-white py-2 px-2 z-10" onClick={() => handleScroll_1(-100)}>
            <FaCaretLeft className='text-2xl'/>
          </button> */}
          <div className="flex overflow-x-scroll py-10 no-scrollbar w-full" ref={containerRef_1} style={{ scrollBehavior: 'smooth' }}>
            <div className="flex flex-nowrap gap-3">
              {users?.map((item, index) => (
                <div key={index} className="flex-none">
                  <UserCard user={item}/>
                </div>
              ))}
            </div>
          </div>
          {/* <button className="hidden sm:flex absolute justify-center items-center right-0 top-0 h-full backdrop-blur-md text-white py-2 px-2 z-10" onClick={() => handleScroll_1(100)}>
            <FaCaretRight className='text-2xl' />
          </button> */}
        </div>
      </div>
      <div className='mt-10'>
        <h1 className='text-3xl text-white font-mono'>RECENTLY PLAYED WITH</h1>
        <div className="flex flex-col bg-inherit relative">
          {/* <button className="hidden sm:flex absolute justify-center items-center left-0 top-0 h-full backdrop-blur-md text-white py-2 px-2 z-10" onClick={() => handleScroll_2(-100)}>
            <FaCaretLeft className='text-2xl' />
          </button> */}
          <div className="flex overflow-x-scroll py-10 no-scrollbar w-full" ref={containerRef_2} style={{ scrollBehavior: 'smooth' }}>
            <div className="flex flex-nowrap gap-3">
              {users?.map((item, index) => (
                <div key={index} className="flex-none">
                  <UserCard user={item} />
                </div>
              ))}
            </div>
          </div>
          {/* <button className="hidden sm:flex absolute justify-center items-center right-0 top-0 h-full backdrop-blur-md text-white py-2 px-2 z-10" onClick={() => handleScroll_2(100)}>
            <FaCaretRight className='text-2xl' />
          </button> */}
        </div>

      </div>
    </div>
  );
};

export default Search;

