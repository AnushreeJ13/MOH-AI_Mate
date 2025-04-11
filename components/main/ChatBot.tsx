"use client";

import React, { useState, useEffect, useRef } from "react";
import { FaBars, FaPlus, FaPaperPlane, FaLightbulb, FaSignOutAlt, FaMicrophone } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import { FiLogIn } from "react-icons/fi";
import Image from "next/image";
import { useRouter } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

// Helper function to add timestamps to messages
const addTimestamp = (message) => {
  return {
    ...message,
    timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
  };
};

const ChatBot = ({ standalone = false }) => {
  const router = useRouter();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [conversations, setConversations] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  const chatRef = useRef(null);
  const inputRef = useRef(null);

  // Initialize speech synthesis (AI speaking)
  const speechSynthesis = window.speechSynthesis;

  // Initialize speech recognition (User speaking)
  const recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const [isListening, setIsListening] = useState(false);

  // Function to start speech recognition
  const startSpeechRecognition = () => {
    if (recognition) {
      const recognitionInstance = new recognition();
      recognitionInstance.lang = "en-US";
      recognitionInstance.interimResults = true;

      recognitionInstance.onstart = () => {
        setIsListening(true);
      };

      recognitionInstance.onend = () => {
        setIsListening(false);
      };

      recognitionInstance.onresult = (event) => {
        let transcript = event.results[event.results.length - 1][0].transcript;
        setInput(transcript);
        if (event.results[0].isFinal) {
          sendMessage(transcript);
        }
      };

      recognitionInstance.start();
    }
  };

  // Function to speak (AI speaking)
  const speak = (text) => {
    if (!speechSynthesis) return;

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.onstart = () => setIsTyping(true);
    utterance.onend = () => setIsTyping(false);
    speechSynthesis.speak(utterance);
  };

  const sendMessage = async (userMessage) => {
    if (!userMessage.trim()) return;

    const userMessageObj = addTimestamp({ text: userMessage, sender: "user" });
    setMessages((prev) => [...prev, userMessageObj]);
    setInput("");
    setIsTyping(true);

    try {
      const response = await fetch(`${API_URL}/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: userMessage }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();

      const botResponse = addTimestamp({
        text: data.response || "I'm not sure how to respond to that.",
        sender: "bot",
      });

      // Add a small delay to simulate typing and speak the bot's response
      setTimeout(() => {
        setMessages((prev) => [...prev, botResponse]);
        setIsTyping(false);
        speak(botResponse.text); // AI speaks the response
      }, 500);
    } catch (error) {
      console.error("Error:", error);
      const errorResponse = addTimestamp({
        text: "Sorry, I couldn't connect to my brain. Please try again later.",
        sender: "bot",
      });
      setMessages((prev) => [...prev, errorResponse]);
      setIsTyping(false);
      speak("Sorry, I couldn't connect to my brain. Please try again later.");
    }
  };

  // Scroll to bottom when messages change
  useEffect(() => {
    if (!chatRef.current) return;

    const timer = setTimeout(() => {
      try {
        if (chatRef.current) {
          chatRef.current.scrollIntoView({ behavior: "smooth" });
        }
      } catch (error) {
        console.error("Error scrolling to bottom:", error);
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [messages]);

  const handleInputFocus = () => {
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 0);
  };

  const startNewChat = () => {
    const newId = conversations.length + 1;
    const updatedConversations = conversations.map((conv) => ({
      ...conv,
      active: false,
    }));

    setConversations([
      ...updatedConversations,
      { id: newId, title: "New Conversation", active: true },
    ]);

    setMessages([
      addTimestamp({
        text: "Hello! I'm MOH, your AI-powered relationship advisor. How can I help you today?",
        sender: "bot",
      }),
    ]);
  };

  const selectConversation = (id) => {
    const updatedConversations = conversations.map((conv) => ({
      ...conv,
      active: conv.id === id,
    }));

    setConversations(updatedConversations);
    setMessages([
      addTimestamp({
        text: "Hello! I'm MOH, your AI-powered relationship advisor. How can I help you today?",
        sender: "bot",
      }),
    ]);
  };

  // Initialize state on client-side only
  useEffect(() => {
    setMessages([
      addTimestamp({ text: "Hello! I'm MOH, your AI-powered relationship advisor. How can I help you today?", sender: "bot" }),
    ]);

    setConversations([
      { id: 1, title: "New Conversation", active: true },
    ]);

    setIsLoaded(true);
  }, []);

  // Don't render until client-side initialization is complete
  if (!isLoaded) {
    return <div className="h-screen w-screen bg-[#0a0a1f]"></div>;
  }

  return (
    <div className="h-screen w-screen bg-[#0a0a1f] text-gray-100 overflow-hidden fixed inset-0 z-50">
      <div className="flex flex-col h-full">
        {/* Header - ChatGPT style */}
        <header className="h-16 bg-[#12122e] flex items-center px-4 border-b border-[#7042f88b]">
          <button
            className="p-2 rounded-full hover:bg-[#2a2a5a] hover:bg-opacity-50 mr-2 transition-colors"
            onClick={startSpeechRecognition}
            aria-label="Start Speaking"
          >
            {isListening ? <IoMdClose size={20} /> : <FaBars size={20} />}
          </button>
          <div
            onClick={() => router.push("/")}
            className="flex items-center cursor-pointer"
          >
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-cyan-500 flex items-center justify-center text-white relative overflow-hidden">
              <Image
                src="/moh-logo.jpg"
                alt="MOH Logo"
                fill
                className="object-cover"
              />
            </div>
            <div className="ml-3">
              <div className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-cyan-500">MOH AImate</div>
              <div className="text-xs text-purple-300">Your Relationship Advisor</div>
            </div>
          </div>
        </header>

        <div className="flex flex-1 h-full overflow-hidden">
          {/* Sidebar */}
          <div
            className={`h-full transition-all duration-300 ease-in-out ${isSidebarOpen ? "w-64" : "w-0"} bg-[#12122e] bg-opacity-80 backdrop-blur-md border-r border-[#7042f88b] flex flex-col overflow-hidden`}
          >
            <div className="p-4">
              <button
                onClick={startNewChat}
                className="w-full flex items-center justify-center gap-2 p-3 rounded-lg bg-gradient-to-r from-purple-600 to-cyan-600 hover:opacity-90 transition-opacity text-white font-medium"
              >
                <FaPlus size={14} />
                <span>New conversation</span>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-2">
              <div className="px-3 py-2 text-sm text-purple-300 font-medium">Recent conversations</div>
              {conversations.map((conv) => (
                <div
                  key={`conv-${conv.id}`}
                  onClick={() => selectConversation(conv.id)}
                  className={`flex items-center p-3 my-1 rounded-lg cursor-pointer ${conv.active ? "bg-[#2a2a5a] bg-opacity-70" : "hover:bg-[#1e1e46] hover:bg-opacity-50"}`}
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center text-white mr-3">
                    <FaLightbulb size={12} />
                  </div>
                  <div className="flex-1 truncate">{conv.title}</div>
                </div>
              ))}
            </div>

            <div className="mt-auto p-4 border-t border-[#7042f88b]">
              <button
                onClick={() => router.push("/login")}
                className="w-full flex items-center justify-center gap-2 p-3 rounded-lg bg-gradient-to-r from-purple-600 to-cyan-600 hover:opacity-90 transition-opacity text-white font-medium"
              >
                <FiLogIn size={14} />
                <span>Login</span>
              </button>
            </div>
          </div>

          {/* Chat Area */}
          <div className="flex-1 overflow-hidden flex flex-col bg-[#12122e]">
            <div className="flex-1 overflow-y-auto px-3 py-4">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex gap-3 ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`p-3 rounded-lg max-w-[70%] ${
                      msg.sender === "user" ? "bg-[#4C6F91]" : "bg-[#3a3a5c]"
                    }`}
                  >
                    <div className="font-semibold">{msg.sender === "user" ? "You" : "MOH AImate"}</div>
                    <div>{msg.text}</div>
                    <div className="text-xs text-gray-400 mt-1">{msg.timestamp}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Input */}
            <div className="bg-[#1c1c3c] p-4 border-t border-[#7042f88b]">
              <div className="flex gap-2">
                <input
                  type="text"
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onFocus={handleInputFocus}
                  className="flex-1 p-2 bg-[#2a2a5a] text-white rounded-lg"
                  placeholder="Type your message..."
                />
                <button
                  onClick={() => sendMessage(input)}
                  className="p-2 rounded-lg bg-gradient-to-r from-purple-500 to-cyan-500 text-white"
                >
                  <FaPaperPlane size={18} />
                </button>
                <button
                  onClick={startSpeechRecognition}
                  className={`p-2 rounded-lg bg-gradient-to-r from-purple-500 to-cyan-500 text-white ${
                    isListening ? "opacity-50" : ""
                  }`}
                >
                  <FaMicrophone size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatBot;
