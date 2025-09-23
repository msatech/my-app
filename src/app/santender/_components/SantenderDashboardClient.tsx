"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function SantenderDashboardClient({ name }: { name: string }) {
  const [serviceLine, setServiceLine] = useState("Commercial Leasing and Lending");
  const [region, setRegion] = useState("India");

  // Parallax (moves slower than scroll)
  const parallaxRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY * 0.25;
      if (parallaxRef.current) parallaxRef.current.style.transform = `translateY(${y}px)`;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="space-y-8">
      {/* HERO panel (soft border + parallax art) */}
      <div className="relative overflow-hidden rounded-2xl bg-[rgb(var(--card))] shadow-sm">
        {/* Parallax swirl image (put your asset at public/santender/swirl.png) */}
        <div className="pointer-events-none absolute -right-6 -top-10 w-[420px] aspect-square">
          <div
            ref={parallaxRef}
            className="relative h-full w-full will-change-transform opacity-20"
            style={{ transform: "translateY(0)" }} // stable initial transform for hydration
          >
            <Image
                src="/santender/swirl.png"
                alt=""
                fill
                priority
                unoptimized             // ⬅ avoids /_next/image, loads the file directly
                sizes="(min-width: 1024px) 420px, 280px"
                />
          </div>
        </div>
        {/* Gradient fallback behind swirl */}
        <div
          aria-hidden
          className="pointer-events-none absolute -right-10 -top-16 h-[360px] w-[360px] rounded-full blur-2xl"
          style={{
            background:
              "radial-gradient(closest-side, rgba(226,27,27,.28), rgba(255,153,128,.20) 45%, rgba(255,213,196,.14) 72%, transparent 78%)",
          }}
        />

        <div className="p-5 sm:p-6 md:p-7 lg:p-8">
          {/* Title + filters + right-side cards (map/insights) */}
          <div className="mt-6 grid gap-6 lg:grid-cols-[1fr,560px]">
            {/* Left: welcome + filters */}
            <div>
              <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight">
                Welcome, {name || "John"}!
              </h1>
              <p className="mt-2 text-sm text-[rgb(var(--muted-foreground))]">
                Let’s see your account today
              </p>

              <div className="mt-6 flex flex-wrap items-end gap-2">
                <div className="space-y-1">
                  <div className="text-xs text-[rgb(var(--muted-foreground))]">Service Line</div>
                  <select
                    value={serviceLine}
                    onChange={(e) => setServiceLine(e.target.value)}
                    className="h-8 min-w-[260px] rounded-md border border-border bg-white px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgb(var(--ring))] focus-visible:ring-offset-2"
                  >
                    <option>Commercial Leasing and Lending</option>
                    <option>Retail Banking</option>
                    <option>Cards & Payments</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <div className="text-xs text-[rgb(var(--muted-foreground))]">Delivery Region</div>
                  <select
                    value={region}
                    onChange={(e) => setRegion(e.target.value)}
                    className="h-8 min-w-[160px] rounded-md border border-border bg-white px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgb(var(--ring))] focus-visible:ring-offset-2"
                  >
                    <option>India</option>
                    <option>Guatemala</option>
                    <option>Poland</option>
                    <option>Philippines</option>
                  </select>
                </div>

                <Button className="h-8 px-3 rounded-md bg-neutral-900 text-white hover:bg-neutral-800">
                  Apply
                </Button>
                <Button
                  variant="outline"
                  className="h-8 px-3 rounded-md"
                  onClick={() => {
                    setServiceLine("Commercial Leasing and Lending");
                    setRegion("India");
                  }}
                >
                  Clear filters
                </Button>
              </div>
            </div>

            {/* Right: map + insights (inside hero like the screenshot) */}
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-5">
              {/* Map card */}

              {/* Insights card */}

            </div>
          </div>
        </div>
      </div>

      <div className="h-8" />
    </div>
  );
}
