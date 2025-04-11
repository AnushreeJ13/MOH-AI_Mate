"use client";

import React, { useEffect } from "react";

const Saathi: React.FC = () => {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://widget-js.cometchat.io/v3/cometchatwidget.js";
    script.defer = true;

    script.onload = () => {
      // @ts-ignore
      if (window.CometChatWidget) {
        // @ts-ignore
        window.CometChatWidget.init({
          appID: "273007af6b1dd710",
          appRegion: "in",
          authKey: "4f60e0dbc829182a47dd9a35fbd1310899c11b60",
        }).then(
          () => {
            // @ts-ignore
            window.CometChatWidget.login({ uid: "pearlly" }).then(
              () => {
                // @ts-ignore
                window.CometChatWidget.launch({
                  widgetID: "b47a16fa-7e78-49a5-ae1a-95d24da89d1f",
                  target: "#cometchat",
                  roundedCorners: true,
                  height: "100%",
                  width: "100%",
                  defaultID: "pearlly",
                  defaultType: "group",
                });
              },
              (error: any) => {
                console.error("Login failed:", error);
              }
            );
          },
          (error: any) => {
            console.error("Initialization failed:", error);
          }
        );
      }
    };

    document.body.appendChild(script);
  }, []);

  return (
    <div className="flex h-[calc(100vh-4rem)] overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-[#1f1f1f] text-white flex flex-col justify-between p-6 shadow-md">
        <div>
          <h2 className="text-2xl font-semibold mb-6 tracking-wide">Saathi</h2>
          <nav className="space-y-3 text-sm">
            <a
              href="/"
              className="block bg-[#333] hover:bg-[#444] px-4 py-2 rounded transition-all duration-150"
            >
              🏠 Home
            </a>
            <a
              href="/ventin"
              className="block bg-[#333] hover:bg-[#444] px-4 py-2 rounded transition-all duration-150"
            >
              🎤 Vent
            </a>
            <a
              href="/find_my_therapist"
              className="block bg-[#333] hover:bg-[#444] px-4 py-2 rounded transition-all duration-150"
            >
              🧠 Find Therapist
            </a>
            <a
              href="#"
              className="block bg-[#333] hover:bg-[#444] px-4 py-2 rounded transition-all duration-150"
            >
              🫂 Saathi Rooms
            </a>
            <a
              href="#"
              className="block bg-[#333] hover:bg-[#444] px-4 py-2 rounded transition-all duration-150"
            >
              👤 Profile
            </a>
          </nav>
        </div>
        <footer className="text-xs text-center text-gray-400 mt-6">
          &copy; 2025 VentApp
        </footer>
      </aside>

      {/* Chat area */}
      <main id="cometchat" className="flex-1 h-full bg-white rounded-l-lg" />
    </div>
  );
};

export default Saathi;
