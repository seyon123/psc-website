"use client"; // Ensures state & event handling works in Next.js

import { useState, useEffect } from "react";
import Link from "next/link";
import { SpeakerWaveIcon, SpeakerXMarkIcon, PlayIcon, PauseIcon } from "@heroicons/react/24/solid"; // Import Heroicons

export default function Hero() {
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true); // Track play/pause state

  useEffect(() => {
    const iframe = document.getElementById("youtube-video") as HTMLIFrameElement;
    if (iframe) {
      iframe.contentWindow?.postMessage('{"event":"command","func":"mute","args":""}', "*");
    }
  }, []);

  const toggleMute = () => {
    const iframe = document.getElementById("youtube-video") as HTMLIFrameElement;
    if (iframe) {
      const command = isMuted ? "unMute" : "mute";
      iframe.contentWindow?.postMessage(`{"event":"command","func":"${command}","args":""}`, "*");
    }
    setIsMuted(!isMuted);
  };

  const togglePlayPause = () => {
    const iframe = document.getElementById("youtube-video") as HTMLIFrameElement;
    if (iframe) {
      const command = isPlaying ? "pauseVideo" : "playVideo";
      iframe.contentWindow?.postMessage(`{"event":"command","func":"${command}","args":""}`, "*");
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <section className="relative h-[60vh] w-full flex items-center justify-center text-center overflow-hidden">
      {/* Responsive YouTube Video Background */}
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-1/2 left-1/2 w-[100vh] h-[60vw] min-w-full min-h-full -translate-x-1/2 -translate-y-1/2">
          <iframe
            id="youtube-video"
            className="w-full h-full"
            src="https://www.youtube.com/embed/C2Gw7ejoYTY?enablejsapi=1&autoplay=1&mute=1&loop=1&controls=0&disablekb=1&modestbranding=1&rel=0&showinfo=0&playlist=C2Gw7ejoYTY"
            title="Background Video"
            allow="autoplay; fullscreen"
            allowFullScreen
          ></iframe>
        </div>
      </div>

      {/* Dark Overlay */}
      <div className="absolute top-0 left-0 w-full h-full bg-black opacity-50 pointer-events-none"></div>

      {/* Hero Content */}
      <div className="relative z-10 text-white px-6 max-w-3xl">
        <h1 className="text-4xl font-bold drop-shadow-lg">
          Powerful Pressure Washing Solutions
        </h1>
        <p className="mt-4 text-lg text-gray-300 drop-shadow-md">
          Discover high-performance pressure washing machines built for durability and efficiency.
        </p>

        {/* CTA Button */}
        <Link
          href="/contact"
          className="mt-6 inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 shadow-lg"
        >
          Contact Us
        </Link>
      </div>

      {/* Play/Pause Button (left of mute) */}
      <button
        onClick={togglePlayPause}
        className="cursor-pointer absolute bottom-4 left-20 bg-gray-800 bg-opacity-70 text-white p-3 rounded-full hover:bg-opacity-90 transition-all duration-300 shadow-md flex items-center justify-center"
      >
        {isPlaying ? (
          <PauseIcon className="w-6 h-6" />
        ) : (
          <PlayIcon className="w-6 h-6" />
        )}
      </button>

      {/* Mute/Unmute Button */}
      <button
        onClick={toggleMute}
        className="cursor-pointer absolute bottom-4 left-4 bg-gray-800 bg-opacity-70 text-white p-3 rounded-full hover:bg-opacity-90 transition-all duration-300 shadow-md flex items-center justify-center"
      >
        {isMuted ? (
          <SpeakerXMarkIcon className="w-6 h-6" />
        ) : (
          <SpeakerWaveIcon className="w-6 h-6" />
        )}
      </button>
    </section>
  );
}
