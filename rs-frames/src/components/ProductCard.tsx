"use client";

import { motion } from "motion/react";
import Image from "next/image";
import { Eye, ShoppingBag } from "lucide-react";
import { Product } from "@/types/product";

interface ProductCardProps {
  product: Product;
  index?: number;
  onView: () => void;
  onBuy: () => void;
}

export default function ProductCard({
  product,
  index = 0,
  onView,
  onBuy,
}: ProductCardProps) {
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
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="z-10 relative object-cover group-hover:scale-106 transition-transform duration-500 ease-out"
          sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.style.display = "none";
          }}
        />
        {/* Fallback placeholder */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-serif-deva text-sm text-secondary text-center px-4 leading-relaxed">
            {product.name}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-3 md:p-4 flex flex-col flex-1 justify-between">
        <div>
          <h3 className="font-serif-deva text-sm md:text-base font-semibold text-foreground mb-1.5 line-clamp-2 leading-snug">
            {product.name}
          </h3>
          <p className="font-sans-deva text-xs md:text-sm text-secondary mb-4 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Buttons */}
        <div className="flex flex-row gap-2 mt-auto">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.96 }}
            onClick={onView}
            className="cursor-pointer flex-1 flex items-center justify-center gap-1.5 border border-border py-2 px-2 text-xs text-foreground hover:border-accent hover:text-accent transition-colors"
          >
            <Eye className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">View Frame</span>
            <span className="text-[10px] sm:hidden">View</span>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.96 }}
            onClick={onBuy}
            className="cursor-pointer flex-1 flex items-center justify-center gap-1.5 bg-btn text-btn-text py-2 px-2 text-xs hover:bg-foreground transition-colors"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Buy Now</span>
            <span className="text-[10px] sm:hidden">Buy</span>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
