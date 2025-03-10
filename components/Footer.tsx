"use client";

import Link from "next/link";
import { FaFacebook, FaInstagram, FaLinkedin } from "react-icons/fa";
import { SunIcon, MoonIcon } from "@heroicons/react/24/outline";
import { useState, useEffect } from "react";

export default function Footer() {
    const [theme, setTheme] = useState("light");

    useEffect(() => {
        const savedTheme = localStorage.getItem("theme") || "light";
        setTheme(savedTheme);
        document.documentElement.className = savedTheme;
    }, []);

    const toggleTheme = () => {
        const newTheme = theme === "light" ? "dark" : "light";
        setTheme(newTheme);
        localStorage.setItem("theme", newTheme);
        document.documentElement.className = newTheme;
    };

    return (
        <footer className="bg-blue-700 text-white py-6">
            <div className="container mx-auto px-4 md:px-8 flex flex-col md:flex-row items-center justify-between">
                <div className="text-center md:text-left mb-4 md:mb-0">
                    <p className="text-lg font-semibold">Pressure Systems Company Inc.</p>
                    <p className="text-sm">&copy; {new Date().getFullYear()} All rights reserved.</p>
                </div>

                <div className="flex space-x-6 mb-4 md:mb-0">
                    <Link href="https://facebook.com" target="_blank" aria-label="Facebook">
                        <FaFacebook className="w-6 h-6 hover:text-gray-300" />
                    </Link>
                    <Link href="https://instagram.com" target="_blank" aria-label="Instagram">
                        <FaInstagram className="w-6 h-6 hover:text-gray-300" />
                    </Link>
                    <Link href="https://linkedin.com" target="_blank" aria-label="LinkedIn">
                        <FaLinkedin className="w-6 h-6 hover:text-gray-300" />
                    </Link>
                </div>

                <div className="flex space-x-6 text-sm mb-4 md:mb-0">
                    <Link href="/privacy-policy" className="hover:underline">
                        Privacy Policy
                    </Link>
                    <Link href="/sitemap" className="hover:underline">
                        Sitemap
                    </Link>
                </div>
                <button
                    className="p-2 bg-gray-800 text-white rounded-full hover:bg-gray-700"
                    onClick={toggleTheme}
                    aria-label="Toggle theme"
                >
                    {theme === "light" ? <MoonIcon className="h-6 w-6" /> : <SunIcon className="h-6 w-6" />}
                </button>
            </div>
        </footer>
    );
}
