"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { slideInFromTop } from "@/utils/motion";

const Login = ({ onClose }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically handle authentication
    console.log("Login attempt with:", username);
    
    // For demo purposes, just close the modal
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="relative w-[400px] h-[200px] md:w-[450px] md:h-[500px] transition-all duration-500">
        {/* Animated background */}
        <div 
          className="absolute inset-0 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-[20px] animate-pulse-slow"
          style={{ 
            backgroundImage: `repeating-conic-gradient(from 0deg, #7042f8 0%, #7042f8 5%, transparent 5%, transparent 40%, #7042f8 50%)`,
            filter: "drop-shadow(0 15px 50px #000)",
          }}
        />
        
        {/* Second layer animation */}
        <div 
          className="absolute inset-0 rounded-[20px]"
          style={{ 
            backgroundImage: `repeating-conic-gradient(from 0deg, #45f3ff 0%, #45f3ff 5%, transparent 5%, transparent 40%, #45f3ff 50%)`,
            filter: "drop-shadow(0 15px 50px #000)",
            animationDelay: "-1s",
          }}
        />
        
        {/* Inner content box */}
        <div className="absolute inset-[4px] bg-[#0d0d23] rounded-[15px] border-[8px] border-[#0a0a1f]">
          {/* Login form */}
          <div className="absolute inset-[40px] flex justify-center items-center flex-col rounded-[10px] bg-[#00000033] text-white z-[1000] shadow-inner border-b-2 border-[#ffffff80] overflow-hidden">
            <div className="relative flex justify-center items-center flex-col gap-5 w-[70%]">
              <motion.h2 
                variants={slideInFromTop}
                className="uppercase font-semibold tracking-wider"
              >
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-cyan-500">
                  Login
                </span>
                <i className="ml-2 text-purple-500"></i>
              </motion.h2>
              
              <input 
                type="text" 
                placeholder="Username" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-5 py-2 outline-none border-none text-white bg-[#0000001a] border-2 border-[#7042f88b] rounded-[30px]"
              />
              
              <input 
                type="password" 
                placeholder="Password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-5 py-2 outline-none border-none text-white bg-[#0000001a] border-2 border-[#7042f88b] rounded-[30px]"
              />
              
              <button
                onClick={handleSubmit}
                className="w-full py-2 bg-gradient-to-r from-purple-500 to-cyan-500 border-none font-medium text-[#111] cursor-pointer transition-all duration-500 rounded-[30px] hover:shadow-[0_0_10px_#45f3ff,0_0_60px_#45f3ff]"
              >
                Sign in
              </button>
              
              <div className="w-full flex justify-between">
                <a href="#" className="text-white no-underline text-sm">Forgot Password</a>
                <a href="#" className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-cyan-500 font-semibold text-sm">Sign up</a>
              </div>
            </div>
          </div>
        </div>
        
        {/* Close button */}
        <button 
          onClick={onClose}
          className="absolute top-2 right-2 text-white bg-[#7042f88b] rounded-full w-8 h-8 flex items-center justify-center z-[1001] hover:bg-[#7042f8] transition-colors"
        >
          ✕
        </button>
      </div>
    </div>
  );
};

export default Login;