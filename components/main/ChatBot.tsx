"use client";

import React, { useState, useEffect, useRef } from "react";
import { FaBars, FaPlus, FaPaperPlane, FaLightbulb, FaSignOutAlt } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import { FiLogIn } from "react-icons/fi";
import Image from "next/image";
import { useRouter } from "next/navigation";
import dynamic from 'next/dynamic';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

// Helper function to add timestamps to messages
const addTimestamp = (message) => {
  return {
    ...message,
    timestamp: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
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
  
  // Initialize state on client-side only
  useEffect(() => {
    setMessages([
      addTimestamp({ 
        text: "Hello! I'm MOH, your AI-powered relationship advisor. How can I help you today?", 
        sender: "bot" 
      })
    ]);
    
    setConversations([
      { id: 1, title: "New Conversation", active: true }
    ]);
    
    setIsLoaded(true);
  }, []);
  
  // Navigation function to safely return to home
  const navigateToHome = () => {
    router.push('/');
  };
  
  const handleInputFocus = () => {
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 0);
  };
  // Add proper TypeScript types for messages and conversations
  const sendMessage = async () => {
    if (!input.trim()) return;
  
    const userMessage = addTimestamp({ text: input, sender: "user" });
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);
  
    handleInputFocus();
  
    try {
      const response = await fetch(`${API_URL}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: input }),
      });
      
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      
      const data = await response.json();
      
      const botResponse = addTimestamp({ 
        text: data.response || "I'm not sure how to respond to that.",
        sender: "bot" 
      });
      
      // Add a small delay to make the typing indicator visible
      setTimeout(() => {
        setMessages((prev) => [...prev, botResponse]);
        setIsTyping(false);
      }, 500);
      
    } catch (error) {
      console.error('Error:', error);
      const errorResponse = addTimestamp({ 
        text: "Sorry, I couldn't connect to my brain. Please try again later.",
        sender: "bot" 
      });
      setMessages((prev) => [...prev, errorResponse]);
      setIsTyping(false);
    }
  };
  
  const startNewChat = () => {
    const newId = conversations.length + 1;
    const updatedConversations = conversations.map(conv => ({
      ...conv, 
      active: false
    }));
    
    setConversations([
      ...updatedConversations, 
      { id: newId, title: "New Conversation", active: true }
    ]);
    
    setMessages([
      addTimestamp({ 
        text: "Hello! I'm MOH, your AI-powered relationship advisor. How can I help you today?", 
        sender: "bot" 
      })
    ]);
  };
  
  const selectConversation = (id) => {
    const updatedConversations = conversations.map(conv => ({
      ...conv,
      active: conv.id === id
    }));
    
    setConversations(updatedConversations);
    setMessages([
      addTimestamp({ 
        text: "Hello! I'm MOH, your AI-powered relationship advisor. How can I help you today?", 
        sender: "bot" 
      })
    ]);
  };
  
  // Scroll to bottom when messages change - Fixed with proper cleanup and error handling
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
  
  // Focus input on initial load
  useEffect(() => {
    if (!isLoaded) return;
    const timer = setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [isLoaded]);
  
  // Add a new effect to handle focus when clicking anywhere in the chat area - Fixed with better error handling
  useEffect(() => {
    if (!isLoaded) return;
    
    const handleClick = (e) => {
      // Add null check for e.target
      if (!e || !e.target) return;
      
      try {
        // Only focus if clicking in the chat area, not on buttons or other interactive elements
        if (e.target.tagName !== 'BUTTON' && 
            e.target.tagName !== 'TEXTAREA' && 
            e.target.tagName !== 'A' &&
            e.target.tagName !== 'INPUT' &&
            !e.target.closest('button') &&
            !e.target.closest('a')) {
          if (inputRef.current) {
            inputRef.current.focus();
          }
        }
      } catch (error) {
        console.error("Error in click handler:", error);
      }
    };
    
    document.addEventListener('click', handleClick);
    
    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, [isLoaded]);
  
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  
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
            onClick={toggleSidebar}
            aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
          >
            {isSidebarOpen ? <IoMdClose size={20} /> : <FaBars size={20} />}
          </button>
          <div 
            onClick={navigateToHome}
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
          {/* Sidebar - ChatGPT style */}
          <div 
            className={`h-full transition-all duration-300 ease-in-out ${
              isSidebarOpen ? "w-64" : "w-0"
            } bg-[#12122e] bg-opacity-80 backdrop-blur-md border-r border-[#7042f88b] flex flex-col overflow-hidden`}
          >
            {/* New Chat Button */}
            <div className="p-4">
              <button 
                onClick={startNewChat}
                className="w-full flex items-center justify-center gap-2 p-3 rounded-lg bg-gradient-to-r from-purple-600 to-cyan-600 hover:opacity-90 transition-opacity text-white font-medium"
              >
                <FaPlus size={14} />
                <span>New conversation</span>
              </button>
            </div>
            
            {/* Conversations List */}
            <div className="flex-1 overflow-y-auto px-2">
              <div className="px-3 py-2 text-sm text-purple-300 font-medium">Recent conversations</div>
              {conversations.map((conv) => (
                <div 
                  key={`conv-${conv.id}`}
                  onClick={() => selectConversation(conv.id)}
                  className={`flex items-center p-3 my-1 rounded-lg cursor-pointer ${conv.active 
                      ? "bg-[#2a2a5a] bg-opacity-70" 
                      : "hover:bg-[#1e1e46] hover:bg-opacity-50"
                  }`}
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center text-white mr-3">
                    <FaLightbulb size={12} />
                  </div>
                  <div className="flex-1 truncate">
                    {conv.title}
                  </div>
                </div>
              ))}
            </div>
            
            {/* Login button at the bottom of sidebar */}
            <div className="mt-auto p-4 border-t border-[#7042f88b]">
              <button 
                onClick={() => router.push('/login')}
                className="w-full flex items-center justify-center gap-2 p-3 rounded-lg bg-[#2a2a5a] hover:bg-[#3a3a7a] transition-colors"
              >
                <FiLogIn size={16} />
                <span>Login</span>
              </button>
            </div>
          </div>
          
          {/* Main Chat Area - ChatGPT style */}
          <div className="flex-1 flex flex-col h-full bg-[#0d0d23] relative">
            {/* Chat background pattern */}
            <div className="absolute inset-0 opacity-5" style={{ 
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              backgroundSize: '30px 30px'
            }}></div>
            
            {/* Messages Area - WhatsApp style bubbles */}
            <div className="flex-1 overflow-y-auto p-4 relative flex justify-center">
              <div className="w-full max-w-3xl">
                {messages.map((msg, index) => (
                  <div
                    key={`msg-${index}`}
                    className={`mb-4 flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                  >
                    {msg.sender === "bot" && (
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-cyan-500 flex-shrink-0 mr-2 self-end overflow-hidden relative">
                        <Image 
                          src="/moh-logo.jpg" 
                          alt="MOH" 
                          fill 
                          className="object-cover"
                        />
                      </div>
                    )}
                    <div 
                      className={`max-w-xs md:max-w-md p-3 rounded-lg ${msg.sender === "user" 
                          ? "bg-[#2a2a5a] rounded-tr-none text-white" 
                          : "bg-[#1e1e46] rounded-tl-none text-gray-200 border border-[#7042f88b]"
                      }`}
                      style={{ wordBreak: 'break-word', overflowWrap: 'break-word' }}
                    >
                      <div className="text-gray-300 whitespace-pre-wrap overflow-hidden">
                        {msg.text}
                      </div>
                      <div className="text-right mt-1">
                        <span className="text-xs opacity-70">
                          {msg.timestamp}
                        </span>
                      </div>
                    </div>
                    {msg.sender === "user" && (
                      <div className="w-8 h-8 rounded-full bg-[#3a3a7a] flex-shrink-0 ml-2 self-end flex items-center justify-center">
                        <span className="text-xs">You</span>
                      </div>
                    )}
                  </div>
                ))}
                {/* Typing Indicator */}
                {isTyping && (
                  <div className="flex justify-start mb-4">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-cyan-500 flex-shrink-0 mr-2 self-end overflow-hidden relative">
                      <Image 
                        src="/moh-logo.jpg" 
                        alt="MOH" 
                        fill 
                        className="object-cover"
                      />
                    </div>
                    <div className="max-w-xs md:max-w-md p-3 rounded-lg bg-[#1e1e46] rounded-tl-none text-gray-200 border border-[#7042f88b]">
                      <div className="flex space-x-2">
                        <div className="w-2 h-2 rounded-full bg-purple-400 animate-pulse"></div>
                        <div className="w-2 h-2 rounded-full bg-purple-400 animate-pulse delay-150"></div>
                        <div className="w-2 h-2 rounded-full bg-purple-400 animate-pulse delay-300"></div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={chatRef} />
              </div>
            </div>
            
            {/* Input Area - ChatGPT style */}
            <div className="p-4 bg-[#0d0d23] border-t border-[#7042f88b] flex justify-center">
              <div className="w-full max-w-3xl">
                <div className="flex items-center gap-2 bg-[#1e1e46] rounded-lg p-2 shadow-lg">
                  <textarea
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        sendMessage();
                      }
                    }}
                    placeholder="Message MOH..."
                    className="flex-1 bg-transparent border-none text-white placeholder-gray-400 focus:outline-none resize-none max-h-20 py-2 px-3"
                    rows={1}
                  />
                  <button
                    onClick={sendMessage}
                    disabled={!input.trim()}
                    className={`p-3 rounded-lg ${input.trim() 
                        ? "bg-gradient-to-r from-purple-500 to-cyan-500 hover:opacity-90" 
                        : "bg-gray-700 opacity-50"
                    } transition-all`}
                  >
                    <FaPaperPlane size={16} />
                  </button>
                </div>
                <div className="text-xs text-center mt-2 text-purple-300">
                  MOH AIMate is here to help with relationship advice and emotional support.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Create a wrapper component to handle client-side only rendering
const ChatBotWithNoSSR = dynamic(() => Promise.resolve(ChatBot), {
  ssr: false,
});

export default ChatBotWithNoSSR;