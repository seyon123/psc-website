"use client"; // Ensures state & event handling works in Next.js

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { SpeakerWaveIcon, SpeakerXMarkIcon, PlayIcon, PauseIcon, ChevronDownIcon } from "@heroicons/react/24/solid";
import { useTheme } from "next-themes";

export default function Hero() {
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme } = useTheme();
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Determine if it's dark mode
  const isDarkMode = mounted && resolvedTheme === 'dark';

  useEffect(() => {
    setMounted(true);

    // Force video to be visible after a timeout regardless of events
    const timer = setTimeout(() => {
      setIsVideoLoaded(true);
    }, 2000);

    // Manual video loading check
    const checkVideoLoaded = () => {
      const iframe = iframeRef.current;
      if (iframe && iframe.contentWindow) {
        setIsVideoLoaded(true);
      }
    };

    // Check if video is loaded after a short delay
    const loadCheck = setTimeout(checkVideoLoaded, 1000);

    // Set up event listener for iframe load
    const handleIframeLoad = () => {
      setIsVideoLoaded(true);

      // Ensure video is muted initially
      if (iframeRef.current && iframeRef.current.contentWindow) {
        iframeRef.current.contentWindow.postMessage('{"event":"command","func":"mute","args":""}', "*");
      }
    };

    const iframe = iframeRef.current;
    if (iframe) {
      iframe.addEventListener('load', handleIframeLoad);
    }

    // Clean up
    return () => {
      clearTimeout(timer);
      clearTimeout(loadCheck);
      if (iframe) {
        iframe.removeEventListener('load', handleIframeLoad);
      }
    };
  }, []);

  const toggleMute = () => {
    if (iframeRef.current && iframeRef.current.contentWindow) {
      const command = isMuted ? "unMute" : "mute";
      iframeRef.current.contentWindow.postMessage(`{"event":"command","func":"${command}","args":""}`, "*");
      setIsMuted(!isMuted);
    }
  };

  const togglePlayPause = () => {
    if (iframeRef.current && iframeRef.current.contentWindow) {
      const command = isPlaying ? "pauseVideo" : "playVideo";
      iframeRef.current.contentWindow.postMessage(`{"event":"command","func":"${command}","args":""}`, "*");
      setIsPlaying(!isPlaying);
    }
  };

  const scrollToContent = () => {
    // Smooth scroll to the section below the hero
    const heroHeight = document.querySelector('section')?.offsetHeight || 0;
    window.scrollTo({ top: heroHeight, behavior: 'smooth' });
  };

  return (
    <section className="relative h-[75vh] w-full flex items-center justify-center text-center overflow-hidden">
      {/* Responsive YouTube Video Background */}
      <div className={`absolute top-0 left-0 w-full h-full transition-opacity duration-700 ${isVideoLoaded ? 'opacity-100' : 'opacity-0'}`}>
        <div className="absolute top-1/2 left-1/2 w-[100vh] h-[60vw] min-w-full min-h-full -translate-x-1/2 -translate-y-1/2">
          <iframe
            ref={iframeRef}
            id="youtube-video"
            className="w-full h-full"
            src="https://www.youtube.com/embed/C2Gw7ejoYTY?enablejsapi=1&autoplay=1&mute=1&loop=1&controls=0&disablekb=1&modestbranding=1&rel=0&showinfo=0&playlist=C2Gw7ejoYTY"
            title="Background Video"
            allow="autoplay; fullscreen"
            allowFullScreen
          ></iframe>
        </div>
      </div>

      {/* Loading state - only visible when video is not loaded */}
      {!isVideoLoaded && (
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-blue-900 to-blue-700 flex items-center justify-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-white"></div>
        </div>
      )}

      {/* Dark Overlay with gradient - always visible */}
      <div
        className={`absolute top-0 left-0 w-full h-full pointer-events-none ${isDarkMode
            ? 'bg-gradient-to-b from-black/70 via-black/60 to-black/80'
            : 'bg-gradient-to-b from-black/50 via-black/40 to-black/70'
          }`}
      ></div>

      {/* Hero Content */}
      <div className="relative z-10 text-white px-6 max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold drop-shadow-lg mb-6">
          Professional Pressure Washing Solutions
        </h1>
        <p className="mt-4 text-lg md:text-xl text-gray-200 drop-shadow-md max-w-2xl mx-auto">
          Discover high-performance pressure washing equipment built for industrial strength, durability and efficiency.
        </p>

        {/* CTA Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/products"
            className="w-full sm:w-auto inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-300 shadow-lg transform hover:-translate-y-1"
          >
            Explore Products
          </Link>
          <Link
            href="/contact"
            className="w-full sm:w-auto inline-block bg-transparent hover:bg-white/10 text-white font-semibold py-3 px-8 rounded-lg border-2 border-white/70 hover:border-white transition-all duration-300 shadow-lg transform hover:-translate-y-1"
          >
            Request Quote
          </Link>
        </div>
      </div>

      {/* Video Controls */}
      <div className="absolute bottom-6 left-6 flex items-center space-x-3 z-10">
        {/* Play/Pause Button */}
        <button
          onClick={togglePlayPause}
          className="cursor-pointer bg-gray-900/70 text-white p-3 rounded-full hover:bg-gray-800 transition-all duration-300 shadow-md flex items-center justify-center"
          aria-label={isPlaying ? "Pause video" : "Play video"}
        >
          {isPlaying ? (
            <PauseIcon className="w-5 h-5" />
          ) : (
            <PlayIcon className="w-5 h-5" />
          )}
        </button>

        {/* Mute/Unmute Button */}
        <button
          onClick={toggleMute}
          className="cursor-pointer bg-gray-900/70 text-white p-3 rounded-full hover:bg-gray-800 transition-all duration-300 shadow-md flex items-center justify-center"
          aria-label={isMuted ? "Unmute video" : "Mute video"}
        >
          {isMuted ? (
            <SpeakerXMarkIcon className="w-5 h-5" />
          ) : (
            <SpeakerWaveIcon className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Scroll down indicator */}
      <button
        onClick={scrollToContent}
        className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-10 flex flex-col items-center animate-bounce cursor-pointer text-white opacity-75 hover:opacity-100 transition-opacity"
        aria-label="Scroll down"
      >
        <span className="text-sm mb-1">Scroll</span>
        <ChevronDownIcon className="w-6 h-6" />
      </button>
    </section>
  );
}