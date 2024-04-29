"use client";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import React from "react";
import Image from "next/image";
import { TypewriterEffectSmooth } from "@/components/ui/typewriter-effect";
import { rajdhani } from "./utils/fontConfig";

const words = [
  {
    text: "<",
    className: "text-white",
  },
  {
    text: "Future:",
    className: "text-red-500",
  },
  {
    text: "HAS_LOADED",
    className: "text-white",
  },
  {
    text: "/>",
    className: "text-white",
  },
  // {
  //   text: "Aceternity.",
  //   className: "text-blue-500 dark:text-blue-500",
  // },
];
const page = () => {
  const router = useRouter();
  return (
    <div className="text-white flex sm:flex-row flex-col items-center h-screen justify-center sm:gap-10">
      <div className="flex flex-col sm:items-start items-center sm:pb-[150px] relative z-50">
        <TypewriterEffectSmooth words={words} />
        <motion.span
          className="bg-red-500 xl:h-[7px] h-[5px] rounded-md absolute xl:top-[100px] lg:top-[85px] md:top-[75px]  left-0 top-[75px]"
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          transition={{ duration: 1, delay: 1.2 }}
        ></motion.span>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, delay: 3.2 }}
          className="cursor-pointer"
        >
          <div
            className="xl:w-[270px] w-[200px]"
            onClick={() => {
              router.push("/Signin");
            }}
          >
            <svg
              width="100%"
              height="82"
              viewBox="0 0 310 82"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              onMouseOver={(e) => {
                e.target.style.fill = "#2a1515";
              }}
              onMouseOut={(e) => {
                e.target.style.fill = "#181818";
              }}
            >
              <path
                d="M9 1.09375H72L77.5 5.59375H308.5V70.5938L299 80.0938H9H1.5V69.5938L3.5 67.5938V49.5938L1.5 48.0938V1.09375H9Z"
                fill="#181818"
              />
              <path
                d="M9 1.09375H72L77.5 5.59375H308.5V70.5938L299 80.0938H9M9 1.09375V80.0938M9 1.09375H1.5V48.0938L3.5 49.5938V67.5938L1.5 69.5938V80.0938H9"
                stroke="#53212B"
                stroke-width="2"
              />
              <path
                d="M108.644 51.0938H107.948C107.788 51.0938 107.708 50.9977 107.708 50.8057V35.9497C107.708 35.7577 107.788 35.6617 107.948 35.6617H113.468C114.508 35.6617 115.332 35.9657 115.94 36.5737C116.548 37.1817 116.852 38.0137 116.852 39.0697V41.8777C116.852 42.9337 116.548 43.7657 115.94 44.3737C115.332 44.9817 114.508 45.2857 113.468 45.2857H109.148C108.988 45.2857 108.908 45.3497 108.908 45.4777V50.8057C108.908 50.9977 108.82 51.0938 108.644 51.0938ZM109.148 44.1817H113.372C114.108 44.1817 114.668 43.9817 115.052 43.5817C115.436 43.1657 115.628 42.5817 115.628 41.8297V39.1177C115.628 38.3497 115.436 37.7657 115.052 37.3657C114.668 36.9497 114.108 36.7417 113.372 36.7417H109.148C108.988 36.7417 108.908 36.8137 108.908 36.9577V43.9897C108.908 44.1177 108.988 44.1817 109.148 44.1817ZM128.166 51.0938H120.534C120.374 51.0938 120.294 50.9977 120.294 50.8057V35.9497C120.294 35.7577 120.374 35.6617 120.534 35.6617H121.23C121.406 35.6617 121.494 35.7577 121.494 35.9497V49.7497C121.494 49.8937 121.574 49.9657 121.734 49.9657H128.166C128.358 49.9657 128.454 50.0537 128.454 50.2297V50.8297C128.454 51.0057 128.358 51.0938 128.166 51.0938ZM130.714 51.0938H129.97C129.794 51.0938 129.738 50.9977 129.802 50.8057L134.578 35.9497C134.626 35.7577 134.738 35.6617 134.914 35.6617H136.042C136.202 35.6617 136.314 35.7577 136.378 35.9497L141.154 50.8057C141.202 50.9977 141.146 51.0938 140.986 51.0938H140.218C140.058 51.0938 139.954 50.9977 139.906 50.8057L138.61 46.9657H132.322L131.026 50.8057C130.962 50.9977 130.858 51.0938 130.714 51.0938ZM135.418 36.9818L132.658 45.8857H138.298L135.514 36.9818H135.418ZM148.143 51.0938H147.447C147.271 51.0938 147.183 50.9977 147.183 50.8057V45.2617L142.527 35.9497C142.431 35.7577 142.487 35.6617 142.695 35.6617H143.559C143.703 35.6617 143.815 35.7577 143.895 35.9497L147.735 43.7977H147.855L151.671 35.9497C151.751 35.7577 151.863 35.6617 152.007 35.6617H152.895C153.071 35.6617 153.127 35.7577 153.063 35.9497L148.383 45.2617V50.8057C148.383 50.9977 148.303 51.0938 148.143 51.0938ZM163.089 51.0938H162.393C162.233 51.0938 162.153 50.9977 162.153 50.8057V35.9497C162.153 35.7577 162.233 35.6617 162.393 35.6617H163.041C163.185 35.6617 163.281 35.7097 163.329 35.8057L170.697 48.4777H170.793V35.9497C170.793 35.7577 170.881 35.6617 171.057 35.6617H171.729C171.905 35.6617 171.993 35.7577 171.993 35.9497V50.8057C171.993 50.9977 171.905 51.0938 171.729 51.0938H171.177C171.033 51.0938 170.905 51.0057 170.793 50.8297L163.449 38.2537H163.353V50.8057C163.353 50.9977 163.265 51.0938 163.089 51.0938ZM179.268 50.0137H182.004C182.74 50.0137 183.3 49.8137 183.684 49.4137C184.084 48.9977 184.284 48.4057 184.284 47.6377V39.1177C184.284 38.3497 184.084 37.7657 183.684 37.3657C183.3 36.9497 182.74 36.7417 182.004 36.7417H179.268C178.532 36.7417 177.972 36.9497 177.588 37.3657C177.204 37.7817 177.012 38.3657 177.012 39.1177V47.6377C177.012 48.3897 177.204 48.9737 177.588 49.3897C177.972 49.8057 178.532 50.0137 179.268 50.0137ZM182.124 51.0938H179.172C178.132 51.0938 177.308 50.7897 176.7 50.1817C176.108 49.5737 175.812 48.7417 175.812 47.6857V39.0697C175.812 38.0137 176.108 37.1817 176.7 36.5737C177.308 35.9657 178.132 35.6617 179.172 35.6617H182.124C183.164 35.6617 183.98 35.9657 184.572 36.5737C185.18 37.1817 185.484 38.0137 185.484 39.0697V47.6857C185.484 48.7417 185.18 49.5737 184.572 50.1817C183.98 50.7897 183.164 51.0938 182.124 51.0938ZM192.869 51.0938H191.669C191.493 51.0938 191.381 50.9977 191.333 50.8057L188.045 35.9497C187.997 35.7577 188.077 35.6617 188.285 35.6617H189.077C189.253 35.6617 189.357 35.7577 189.389 35.9497L192.245 49.7257H192.365L196.013 35.9257C196.045 35.7497 196.149 35.6617 196.325 35.6617H197.237C197.429 35.6617 197.541 35.7497 197.573 35.9257L201.245 49.7257H201.365L204.197 35.9497C204.229 35.7577 204.341 35.6617 204.533 35.6617H205.349C205.541 35.6617 205.613 35.7577 205.565 35.9497L202.277 50.8057C202.245 50.9977 202.141 51.0938 201.965 51.0938H200.741C200.565 51.0938 200.453 50.9977 200.405 50.8057L196.853 37.2697H196.757L193.181 50.8057C193.133 50.9977 193.029 51.0938 192.869 51.0938Z"
                fill="#BD3944"
              />
            </svg>
          </div>
          {/* <Image
            src="/Button.svg"
            width={0}
            height={0}
            alt={"image"}
            sizes="100vh 100vw"
            className="  hover:text-red-500"
            onClick={() => {router.push("/Signin")}}
          /> */}
        </motion.div>
      </div>
      <div className="">
        <Image
          src="/paddles.svg"
          width={0}
          height={0}
          alt={"image"}
          sizes="100vh 100vw"
          priority
          className="2xl:w-[700px] xl:w-[610px] lg:w-[400px] md:w-[270px] mt-2 w-[250px]"
        />
      </div>
    </div>
  );
};

export default page;
