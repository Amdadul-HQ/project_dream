"use client";

import { useState, useRef, useEffect } from "react";
import { Demodata } from "@/assets/Demodata";
import { ChevronLeft, ChevronRight } from "lucide-react";
import SliderCard from "./SlideCard";

export const SliderSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleCards, setVisibleCards] = useState(1);
  const sliderRef = useRef<HTMLDivElement>(null);

  // Calculate visible cards based on screen size
  useEffect(() => {
    const updateVisibleCards = () => {
      const width = window.innerWidth;
      if (width < 480) { // xs - very small devices
        setVisibleCards(1);
      } else if (width < 640) { // sm
        setVisibleCards(1);
      } else if (width < 768) { // md
        setVisibleCards(2);
      } else if (width < 1024) { // lg
        setVisibleCards(3);
      } else if (width < 1280) { // xl
        setVisibleCards(3);
      } else { // 2xl and above
        setVisibleCards(4);
      }
    };

    updateVisibleCards();
    window.addEventListener('resize', updateVisibleCards);
    return () => window.removeEventListener('resize', updateVisibleCards);
  }, []);

  const maxIndex = Math.max(0, Demodata.length - visibleCards);

  const nextSlide = () => {
    setCurrentIndex(prev => Math.min(prev + 1, maxIndex));
  };

  const prevSlide = () => {
    setCurrentIndex(prev => Math.max(prev - 1, 0));
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(Math.min(index, maxIndex));
  };

  // Auto-play functionality
  useEffect(() => {
    const interval = setInterval(() => {
      if (currentIndex < maxIndex) {
        nextSlide();
      } else {
        setCurrentIndex(0);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [currentIndex, maxIndex]);

  return (
    <section className="relative w-full max-w-7xl mx-auto px-2 sm:px-4 py-4 sm:py-8">
      <div className="relative">
        {/* Slider Container */}
        <div 
          ref={sliderRef}
          className="flex gap-2 sm:gap-4 transition-transform duration-500 ease-in-out"
          style={{
            transform: `translateX(-${currentIndex * (100 / visibleCards)}%)`
          }}
        >
          {Demodata.map((item, index) => (
            <div 
              key={index}
              className="flex-shrink-0"
              style={{ width: `${100 / visibleCards}%` }}
            >
              <SliderCard 
                item={item} 
                isActive={index >= currentIndex && index < currentIndex + visibleCards}
              />
            </div>
          ))}
        </div>

        {/* Navigation Arrows - positioned exactly like in the image */}
        {currentIndex > 0 && (
          <button
            onClick={prevSlide}
            className="absolute left-1 sm:left-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 sm:w-10 sm:h-10 bg-black/80 hover:bg-black text-white rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 shadow-lg"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        )}

        {currentIndex < maxIndex && (
          <button
            onClick={nextSlide}
            className="absolute right-1 sm:right-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 sm:w-10 sm:h-10 bg-black/80 hover:bg-black text-white rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 shadow-lg"
            aria-label="Next slide"
          >
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        )}

        {/* Pagination Dots - matches the image design */}
        <div className="flex justify-center mt-4 sm:mt-6 gap-1 sm:gap-2">
          {Array.from({ length: maxIndex + 1 }, (_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full transition-all duration-200 ${
                index === currentIndex 
                  ? 'bg-blue-600 scale-125' 
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
