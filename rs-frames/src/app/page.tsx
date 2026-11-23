"use client";

import { useState, useCallback } from "react";
import { Product } from "@/types/product";
import { products } from "@/data/products";
import AnnouncementBar from "@/components/AnnouncementBar";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import CollectionSection from "@/components/CollectionSection";
import ProductDetail from "@/components/ProductDetail";
import OrderForm from "@/components/OrderForm";
import AboutSection from "@/components/AboutSection";
import ServicesSection from "@/components/ContactSection";
import Footer from "@/components/Footer";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showProductDetail, setShowProductDetail] = useState(false);
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [orderProduct, setOrderProduct] = useState<Product | null>(null);

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      const el = document.querySelector("#collection");
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, []);

  const handleClearSearch = useCallback(() => {
    setSearchQuery("");
  }, []);

  const handleViewProduct = useCallback((product: Product) => {
    setSelectedProduct(product);
    setShowProductDetail(true);
  }, []);

  const handleBuyProduct = useCallback((product: Product) => {
    setOrderProduct(product);
    setShowOrderForm(true);
    setShowProductDetail(false);
  }, []);

  const handleWhatsAppChat = useCallback(async () => {
    try {
      const response = await fetch("/api/whatsapp-order");
      const data = await response.json();
      if (data.url) {
        window.open(data.url, "_blank");
      }
    } catch {
      console.error("Could not fetch WhatsApp URL");
    }
  }, []);

  return (
    <>
      {/* Section 01 — Announcement Bar */}
      <AnnouncementBar />

      {/* Section 02 — Navbar */}
      <Navbar onSearch={handleSearch} searchQuery={searchQuery} />

      <main className="flex-1">
        {/* Section 03 — Hero Banner */}
        <HeroSection onWhatsAppClick={handleWhatsAppChat} />

        {/* Section 04 — Collection / All Frames */}
        <CollectionSection
          products={products}
          searchQuery={searchQuery}
          onClearSearch={handleClearSearch}
          onViewProduct={handleViewProduct}
          onBuyProduct={handleBuyProduct}
        />

        {/* Section 05 — About / Emotional Brand Section */}
        <AboutSection />

        {/* Section 06 — Services Section */}
        <ServicesSection onWhatsAppClick={handleWhatsAppChat} />
      </main>

      {/* Section 07 — Footer */}
      <Footer onWhatsAppClick={handleWhatsAppChat} />

      {/* Modals */}
      {showProductDetail && selectedProduct && (
        <ProductDetail
          product={selectedProduct}
          onClose={() => setShowProductDetail(false)}
          onBuy={() => handleBuyProduct(selectedProduct)}
        />
      )}

      {showOrderForm && (
        <OrderForm
          selectedProduct={orderProduct}
          onClose={() => {
            setShowOrderForm(false);
            setOrderProduct(null);
          }}
        />
      )}
    </>
  );
}
