"use client";

import React, { useEffect, useState } from "react";

export function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Find the first section on the current page
      const firstSection = document.querySelector(
        "main > section, main > div > section, main > div:first-child"
      );
      
      // Threshold: at least 70% of the first section height, or fallback to 380px
      const firstSectionHeight = firstSection?.clientHeight || 450;
      const threshold = Math.min(Math.max(firstSectionHeight * 0.7, 300), 650);

      if (window.scrollY > threshold) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    // Check initially in case page loads scrolled down
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label="Scroll back to top"
      title="Scroll to top"
      className={`fixed bottom-6 right-6 sm:bottom-8 sm:right-8 z-50 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white shadow-[0_8px_24px_rgba(0,0,0,0.35)] flex items-center justify-center border border-neutral-200/90 hover:scale-110 active:scale-95 transition-all duration-300 group cursor-pointer ${
        isVisible
          ? "opacity-100 translate-y-0 pointer-events-auto"
          : "opacity-0 translate-y-4 pointer-events-none"
      }`}
    >
      <svg
        className="w-5 h-5 sm:w-6 sm:h-6 group-hover:-translate-y-0.5 transition-transform duration-200 drop-shadow-sm"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="upArrowGrad" x1="12" y1="21" x2="12" y2="3" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#0052cc" />
            <stop offset="100%" stopColor="#0ea5e9" />
          </linearGradient>
        </defs>
        <path
          d="M12 3.5L4.5 11.5H9V20.5H15V11.5H19.5L12 3.5Z"
          fill="url(#upArrowGrad)"
        />
      </svg>
    </button>
  );
}
