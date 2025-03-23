"use client"; // Ensures state & event handling works in Next.js

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  SpeakerWaveIcon, 
  SpeakerXMarkIcon, 
  PlayIcon, 
  PauseIcon, 
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from "@heroicons/react/24/solid";
import { useTheme } from "next-themes";

// Define hero content types
type HeroContent = {
  type: 'video' | 'image';
  src: string;
  alt?: string;
  title: string;
  subtitle: string;
};

// Sample hero content
const heroContent: HeroContent[] = [
  {
    type: 'video',
    src: 'C2Gw7ejoYTY', // YouTube video ID
    title: 'Professional Pressure Washing Systems',
    subtitle: 'Discover high-performance pressure washing equipment built for industrial strength, durability and efficiency.'
  },
  {
    type: 'image',
    src: '/pumps.jpg', // Update with your actual image path
    alt: 'Building of Pressure Systems Company Products',
    title: 'Industrial-Grade Equipment',
    subtitle: 'Heavy-duty pressure washing systems designed for the toughest cleaning challenges.'
  },
  {
    type: 'image',
    src: '/car-wash.png', // Update with your actual image path
    alt: 'Commercial cleaning team using pressure washer',
    title: 'Commercial Cleaning Power',
    subtitle: 'Efficient solutions for businesses that demand reliable performance and superior results.'
  }
];

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme } = useTheme();
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Determine if it's dark mode
  const isDarkMode = mounted && resolvedTheme === 'dark';
  
  // Current slide content
  const currentContent = heroContent[currentSlide];
  const isCurrentVideo = currentContent.type === 'video';

  useEffect(() => {
    setMounted(true);
  }, []);

  // Effect for video loading
  useEffect(() => {
    if (isCurrentVideo) {
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
    } else {
      // For images, consider them loaded immediately
      setIsVideoLoaded(true);
    }
  }, [isCurrentVideo, currentSlide]);

  // Removed autoplay timer

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

  const nextSlide = () => {
    if (isTransitioning) return;
    
    setIsTransitioning(true);
    setIsVideoLoaded(false);
    const nextIndex = (currentSlide + 1) % heroContent.length;
    
    setTimeout(() => {
      setCurrentSlide(nextIndex);
      setIsTransitioning(false);
    }, 500);
  };

  const prevSlide = () => {
    if (isTransitioning) return;
    
    setIsTransitioning(true);
    setIsVideoLoaded(false);
    const prevIndex = (currentSlide - 1 + heroContent.length) % heroContent.length;
    
    setTimeout(() => {
      setCurrentSlide(prevIndex);
      setIsTransitioning(false);
    }, 500);
  };

  const scrollToContent = () => {
    // Smooth scroll to the section below the hero
    const heroHeight = document.querySelector('section')?.offsetHeight || 0;
    window.scrollTo({ top: heroHeight, behavior: 'smooth' });
  };

  return (
    <section className="relative h-[75vh] w-full flex items-center justify-center text-center overflow-hidden">
      {/* Responsive Background (Video or Image) */}
      <div className={`absolute top-0 left-0 w-full h-full transition-opacity duration-700 ${isVideoLoaded && !isTransitioning ? 'opacity-100' : 'opacity-0'}`}>
        {isCurrentVideo ? (
          // YouTube Video Background
          <div className="absolute top-1/2 left-1/2 w-[100vh] h-[60vw] min-w-full min-h-full -translate-x-1/2 -translate-y-1/2">
            <iframe
              ref={iframeRef}
              id="youtube-video"
              className="w-full h-full"
              src={`https://www.youtube.com/embed/${currentContent.src}?enablejsapi=1&autoplay=1&mute=1&loop=1&controls=0&disablekb=1&modestbranding=1&rel=0&showinfo=0&playlist=${currentContent.src}`}
              title="Background Video"
              allow="autoplay; fullscreen"
              allowFullScreen
            ></iframe>
          </div>
        ) : (
          // Image Background
          <div className="absolute top-0 left-0 w-full h-full">
            <Image
              src={currentContent.src}
              alt={currentContent.alt || "Hero background"}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}
      </div>

      {/* Loading state - only visible when content is not loaded */}
      {(!isVideoLoaded || isTransitioning) && (
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

      {/* Navigation arrows */}
      <button 
        onClick={prevSlide}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 bg-black/30 hover:bg-black/50 text-white rounded-full p-2 transition-all duration-300 cursor-pointer"
        aria-label="Previous slide"
      >
        <ChevronLeftIcon className="h-8 w-8" />
      </button>
      
      <button 
        onClick={nextSlide}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 bg-black/30 hover:bg-black/50 text-white rounded-full p-2 transition-all duration-300 cursor-pointer"
        aria-label="Next slide"
      >
        <ChevronRightIcon className="h-8 w-8" />
      </button>

      {/* Dot Indicators - styled like ProductCategories */}
      <div className="absolute bottom-6 right-6 z-10 flex items-center space-x-1">
        {heroContent.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              if (currentSlide !== index) {
                setIsTransitioning(true);
                setIsVideoLoaded(false);
                setTimeout(() => {
                  setCurrentSlide(index);
                  setIsTransitioning(false);
                }, 500);
              }
            }}
            className={`h-3 w-3 rounded-full mx-1 transition-all duration-300 cursor-pointer ${
              currentSlide === index
                ? isDarkMode
                  ? 'bg-blue-400 w-6'
                  : 'bg-blue-600 w-6'
                : isDarkMode
                  ? 'bg-gray-600 hover:bg-gray-500'
                  : 'bg-gray-300 hover:bg-gray-400'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Hero Content */}
      <div className="relative z-10 text-white px-6 max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold drop-shadow-lg mb-6">
          {currentContent.title}
        </h1>
        <p className="mt-4 text-lg md:text-xl text-gray-200 drop-shadow-md max-w-2xl mx-auto">
          {currentContent.subtitle}
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

      {/* Video Controls - only shown when current slide is a video */}
      {isCurrentVideo && (
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
      )}

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