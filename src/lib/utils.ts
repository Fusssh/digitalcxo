import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return dateString;
  }
}

export function extractYouTubeId(url: string): string {
  if (!url) return "";
  const match = url.match(/(?:v=|\/embed\/|\/watch\?v=|\/shorts\/|youtu\.be\/|youtube\.com\/live\/)([a-zA-Z0-9_-]{11})/);
  return match ? match[1] : "";
}
