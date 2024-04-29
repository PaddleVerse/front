'use client'
import React, { useState } from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import BigCard from "./BigCard";

import MatchMakingCard from "./MatchMakingCard";

const responsive = {
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items:3,
    slidesToSlide: 1 
  },
    laptop: {
    breakpoint: { max: 1500, min: 1025 },
    items: 2,
    slidesToSlide: 1 
  },
  tablet: {
    breakpoint: { max: 1024, min: 768 },
    items: 1,
    slidesToSlide: 1 
  },
  mobile: {
    breakpoint: { max: 767, min: 464 },
    items: 1,
    slidesToSlide: 1 
  }
};

const Caroussel = () => {
  const [matchMaking, setMatchMaking] = useState(false);
  
  return (
    <>
      <div className="mt-[75px] 2xl:mb-4 xl:mb-[175px] mb-[50px]  2xl:max-w-[1800px] xl:max-w-[950px] mx-auto 2xl:pl-4"
      style={{zIndex: 0}}
      >
        <Carousel
          responsive={responsive}
          autoPlay={false}
          swipeable={true}
          draggable={true}
          centerMode={false}
          // showDots={true}
          infinite={true}
          removeArrowOnDeviceType={["tablet", "mobile"]}

        >
          <BigCard gameMode={'1'} turnOn={() => setMatchMaking(true)}/>
          <BigCard gameMode={'2'} turnOn={() => setMatchMaking(true)}/>
          {/* <BigCard gameMode={'3'}/>
          <BigCard gameMode={'2'}/> */}
        </Carousel>
      </div>
      {
        matchMaking && <MatchMakingCard gameMode={'2'} turnOff={() => setMatchMaking(false)} />
      }
    </>
  );
};
export default Caroussel;
