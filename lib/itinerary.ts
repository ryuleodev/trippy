import { db } from "./db";
import { Itinerary } from "./type";

export async function getItinerariesByTripId(
  tripId: string
): Promise<Itinerary[]> {
  const result = await db.execute({
    sql: "SELECT * FROM itineraries WHERE trip_id = ? ORDER BY date ASC, start_time ASC",
    args: [tripId],
  });

  return result.rows.map((row) => ({
    id: String(row.id),
    tripId: String(row.trip_id),
    date: String(row.date),
    title: String(row.title),
    startTime: String(row.start_time ?? ""),
    endTime: String(row.end_time ?? ""),
    memo: String(row.memo ?? ""),
    cost: Number(row.cost ?? 0),
    costCurrency: String(row.cost_currency ?? "JPY"),
  }));
}

export async function createItinerary(
  tripId: string,
  date: string,
  title: string,
  startTime: string,
  endTime: string,
  memo: string,
  cost: number,
  costCurrency: string
): Promise<Itinerary> {
  const id = crypto.randomUUID();

  await db.execute({
    sql: "INSERT INTO itineraries (id, trip_id, date, title, start_time, end_time, memo, cost, cost_currency) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
    args: [id, tripId, date, title, startTime, endTime, memo, cost, costCurrency],
  });

  return {
    id,
    tripId,
    date,
    title,
    startTime,
    endTime,
    memo,
    cost,
    costCurrency,
  };
}

export async function deleteItinerary(id: string): Promise<void> {
  await db.execute({
    sql: "DELETE FROM itineraries WHERE id = ?",
    args: [id],
  });
}

export async function updateItinerary(
    id: string,
    tripId: string,
    date: string,
    title: string,
    startTime: string,
    endTime: string,
    memo: string,
    cost: number,
    costCurrency: string
): Promise<Itinerary> {
  await db.execute({
    sql: "UPDATE itineraries SET date = ?, title = ?, start_time = ?, end_time = ?, memo = ?, cost = ?, cost_currency = ? WHERE id = ?",
    args: [date, title, startTime, endTime, memo, cost, costCurrency, id],
  });

  return {
    id,
    tripId,
    date,
    title,
    startTime,
    endTime,
    memo,
    cost,
    costCurrency,
  };
}