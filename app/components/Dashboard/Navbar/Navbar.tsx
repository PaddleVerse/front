"use client";
import axios from "axios";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { IoNotifications } from "react-icons/io5";
import { useGlobalState } from "../../Sign/GlobalState";
import NotificationCard from "./NotificationCard";
import { ipAdress } from "@/app/utils";

const Navbar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [notifed, setNotifed] = useState(false);
  const { state, dispatch } = useGlobalState();
  const { user, socket } = state;

  const handleClick = () => {
    if (socket) {
      socket.emit('!notified', {'userId': user?.id} );
    }
    setOpen(!open);
    setNotifed(false);
  };

  const cleanCookie = () => {
    const cookies = document.cookie.split(";");

    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i];
      const eqPos = cookie.indexOf("=");
      const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
      document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
    }
  };

  useEffect(() => {
    if (!user || !socket) return;
    console.log(user?.notified);
    if (user?.notified === true) setNotifed(true);
    socket?.on('notification', () => {
      setNotifed(true);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket, user]);

  useEffect(() => {
    if (!socket || !user) return;
    socket?.on("notification", (data: any) => {
      if (data?.ok === 0) return;
      axios
        .get(`http://${ipAdress}:8080/user/${user?.id}`)
        .then((res) => {
          dispatch && dispatch({ type: "UPDATE_USER", payload: res.data });
        })
        .catch(() => {});
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  } , [socket]);

  const getCookie = (name: string) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);

    if (parts.length === 2) {
      const cookieValue = parts.pop()?.split(";").shift();
      return cookieValue;
    } else {
      return undefined;
    }
  };

  const accessToken = getCookie("access_token");

  const handleLogout = async () => {
    axios
      .post(
        `http://${ipAdress}:8080/auth/logout`,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )
      .then((res) => {
        cleanCookie();
        router.push("/");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="w-full flex justify-center z-50">
      <div className="w-[95%] h-14 bg-primaryColor rounded-b-sm md:flex hidden justify-between items-center">
        <span className="text-gray-400 ml-10 text-[14px]">{pathname}</span>
        <div className="flex justify-center items-center relative">
          <div>
            <button
              onClick={handleClick}
              className=" relative h-8 w-8 flex justify-center items-center text-gray-300 select-none rounded-2xl text-center align-middle font-sans text-xs font-medium uppercase transition-all hover:bg-gray-100/10 active:bg-gray-100/20 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
            >
              <IoNotifications className="h-6 w-6" />
              {notifed && (
                <div className="absolute bg-gray-900 p-1 rounded-full top-0 right-0">
                  <div className="bg-red-500 rounded-full w-[6px] h-[6px]"></div>
                </div>
              )}
            </button>
            {open && (
              <ul
                className="absolute w-[200%] #9c9c9c66 bg-gray-200 left-[-100%] rounded-xl mt-2"
                onBlur={() => setOpen(false)}
              >
                {user && user?.notifications.length !== 0 ? (
                  user?.notifications.map((not: any, index: any) => (
                    <li key={index}>
                      <NotificationCard not={not} setOpen={setOpen} />
                    </li>
                  ))
                ) : (
                  <li className="py-4 text-center text-gray-500">
                    {" "}
                    There are no notifications{" "}
                  </li>
                )}
              </ul>
            )}
          </div>
          <button
            onClick={handleLogout}
            className="text-gray-400 ml-10 text-[14px] flex gap-1 justify-center items-center mr-10"
          >
            <span>Logout</span>
            <svg
              width="18"
              height="19"
              viewBox="0 0 18 19"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M2 18.5C1.45 18.5 0.979333 18.3043 0.588 17.913C0.196667 17.5217 0.000666667 17.0507 0 16.5V2.5C0 1.95 0.196 1.47933 0.588 1.088C0.98 0.696667 1.45067 0.500667 2 0.5H9V2.5H2V16.5H9V18.5H2ZM13 14.5L11.625 13.05L14.175 10.5H6V8.5H14.175L11.625 5.95L13 4.5L18 9.5L13 14.5Z"
                fill="white"
                fillOpacity="0.5"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
