"use client";

import Image from "next/image";
import { Eye, ShoppingBag } from "lucide-react";
import { Product } from "@/types/product";

interface ProductCardProps {
  product: Product;
  onView: () => void;
  onBuy: () => void;
}

export default function ProductCard({
  product,
  onView,
  onBuy,
}: ProductCardProps) {
  return (
    <div className="bg-card border border-border group">
      {/* Image */}
      <div className="relative aspect-[3/4] overflow-hidden bg-[#EDE8DC]">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
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
      <div className="p-3 md:p-4">
        <h3 className="font-serif-deva text-sm md:text-base font-semibold text-foreground mb-1.5 line-clamp-2 leading-snug">
          {product.name}
        </h3>
        <p className="font-sans-deva text-xs md:text-sm text-secondary mb-4 line-clamp-2 leading-relaxed">
          {product.description}
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-2">
          <button
            onClick={onView}
            className="flex-1 flex items-center justify-center gap-1.5 border border-border py-2 px-2 text-xs text-foreground hover:border-foreground transition-colors"
          >
            <Eye className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">View Frame</span>
            <span className="sm:hidden">View</span>
          </button>
          <button
            onClick={onBuy}
            className="flex-1 flex items-center justify-center gap-1.5 bg-btn text-btn-text py-2 px-2 text-xs hover:bg-foreground transition-colors"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Buy Now</span>
            <span className="sm:hidden">Buy</span>
          </button>
        </div>
      </div>
    </div>
  );
}
