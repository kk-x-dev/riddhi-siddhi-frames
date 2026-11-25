"use client";

import { motion } from "motion/react";
import Image from "next/image";

interface HeroSectionProps {
  onWhatsAppClick: () => void;
}

export default function HeroSection({ onWhatsAppClick }: HeroSectionProps) {
  const scrollToCollection = () => {
    const el = document.querySelector("#collection");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative w-full min-h-[500px] md:min-h-[600px] lg:min-h-[700px] flex items-center justify-center overflow-hidden">
      {/* Background Image with subtle zoom effect */}
      <div className="absolute inset-0">
        <motion.div
          initial={{ scale: 1.08 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.6, ease: "easeOut" }}
          className="relative w-full h-full"
        >
          <Image
            src="/images/banner.jpg"
            alt="सुंदर भारतीय घर"
            fill
            className="object-cover"
            priority
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = "none";
            }}
          />
        </motion.div>

        {/* Ambient warm breathing aura */}
        <motion.div
          animate={{
            opacity: [0.25, 0.45, 0.25],
            scale: [1, 1.04, 1],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent pointer-events-none"
        />

        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-[1280px] mx-auto px-4 md:px-6 lg:px-8 py-16 md:py-24 text-center">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="flex justify-center mb-8"
        >
          <Image
            src="/images/rsframeslogo.jpg"
            alt="रिद्धी सिद्धी Frames"
            width={400}
            height={400}
            className="h-30 md:h-80 w-auto"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = "none";
              const parent = target.parentElement;
              if (parent && !parent.querySelector("span")) {
                const span = document.createElement("span");
                span.className =
                  "font-serif-deva text-2xl md:text-3xl font-bold text-white";
                span.textContent = "रिद्धी सिद्धी Frames";
                parent.appendChild(span);
              }
            }}
          />
        </motion.div>

        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold leading-snug mb-6 max-w-3xl mx-auto text-white"
        >
          काही प्रतिमा फक्त दिसत नाहीत, त्या मनात वसतात!
        </motion.h1>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="font-sans-deva text-sm sm:text-base md:text-lg text-white! max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          आपल्या श्रद्धेच्या, भक्तीच्या आणि प्रेरणेच्या भावना जपणाऱ्या सुंदर
          फ्रेम्स. आपल्या घराला द्या एक खास आध्यात्मिक स्पर्श.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={scrollToCollection}
            className="cursor-pointer bg-btn text-btn-text px-8 py-3.5 text-sm font-medium tracking-wide hover:bg-white hover:text-foreground transition-colors w-full sm:w-auto"
          >
            View All Frames
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={onWhatsAppClick}
            className="cursor-pointer border border-white text-white px-8 py-3.5 text-sm font-medium tracking-wide hover:bg-white hover:text-foreground transition-colors w-full sm:w-auto"
          >
            Talk to Us
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}
