'use client';
import React, { use, useEffect, useState } from 'react'
import UserSearchCard from './UserSearchCard'
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useGlobalState } from '../../Sign/GlobalState';

const SearchBarPop = () => {
    const router = useRouter();
    const {state} = useGlobalState();

    const [isfocus , setIsFocus] = useState(false);
    const [users , setUsers] = useState<any>([]);
    const [inputValue, setInputValue] = useState('');
    const [filteredUsers, setFilteredUsers] = useState<any>([]);
    const [searchedUsers, setSearchedUsers] = useState<any>([]);
    const [is , setIs] = useState(false);
    const [status , setStatus] = useState(false);
    const [title , setTitle] = useState('Recent Searches');

    const { socket } = state;
    useEffect(() => {
      socket?.on('ok', () => setStatus(!status));

      return () => {
        socket?.off('ok');
      }
    }, [])

    const handleInputChange = (event : React.ChangeEvent<HTMLInputElement>) => {
      setInputValue(event.target.value.trim());
      setTitle('Search Results');
    };

    const filterUsers = async (inputValue : string) => {
        const filteredUsers = await users.filter((user : any) => {
          return user?.name.toLowerCase().includes(inputValue.toLowerCase());
        });
        setFilteredUsers(filteredUsers);
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
      if (users.length === 0) return;
      axios.get('http://localhost:8080/search')
      .then(res => {
        const usersID = res.data.map((user : any) => user?.userId);
        setSearchedUsers(usersID.map((id : any) => users.find((u : any) => u?.id === id)));
        setFilteredUsers(usersID.map((id : any) => users.find((u : any) => u?.id === id)));
      })
    }, [users, is])

    useEffect(() => {
        axios.get('http://localhost:8080/user')
          .then(res => {
            setUsers(res.data);
          })
    } , [status])

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
                        { filteredUsers.map((user : any) => (
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