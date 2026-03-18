import { db } from "./db";
import { Trip } from "./type";

export default async function getAllTrips(): Promise<Trip[]> {
  const result = await db.execute("SELECT * FROM trips ORDER BY created_at DESC");

  return result.rows.map((row) => ({
    id: String(row.id),
    title: String(row.title),
    destination: String(row.destination),
    startDate: String(row.start_date),
    endDate: String(row.end_date),
    status: String(row.status),
  }));
}

export async function getTripById(id: string): Promise<Trip | null> {
  const result = await db.execute({
    sql: "SELECT * FROM trips WHERE id = ?",
    args: [id],
  });

  const row = result.rows[0];
  if (!row) return null;

  return {
    id: String(row.id),
    title: String(row.title),
    destination: String(row.destination),
    startDate: String(row.start_date),
    endDate: String(row.end_date),
    status: String(row.status),
  };
}

export async function createTrip(
  title: string,
  destination: string,
  startDate: string,
  endDate: string
): Promise<Trip> {
  const id = crypto.randomUUID();

  await db.execute({
    sql: "INSERT INTO trips (id, title, destination, start_date, end_date, status) VALUES (?, ?, ?, ?, ?, ?)",
    args: [id, title, destination, startDate, endDate, "planning"],
  });

  return {
    id,
    title,
    destination,
    startDate,
    endDate,
    status: "planning",
  };
}

export async function deleteTrip(id: string): Promise<void> {
  await db.execute({
    sql: "DELETE FROM trips WHERE id = ?",
    args: [id],
  });
}