"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Bars3Icon, PhoneIcon, XMarkIcon, ChevronDownIcon } from "@heroicons/react/24/outline";
import { getProductLines, getPartCategories } from "../lib/api";
import { useTheme } from "next-themes";

export default function Header() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { theme } = useTheme();
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);

  // Determine if we're in dark mode
  const isDarkMode = theme === 'dark';

  interface ProductLine {
    slug: string;
    name: string;
  }

  interface PartCategory {
    slug: string;
    name: string;
  }

  const [productLines, setProductLines] = useState<ProductLine[]>([]);
  const [partCategories, setPartCategories] = useState<PartCategory[]>([]);

  useEffect(() => {
    setMounted(true);

    async function fetchData() {
      const lines = await getProductLines();
      const categories = await getPartCategories();
      setProductLines(lines);
      setPartCategories(categories);
    }
    fetchData();
  }, []);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  const navLinks = [
    { href: "/", label: "Home" },
    {
      href: "/products",
      label: "Products",
      subLinks: productLines.map((line) => ({
        href: `/products/${line.slug}`,
        label: line.name,
      })),
    },
    {
      href: "/parts-and-accessories",
      label: "Parts & Accessories",
      subLinks: partCategories.map((category) => ({
        href: `/parts-and-accessories/${category.slug}`,
        label: category.name,
      })),
    },
    { href: "/about", label: "About Us" },
    { href: "/contact", label: "Contact" },
    { href: "/service", label: "Request Service" },
  ];

  const isLinkActive = (href: string) => pathname === href;
  const isSubLinkActive = (subLinks: { href: string }[]) =>
    subLinks.some((subLink) => pathname === subLink.href);

  const generateBreadcrumbs = () => {
    const pathSegments = pathname.split("/").filter(Boolean);
    const breadcrumbs = pathSegments.map((segment, index) => {
      const href = "/" + pathSegments.slice(0, index + 1).join("/");
      const label = segment.replace(/-/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
      return { href, label };
    });

    return [
      { href: "/", label: "Home" },
      ...breadcrumbs,
    ];
  };

  // Function to toggle dropdown on mobile
  const toggleDropdown = (index: number) => {
    setActiveDropdown(activeDropdown === index ? null : index);
  };

  // Don't render with theme-specific styles until mounted to prevent hydration mismatch
  if (!mounted) {
    return (
      <header className="bg-blue-600 text-white py-4 pb-0">
        <div className="container mx-auto flex flex-col md:flex-row items-center px-4 md:px-8 pb-4">
          {/* Placeholder content */}
        </div>
      </header>
    );
  }

  return (
    <header className={`${isDarkMode ? 'bg-blue-900' : 'bg-blue-600'} text-white shadow-lg z-30 relative`}>
      <div className="container mx-auto px-4">
        {/* Top contact bar */}
        <div className="hidden md:flex justify-end items-center py-2 text-sm">
          <a href="tel:+18002469689" className="flex items-center hover:text-blue-200 transition-colors">
            <PhoneIcon className="h-4 w-4 mr-1" />
            1-800-246-9689
          </a>
        </div>

        {/* Main header */}
        <div className="flex items-center justify-between py-4">
          <Link href="/" className="flex items-center space-x-3 group">
            <Image
              src="/logo.png"
              alt="Pressure Systems Company Inc. Logo"
              width={48}
              height={48}
              priority
              className={`transition-all duration-300 ${isDarkMode ? 'brightness-110' : ''}`}
            />
            <span className="text-xl font-semibold">
              Pressure Systems Company Inc.
            </span>
          </Link>

          {/* Mobile menu button */}
          <button
            className="md:hidden flex items-center p-2 rounded-lg hover:bg-blue-700 transition-colors focus:outline-none"
            onClick={toggleMenu}
          >
            {menuOpen ? (
              <XMarkIcon className="h-7 w-7" />
            ) : (
              <Bars3Icon className="h-7 w-7" />
            )}
          </button>

          {/* Desktop navigation */}
          <nav className="hidden md:block">
            <ul className="flex space-x-1">
              {navLinks.map((link, index) => (
                <li key={index} className="relative group">
                  {link.subLinks ? (
                    <>
                      <div
                        className={`flex items-center px-4 py-2 rounded-lg cursor-pointer ${isLinkActive(link.href) || isSubLinkActive(link.subLinks)
                            ? isDarkMode
                              ? "bg-blue-800 font-semibold"
                              : "bg-blue-700 font-semibold"
                            : "hover:bg-blue-700/50 transition-colors"
                          }`}
                      >
                        <Link href={link.href}>{link.label}</Link>
                        <ChevronDownIcon className="h-4 w-4 ml-1 transition-transform group-hover:rotate-180" />
                      </div>
                      <div className="absolute left-0 pt-2 w-64 hidden group-hover:block z-50">
                        <ul
                          className={`${isDarkMode
                              ? 'bg-gray-800 border-gray-700'
                              : 'bg-white border-gray-200'
                            } rounded-lg overflow-hidden shadow-xl border py-1 transition-all duration-200`}
                        >
                          {link.subLinks.map((subLink, subIndex) => (
                            <li key={subIndex}>
                              <Link
                                href={subLink.href}
                                className={`block px-4 py-2 ${isDarkMode
                                    ? `text-white hover:bg-blue-900 ${isLinkActive(subLink.href) ? "bg-blue-800" : ""}`
                                    : `text-gray-800 hover:bg-blue-50 ${isLinkActive(subLink.href) ? "bg-blue-100" : ""}`
                                  } transition-colors`}
                              >
                                {subLink.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </>
                  ) : (
                    <Link
                      href={link.href}
                      className={`block px-4 py-2 rounded-lg ${isLinkActive(link.href)
                          ? isDarkMode
                            ? "bg-blue-800 font-semibold"
                            : "bg-blue-700 font-semibold"
                          : "hover:bg-blue-700/50 transition-colors"
                        }`}
                    >
                      {link.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </nav>

          {/* Mobile call-to-action */}
          <a
            href="tel:+18002469689"
            className={`${isDarkMode ? 'bg-yellow-600 hover:bg-yellow-700' : 'bg-yellow-500 hover:bg-yellow-600'
              } md:hidden text-black py-2 px-3 rounded-lg text-sm font-bold focus:outline-none transition-colors flex items-center`}
          >
            <PhoneIcon className="h-4 w-4 mr-1" /> Call
          </a>
        </div>
      </div>

      {/* Mobile navigation menu */}
      <div
        className={`${menuOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
          } md:hidden overflow-hidden transition-all duration-300 ease-in-out`}
      >
        <nav className="px-4 pb-4">
          <ul className="flex flex-col space-y-1">
            {navLinks.map((link, index) => (
              <li key={index} className="relative">
                {link.subLinks ? (
                  <>
                    <div
                      className={`flex items-center justify-between p-3 rounded-lg cursor-pointer ${isLinkActive(link.href) || isSubLinkActive(link.subLinks)
                          ? isDarkMode
                            ? "bg-blue-800 font-semibold"
                            : "bg-blue-700 font-semibold"
                          : isDarkMode
                            ? "bg-blue-950/50"
                            : "bg-blue-700/30"
                        }`}
                      onClick={() => toggleDropdown(index)}
                    >
                      <Link href={link.href}>{link.label}</Link>
                      <ChevronDownIcon className={`h-5 w-5 transition-transform ${activeDropdown === index ? 'rotate-180' : ''}`} />
                    </div>
                    <ul
                      className={`${activeDropdown === index
                          ? "max-h-96 opacity-100 mt-1"
                          : "max-h-0 opacity-0"
                        } overflow-hidden transition-all duration-300 rounded-lg ${isDarkMode ? 'bg-blue-950/70' : 'bg-blue-500/70'
                        }`}
                    >
                      {link.subLinks.map((subLink, subIndex) => (
                        <li key={subIndex}>
                          <Link
                            href={subLink.href}
                            className={`block p-3 pl-6 ${isLinkActive(subLink.href)
                                ? "font-semibold bg-blue-800/50"
                                : ""
                              } hover:bg-blue-800/30 transition-colors`}
                            onClick={() => setMenuOpen(false)}
                          >
                            {subLink.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </>
                ) : (
                  <Link
                    href={link.href}
                    className={`block p-3 rounded-lg ${isLinkActive(link.href)
                        ? isDarkMode
                          ? "bg-blue-800 font-semibold"
                          : "bg-blue-700 font-semibold"
                        : isDarkMode
                          ? "bg-blue-950/50"
                          : "bg-blue-700/30"
                      } hover:bg-blue-700 transition-colors`}
                    onClick={() => setMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Breadcrumb Bar */}
      {pathname !== "/" && (
        <div className={`${isDarkMode ? 'bg-blue-950' : 'bg-blue-700'} py-2 shadow-md relative z-20`}>
          <div className="container mx-auto px-4">
            <nav className="text-sm text-blue-100 flex flex-wrap">
              {generateBreadcrumbs().map((crumb, index) => (
                <span key={index} className="flex items-center">
                  {index > 0 && (
                    <svg className="h-3 w-3 mx-2 text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  )}
                  <Link
                    href={crumb.href}
                    className={`hover:text-white transition-colors ${index === generateBreadcrumbs().length - 1 ? "font-semibold text-white" : ""
                      }`}
                  >
                    {crumb.label}
                  </Link>
                </span>
              ))}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}