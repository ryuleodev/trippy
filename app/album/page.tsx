import { getAllAlbumLinks } from "@/lib/album";
import getAllTrips from "@/lib/trip";
import AlbumClient from "./AlbumClient";

export const dynamic = 'force-dynamic';

export default async function AlbumPage() {
  const [albums, trips] = await Promise.all([
    getAllAlbumLinks(),
    getAllTrips(),
  ]);

  return (
    <div className="min-h-screen bg-background pb-20">
      <AlbumClient initialAlbums={albums} trips={trips} />
    </div>
  );
}
