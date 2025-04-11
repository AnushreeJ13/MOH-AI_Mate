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
        className="absolute top-10 left-10 h-[200px] w-[400px] z-[1] object-cover rounded-xl shadow-lg"
      >
        
        <source src="/blackhole.webm" type="video/webm" />
        <br/>
      </video>
      <HeroContent />
      {/* Removed the Explore MOH button that was here */}
    </div>
  );
};

export default Hero;
