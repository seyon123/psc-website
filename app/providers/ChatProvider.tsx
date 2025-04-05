'use client';

import React, { createContext, useContext, ReactNode, useEffect } from 'react';
import { useTheme } from 'next-themes';

// Define a more specific type for Crisp
// The key issue is that window.$crisp is both an array AND has methods
interface CrispInterface {
  push: (...args: unknown[]) => void;
  is: (method: string) => boolean;
}

// Define the Crisp object for TypeScript
declare global {
  interface Window {
    $crisp: CrispInterface;
    CRISP_WEBSITE_ID: string;
  }
}

// Define types for our chat context
type ChatContextType = {
  openChat: () => void;
  closeChat: () => void;
  isChatOpen: () => boolean;
  hideChat: () => void;
  showChat: () => void;
  sendMessage: (message: string) => void;
};

// Create the context with default values
const ChatContext = createContext<ChatContextType>({
  openChat: () => {},
  closeChat: () => {},
  isChatOpen: () => false,
  hideChat: () => {},
  showChat: () => {},
  sendMessage: () => {},
});

// Hook to use the chat context
export const useChat = () => useContext(ChatContext);

// Provider component
export function ChatProvider({ children }: { children: ReactNode }) {
  const { resolvedTheme } = useTheme();

  // Initialize Crisp when component mounts
  useEffect(() => {
    // Only initialize once
    if (!window.$crisp) {
      window.$crisp = [] as unknown as CrispInterface;
      window.CRISP_WEBSITE_ID = process.env.NEXT_PUBLIC_CRISP_WEBSITE_ID || "";
      
      // Load Crisp script
      const d = document;
      const s = d.createElement("script");
      s.src = "https://client.crisp.chat/l.js";
      s.async = true;
      d.getElementsByTagName("head")[0].appendChild(s);
    }
    
    // Configure based on theme
    const intervalId = setInterval(() => {
      if (window.$crisp && typeof window.$crisp.push === 'function') {
        configureChat();
        clearInterval(intervalId);
      }
    }, 100);
    
    return () => {
      clearInterval(intervalId);
    };
  }, []);
  
  // Update chat configuration when theme changes
  useEffect(() => {
    if (window.$crisp && typeof window.$crisp.push === 'function') {
      configureChat();
    }
  }, [resolvedTheme]);
  
  // Configure chat appearance and behavior
  const configureChat = () => {
    try {
      if (window.$crisp && typeof window.$crisp.push === 'function') {
        // Theme configuration
        if (resolvedTheme === 'dark') {
          window.$crisp.push(["set", "session:data", [["theme", "dark"]]]);
          window.$crisp.push(["config", "color:theme", "#1e90ff"]);
          window.$crisp.push(["config", "color:button", "#1e90ff"]);
        } else {
          window.$crisp.push(["set", "session:data", [["theme", "light"]]]);
          window.$crisp.push(["config", "color:theme", "#007bff"]);
          window.$crisp.push(["config", "color:button", "#007bff"]);
        }
        
        // Company info and welcome message
        window.$crisp.push(["set", "user:company", ["Pressure Systems Company Inc"]]);
        
        // Position
        window.$crisp.push(["config", "position:button", "right"]);
        window.$crisp.push(["config", "position:button:x", 20]);
        window.$crisp.push(["config", "position:button:y", 20]);
        
        return true;
      }
    } catch (error) {
      console.log("Error configuring chat:", error);
    }
    return false;
  };
  
  // Chat control functions
  const openChat = () => {
    try {
      if (window.$crisp && typeof window.$crisp.push === 'function') {
        window.$crisp.push(["do", "chat:open"]);
        return true;
      }
      // If Crisp isn't loaded yet, try again after a short delay
      setTimeout(() => {
        try {
          if (window.$crisp && typeof window.$crisp.push === 'function') {
            window.$crisp.push(["do", "chat:open"]);
          }
        } catch (error) {
          console.log("Error opening chat on retry:", error);
        }
      }, 500);
    } catch (error) {
      console.log("Error opening chat:", error);
    }
    return false;
  };
  
  const closeChat = () => {
    try {
      if (window.$crisp && typeof window.$crisp.push === 'function') {
        window.$crisp.push(["do", "chat:close"]);
        return true;
      }
    } catch (error) {
      console.log("Error closing chat:", error);
    }
    return false;
  };
  
  const isChatOpen = () => {
    try {
      if (window.$crisp && typeof window.$crisp.is === 'function') {
        return window.$crisp.is("chat:opened");
      }
    } catch (error) {
      console.log("Error checking if chat is open:", error);
    }
    return false;
  };
  
  const hideChat = () => {
    try {
      if (window.$crisp && typeof window.$crisp.push === 'function') {
        window.$crisp.push(["do", "chat:hide"]);
        return true;
      }
    } catch (error) {
      console.log("Error hiding chat:", error);
    }
    return false;
  };
  
  const showChat = () => {
    try {
      if (window.$crisp && typeof window.$crisp.push === 'function') {
        window.$crisp.push(["do", "chat:show"]);
        return true;
      }
    } catch (error) {
      console.log("Error showing chat:", error);
    }
    return false;
  };
  
  const sendMessage = (message: string) => {
    try {
      if (window.$crisp && typeof window.$crisp.push === 'function') {
        window.$crisp.push(["do", "message:send", ["text", message]]);
        return true;
      }
    } catch (error) {
      console.log("Error sending message:", error);
    }
    return false;
  };
  
  // Effect to update CRISP when it's loaded from other contexts
  useEffect(() => {
    // Listen for Crisp ready event
    if (typeof window !== 'undefined') {
      const handleCrispReady = () => {
        console.log("Crisp is ready");
        configureChat();
      };
      
      window.addEventListener("crisp:ready", handleCrispReady);
      
      return () => {
        window.removeEventListener("crisp:ready", handleCrispReady);
      };
    }
  }, []);

  // Context provider with values
  return (
    <ChatContext.Provider
      value={{
        openChat,
        closeChat,
        isChatOpen,
        hideChat,
        showChat,
        sendMessage,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}