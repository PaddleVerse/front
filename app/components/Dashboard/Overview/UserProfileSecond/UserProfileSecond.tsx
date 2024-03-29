import React from "react";
import {motion} from "framer-motion";
import { Rajdhani } from "next/font/google";
import { Inter } from "next/font/google";
import Image from "next/image";
import { PinContainer } from "@/components/ui/3d-pin";
import Friends from "./Friends";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
const inter = Inter({ subsets: ["latin"] });
const rajdhani = Rajdhani({ subsets: ["latin"], weight: ["400", "500"] });

const UserProfileSecond = ({ user }: any) => {
  return (
    <div
      className=" p-4 bg-[#101823] rounded-md "
      // style={{
      //   backdropFilter: "blur(1px)",
      //   backgroundColor: "rgba(13, 9, 10, 0.3)",
      // }}
    >
      <div className=" w-full h-full relative flex flex-col 2xl:gap-[80px] gap-12 rounded-md">
        <div className="w-full  h-[290px] relative">
          <PinContainer title="Overview" href="https://twitter.com/mannupaaji">
            <div className="overflow-hidden h-[290px] w-full relative">
              {
                user ? (
                  <Image
                    src={user?.banner_picture ? user?.banner_picture : "/car1.jpg"}
                    fill
                    priority
                    style={{ objectFit: "cover" }}
                    alt="bg"
                    sizes="auto"
                    className="z-[-1] rounded-2xl"
                  />
                ) : (
                  <div className="flex items-center justify-center w-full h-full bg-gray-400 rounded  animate-pulse">
                      <svg className="w-10 h-10 text-gray-300" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 18">
                          <path d="M18 0H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm4.376 10.481A1 1 0 0 1 16 15H4a1 1 0 0 1-.895-1.447l3.5-7A1 1 0 0 1 7.468 6a.965.965 0 0 1 .9.5l2.775 4.757 1.546-1.887a1 1 0 0 1 1.618.1l2.541 4a1 1 0 0 1 .028 1.011Z"/>
                      </svg>
                  </div>
                )
              }
            </div>
          </PinContainer>
          <div
            className="2xl:w-[170px]  xl:w-[120px] xl:h-[200px] absolute 2xl:h-[250px]  bg-[#101823] rounded-md 2xl:-bottom-[120px] 2xl:left-[100px] p-2 text-white sm:bottom-[10px] sm:left-[50px] sm:w-[110px] sm:h-[170px] bottom-[10px] left-[20px] w-[80px] h-[150px]"
            // style={{
            //   backdropFilter: "blur(10px)",
            //   backgroundColor: "rgba(13, 9, 10, 0.3)",
            // }}
          >
            <div
              className="w-full h-full flex flex-col items-center bg-[#101823] rounded-md gap-4"
              // style={{
              //   backdropFilter: "blur(10px)",
              //   backgroundColor: "rgba(13, 9, 10, 0.3)",
              // }}
            >
              <div className="w-full h-[60%]   relative">
                {user ? (
                  <Image
                    src={user?.picture ? user?.picture : "/b.png"}
                    alt="profile"
                    fill
                    style={{ objectFit: "cover" }}
                    sizes="auto"
                    className="rounded-md"
                  />
                ) : (
                  <div className="flex items-center justify-center w-full h-full bg-gray-400 rounded  animate-pulse">
                      <svg className="w-10 h-10 text-gray-300" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 18">
                          <path d="M18 0H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm4.376 10.481A1 1 0 0 1 16 15H4a1 1 0 0 1-.895-1.447l3.5-7A1 1 0 0 1 7.468 6a.965.965 0 0 1 .9.5l2.775 4.757 1.546-1.887a1 1 0 0 1 1.618.1l2.541 4a1 1 0 0 1 .028 1.011Z"/>
                      </svg>
                  </div>
                )}
              </div>
              {
                user ? (
                <div className="flex flex-col items-center">
                  <h2 className="mt-2 xl:text-[15px] text-[10px] text-center">
                    {user.name}
                  </h2>
                  <span className="xl:text-[10px] text-[7px]">
                    @{user.username}
                  </span>
                  <span className="xl:text-[10px] text-[7px]">400,000</span>
                </div>
                ) :(
                <div  className="w-[80%] animate-pulse">
                    <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-700 w-full mb-4"></div>
                    <div className="h-2 bg-gray-300 rounded-full dark:bg-gray-700 w-full mb-2.5"></div>
                    <div className="h-2 bg-gray-300 rounded-full dark:bg-gray-700 mb-2.5"></div>
                </div>
                )
              }
            </div>
          </div>
        </div>

        <div className="w-full   border-red-500 pb-5  flex sm:flex-row flex-col sm:flex-wrap 2xl:mt-0 mt-2 justify-between sm:gap-2 gap-5">
          <div className="2xl:w-[35%] sm:w-[55%]  border-yellow-500 flex sm:h-[250px]">
            <div
              className="w-full  border-green-500  2xl:self-end 2xl:h-[55%] lg:h-[100%] items-center bg-[#101823]  flex justify-between rounded-md 2xl:flex-row"
              // style={{
              //   backdropFilter: "blur(10px)",
              //   backgroundColor: "rgba(13, 9, 10, 0.3)",
              // }}
            >
              <div className="flex   sm:w-full items-center  sm:h-[40%] h-full 2xl:h-full w-full bg-[#172234] rounded-md">
                <div className="relative">
                  <Image
                    src={"/badge1.png"}
                    width={150}
                    priority
                    height={130}
                    alt="badge"
                    className="2xl:w-[150px] xl:w-[115px] md:w-[112px] w-[105px]"
                  ></Image>
                </div>
                <div className="flex flex-col 2xl:w-[100%] w-[420px] ">
                  <div className="flex items-center justify-between text-white">
                    <h1 className="ml-1 2xl:text-[17px] xl:text-[14px] font-[500] sm:text-[11px] text-[14px]">
                      LVL 2
                    </h1>
                    <span className="2xl:text-xs text-[8px] text-white 2xl:mr-3 sm:mr-7 mr-7">
                      250/1000
                    </span>
                  </div>
                  <div className="sm:w-[95%] w-[91%] 2xl:w-[98%] b bg-[#D6D6D6] rounded-full">
                    <motion.div
                      className="bg-[#FF4654] p-2 sm:h-2.5 h-2 rounded-full relative w-[45%]"
                      initial={{ width: "0%" }}
                      animate={{ width: "45%" }}
                      transition={{ duration: 1 }}
                      // style={{ width: "45%" }}
                    >
                      <div className="relative">
                        <div className="absolute 2xl:w-4 2xl:h-4 w-3 h-3  bg-[#FF4656] 2xl:-right-[13px] -right-[11px] top-[16px]  transform rotate-45"></div>
                      </div>
                      <div className="absolute bg-[#FF4656] w-10 h-6 rounded-sm -right-4 -bottom-[34px] text-white flex items-center justify-center text-[12px] text-center">
                        45%
                      </div>
                    </motion.div>
                  </div>
                </div>
              </div>
              {/* <div className="  2xl:w-[30%] w-full h-[40%] 2xl:h-auto bg-dashBack rounded-md border"></div> */}
            </div>
          </div>

          <div
            className={`2xl:w-[30%] p-5 text-white ${rajdhani.className} bg-[#172234] sm:w-[42%]  rounded-lg h-[250px] flex flex-col gap-4`}
            // style={{
            //   backdropFilter: "blur(10px)",
            //   backgroundColor: "rgba(13, 9, 10, 0.3)",
            // }}
          >
            <h1 className="2xl:text-3xl xl:text-2xl text-xl font-[600]">
              TOP 3 FRIENDS
            </h1>
            <div className="flex flex-col gap-1">
              <Friends />
              <Friends />
              <Friends />
            </div>
          </div>
          <div
            className={` 2xl:w-[30%] w-full bg-[#172234] flex flex-col rounded-lg text-3xl font-[600] text-white ${rajdhani.className} p-4`}
            // style={{
            //   backdropFilter: "blur(10px)",
            //   backgroundColor: "rgba(13, 9, 10, 0.3)",
            // }}
          >
            <h1 className="text-center">Lifetime Overview</h1>
            <div className="w-full  flex mt-4 gap-6 justify-evenly items-center">
              <div className="flex gap-4 items-center">
                <div className="sm:w-32 sm:h-32 w-20 h-20 fill-black">
                  <CircularProgressbar
                    value={66}
                    text={`${66}%`}
                    strokeWidth={16}
                    styles={{
                      path: {
                        stroke: `#FF4654`,
                      },
                      text: {
                        fill: "#FF4654",
                        fontSize: "16px",
                      },
                    }}
                  />
                </div>
                <div className="flex flex-col text-[17px]">
                  <span className="text-sm">1.65</span>
                  <span className="text-sm">KDE/Ratio</span>
                  <span className="text-sm">Top 2.5%</span>
                </div>
              </div>
              <div className="flex gap-4 items-center">
                <div className="sm:w-32 sm:h-32 w-20 h-20 fill-black">
                  <CircularProgressbar
                    value={66}
                    text={`${66}%`}
                    strokeWidth={16}
                    styles={{
                      path: {
                        stroke: `#FF4654`,
                      },
                      text: {
                        fill: "#FF4654",
                        fontSize: "16px",
                      },
                    }}
                  />
                </div>
                <div className="flex flex-col text-[17px]">
                  <span className="text-sm">1.65</span>
                  <span className="text-sm">KDE/Ratio</span>
                  <span className="text-sm">Top 2.5%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfileSecond;
