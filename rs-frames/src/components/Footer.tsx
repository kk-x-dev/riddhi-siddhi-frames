"use client";

import { MessageCircle } from "lucide-react";
import { LuInstagram } from "react-icons/lu";
import Image from "next/image";

interface FooterProps {
  onWhatsAppClick: () => void;
}

const quickLinks = [
  { label: "Home", href: "#" },
  { label: "All Frames", href: "#collection" },
  { label: "Our Story", href: "#about" },
  { label: "Services", href: "#services" },
];

const infoLinks = [
  { label: "Delivery Information", href: "#" },
  { label: "Returns & Refund Policy", href: "#" },
  { label: "Privacy Policy", href: "#" },
];

export default function Footer({ onWhatsAppClick }: FooterProps) {
  const instagramProfile = process.env.NEXT_PUBLIC_INSTAGRAM_PROFILE || "";

  const handleNavClick = (href: string) => {
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
    <footer className="border-t border-border mt-auto">
      <div className="max-w-[1280px] mx-auto px-4 md:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="mb-4">
              <Image
                src="/images/rslogo.png"
                alt="रिद्धी सिद्धी Frames"
                width={200}
                height={200}
                className="h-20 w-auto mb-3"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = "none";
                  const parent = target.parentElement;
                  if (parent && !parent.querySelector("span")) {
                    const span = document.createElement("span");
                    span.className =
                      "font-serif-deva text-lg font-bold text-foreground block mb-3";
                    span.textContent = "रिद्धी सिद्धी Frames";
                    parent.appendChild(span);
                  }
                }}
              />
            </div>
            <p className="font-sans-deva text-sm text-secondary leading-relaxed">
              श्रद्धा, प्रेरणा आणि आपुलकीचा सुंदर संगम.
            </p>
            <p className="font-sans-deva text-sm text-secondary leading-relaxed mt-1">
              तुमच्या घरासाठी आणि प्रियजनांसाठी मनाजवळच्या फ्रेम्सची निवड.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-bold text-foreground mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    onClick={(e) => {
                      e.preventDefault();
                      handleNavClick(link.href);
                    }}
                    className="text-sm text-secondary hover:text-accent transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Info Links */}
          <div>
            <h4 className="text-sm font-bold text-foreground mb-4">
              Customer Info
            </h4>
            <ul className="space-y-2.5">
              {infoLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    onClick={(e) => e.preventDefault()}
                    className="text-sm text-secondary hover:text-accent transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-bold text-foreground mb-4">
              Contact
            </h4>
            <div className="space-y-3">
              <button
                onClick={onWhatsAppClick}
                className="inline-flex items-center gap-2 text-sm text-secondary hover:text-accent transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                WhatsApp वर बोला
              </button>
              {instagramProfile && (
                <a
                  href={`https://www.instagram.com/${instagramProfile}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-secondary hover:text-accent transition-colors"
                >
                  <LuInstagram className="w-4 h-4" />
                  @{instagramProfile}
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-10 pt-6 border-t border-border">
          <p className="text-xs text-secondary text-center">
            © 2026 रिद्धी सिद्धी Frames. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
