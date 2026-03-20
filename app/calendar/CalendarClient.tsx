"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trip } from "@/lib/type";

const WEEKDAYS = ["日", "月", "火", "水", "木", "金", "土"] as const;

/* ステータス別カラー */
const STATUS_COLOR: Record<string, { bg: string; text: string; bar: string }> = {
  planning:  { bg: "bg-gold/10",       text: "text-gold",        bar: "bg-gold" },
  ongoing:   { bg: "bg-accent-teal/10",text: "text-accent-teal", bar: "bg-accent-teal" },
  completed: { bg: "bg-ink-subtle/10", text: "text-ink-subtle",  bar: "bg-ink-subtle" },
};

function isSameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();
}

function inRange(date: Date, start: Date, end: Date) {
  const d = date.getTime();
  return d >= start.getTime() && d <= end.getTime();
}

function toLocalDate(str: string) {
  // "YYYY-MM-DD" → ローカル日付（UTC誤差回避）
  const [y, m, d] = str.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export default function CalendarClient({ trips }: { trips: Trip[] }) {
  const router = useRouter();
  const today = new Date();
  const [currentDate, setCurrentDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [selectedDate, setSelectedDate] = useState<Date | null>(today);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));
  const goToday  = () => { setCurrentDate(new Date(today.getFullYear(), today.getMonth(), 1)); setSelectedDate(today); };

  /* その日に関連する旅行を返す */
  const getTripsForDay = (day: number): Trip[] => {
    const date = new Date(year, month, day);
    return trips.filter((t) => {
      if (!t.startDate || !t.endDate) return false;
      return inRange(date, toLocalDate(t.startDate), toLocalDate(t.endDate));
    });
  };

  /* 選択日に関連する旅行 */
  const selectedTrips = selectedDate
    ? trips.filter((t) => {
        if (!t.startDate || !t.endDate) return false;
        return inRange(selectedDate, toLocalDate(t.startDate), toLocalDate(t.endDate));
      })
    : [];

  /* その月に存在する旅行（旅程バー表示用） */
  const monthTrips = trips.filter((t) => {
    if (!t.startDate || !t.endDate) return false;
    const start = toLocalDate(t.startDate);
    const end = toLocalDate(t.endDate);
    const monthStart = new Date(year, month, 1);
    const monthEnd = new Date(year, month + 1, 0);
    return start <= monthEnd && end >= monthStart;
  });

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* ヘッダー */}
      <div className="gradient-hero px-5 pt-14 pb-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 opacity-5 rounded-full"
          style={{ background: 'radial-gradient(circle, #c9a84c 0%, transparent 70%)', transform: 'translate(30%,-30%)' }} />
        <div className="relative max-w-lg mx-auto flex items-end justify-between">
          <div>
            <p className="text-gold/70 text-xs tracking-widest uppercase font-medium mb-1">Calendar</p>
            <h1 className="text-4xl font-bold text-white">カレンダー</h1>
          </div>
          <button
            onClick={goToday}
            className="text-xs text-white/60 bg-white/10 px-3 py-1.5 rounded-full active:scale-95 transition-transform"
          >
            今日
          </button>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 pt-5">
        {/* 月ナビゲーション */}
        <div className="bg-surface rounded-2xl card-shadow p-4 mb-4">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={prevMonth}
              className="w-9 h-9 rounded-xl bg-surface-sub flex items-center justify-center active:scale-90 transition-transform"
            >
              <svg className="w-5 h-5 text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h2 className="text-lg font-bold text-foreground">
              {new Date(year, month).toLocaleDateString("ja-JP", { year: "numeric", month: "long" })}
            </h2>
            <button
              onClick={nextMonth}
              className="w-9 h-9 rounded-xl bg-surface-sub flex items-center justify-center active:scale-90 transition-transform"
            >
              <svg className="w-5 h-5 text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* 曜日ヘッダー */}
          <div className="grid grid-cols-7 mb-1">
            {WEEKDAYS.map((d, i) => (
              <div key={d} className={`text-center text-xs font-semibold py-1
                ${i === 0 ? "text-red-400" : i === 6 ? "text-blue-400" : "text-ink-muted"}`}>
                {d}
              </div>
            ))}
          </div>

          {/* 日付グリッド */}
          <div className="grid grid-cols-7 gap-y-1">
            {Array.from({ length: firstDay }).map((_, i) => (
              <div key={`empty-${i}`} />
            ))}
            {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => {
              const date = new Date(year, month, day);
              const isToday = isSameDay(date, today);
              const isSelected = selectedDate ? isSameDay(date, selectedDate) : false;
              const dayTrips = getTripsForDay(day);
              const hasPrimary = dayTrips.some((t) => t.status === "ongoing");
              const weekday = date.getDay();

              return (
                <button
                  key={day}
                  onClick={() => setSelectedDate(date)}
                  className={`relative flex flex-col items-center justify-start pt-1 pb-1.5 rounded-xl transition-all duration-150 min-h-[48px]
                    ${isSelected
                      ? "gradient-gold shadow-md"
                      : isToday
                        ? "bg-navy-light/10"
                        : "hover:bg-surface-sub active:scale-95"
                    }`}
                >
                  <span className={`text-sm font-semibold leading-tight
                    ${isSelected
                      ? "text-navy-dark"
                      : isToday
                        ? "text-navy-light"
                        : weekday === 0 ? "text-red-400"
                        : weekday === 6 ? "text-blue-400"
                        : "text-foreground"
                    }`}>
                    {day}
                  </span>
                  {/* ドットインジケーター */}
                  {dayTrips.length > 0 && (
                    <div className="flex gap-0.5 mt-0.5">
                      {dayTrips.slice(0, 3).map((t) => {
                        const c = STATUS_COLOR[t.status ?? "completed"];
                        return (
                          <span
                            key={t.id}
                            className={`w-1 h-1 rounded-full ${isSelected ? "bg-navy-dark/50" : c.bar}`}
                          />
                        );
                      })}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* その月の旅行一覧バー */}
        {monthTrips.length > 0 && (
          <div className="bg-surface rounded-2xl card-shadow p-4 mb-4">
            <p className="text-xs font-semibold text-ink-muted uppercase tracking-wider mb-3">
              {new Date(year, month).toLocaleDateString("ja-JP", { month: "long" })}の旅行
            </p>
            <div className="space-y-2">
              {monthTrips.map((t) => {
                const c = STATUS_COLOR[t.status ?? "completed"];
                const start = toLocalDate(t.startDate!);
                const end = toLocalDate(t.endDate!);
                const nights = Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
                return (
                  <button
                    key={t.id}
                    onClick={() => router.push(`/trips/${t.id}`)}
                    className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-surface-sub active:scale-[0.98] transition-all"
                  >
                    <div className={`w-1 h-8 rounded-full ${c.bar} shrink-0`} />
                    <div className="flex-1 text-left min-w-0">
                      <p className="text-sm font-semibold text-foreground truncate">{t.title}</p>
                      <p className="text-xs text-ink-muted">
                        {start.toLocaleDateString("ja-JP", { month: "short", day: "numeric" })} 〜{" "}
                        {end.toLocaleDateString("ja-JP", { month: "short", day: "numeric" })} · {nights}泊
                      </p>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full shrink-0 ${c.bg} ${c.text}`}>
                      {t.status === "planning" ? "計画中" : t.status === "ongoing" ? "進行中" : "完了"}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* 選択日の旅行詳細 */}
        {selectedDate && (
          <div className="animate-fade-in-up">
            <p className="text-xs font-semibold text-ink-muted uppercase tracking-wider mb-3 px-1">
              {selectedDate.toLocaleDateString("ja-JP", { month: "long", day: "numeric", weekday: "short" })}
            </p>

            {selectedTrips.length === 0 ? (
              <div className="bg-surface rounded-2xl card-shadow p-6 text-center">
                <p className="text-sm text-ink-muted">この日の予定はありません</p>
              </div>
            ) : (
              <div className="space-y-3">
                {selectedTrips.map((t) => {
                  const c = STATUS_COLOR[t.status ?? "completed"];
                  const start = toLocalDate(t.startDate!);
                  const end = toLocalDate(t.endDate!);
                  const dayNum = Math.round((selectedDate.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
                  return (
                    <button
                      key={t.id}
                      onClick={() => router.push(`/trips/${t.id}`)}
                      className="w-full text-left bg-surface rounded-2xl card-shadow overflow-hidden active:scale-[0.98] transition-all"
                    >
                      <div className={`h-1 w-full ${c.bar}`} />
                      <div className="p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <div className={`text-xs font-semibold mb-1 ${c.text}`}>DAY {dayNum}</div>
                            <p className="font-bold text-foreground truncate">{t.title}</p>
                            <div className="flex items-center gap-1.5 mt-1.5">
                              <svg className="w-3.5 h-3.5 text-ink-subtle shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                              </svg>
                              <span className="text-xs text-ink-muted">{t.destination}</span>
                            </div>
                            <p className="text-xs text-ink-subtle mt-1">
                              {start.toLocaleDateString("ja-JP", { month: "short", day: "numeric" })} 〜{" "}
                              {end.toLocaleDateString("ja-JP", { month: "short", day: "numeric" })}
                            </p>
                          </div>
                          <svg className="w-4 h-4 text-ink-subtle shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
