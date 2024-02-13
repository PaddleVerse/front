'use client'
import React from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import BigCard from "./BigCard";
const responsive = {
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 3,
    slidesToSlide: 4 // optional, default to 1.
  },
  tablet: {
    breakpoint: { max: 1024, min: 768 },
    items: 3,
    slidesToSlide: 3 // optional, default to 1.
  },
  mobile: {
    breakpoint: { max: 767, min: 464 },
    items: 2,
    slidesToSlide: 1 // optional, default to 1.
  }
};
const Caroussel = () => {
  return (
    <div className="mt-[75px]  border border-red-500 w-full">
      <Carousel
        responsive={responsive}
        autoPlay={false}
        swipeable={true}
        draggable={true}
        centerMode={false}
        showDots={false}
        infinite={true}
      >
        <BigCard />
        <BigCard />
        {/* <BigCard /> */}
        <BigCard />
      </Carousel>
    </div>
  );
};
export default Caroussel;
