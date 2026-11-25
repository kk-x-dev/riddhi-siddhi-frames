"use client";

import { motion } from "motion/react";
import { MessageCircle } from "lucide-react";
import { LuInstagram } from "react-icons/lu";

interface ServicesSectionProps {
  onWhatsAppClick: () => void;
}

export default function ServicesSection({
  onWhatsAppClick,
}: ServicesSectionProps) {
  const instagramProfile = process.env.NEXT_PUBLIC_INSTAGRAM_PROFILE || "";

  return (
    <section id="services" className="py-16 md:py-24 border-t border-border">
      <div className="max-w-[1280px] mx-auto px-4 md:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-2xl mx-auto text-center border border-border bg-card p-8 md:p-12"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
            तुमच्या मनात काही प्रश्न आहेत का?
          </h2>

          <div className="font-sans-deva text-sm md:text-base text-secondary leading-relaxed mb-8 space-y-2">
            <p>
              योग्य फ्रेम निवडताना काही मदत हवी आहे? एखाद्या विशिष्ट देवाची
              फ्रेम शोधत आहात?
            </p>
            <p>
              अगदी हक्काने आमच्याशी बोला. तुमच्या प्रश्नांची उत्तरं
              देण्यासाठी आम्ही इथे आहोत.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={onWhatsAppClick}
              className="cursor-pointer inline-flex items-center gap-2 bg-btn text-btn-text px-8 py-3.5 text-sm font-sans-deva font-medium hover:bg-foreground transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              WhatsApp वर बोला
            </motion.button>

            {instagramProfile && (
              <motion.a
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                href={`https://www.instagram.com/${instagramProfile}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 border border-border text-foreground px-8 py-3.5 text-sm font-medium hover:border-foreground transition-colors"
              >
                <LuInstagram className="w-4 h-4" />
                @{instagramProfile}
              </motion.a>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
