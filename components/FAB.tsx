"use client";

import { usePathname, useRouter } from "next/navigation";

export default function FAB() {
  const router = useRouter();
  const pathname = usePathname();

  const isDetailPage = /^\/trips\/(?!new$)[^/]+/.test(pathname);
  if (isDetailPage) return null;

  return (
    <button
      onClick={() => router.push("/trips/new")}
      aria-label="旅行を追加"
      className="fixed bottom-[2.5rem] left-1/2 -translate-x-1/2 z-50
        w-14 h-14 rounded-full
        gradient-gold
        flex items-center justify-center
        active:scale-90 transition-transform duration-150
        animate-pulse-glow"
      style={{
        boxShadow: '0 4px 20px rgba(201, 168, 76, 0.5), 0 2px 8px rgba(0,0,0,0.3)'
      }}
    >
      <svg
        className="w-6 h-6 text-navy-dark"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2.5}
          d="M12 4v16m8-8H4"
        />
      </svg>
    </button>
  );
}
