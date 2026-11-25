"use client";

import { motion } from "motion/react";
import { X } from "lucide-react";
import Image from "next/image";
import { Product } from "@/types/product";

interface ProductDetailProps {
  product: Product;
  onClose: () => void;
  onBuy: () => void;
}

export default function ProductDetail({
  product,
  onClose,
  onBuy,
}: ProductDetailProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 25 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 25 }}
        transition={{ type: "spring", stiffness: 320, damping: 26 }}
        className="bg-card border border-border w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 md:p-6 border-b border-border sticky top-0 bg-card z-10">
          <h2 className="text-lg md:text-xl font-bold">
            {product.name}
          </h2>
          <motion.button
            whileHover={{ scale: 1.15, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            className="cursor-pointer p-1 text-secondary hover:text-foreground transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </motion.button>
        </div>

        <div className="md:flex">
          {/* Image */}
          <div className="md:w-1/2">
            <div className="relative aspect-[3/4] bg-[#EDE8DC] overflow-hidden">
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = "none";
                }}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="font-serif-deva text-base text-secondary text-center px-6">
                  {product.name}
                </span>
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="md:w-1/2 p-4 md:p-6 flex flex-col justify-between">
            <div>
              <p className="font-sans-deva text-sm md:text-base text-secondary mb-6 leading-relaxed">
                {product.description}
              </p>

              {product.sizes && product.sizes.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-foreground mb-2">
                    Available Sizes:
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((size) => (
                      <span
                        key={size}
                        className="px-3 py-1.5 border border-border text-xs font-sans-deva text-secondary"
                      >
                        {size}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {product.price && (
                <p className="text-lg font-bold text-accent mb-6">
                  ₹{product.price}
                </p>
              )}

              {product.material && (
                <p className="text-sm text-secondary mb-4">
                  <span className="font-semibold text-foreground">
                    Material:
                  </span>{" "}
                  {product.material}
                </p>
              )}
            </div>

            {/* Buy CTA */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onBuy}
              className="cursor-pointer w-full bg-btn text-btn-text py-3 text-sm font-medium hover:bg-foreground hover:shadow-[0_4px_16px_rgba(0,0,0,0.3)] transition-all mt-4"
            >
              Buy Now
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
