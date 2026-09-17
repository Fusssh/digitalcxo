import React from "react";
import { cn } from "@/lib/utils";

interface TricolourAccentProps {
  className?: string;
  active?: boolean;
  animated?: boolean;
}

export function TricolourAccent({ className, active = false, animated = true }: TricolourAccentProps) {
  return (
    <div
      className={cn(
        "h-[2.5px] w-full rounded-full flex overflow-hidden transition-all duration-300",
        active ? "opacity-100 scale-x-100" : "opacity-0 scale-x-0 group-hover:opacity-100 group-hover:scale-x-100",
        animated && "origin-left",
        className
      )}
    >
      <div className="w-1/3 h-full bg-[#FF9933]" />
      <div className="w-1/3 h-full bg-white/90" />
      <div className="w-1/3 h-full bg-[#138808]" />
    </div>
  );
}
