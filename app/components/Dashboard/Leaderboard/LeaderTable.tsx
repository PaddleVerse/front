import React from "react";
import { Inter } from "next/font/google";
import StandingRow from "./LeaderRow";

const inter = Inter({
  subsets: ["latin"],
  weight: ["100", "300", "400", "500", "700"],
});
const LeaderTable = () => {
  return (
    <div className="">
      <div className="relative  space-y-4">
        <table
          className={`${inter.className}  w-full  text-left text-white font-light border-separate border-spacing-y-2`}
        >
          <thead className="text-xs sm:text-sm text-gray-400  bg-dashBack ">
            <tr>
              <th scope="col" className="font-[300] sm:w-[3%] w-[7%] text-center">
                #
              </th>
              <th scope="col" className=" font-[300]">
                User
              </th>
              <th scope="col" className="font-[300] sm:w-[12%] sm:pl-[17px] pl-4">
                PL
              </th>
              <th scope="col" className="font-[300] sm:w-[7%] sm:pl-[7px] pl-[5px] ">
                W
              </th>
              <th scope="col" className="font-[300] sm:w-[7%] sm:pl-[7px] pl-[7px]">
                L
              </th>
              <th scope="col" className="font-[300] sm:w-[7%] sm:pl-[17px] pl-[14px]">
                W/L
              </th>
              <th scope="col" className="font-[300] xl:w-[31%] lg:w-[50%] md:w-[30%] w-[40%]">
                Form
              </th>
            </tr>
          </thead>
          <tbody className="">
              <StandingRow />
              <StandingRow />
              <StandingRow />
              <StandingRow />
              <StandingRow />
              <StandingRow />
              <StandingRow />
              <StandingRow />
              <StandingRow />
              <StandingRow />
            {/* <tr className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
              <th
                scope="row"
                className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
              >
                Microsoft Surface Pro
              </th>
              <td className="px-6 py-4">White</td>
              <td className="px-6 py-4">Laptop PC</td>
              <td className="px-6 py-4">$1999</td>
              <td className="px-6 py-4">
                <a
                  href="#"
                  className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                >
                  Edit
                </a>
              </td>
            </tr>
            <tr className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
              <th
                scope="row"
                className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
              >
                Magic Mouse 2
              </th>
              <td className="px-6 py-4">Black</td>
              <td className="px-6 py-4">Accessories</td>
              <td className="px-6 py-4">$99</td>
              <td className="px-6 py-4">
                <a
                  href="#"
                  className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                >
                  Edit
                </a>
              </td>
            </tr>
            <tr className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
              <th
                scope="row"
                className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
              >
                Google Pixel Phone
              </th>
              <td className="px-6 py-4">Gray</td>
              <td className="px-6 py-4">Phone</td>
              <td className="px-6 py-4">$799</td>
              <td className="px-6 py-4">
                <a
                  href="#"
                  className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                >
                  Edit
                </a>
              </td>
            </tr>
            <tr>
              <th
                scope="row"
                className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
              >
                Apple Watch 5
              </th>
              <td className="px-6 py-4">Red</td>
              <td className="px-6 py-4">Wearables</td>
              <td className="px-6 py-4">$999</td>
              <td className="px-6 py-4">
                <a
                  href="#"
                  className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                >
                  Edit
                </a>
              </td>
            </tr> */}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LeaderTable;
