"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import AnnouncementBar from "@/components/AnnouncementBar";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import type { Group } from "@/types/group";

export default function GroupDetailPage() {
  const params = useParams<{ slug: string }>();
  const slug = params?.slug ? decodeURIComponent(params.slug) : "";

  const [group, setGroup] = useState<Group | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!slug) return;
    let active = true;

    async function loadGroup() {
      try {
        const res = await fetch(`/api/groups/${encodeURIComponent(slug)}`, {
          cache: "no-store",
        });
        const data = await res.json();
        if (!active) return;

        if (!res.ok || !data.ok || !data.group) {
          setError(data.error || "Group not found.");
          return;
        }

        setGroup(data.group);
      } catch (err) {
        if (!active) return;
        setError(
          err instanceof Error ? err.message : "Failed to load group details."
        );
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void loadGroup();
    return () => {
      active = false;
    };
  }, [slug]);

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
      <AnnouncementBar />
      <Navbar />

      <main className="flex-1 py-12 md:py-16">
        <div className="max-w-[1280px] mx-auto px-4 md:px-6 lg:px-8">
          <Link
            href="/#collection"
            className="inline-flex items-center gap-2 text-sm text-secondary hover:text-foreground transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Collections</span>
          </Link>

          {loading ? (
            <div className="py-12">
              <div className="h-9 w-64 bg-[#EDE8DC] animate-pulse" />
            </div>
          ) : error || !group ? (
            <div className="border border-border bg-card p-8 text-center">
              <h1 className="text-2xl font-bold mb-2">Group Not Found</h1>
              <p className="text-sm text-secondary mb-6">
                {error || "This collection group could not be found."}
              </p>
              <Link
                href="/#collection"
                className="inline-block bg-btn text-btn-text px-6 py-2.5 text-sm hover:bg-foreground transition-colors"
              >
                View All Collections
              </Link>
            </div>
          ) : (
            <div className="border border-border bg-card p-8 md:p-12 text-center">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">
                {group.name}
              </h1>
            </div>
          )}
        </div>
      </main>

      <Footer onWhatsAppClick={handleWhatsAppChat} />
    </>
  );
}
