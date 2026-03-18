import TripList from "@/components/TripList";
import getAllTrips from "@/lib/trip";
import { Trip } from "@/lib/type";

export default async function Home() {
  const trips: Trip[] = await getAllTrips();
  const upcomingTrips = trips.filter((t) => t.status === 'planning').length;
  const ongoingTrips = trips.filter((t) => t.status === 'ongoing').length;

  return (
    <div className="min-h-screen bg-background px-4 pt-6">
      <div className="max-w-lg mx-auto">
        <h1 className="text-5xl font-bold mb-5 text-navy-light">Trippy</h1>

        {/* サマリーカード */}
        <div className="grid grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition duration-300 p-6 border-l-4 border-navy-light">
            <p className="text-foreground text-sm font-medium mb-2">総旅行数</p>
            <p className="text-4xl font-bold text-navy-light">{trips.length}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition duration-300 p-6 border-l-4 border-gold">
            <p className="text-foreground text-sm font-medium mb-2">計画中</p>
            <p className="text-4xl font-bold text-gold">{upcomingTrips}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition duration-300 p-6 border-l-4 border-accent-teal">
            <p className="text-foreground text-sm font-medium mb-2">進行中</p>
            <p className="text-4xl font-bold text-accent-teal">{ongoingTrips}</p>
          </div>
        </div>

        {/* 旅行一覧 */}
        <TripList trips={trips} />
      </div>
    </div>
  );
}
