"use client";
import Encryption from "@/components/main/Encryption";
import Hero from "@/components/main/Hero";

import Projects from "@/components/main/Projects";
import Skills from "@/components/main/Skills";
import Image from "next/image";
import { useState } from 'react';
import ChatBot from '../components/main/ChatBot';
import { FaRobot } from "react-icons/fa";

export default function Home() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  
  return (
    <main className="h-full w-full">
      <div className="flex flex-col gap-20">
        <Hero />
        <Skills />
        <Encryption />
        <Projects />
      </div>
      
      {/* Render ChatBot only when chat is open */}
      {isChatOpen && (
        <div className="fixed inset-0 z-50">
          <ChatBot onClose={() => setIsChatOpen(false)} />
        </div>
      )}
      
      {/* Removed the floating center button that was here */}
    </main>
  );
}
