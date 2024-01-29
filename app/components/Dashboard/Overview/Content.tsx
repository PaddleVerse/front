'use client';
import React, {useState, useEffect} from "react";
import Navbar from "../Navbar/Navbar";
import ContentCenter from "./ContentCenter";
import { useRouter } from 'next/navigation';
import { useGlobalState } from "../../Sign/GlobalState";

const Content = () => {
  const { state, dispatch } = useGlobalState();

  const [isAuth, setIsAuth] = useState(false);

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

  const router = useRouter();
  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    
    // get the access token from the cookie
    const accessToken = getCookie("access_token");
    // alert(accessToken);

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
          if (!data || data.message === "Unauthorized")
          {
            router.push('/');
          }
          else
          {
            setIsAuth(true);
            // console.log(data);
            dispatch({type: 'UPDATE_PROPERTY', payload: data});
          }
        })
        .catch(error => {
          console.error("Error during protected endpoint request", error);
        });
    }
    else
    {
      router.push('/');
    }
  }, []);

  return isAuth ? <ContentCenter /> : null;

};

export default Content;
