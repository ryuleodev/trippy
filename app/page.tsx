import TripList from "@/components/TripList";
import getAllTrips from "@/lib/trip";
import { Trip } from "@/lib/type";

export const dynamic = 'force-dynamic';

export default async function Home() {
  const trips: Trip[] = await getAllTrips();
  const upcomingTrips = trips.filter((t) => t.status === 'planning').length;
  const ongoingTrips  = trips.filter((t) => t.status === 'ongoing').length;

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Header */}
      <div className="gradient-hero px-5 pt-14 pb-8 relative overflow-hidden">
        {/* 背景装飾 */}
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-5"
          style={{ background: 'radial-gradient(circle, #c9a84c 0%, transparent 70%)', transform: 'translate(30%, -30%)' }} />
        <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full opacity-5"
          style={{ background: 'radial-gradient(circle, #00a896 0%, transparent 70%)', transform: 'translate(-30%, 30%)' }} />

        <div className="relative max-w-lg mx-auto">
          <p className="text-gold/70 text-xs tracking-widest uppercase font-medium mb-1">Travel Planner</p>
          <h1 className="text-5xl font-bold text-gradient-gold mb-1">Trippy</h1>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 -mt-6">
        {/* 統計カード */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          <div className="bg-surface rounded-2xl card-shadow p-4 animate-fade-in-up"
            style={{ animationDelay: '0ms' }}>
            <div className="w-8 h-8 rounded-xl bg-navy-light/10 flex items-center justify-center mb-3">
              <svg className="w-4 h-4 text-navy-light" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" />
              </svg>
            </div>
            <p className="text-xs text-ink-muted mb-1">総旅行数</p>
            <p className="text-3xl font-bold text-navy-light leading-none">{trips.length}</p>
          </div>

          <div className="bg-surface rounded-2xl card-shadow p-4 animate-fade-in-up"
            style={{ animationDelay: '60ms' }}>
            <div className="w-8 h-8 rounded-xl bg-gold/10 flex items-center justify-center mb-3">
              <svg className="w-4 h-4 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <p className="text-xs text-ink-muted mb-1">計画中</p>
            <p className="text-3xl font-bold text-gold leading-none">{upcomingTrips}</p>
          </div>

          <div className="bg-surface rounded-2xl card-shadow p-4 animate-fade-in-up"
            style={{ animationDelay: '120ms' }}>
            <div className="w-8 h-8 rounded-xl bg-accent-teal/10 flex items-center justify-center mb-3">
              <svg className="w-4 h-4 text-accent-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <p className="text-xs text-ink-muted mb-1">進行中</p>
            <p className="text-3xl font-bold text-accent-teal leading-none">{ongoingTrips}</p>
          </div>
        </div>

        <TripList trips={trips} />

        {/* フッタースペース */}
        <div className="h-6" />
      </div>
    </div>
  );
}
