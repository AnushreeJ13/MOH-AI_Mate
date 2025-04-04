"use client";

import { Socials } from "@/constants";
import Image from "next/image";
import React, { useState } from "react";
import dynamic from 'next/dynamic';
import { useRouter } from "next/navigation";

// Dynamically import ChatBot with no SSR to avoid hydration issues
const ChatBot = dynamic(() => import("@/components/main/ChatBot"), { 
  ssr: false,
  loading: () => <div className="fixed inset-0 bg-[#0a0a1f] z-50 flex items-center justify-center">
    <div className="text-white">Loading chat...</div>
  </div>
});

const Navbar = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const router = useRouter();

  return (
    <div className="w-full h-[65px] fixed top-0 shadow-lg shadow-[#2A0E61]/50 bg-[#03001417] backdrop-blur-md z-50 px-10">
      <div className="w-full h-full flex flex-row items-center justify-between m-auto px-[10px]">
        <a
          href="/"
          className="h-auto w-auto flex flex-row items-center"
        >
          <Image
            src="/mohlogo.png"
            alt="logo"
            width={70}
            height={70}
            className="cursor-pointer hover:animate-slowspin"
          />

          <span className="font-bold ml-[10px] hidden md:block text-gray-300">
            MOH AIMate
          </span>
        </a>

        <div className="w-[500px] h-full flex flex-row items-center justify-between md:mr-20">
          <div className="flex items-center justify-between w-full h-auto border border-[#7042f861] bg-[#0300145e] mr-[15px] px-[20px] py-[10px] rounded-full text-gray-200">
            <a href="#about-me" className="cursor-pointer">
              Chat
            </a>
            <a href="#skills" className="cursor-pointer">
              how i was made 
            </a>
            <a href="#projects" className="cursor-pointer">
              About me 
            </a>
            <button 
              onClick={() => router.push('/login')} 
              className="cursor-pointer bg-transparent border-none text-gray-200 hover:text-white transition-colors"
            >
              Login
            </button>
          </div>
        </div>
      </div>
      
      {/* Render ChatBot only on client side */}
      {isChatOpen && (
        <div className="fixed inset-0 z-50">
          <ChatBot onClose={() => setIsChatOpen(false)} />
        </div>
      )}
    </div>
  );
};

export default Navbar;
