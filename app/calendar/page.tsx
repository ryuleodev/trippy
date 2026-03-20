import getAllTrips from "@/lib/trip";
import CalendarClient from "./CalendarClient";

export const dynamic = 'force-dynamic';

export default async function CalendarPage() {
  const trips = await getAllTrips();
  return <CalendarClient trips={trips} />;
}
