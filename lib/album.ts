import { db } from "./db";
import { AlbumLink } from "./type";

export async function getAllAlbumLinks(): Promise<AlbumLink[]> {
  const result = await db.execute(`
    SELECT al.*, t.title as trip_title, t.destination as trip_destination
    FROM album_links al
    LEFT JOIN trips t ON al.trip_id = t.id
    ORDER BY al.created_at DESC
  `);

  return result.rows.map((row) => ({
    id: String(row.id),
    tripId: String(row.trip_id),
    title: String(row.title),
    url: String(row.url),
    createdAt: String(row.created_at),
    tripTitle: row.trip_title ? String(row.trip_title) : undefined,
    tripDestination: row.trip_destination ? String(row.trip_destination) : undefined,
  }));
}

export async function getAlbumLinksByTripId(tripId: string): Promise<AlbumLink[]> {
  const result = await db.execute({
    sql: "SELECT * FROM album_links WHERE trip_id = ? ORDER BY created_at DESC",
    args: [tripId],
  });

  return result.rows.map((row) => ({
    id: String(row.id),
    tripId: String(row.trip_id),
    title: String(row.title),
    url: String(row.url),
    createdAt: String(row.created_at),
  }));
}

export async function createAlbumLink(
  tripId: string,
  title: string,
  url: string
): Promise<AlbumLink> {
  const id = crypto.randomUUID();
  await db.execute({
    sql: "INSERT INTO album_links (id, trip_id, title, url) VALUES (?, ?, ?, ?)",
    args: [id, tripId, title, url],
  });
  return { id, tripId, title, url, createdAt: new Date().toISOString() };
}

export async function deleteAlbumLink(id: string): Promise<void> {
  await db.execute({
    sql: "DELETE FROM album_links WHERE id = ?",
    args: [id],
  });
}
