"use client";

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
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4"
      onClick={onClose}
    >
      <div
        className="bg-card border border-border w-full max-w-3xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 md:p-6 border-b border-border">
          <h2 className="font-serif-deva text-lg md:text-xl font-bold text-foreground">
            {product.name}
          </h2>
          <button
            onClick={onClose}
            className="p-1 text-secondary hover:text-foreground transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="md:flex">
          {/* Image */}
          <div className="md:w-1/2">
            <div className="relative aspect-[3/4] bg-[#EDE8DC]">
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
            <button
              onClick={onBuy}
              className="w-full bg-btn text-btn-text py-3 text-sm font-medium hover:bg-foreground transition-colors mt-4"
            >
              Buy Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
