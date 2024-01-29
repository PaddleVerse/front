import React from "react";
import { Roboto } from "next/font/google";
import StandingRow from "./StandingRow";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["100", "300", "400", "500", "700"],
});
const StandingTable = () => {
  return (
    <div>
      <div className="relative">
        <table
          className={`${roboto.className}  w-full text-sm text-left rtl:text-right text-white`}
        >
          <thead className="text-xs text-gray-400  bg-transparent ">
            <tr>
              <th scope="col" className="font-[400] ">
                #
              </th>
              <th scope="col" className=" font-[400]">
                User
              </th>
              <th scope="col" className="font-[400] ">
                PL
              </th>
              <th scope="col" className="font-[400] 2xl:table-cell xl:hidden">
                W
              </th>
              <th scope="col" className="font-[400] 2xl:table-cell xl:hidden">
                L
              </th>
              <th scope="col" className="font-[400] 2xl:table-cell xl:hidden">
                W/L
              </th>
              <th scope="col" className="font-[400] 2xl:table-cell xl:hidden">
                Form
              </th>
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 10 }, (_, index) => (
              <StandingRow key={index} />
            ))}

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

export default StandingTable;
