"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import Image from "next/image";
import { Eye } from "lucide-react";
import type { Group } from "@/types/group";

interface ProductCardProps {
  group: Group;
  index?: number;
}

export default function ProductCard({
  group,
  index = 0,
}: ProductCardProps) {
  const [imgError, setImgError] = useState(false);
  const isOptimizedSource =
    group.image.startsWith("/") ||
    group.image.includes("res.cloudinary.com");

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1],
        delay: (index % 4) * 0.08,
      }}
      whileHover={{ y: -8 }}
      className="bg-card border border-border hover:border-accent hover:shadow-[0_14px_30px_-10px_rgba(197,138,53,0.25)] transition-shadow duration-300 group flex flex-col justify-between"
    >
      {/* Image Container */}
      <div className="relative aspect-[3/4] overflow-hidden bg-[#EDE8DC]">
        {group.image && !imgError && (
          <Image
            src={group.image}
            alt={group.name}
            fill
            unoptimized={!isOptimizedSource}
            className="z-10 relative object-cover group-hover:scale-106 transition-transform duration-500 ease-out"
            sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
            onError={() => setImgError(true)}
          />
        )}
        {/* Fallback placeholder */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-serif-deva text-sm text-secondary text-center px-4 leading-relaxed">
            {group.name}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-3 md:p-4 flex flex-col flex-1 justify-between">
        <div>
          <h3 className="font-serif-deva text-sm md:text-base font-semibold text-foreground mb-1.5 line-clamp-2 leading-snug">
            {group.name}
          </h3>
          <p className="font-sans-deva text-xs md:text-sm text-secondary mb-4 line-clamp-2 leading-relaxed">
            {group.description}
          </p>
        </div>

        {/* Single View All Button */}
        <div className="flex flex-row gap-2 mt-auto">
          <Link
            href={`/groups/${encodeURIComponent(group.slug)}`}
            className="flex-1"
          >
            <motion.span
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.96 }}
              className="cursor-pointer w-full flex items-center justify-center gap-1.5 bg-btn text-btn-text py-2 px-3 text-xs hover:bg-foreground transition-colors"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>View All</span>
            </motion.span>
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
