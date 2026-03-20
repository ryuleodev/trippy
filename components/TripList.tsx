"use client";

import { useRouter } from "next/navigation";
import { Trip } from "@/lib/type";

const STATUS_CONFIG = {
  planning: {
    label: "計画中",
    bgClass: "bg-gold/10",
    textClass: "text-gold",
    dotClass: "bg-gold",
  },
  ongoing: {
    label: "進行中",
    bgClass: "bg-accent-teal/10",
    textClass: "text-accent-teal",
    dotClass: "bg-accent-teal",
  },
  completed: {
    label: "完了",
    bgClass: "bg-ink-subtle/10",
    textClass: "text-ink-muted",
    dotClass: "bg-ink-subtle",
  },
} as const;

function formatDateRange(start: string, end: string) {
  const s = new Date(start);
  const e = new Date(end);
  const nights = Math.round((e.getTime() - s.getTime()) / (1000 * 60 * 60 * 24));
  const fmt = (d: Date) =>
    d.toLocaleDateString("ja-JP", { month: "short", day: "numeric" });
  return { range: `${fmt(s)} 〜 ${fmt(e)}`, nights };
}

export default function TripList({ trips }: { trips: Trip[] }) {
  const router = useRouter();

  if (trips.length === 0) {
    return (
      <div className="py-16 flex flex-col items-center gap-4 text-ink-muted animate-fade-in">
        <div className="w-20 h-20 rounded-full bg-surface-sub flex items-center justify-center">
          <svg className="w-10 h-10 text-ink-subtle" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
              d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" />
          </svg>
        </div>
        <div className="text-center">
          <p className="font-medium text-foreground mb-1">旅行がまだありません</p>
          <p className="text-sm text-ink-subtle">下の + ボタンから旅行を追加しましょう</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-foreground tracking-wide">旅行一覧</h2>
        <span className="text-xs text-ink-muted bg-surface-sub px-2.5 py-1 rounded-full">
          {trips.length}件
        </span>
      </div>

      <div className="space-y-3">
        {trips.map((trip, i) => {
          const status = STATUS_CONFIG[trip.status as keyof typeof STATUS_CONFIG] ?? STATUS_CONFIG.completed;
          const { range, nights } = formatDateRange(trip.startDate as string, trip.endDate as string);

          return (
            <div
              key={trip.id}
              onClick={() => router.push(`/trips/${trip.id}`)}
              className="bg-surface rounded-2xl card-shadow active:scale-[0.98] transition-all duration-200 cursor-pointer overflow-hidden animate-fade-in-up"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              {/* アクセントライン */}
              <div className={`h-1 w-full ${
                trip.status === 'planning' ? 'gradient-gold' :
                trip.status === 'ongoing'  ? 'bg-accent-teal' : 'bg-ink-subtle/30'
              }`} />

              <div className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-semibold text-foreground leading-snug truncate mb-0.5">
                      {trip.title}
                    </h3>
                    <div className="flex items-center gap-1.5 text-ink-muted mb-3">
                      <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span className="text-sm truncate">{trip.destination}</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1 text-xs text-ink-muted">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span>{range}</span>
                      </div>
                      {nights > 0 && (
                        <span className="text-xs text-ink-subtle bg-surface-sub px-2 py-0.5 rounded-full">
                          {nights}泊
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${status.bgClass} ${status.textClass}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${status.dotClass}`} />
                      {status.label}
                    </span>
                    <svg className="w-4 h-4 text-ink-subtle" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
