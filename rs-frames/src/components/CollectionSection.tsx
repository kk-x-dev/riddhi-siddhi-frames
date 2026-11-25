"use client";

import { motion, AnimatePresence } from "motion/react";
import { Product } from "@/types/product";
import ProductCard from "./ProductCard";

interface CollectionSectionProps {
  products: Product[];
  searchQuery: string;
  onClearSearch: () => void;
  onViewProduct: (product: Product) => void;
  onBuyProduct: (product: Product) => void;
}

export default function CollectionSection({
  products,
  searchQuery,
  onClearSearch,
  onViewProduct,
  onBuyProduct,
}: CollectionSectionProps) {
  const filteredProducts = searchQuery.trim()
    ? products.filter((product) => {
        const query = searchQuery.toLowerCase();
        return (
          product.name.toLowerCase().includes(query) ||
          product.description.toLowerCase().includes(query)
        );
      })
    : products;

  return (
    <section id="collection" className="py-16 md:py-24">
      <div className="max-w-[1280px] mx-auto px-4 md:px-6 lg:px-8">
        {/* Section Header with scroll entrance */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-12 md:mb-16"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
            तुमच्या मनाजवळची प्रतिमा निवडा...
          </h2>
          <p className="font-sans-deva text-sm md:text-base text-secondary max-w-2xl mx-auto leading-relaxed">
            प्रत्येकाची श्रद्धा वेगळी, प्रत्येकाची आवड वेगळी. तुमच्या
            आवडीच्या देवदेवता आणि प्रेरणादायी व्यक्तिमत्त्वांच्या फ्रेम्स इथे
            पाहा.
          </p>
        </motion.div>

        {/* Search active indicator */}
        <AnimatePresence>
          {searchQuery.trim() && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-8 text-center"
            >
              <p className="text-sm text-secondary">
                Search results for &ldquo;{searchQuery}&rdquo;
                <button
                  onClick={onClearSearch}
                  className="ml-3 text-accent hover:text-accent-secondary underline text-sm cursor-pointer"
                >
                  Clear search
                </button>
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Product Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {filteredProducts.map((product, index) => (
              <ProductCard
                key={product.id}
                index={index}
                product={product}
                onView={() => onViewProduct(product)}
                onBuy={() => onBuyProduct(product)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="font-sans-deva text-base text-secondary mb-4">
              माफ करा, तुमच्या शोधाशी जुळणारी फ्रेम सापडली नाही.
            </p>
            <button
              onClick={onClearSearch}
              className="bg-btn text-btn-text px-6 py-2.5 text-sm hover:bg-foreground transition-colors cursor-pointer"
            >
              View All Frames
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
