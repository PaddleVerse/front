'use client';
import Content from "../components/Dashboard/Overview/Content";
import Sidebar from "../components/Dashboard/Sidebar/Sidebar";
import {GlobalStateProvider, useGlobalState} from "../components/Sign/GlobalState";
import React,{useState, useEffect} from "react";

const page = () => {
  const {state , dispatch} = useGlobalState();
  
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

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    
    // get the access token from the cookie
    const accessToken = getCookie("access_token");
    if (accessToken)
    {
        fetch("http://localhost:8080/auth/protected", {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
        })
        .then(response => { return response.json();})
        .then(data => {
          if (data || data.message !== "Unauthorized")
            dispatch({type: 'UPDATE_PROPERTY', payload: data});
        })
        .catch(error => {
          console.log("Error during protected endpoint request", error);
        });
    }
  }, []);

  return (
    <div className="h-full w-full flex flex-1 overflow-y-auto no-scrollbar">
      <div className="flex w-full h-full ">
          <Content />
      </div>
    </div>
  );
};

export default page;
