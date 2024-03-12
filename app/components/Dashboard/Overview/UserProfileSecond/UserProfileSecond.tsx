import React from "react";
import { Rajdhani } from "next/font/google";
import { Inter } from "next/font/google";
import Image from "next/image";
import { PinContainer } from "@/components/ui/3d-pin";

const inter = Inter({ subsets: ["latin"] });
const rajdhani = Rajdhani({ subsets: ["latin"], weight: ["400", "500"] });

const UserProfileSecond = ({user} : any) => {
  
  return (
    <div
      className=" p-4 bg-transparent rounded-md "
      style={{
        backdropFilter: "blur(1px)",
        backgroundColor: "rgba(13, 9, 10, 0.3)",
      }}
    >
      <div className=" w-full h-full relative flex flex-col gap-5  rounded-md">
          <div className="w-full  h-[290px] relative">
          <PinContainer
            title="Overview"
            href="https://twitter.com/mannupaaji"
          >
            <div className="overflow-hidden h-[290px] w-full">
              <Image
                src={user.banner_picture ? user.banner_picture : "/car1.jpg"}
                fill
                priority
                style={{objectFit:"cover"}}
                alt="bg"
                sizes="auto"
                className="z-[-1] rounded-2xl"
              />
            </div>
          </PinContainer>
          <div
            className="2xl:w-[170px] xl:w-[120px] xl:h-[200px] absolute 2xl:h-[250px]  bg-transparent rounded-md 2xl:-bottom-[120px] 2xl:left-[100px] p-2 text-white sm:bottom-[10px] sm:left-[50px] sm:w-[110px] sm:h-[170px] bottom-[10px] left-[20px] w-[80px] h-[150px]"
            style={{
              backdropFilter: "blur(10px)",
              backgroundColor: "rgba(13, 9, 10, 0.3)",
            }}
          >
            <div
              className="w-full h-full flex flex-col items-center bg-transparent rounded-md gap-4"
              style={{
                backdropFilter: "blur(10px)",
                backgroundColor: "rgba(13, 9, 10, 0.3)",
              }}
            >
              <div className="w-full h-[60%]   relative">
                <Image
                  src={user.picture ? user.picture : "/b.png"}
                  alt="profile"
                  fill
                  style={{objectFit:"cover"}}
                  sizes="auto"
                  className="rounded-md"
                />
              </div>
              <div className="flex flex-col items-center">
                <h2 className="mt-2 xl:text-[15px] text-[10px]">
                  {user.name}
                </h2>
                <span className="xl:text-[10px] text-[7px]">@{user.username}</span>
                <span className="xl:text-[10px] text-[7px]">400,000</span>
              </div>
            </div>
          </div>
          </div>
              
          <div className="w-full  border-red-500  flex sm:flex-row flex-col sm:flex-wrap justify-between sm:gap-0 gap-5">
          <div className="2xl:w-[35%] sm:w-[55%]  border-yellow-500 flex h-[250px]">
            <div
              className="w-full  border-green-500  2xl:self-end 2xl:h-[40%] lg:h-[100%]  py-2 px-4 bg-dashBack flex justify-between rounded-md 2xl:flex-row flex-col"
            >
              <div className="flex  2xl:w-[100%] sm:w-full items-center h-[40%] 2xl:h-auto  bg-dashBack rounded-md">
                <div className="relative">
                  <Image
                    src={"/badge1.png"}
                    width={200}
                    height={130}
                    alt="badge"
                    className="w-[80px]"
                  ></Image>
                </div>
                <div className="flex flex-col 2xl:w-[100%] w-[420px]">
                  <div className="flex items-center justify-between text-white">
                    <h1 className="ml-1 2xl:text-[15px] xl:text-[12px] sm:text-[11px] text-[14px]">
                      LVL 2
                    </h1>
                    <span className="2xl:text-xs text-[8px] text-buttonGray 2xl:mr-3 sm:mr-7 mr-7">
                      250/1000
                    </span>
                  </div>
                  <div className="sm:w-[95%] w-[91%] 2xl:w-full bg-progressBg rounded-full p-[1px] dark:bg-gray-700">
                    <div
                      className="bg-progressColor sm:h-2.5 h-2 rounded-full relative"
                      style={{ width: "45%" }}
                    >
                      <div className="absolute bg-progressIndicator w-4 h-4 rounded-full -right-2 sm:-top-[3px] -top-[4px]"></div>
                    </div>
                  </div>
                </div>
              </div>
              {/* <div className="  2xl:w-[30%] w-full h-[40%] 2xl:h-auto bg-dashBack rounded-md border"></div> */}
            </div>
          </div>
          {/* <div className="2xl:w-[30%] sm:w-[100%] border h-[250px]"></div> */}
          </div>
      </div>
    </div>
  );
};

export default UserProfileSecond;
