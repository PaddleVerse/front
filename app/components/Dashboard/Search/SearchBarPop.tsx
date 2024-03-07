'use client';
import React, { use, useEffect, useState } from 'react'
import UserSearchCard from './UserSearchCard'
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useGlobalState } from '../../Sign/GlobalState';

const SearchBarPop = () => {
    const router = useRouter();
    const {state} = useGlobalState();
    const { user } = state;

    const [isfocus , setIsFocus] = useState(false);
    const [users , setUsers] = useState<any>([]);
    const [inputValue, setInputValue] = useState('');
    const [filteredUsers, setFilteredUsers] = useState<any>([]);
    const [searchedUsers, setSearchedUsers] = useState<any>([]);
    const [is , setIs] = useState(false);
    const [title , setTitle] = useState('Recent Searches');


    const handleInputChange = (event : React.ChangeEvent<HTMLInputElement>) => {
      setInputValue(event.target.value.trim());
      setTitle('Search Results');
    };

    const filterUsers = (inputValue : string) => {
      setTimeout(() => {
        if (user?.id === undefined) return;
        axios.get(`http://localhost:8080/search/${inputValue}/${user?.id}`)
        .then(res => {
          setFilteredUsers(res.data);
        })
      }, 100);
    }

    useEffect(() => {
        if (inputValue === '') 
        {
          setFilteredUsers(searchedUsers);
          setIs(!is);
          setTitle('Recent Searches');
          return;
        }
        filterUsers(inputValue);
    } , [inputValue])

    useEffect(() => {
      axios.get('http://localhost:8080/search/searchedUsers')
      .then(res => {
        setSearchedUsers(res.data);
        setFilteredUsers(res.data);
      })
    }, [users, is])

    useEffect(() => {
        axios.get('http://localhost:8080/user')
          .then(res => {
            setUsers(res.data?.filter((u : any) => u?.id !== user?.id));
          })
    } , [])

    const handleclick = (id : any) => {
      axios.post('http://localhost:8080/search', {
        userId: id
      }).catch();
      router.push(`/Dashboard/Profile?id=${id}`);
    }

  return (
    <div className=' flex justify-center items-center flex-col'>
        <input
            className='w-[90%] h-14 p-6 text-sm text-white rounded-xl mt-10 bg-[#434343d9] shadow-xl focus:outline-none focus:ring-[1px] focus:ring-red-400/[0.5] transition duration-300 ease-in-out'
            type='text'
            placeholder='Look for other gamers!'
            onFocus={() => setIsFocus(true)}
            onBlur={() => setTimeout(() => setIsFocus(false), 150)}
            onChange={handleInputChange}
        />
        {isfocus && (
            <div className="absolute top-0 w-[80%] xl:h-[35%] h-[50%] rounded-md bg-[#000000] z-40 mt-28 p-4 overflow-y-scroll" style={{ scrollBehavior: 'smooth' }}>
                <div>
                    <h1 className='text-white text-xl my-4 ml-2'>{title}</h1>
                    <div className='flex justify-start items-start flex-wrap'>
                        { filteredUsers && filteredUsers?.map((user : any) => (
                            <UserSearchCard user={user} key={user.id} handleClick={handleclick}/>
                        ))
                        }
                    </div>
                </div>
            </div>
        )}
    </div>
  )
}

export default SearchBarPop