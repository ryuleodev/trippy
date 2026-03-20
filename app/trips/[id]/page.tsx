import DetailHeader from "@/components/DetailHeader";
import TripDetail from "@/components/TripDetail";
import { Trip, Note, Itinerary } from "@/lib/type";
import { getTripById } from "@/lib/trip";
import { getNotesByTripId } from "@/lib/notes";
import { getItinerariesByTripId } from "@/lib/itinerary";
import { getAccommodationsByTripId } from "@/lib/accommodations";
import { getMembersByTripId } from "@/lib/members";
import { getExpensesByTripId } from "@/lib/expenses";

const STATUS_CONFIG = {
  planning:  { label: "計画中",  color: "#c9a84c" },
  ongoing:   { label: "進行中",  color: "#00a896" },
  completed: { label: "完了",    color: "#6b7280" },
} as const;

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("ja-JP", { month: "short", day: "numeric" });
}

export default async function TripDetailPage({ params }: { params: { id: string } }) {
  const { id } = await params;
  const trip: Trip | null = await getTripById(id);
  const notes: Note[] = trip ? await getNotesByTripId(id) : [];
  const itineraries: Itinerary[] = trip ? await getItinerariesByTripId(id) : [];
  const accommodations = trip ? await getAccommodationsByTripId(id) : [];
  const members = trip ? await getMembersByTripId(id) : [];
  const expenses = trip ? await getExpensesByTripId(id) : [];

  if (!trip) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center text-ink-muted">
          <div className="w-16 h-16 rounded-full bg-surface-sub flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p>旅行が見つかりませんでした</p>
        </div>
      </div>
    );
  }

  const status = STATUS_CONFIG[trip.status as keyof typeof STATUS_CONFIG] ?? STATUS_CONFIG.completed;
  const nights = Math.round(
    (new Date(trip.endDate as string).getTime() - new Date(trip.startDate as string).getTime()) / (1000 * 60 * 60 * 24)
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-lg mx-auto">
        <DetailHeader title={trip.title || "無題の旅行"} subtitle={trip.destination} />

        {/* トリップヒーロー */}
        <div className="gradient-hero px-5 pt-5 pb-6 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10"
            style={{ background: `radial-gradient(circle at 80% 50%, ${status.color} 0%, transparent 60%)` }} />

          <div className="relative flex items-end justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-3">
                <svg className="w-4 h-4 text-white/50 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="text-white/60 text-sm truncate">{trip.destination}</span>
              </div>

              <div className="flex items-center gap-2 text-white/50 text-sm">
                <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>{formatDate(trip.startDate as string)} 〜 {formatDate(trip.endDate as string)}</span>
                <span className="bg-white/10 text-white/60 text-xs px-2 py-0.5 rounded-full">{nights}泊</span>
              </div>
            </div>

            <span className="shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold"
              style={{ background: `${status.color}20`, color: status.color, border: `1px solid ${status.color}40` }}>
              {status.label}
            </span>
          </div>

          {/* 統計バー */}
          <div className="flex gap-4 mt-5 pt-4 border-t border-white/8">
            <div className="flex-1 text-center">
              <p className="text-white font-bold text-lg leading-none">{itineraries.length}</p>
              <p className="text-white/40 text-xs mt-1">旅程</p>
            </div>
            <div className="w-px bg-white/10" />
            <div className="flex-1 text-center">
              <p className="text-white font-bold text-lg leading-none">{members.length}</p>
              <p className="text-white/40 text-xs mt-1">メンバー</p>
            </div>
            <div className="w-px bg-white/10" />
            <div className="flex-1 text-center">
              <p className="text-white font-bold text-lg leading-none">
                {expenses.reduce((s, e) => s + e.amount, 0).toLocaleString()}
              </p>
              <p className="text-white/40 text-xs mt-1">合計 ¥</p>
            </div>
          </div>
        </div>

        <TripDetail
          trip={trip}
          initialNotes={notes}
          initialItineraries={itineraries}
          initialAccommodations={accommodations}
          initialMembers={members}
          initialExpenses={expenses}
        />
      </div>
    </div>
  );
}
