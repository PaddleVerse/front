"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { FaChevronRight, FaPlus } from "react-icons/fa6";
import Option from "./Option";
import ProfileUser from "./ProfileUser";
import { useSwipeable } from "react-swipeable";
import { useGlobalState } from "../../Sign/GlobalState";
import { io } from "socket.io-client";

const image =
  "https://preview.redd.it/dwhdw8qeoyn91.png?width=640&crop=smart&auto=webp&s=65176fb065cf249155e065b4ab7041f708af29e4";

const image2 =
  "https://img.pikbest.com/origin/09/26/71/799pIkbEsTSty.png!w700wp";
// const showElementssideVariants = {
//   closed: {
//     transition: {
//       staggerChildren: 0.2,
//       staggerDirection: -1,
//     },
//   },
//   open: {
//     transition: {
//       staggerChildren: 0.2,
//       staggerDirection: 1,
//     },
//   },
// };



interface User{
  username    : string,
  name      : string,
  picture   :string,
  banner_picture :string 
  status    :string,
  level    : Number
  createdAt : Date,
}

const ProfileInfoVariants = {
  opened: { opacity: 1 },
  closed: { opacity: 0 },
  exit: { opacity: 0 },
};
function useWindowSize() {
  const [size, setSize] = useState(0);
  useLayoutEffect(() => {
    function updateSize() {
      setSize(window.innerWidth);
    }
    window.addEventListener("resize", updateSize);
    updateSize();
    return () => window.removeEventListener("resize", updateSize);
  }, []);
  return size;
}
const Sidebar = () => {

  const { state, dispatch } = useGlobalState();
  const user : any = state.user;
  const [expanded, setExpanded] = useState(true);
  const sidebarRef = useRef(null);
  const handlers = useSwipeable({
    onSwipedLeft: () => setExpanded(false),
    onSwipedRight: () => setExpanded(true),
    // onSwiped:()=>setExpanded(!expanded),
  });

  const tablet = useWindowSize() < 769;
  const containerVariants = {
    opened: { width: "270px" },
    closed: { width: tablet ? "1px" : "95px" },
  };
  
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
    let socket : any = null;
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
          {
            socket = io('http://localhost:8080', {query: { userId: data?.id } });
            dispatch({type: 'UPDATE_SOCKET', payload: socket});
            dispatch({type: 'UPDATE_USER', payload: data});
          }
        })
        .catch(error => {
          console.log("Error during protected endpoint request", error);
        });
    }
    return () => {
        socket?.disconnect();
    };
  }, []);
  

  return (
    <div className="flex relative lg:h-[fit-content] h-auto" {...handlers}>
      <div className="h-screen w-full absolute bg-dashBack"></div>
      <motion.div
        className="absolute border w-5 h-5 cursor-pointer z-40 lg:-right-[10px] -right-[15px] top-[80px] border-rightArrowColor lg:p-[2px] p-[20px]  text-rightArrowColor bg-rightArrowBg rounded-full flex items-center justify-center"
        onClick={() => setExpanded(!expanded)}
        initial={{ rotate: 180 }}
        animate={{ rotate: expanded ? 180 : 0 }}
      >
        <FaChevronRight />
      </motion.div>
      <motion.div
        className={`text-white bg-dashBack  flex-col h-full ${
          tablet && !expanded ? "" : "pl-6 pr-7 z-20"
        }   select-none sm:flex lg:relative absolute overflow-auto lg:overflow-visible no-scrollbar`}
        variants={containerVariants}
        animate={expanded ? "opened" : "closed"}
        initial={"opened"}
        ref={sidebarRef}
        transition={{
          duration: 0.5,
          // staggerChildren: 0.015,
          // staggerDirection: expanded ? 1 : -1,
        }}
      >
        <motion.div
          animate={{
            opacity: !expanded && tablet ? 0 : 1,
            transition: { duration: 0.5 },
          }}
          className="relative z-20"
        >
          {/* <div className={`${!expanded ? "hidden" : ""}`}> rounded-full w-20 h-20 object-cover mt-10 */}
          <motion.div className=" flex gap-4 mt-[65px] items-center">
            <motion.img
              src={user?.picture ? user?.picture : "/b.png"}
              alt="image"
              className="object-cover h-[50px] w-[50px] rounded-full"
            />
            <AnimatePresence initial={false}>
              {expanded && (
                <motion.div
                  className="flex flex-col text-center w-[150px] absolute left-[70px]"
                  initial={{ opacity: 1 }}
                  animate={{
                    opacity: expanded ? 1 : 0,
                    transition: { duration: 0.2 },
                  }}
                  // exit={{
                  //   opacity: 0,
                  //   transition: { duration: 2.8 },
                  // }}
                  // transition={{ duration: 0.29 }}
                  key="modal"
                >
                  <span className="text-[12px] text-buttonGray">NOOB</span>
                  <span className="text-[14px] w-22">{user && user.name}</span>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          <motion.span
            className="text-buttonGray text-[12px] mt-12 block"
            initial={{ paddingLeft: "29px" }}
            animate={{ paddingLeft: expanded ? "29px" : "8px" }}
            // transition={{ duration: expanded ? 1.5 : 0.1 }}
          >
            MAIN
          </motion.span>
          <div>
            <motion.div>
              <Option label={"Dashboard"} expanded={expanded}/>
              <Option label={"Chat"} expanded={expanded}/>
              <Option label={"Shop"} expanded={expanded} />
              <Option label={"Search"} expanded={expanded} />
            </motion.div>
            {/* <div className="overflow-y-scroll no-scrollbar bg-red-500 w-full z-50"> */}
            <div className="text-buttonGray mt-10 flex justify-between pl-4">
              <motion.span
                className="text-[12px]"
                // className="text-buttonGray text-[12px] mt-12"
                initial={{ marginLeft: "14px" }}
                animate={{ marginLeft: expanded ? "14px" : "-24px" }}
                // transition={{ duration: expanded ? 1.5 : 0.1 }}
              >
                MESSAGES
              </motion.span>
              <motion.div
                initial={{ opacity: 1 }}
                animate={{ opacity: expanded ? 1 : 0 }}
                transition={{ duration: expanded ? 1.5 : 0.1 }}
              >
                <FaPlus />
              </motion.div>
            </div>
            <div className="pl-7">
              <ProfileUser
                image={image}
                name="abdelmottalib"
                expanded={expanded}
              />
              <ProfileUser
                image={image}
                name="abdelmottalib"
                expanded={expanded}
              />
              <ProfileUser
                image={image}
                name="abdelmottalib"
                expanded={expanded}
              />
            </div>
            {/* </div> */}
          </div>
        </motion.div>
      </motion.div>
      {/* <motion.div
        className="absolute h-[5rem] w-[5rem] -right-[20px] top-20 bg-rightArrowBg  rounded-3xl transform rotate-45 text-right pt-1 pr-1.5 text-[1.2rem] border  cursor-pointer text-rightArrowColor border-rightArrowColor"
        // initial={{ right: "100px" }}
        animate={{ right: hovered || tablet ? "-20px" : "100px", transition: { duration: 0.4, delay:!hovered ? 0.5:0 } }}
        onMouseOver={() => setHovered(true)}
        onMouseOut={() => setHovered(false)}
        onClick={() => setExpanded(!expanded)}
      >
        <motion.div
          initial={{ rotate: 90 }}
          animate={{ rotate: expanded ? 140 : 310 }}
          className="absolute right-[6px] top-[6px]"
        >
          <FaChevronRight />
        </motion.div>
      </motion.div> */}
    </div>
  );
};

export default Sidebar;
