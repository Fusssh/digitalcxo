"use client";

import React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface Executive3DMedallionProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  tiltAngle?: number;
}

export function Executive3DMedallion({
  className,
  size = "md",
  tiltAngle = -8,
}: Executive3DMedallionProps) {
  const sizeMap = {
    sm: "w-28 h-28 sm:w-32 sm:h-32",
    md: "w-36 h-36 sm:w-44 sm:h-44 md:w-48 md:h-48",
    lg: "w-44 h-44 sm:w-52 sm:h-52 md:w-60 md:h-60",
  };

  const logoSize = size === "sm" ? 64 : size === "md" ? 88 : 110;

  return (
    <div
      className={cn(
        "relative select-none pointer-events-none group",
        sizeMap[size],
        className
      )}
      style={{
        perspective: "1000px",
      }}
    >
      {/* 3D Container with Realistic Perspective Tilt */}
      <div
        className="w-full h-full rounded-full transition-transform duration-700 ease-out"
        style={{
          transform: `rotateY(${tiltAngle}deg) rotateX(12deg) rotateZ(-3deg)`,
          transformStyle: "preserve-3d",
        }}
      >
        {/* Deep 3D Cast Shadow */}
        <div
          aria-hidden="true"
          className="absolute inset-0 rounded-full blur-xl bg-black/70 translate-y-6 translate-x-2 -z-10 scale-95"
        />

        {/* Outer Heavy Coin-Edge Bevel Ring (Brushed Gold) */}
        <div
          className="relative w-full h-full rounded-full p-[5px] sm:p-[6px] shadow-[0_20px_45px_rgba(0,0,0,0.7),0_0_30px_rgba(201,162,39,0.35)]"
          style={{
            background:
              "conic-gradient(from 45deg, #F6E29F, #C9A227 25%, #8A6812 45%, #FBF0CA 60%, #C9A227 75%, #6A500B 90%, #F6E29F 100%)",
          }}
        >
          {/* Ribbed Coin Rim Texture */}
          <div className="w-full h-full rounded-full p-[3px] bg-[#141414] shadow-inner">
            {/* Secondary Gold Rim */}
            <div
              className="w-full h-full rounded-full p-[3px]"
              style={{
                background:
                  "linear-gradient(135deg, #FFE8A3 0%, #C9A227 50%, #7A5C0E 100%)",
              }}
            >
              {/* Medallion Core Face (Deep Obsidian Metallic with Gold Radial Sheen) */}
              <div
                className="w-full h-full rounded-full relative overflow-hidden flex flex-col items-center justify-center p-3 shadow-2xl"
                style={{
                  background:
                    "radial-gradient(circle at 40% 30%, #2A2518 0%, #151412 60%, #0A0A0A 100%)",
                }}
              >
                {/* Micro Concentric Sovereign Guilloche Rings */}
                <div
                  aria-hidden="true"
                  className="absolute inset-1.5 rounded-full border border-[#C9A227]/30 pointer-events-none"
                />
                <div
                  aria-hidden="true"
                  className="absolute inset-3 rounded-full border border-dashed border-[#C9A227]/25 pointer-events-none"
                />

                {/* Top Arc Inscription */}
                <div className="absolute top-2.5 sm:top-3.5 inset-x-0 flex justify-center text-[7.5px] sm:text-[9px] font-bold uppercase tracking-[0.25em] text-[#E8CA65] drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]">
                  DIGITAL CXOS
                </div>

                {/* Authentic Digital CXOS Crest in Center */}
                <div className="relative shrink-0 my-auto drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)]">
                  <Image
                    src="/assets/logo-256.png"
                    alt="Digital CXOS Official Crest"
                    width={logoSize}
                    height={logoSize}
                    priority
                    className="w-auto h-auto max-h-[50px] sm:max-h-[68px] md:max-h-[76px] object-contain"
                  />
                </div>

                {/* Bottom Arc Inscription */}
                <div className="absolute bottom-2.5 sm:bottom-3.5 inset-x-0 flex justify-center text-[6.5px] sm:text-[8px] font-semibold uppercase tracking-[0.22em] text-[#C9A227] drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]">
                  PEER COUNCIL • INDIA
                </div>

                {/* 3D Specular Glass Glare Overlay */}
                <div
                  aria-hidden="true"
                  className="absolute inset-0 rounded-full pointer-events-none"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(255,255,255,0.45) 0%, rgba(255,255,255,0.12) 28%, transparent 50%, rgba(201,162,39,0.15) 100%)",
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
