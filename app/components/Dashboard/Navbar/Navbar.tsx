"use client";
import React from "react";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import axios from "axios";

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
          <img
            loading="lazy"
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/8f732370a24ab06585f4eb2085de2a8322c4a75d2ded72839c1d57c7f44bddfa?"
            className="w-full aspect-square fill-white fill-opacity-50 max-w-[18px]"
          />
        </button>
      </div>
    </div>
  );
};

export default Navbar;
