'use client';

import { useRouter } from 'next/navigation';

interface Props {
  title: string;
  subtitle?: string | null;
}

export default function DetailHeader({ title, subtitle }: Props) {
  const router = useRouter();

  return (
    <header className="sticky top-0 z-40 glass-dark">
      <div className="flex items-center gap-3 h-14 px-4 max-w-lg mx-auto">
        <button
          onClick={() => router.back()}
          className="w-9 h-9 flex items-center justify-center rounded-full
            bg-white/8 text-white/70 hover:text-white hover:bg-white/12
            active:scale-90 transition-all duration-150"
          aria-label="戻る"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div className="flex-1 min-w-0">
          <h1 className="text-base font-semibold text-white truncate leading-tight">{title}</h1>
          {subtitle && (
            <p className="text-xs text-white/40 truncate leading-tight">{subtitle}</p>
          )}
        </div>
      </div>
    </header>
  );
}
