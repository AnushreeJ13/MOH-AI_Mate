import React from "react";
import HeroContent from "../sub/HeroContent";
import Link from "next/link";
import { FaRocket } from "react-icons/fa";

const Hero = () => {
  return (
    <div className="relative flex flex-col h-full w-full" id="about-me">
      <video
        autoPlay
        muted
        loop
        className="rotate-180 absolute top-[-340px]  h-full w-full left-0 z-[1] object-cover "
      >
        <source src="/blackhole.webm" type="video/webm" />
      </video>
      <HeroContent />
      {/* Removed the Explore MOH button that was here */}
    </div>
  );
};

export default Hero;
