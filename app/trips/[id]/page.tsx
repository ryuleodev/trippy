import DetailHeader from "@/components/DetailHeader";
import TripDetail from "@/components/TripDetail";
import { Trip, Note, Itinerary } from "@/lib/type";
import { getTripById } from "@/lib/trip";
import { getNotesByTripId } from "@/lib/notes";
import { getItinerariesByTripId } from "@/lib/itinerary";
import { getAccommodationsByTripId } from "@/lib/accommodations";

export default async function TripDetailPage({ params }: { params: { id: string } }) {
  const { id } = await params;
  const trip : Trip | null = await getTripById(id);
  const notes: Note[] = trip ? await getNotesByTripId(id) : [];
  const itineraries: Itinerary[] = trip ? await getItinerariesByTripId(id) : [];
  const accommodations = trip ? await getAccommodationsByTripId(id) : [];
  
  if (!trip) {
    return <div className="min-h-screen flex items-center justify-center">旅行が見つかりませんでした。</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-lg mx-auto">
        <DetailHeader title={trip.title || "無題の旅行"} />
        <TripDetail trip={trip} initialNotes={notes} initialItineraries={itineraries} initialAccommodations={accommodations} />
      </div>
    </div>
  );
}