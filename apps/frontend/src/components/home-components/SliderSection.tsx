"use client";

import React, { useRef, useState } from "react";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Demodata } from "@/assets/Demodata";
import "./slider.css";

// import required modules
import { Navigation, Pagination, Mousewheel, Keyboard } from "swiper/modules";
import SliderCard from "./SlideCard";

export default function SliderSection() {
  return (
    <div className="w-full max-w-7xl mx-auto px-2 sm:px-4 py-4 sm:py-8">
      <Swiper
        cssMode={true}
        slidesPerView={1}
        spaceBetween={20}
        breakpoints={{
          640: {
            slidesPerView: 2,
            spaceBetween: 25,
          },
          1024: {
            slidesPerView: 4,
            spaceBetween: 30,
          },
        }}
        pagination={{
          clickable: true,
        }}
        navigation={true}
        mousewheel={true}
        keyboard={true}
        modules={[Navigation, Pagination, Mousewheel, Keyboard]}
        className="mySwiper"
      >
        {Demodata.map((item, index) => (
          <SwiperSlide key={index}>
            <SliderCard item={item} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
