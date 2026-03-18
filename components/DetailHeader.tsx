'use client';

import { useRouter } from 'next/navigation';

interface Props {
  title: string;
}

export default function DetailHeader({ title }: Props) {
  const router = useRouter();

  return (
    <header className="sticky top-0 z-40 bg-navy-dark border-b border-navy-mid">
      <div className="flex items-center gap-3 h-14 px-4 max-w-lg mx-auto">
        <button
          onClick={() => router.back()}
          className="p-2 -ml-2 rounded-full text-ink-muted hover:text-foreground
            hover:bg-navy-mid transition-colors"
          aria-label="戻る"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="text-base font-semibold text-white truncate">{title}</h1>
      </div>
    </header>
  );
}