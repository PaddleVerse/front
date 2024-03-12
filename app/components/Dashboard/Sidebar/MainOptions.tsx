import { motion } from "framer-motion";
import { Oswald } from "next/font/google";
import React, { ReactNode } from "react";
import { FaChevronDown } from "react-icons/fa";
const MainOptions = ({
  children,
  showElements,
  label,
  expanded,
}: {
  children: ReactNode;
  showElements: boolean;
  label: string;
  expanded: boolean;
}) => {
  return (
    <motion.div
      className={`group p-3 ${
        label === "Dashboard" ? "mt-2" : "mt-5"
      } text-sm relative z-10 rounded-lg text-[#707b8f]  transition-colors duration-300 cursor-pointer hover:bg-[#221D29] ${
        showElements && "bg-[#221D29]"
      } bg-[#172234] `}
      initial={{ marginLeft: "15px" }}
      animate={{
        marginLeft: expanded ? "15px" : "-2px",
        paddingRight: expanded ? "10px" : "40px",
      }}
    >
      {/* <div className="absolute inset-0 bg-opacity-50 backdrop-filter backdrop-blur-sm " /> */}
      <div
        className={`bg-transparent inset-0 flex justify-between items-center group-hover:text-[#FF5866] transition-colors duration-300 ${
          showElements && "text-[#FF5866] z-10"
        }`}
      >
        <div className="flex items-center gap-4">
          <motion.div
            initial={{ fontSize: "26px" }}
            animate={{
              fontSize: expanded ? "26px" : "28px",
            }}
            // className={`${showElements && "bg-[#221D29] text-[#FF5866]"}}`}
          >
            {children}
          </motion.div>

          <motion.span
            className="2xl:text-[15px] text-[13px]"
            initial={{ opacity: 1 }}
            animate={{ opacity: expanded ? 1 : 0 }}
            transition={{ duration: expanded ? 1.5 : 0.1 }}
          >
            {label}
          </motion.span>
        </div>
        <motion.div
          initial={{ opacity: 1 }}
          animate={{
            rotate: showElements ? 180 : 0,
            opacity: expanded ? 1 : 0,
            transition: { duration: expanded ? 0.8 : 0.2 },
          }}
          // transition={{ duration: expanded ? 1.5 : 0.1 }}
        >
          {label === 'Dashboard' ? <FaChevronDown />: ''}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default MainOptions;
