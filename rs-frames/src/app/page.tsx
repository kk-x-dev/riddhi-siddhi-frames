"use client";

import { useState, useCallback, useEffect } from "react";
import type { Group } from "@/types/group";
import { fetchGroups } from "@/lib/api/groups";
import AnnouncementBar from "@/components/AnnouncementBar";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import CollectionSection from "@/components/CollectionSection";
import AboutSection from "@/components/AboutSection";
import ServicesSection from "@/components/ContactSection";
import Footer from "@/components/Footer";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [groups, setGroups] = useState<Group[]>([]);
  const [loadingGroups, setLoadingGroups] = useState(true);
  const [groupsError, setGroupsError] = useState("");

  const loadGroups = useCallback(async () => {
    setLoadingGroups(true);
    setGroupsError("");
    try {
      const data = await fetchGroups();
      setGroups(data);
    } catch (err) {
      setGroupsError(
        err instanceof Error ? err.message : "Failed to load collections."
      );
    } finally {
      setLoadingGroups(false);
    }
  }, []);

  useEffect(() => {
    let active = true;

    async function init() {
      try {
        const data = await fetchGroups();
        if (!active) return;
        setGroups(data);
        setGroupsError("");
      } catch (err) {
        if (!active) return;
        setGroupsError(
          err instanceof Error ? err.message : "Failed to load collections."
        );
      } finally {
        if (active) {
          setLoadingGroups(false);
        }
      }
    }

    void init();
    return () => {
      active = false;
    };
  }, []);

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
          groups={groups}
          loading={loadingGroups}
          error={groupsError}
          onRetry={loadGroups}
          searchQuery={searchQuery}
          onClearSearch={handleClearSearch}
        />

        {/* Section 05 — About / Emotional Brand Section */}
        <AboutSection />

        {/* Section 06 — Services Section */}
        <ServicesSection onWhatsAppClick={handleWhatsAppChat} />
      </main>

      {/* Section 07 — Footer */}
      <Footer onWhatsAppClick={handleWhatsAppChat} />
    </>
  );
}
