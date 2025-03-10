"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { getProductLines, getPartCategories } from "../lib/api";

export default function Header() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

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

  return (
    <header className="bg-blue-600 text-white py-4 pb-0">
      <div className="container mx-auto flex flex-col md:flex-row items-center px-4 md:px-8 pb-4">
        <div className="w-full flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-4">
            <Image
              src="/logo.png"
              alt="Pressure Systems Company Inc. Logo"
              width={48}
              height={48}
              priority
            />
            <span className="text-xl font-semibold">
              Pressure Systems Company Inc.
            </span>
          </Link>

          <button
            className="md:hidden block text-white focus:outline-none"
            onClick={toggleMenu}
          >
            {menuOpen ? (
              <XMarkIcon className="h-8 w-8" />
            ) : (
              <Bars3Icon className="h-8 w-8" />
            )}
          </button>
        </div>

        <nav
          className={`${menuOpen ? "flex" : "hidden"} md:flex md:flex-row flex-col w-full mt-4 md:mt-0 md:justify-end`}
        >
          <ul className="flex flex-col md:flex-row md:space-x-6 space-y-4 md:space-y-0">
            {navLinks.map((link, index) => (
              <li key={index} className="relative group flex items-center">
                {link.subLinks ? (
                  <>
                    <Link
                      href={link.href}
                      className={`cursor-pointer hover:underline focus:outline-none w-full md:w-auto text-left py-2 ${isLinkActive(link.href) || isSubLinkActive(link.subLinks)
                        ? "font-bold underline"
                        : ""
                        }`}
                    >
                      {link.label}
                    </Link>
                    <ul
                      className="absolute left-0 w-56 bg-white text-black shadow-lg rounded-lg z-50 mt-0 hidden group-hover:block transition-all ease-in-out duration-300"
                      style={{
                        left: "0",
                        right: "0",
                        maxWidth: "calc(100vw - 2rem)",
                        top: "100%",
                      }}
                    >
                      {link.subLinks.map((subLink, subIndex) => (
                        <li key={subIndex}>
                          <Link
                            href={subLink.href}
                            className={`block px-4 py-2 hover:bg-gray-200 rounded ${isLinkActive(subLink.href)
                              ? "font-bold bg-gray-100"
                              : ""
                              }`}
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
                    className={`block hover:underline py-2 ${isLinkActive(link.href) ? "font-bold underline" : ""}`}
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
        <div className="bg-blue-700 p-1">
          <div className="container mx-auto px-4 md:px-8">
            <nav className="text-sm text-white">
              {generateBreadcrumbs().map((crumb, index) => (
                <span key={index}>
                  <Link href={crumb.href} className="hover:underline">
                    {crumb.label}
                  </Link>
                  {index < generateBreadcrumbs().length - 1 && <span className="mx-2">/</span>}
                </span>
              ))}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
