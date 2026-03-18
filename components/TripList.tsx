"use client";

import { useRouter } from "next/navigation";
import { Trip } from "@/lib/type";

export default function TripList({ trips }: { trips: Trip[] }) {
  const router = useRouter();

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-navy-light">旅行一覧</h2>
      <div className="space-y-4">
        {trips.map((trip) => (
          <div
            key={trip.id}
            onClick={() => router.push(`/trips/${trip.id}`)}
            className="bg-surface rounded-xl shadow-sm hover:shadow-lg transition duration-300 p-6 cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-navy-light mb-1">
                  {trip.title}
                </h3>
                <p className="text-foreground mb-2">{trip.destination}</p>
                <p className="text-sm text-foreground opacity-70">
                  {trip.startDate} ～ {trip.endDate}
                </p>
              </div>
              <span
                className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap ml-4 ${
                  trip.status === "planning"
                    ? "bg-gold/10 text-gold"
                    : trip.status === "ongoing"
                      ? "bg-accent-teal/10 text-accent-teal"
                      : "bg-foreground/10 text-foreground"
                }`}
              >
                {trip.status === "planning" && "計画中"}
                {trip.status === "ongoing" && "進行中"}
                {trip.status === "completed" && "完了"}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
