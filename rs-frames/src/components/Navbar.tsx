"use client";

import { useState, useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { Menu, X, Search } from "lucide-react";
import { LuInstagram } from "react-icons/lu";
import Image from "next/image";

interface NavbarProps {
  onSearch?: (query: string) => void;
  searchQuery?: string;
}

const navLinks = [
  { label: "Home", href: "#" },
  { label: "All Frames", href: "#collection" },
  { label: "Our Story", href: "#about" },
  { label: "Services", href: "#services" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar({
  onSearch = () => {},
  searchQuery = "",
}: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const pathname = usePathname();
  const router = useRouter();

  const instagramProfile = process.env.NEXT_PUBLIC_INSTAGRAM_PROFILE || "";

  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  const handleNavClick = (href: string) => {
    setIsMenuOpen(false);
    if (href === "#") {
      if (pathname !== "/") {
        router.push("/");
        return;
      }
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    const el = document.querySelector(href);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    } else {
      router.push(`/${href}`);
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-border transition-colors">
      <div className="max-w-[1280px] mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            <motion.a
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
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
            </motion.a>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <motion.a
                key={link.label}
                whileHover={{ y: -1 }}
                whileTap={{ y: 0 }}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(link.href);
                }}
                className="text-sm text-foreground hover:text-accent transition-colors relative py-1"
              >
                {link.label}
              </motion.a>
            ))}
            {instagramProfile && (
              <motion.a
                whileHover={{ scale: 1.15, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
                href={`https://www.instagram.com/${instagramProfile}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground hover:text-accent transition-colors"
                aria-label="Instagram"
              >
                <LuInstagram className="w-4.5 h-4.5" />
              </motion.a>
            )}
          </div>

          {/* Desktop Search */}
          <div className="hidden md:flex items-center">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary group-focus-within:text-accent transition-colors" />
              <input
                type="text"
                placeholder="Search frames..."
                value={searchQuery}
                onChange={(e) => onSearch(e.target.value)}
                className="pl-9 pr-4 py-2 w-64 text-sm bg-card border border-border text-foreground placeholder:text-secondary focus:outline-none focus:border-accent transition-all duration-200"
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
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => {
                setIsSearchOpen(!isSearchOpen);
                if (isMenuOpen) setIsMenuOpen(false);
              }}
              className="p-2 text-foreground cursor-pointer"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => {
                setIsMenuOpen(!isMenuOpen);
                if (isSearchOpen) setIsSearchOpen(false);
              }}
              className="p-2 text-foreground cursor-pointer"
              aria-label="Menu"
            >
              {isMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </motion.button>
          </div>
        </div>

        {/* Mobile Search with animation */}
        <AnimatePresence>
          {isSearchOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden overflow-hidden pb-4"
            >
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
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile Menu with smooth slide animation */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="md:hidden overflow-hidden border-t border-border pb-4"
            >
              {navLinks.map((link, idx) => (
                <motion.a
                  key={link.label}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.04 }}
                  href={link.href}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick(link.href);
                  }}
                  className="block py-3 px-2 text-sm text-foreground hover:text-accent transition-colors border-b border-border last:border-b-0"
                >
                  {link.label}
                </motion.a>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}
