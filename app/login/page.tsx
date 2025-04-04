"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Script from "next/script";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Success - redirect to home
      router.push('/');
    } catch (err) {
      setError("Login failed. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Script src="https://use.fontawesome.com/releases/v6.5.1/js/all.js" />
      
      <div className="relative h-screen w-screen bg-[#030014] overflow-hidden flex items-center justify-center">
        {/* Background elements */}
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
        
        {/* Stars background */}
        <div className="absolute inset-0">
          <div className="w-full h-full">
            <video
              autoPlay
              muted
              loop
              className="rotate-180 absolute top-[-340px] h-full w-full left-0 z-[1] object-cover opacity-30"
            >
              <source src="/blackhole.webm" type="video/webm" />
            </video>
          </div>
        </div>

        {/* Simple animated login box structure */}
        <div className="login-container">
          <div className="box">
            <div className="login">
              <div className="loginBx">
                <h2>
                  <i className="fa-solid fa-right-to-bracket"></i>
                  Login
                  <i className="fa-solid fa-heart"></i>
                </h2>
                <input 
                  type="text" 
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
                <input 
                  type="password" 
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <input 
                  type="submit" 
                  value={isLoading ? "logining in..." : "login in"} 
                  onClick={handleSubmit}
                  disabled={isLoading}
                />
                <div className="group">
                  <a href="#">Forgot Password</a>
                  <a href="/signup">sign in</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}