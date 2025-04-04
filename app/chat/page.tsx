"use client";

import React from "react";
import dynamic from 'next/dynamic';

// Import the ChatBot component with dynamic loading to prevent SSR issues
const ChatBotWithNoSSR = dynamic(
  () => import('../../components/main/ChatBot'),
  { ssr: false }
);

export default function ChatPage() {
  return <ChatBotWithNoSSR standalone={true} />;
}