"use client";

import { useState, useEffect, useRef } from "react";
import { Menu, X, Search } from "lucide-react";
import { LuInstagram } from "react-icons/lu";
import Image from "next/image";

interface NavbarProps {
  onSearch: (query: string) => void;
  searchQuery: string;
}

const navLinks = [
  { label: "Home", href: "#" },
  { label: "All Frames", href: "#collection" },
  { label: "Our Story", href: "#about" },
  { label: "Services", href: "#services" },
];

export default function Navbar({ onSearch, searchQuery }: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const instagramProfile = process.env.NEXT_PUBLIC_INSTAGRAM_PROFILE || "";

  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  const handleNavClick = (href: string) => {
    setIsMenuOpen(false);
    if (href === "#") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    const el = document.querySelector(href);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-background border-b border-border">
      <div className="max-w-[1280px] mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                handleNavClick("#");
              }}
              className="flex items-center gap-2"
            >
              <Image
                src="/images/rsframeslogo.jpg"
                alt="रिद्धी सिद्धी Frames"
                width={140}
                height={140}
                className="h-10 md:h-15 w-auto"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = "none";
                  const parent = target.parentElement;
                  if (parent && !parent.querySelector("span")) {
                    const span = document.createElement("span");
                    span.className =
                      "font-serif-deva text-lg md:text-xl font-bold text-foreground";
                    span.textContent = "रिद्धी सिद्धी Frames";
                    parent.appendChild(span);
                  }
                }}
              />
            </a>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(link.href);
                }}
                className="text-sm text-foreground hover:text-accent transition-colors"
              >
                {link.label}
              </a>
            ))}
            {instagramProfile && (
              <a
                href={`https://www.instagram.com/${instagramProfile}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground hover:text-accent transition-colors"
                aria-label="Instagram"
              >
                <LuInstagram className="w-4.5 h-4.5" />
              </a>
            )}
          </div>

          {/* Desktop Search */}
          <div className="hidden md:flex items-center">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary" />
              <input
                type="text"
                placeholder="Search frames..."
                value={searchQuery}
                onChange={(e) => onSearch(e.target.value)}
                className="pl-9 pr-4 py-2 w-64 text-sm bg-card border border-border text-foreground placeholder:text-secondary focus:outline-none focus:border-accent"
              />
            </div>
          </div>

          {/* Mobile Actions */}
          <div className="flex md:hidden items-center gap-2">
            {instagramProfile && (
              <a
                href={`https://www.instagram.com/${instagramProfile}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-foreground hover:text-accent transition-colors"
                aria-label="Instagram"
              >
                <LuInstagram className="w-5 h-5" />
              </a>
            )}
            <button
              onClick={() => {
                setIsSearchOpen(!isSearchOpen);
                if (isMenuOpen) setIsMenuOpen(false);
              }}
              className="p-2 text-foreground"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>
            <button
              onClick={() => {
                setIsMenuOpen(!isMenuOpen);
                if (isSearchOpen) setIsSearchOpen(false);
              }}
              className="p-2 text-foreground"
              aria-label="Menu"
            >
              {isMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Search */}
        {isSearchOpen && (
          <div className="md:hidden pb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary" />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search frames..."
                value={searchQuery}
                onChange={(e) => onSearch(e.target.value)}
                className="pl-9 pr-4 py-2.5 w-full text-sm bg-card border border-border text-foreground placeholder:text-secondary focus:outline-none focus:border-accent"
              />
            </div>
          </div>
        )}

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-border pb-4">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(link.href);
                }}
                className="block py-3 px-2 text-sm text-foreground hover:text-accent transition-colors border-b border-border last:border-b-0"
              >
                {link.label}
              </a>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}
