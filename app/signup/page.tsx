"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Script from "next/script";
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";

// Import the functions you need from the SDKs you need
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAzbzw54O_JRDNOfHyteIMvq999R3Aj624",
  authDomain: "ehsaas-f4c7e.firebaseapp.com",
  projectId: "ehsaas-f4c7e",
  storageBucket: "ehsaas-f4c7e.firebasestorage.app",
  messagingSenderId: "618055369757",
  appId: "1:618055369757:web:3592bd6978c85df0f432f4",
  measurementId: "G-JTTDNV43GD"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
// Initialize Firebase

const auth = getAuth(app);
const db = getFirestore(app);

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
      // Create user with email and password
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      console.log("Account created for:", user.email);

      // Save user info to Firestore
      await setDoc(doc(db, "users", user.uid), {
        username: username,
        email: user.email,
        createdAt: new Date(),
      });

      // Redirect to home page after successful sign-up
      router.push("/login");

    } catch (err) {
      setError("Signup failed. Please try again.");
      console.error("Signup error:", err.message);
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
                {error && <div className="text-red-500 text-sm">{error}</div>} {/* Error message */}
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
