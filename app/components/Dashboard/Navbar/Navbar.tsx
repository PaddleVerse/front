"use client";
import React from "react";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import axios from "axios";
import Image from "next/image";

const Navbar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const cleanCookie = () => {
    const cookies = document.cookie.split(";");

    for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i];
        const eqPos = cookie.indexOf("=");
        const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
    }
}


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

  const handleLogout = async () => {
    axios.post(
      'http://localhost:8080/auth/logout',
      {},
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    ).then((res) => {
      cleanCookie();
      router.push('/');
    }
    ).catch((err) => {
      console.log(err);
    });
  }

  return (
    <div className="w-full flex justify-center"
    >
      <div
        className="w-[95%] h-14 bg-transparent rounded-b-sm md:flex hidden justify-between items-center"
        style={{
          backdropFilter: "blur(20px)",
          backgroundColor: "rgba(13, 9, 10, 0.7)",
        }}
      >
        <span className="text-gray-400 ml-10 text-[14px]">{pathname}</span>
        <button
        onClick={handleLogout}
        className="text-gray-400 ml-10 text-[14px] flex gap-1 justify-center items-center mr-10">
          <span>Logout</span>
          <svg width="18" height="19" viewBox="0 0 18 19" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M2 18.5C1.45 18.5 0.979333 18.3043 0.588 17.913C0.196667 17.5217 0.000666667 17.0507 0 16.5V2.5C0 1.95 0.196 1.47933 0.588 1.088C0.98 0.696667 1.45067 0.500667 2 0.5H9V2.5H2V16.5H9V18.5H2ZM13 14.5L11.625 13.05L14.175 10.5H6V8.5H14.175L11.625 5.95L13 4.5L18 9.5L13 14.5Z" fill="white" fillOpacity="0.5"/>
          </svg>
        </button>
      </div>
    </div>
  );
};

export default Navbar;