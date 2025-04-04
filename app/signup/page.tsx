"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Script from "next/script";

export default function SignupPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    
    setIsLoading(true);
    setError("");
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Success - redirect to home
      router.push('/');
    } catch (err) {
      setError("Signup failed. Please try again.");
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

        {/* Simple animated signup box structure */}
        <div className="login-container">
          <div className="box signup-box">
            <div className="login">
              <div className="loginBx">
                <h2>
                  <i className="fa-solid fa-user-plus"></i>
                  Sign Up
                  <i className="fa-solid fa-rocket"></i>
                </h2>
                <input 
                  type="text" 
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
                <input 
                  type="email" 
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <input 
                  type="password" 
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <input 
                  type="password" 
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <input 
                  type="submit" 
                  value={isLoading ? "Creating Account..." : "Create Account"} 
                  onClick={handleSubmit}
                  disabled={isLoading}
                />
                <div className="group">
                  <a href="#">Terms & Conditions</a>
                  <a href="/login">Login</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}