import { db } from "./db";
import { Accommodation } from "./type";

export async function getAccommodationsByTripId(tripId: string): Promise<Accommodation[]> {
  const result = await db.execute({
    sql: "SELECT * FROM accommodations WHERE trip_id = ?",
    args: [tripId],
  });

  return result.rows.map((row) => ({
    id: String(row.id),
    tripId: String(row.trip_id),
    name: String(row.name),
    checkIn: String(row.check_in),
    checkOut: String(row.check_out),
    address: String(row.address),
    url: String(row.url),
    memo: String(row.memo),
  }));
}

export async function addAccommodation(
    tripId: string,
    name: string,
    checkIn: string,
    checkOut: string,
    address: string | null,
    url: string | null,
    memo: string | null
): Promise<Accommodation> {
  const id = crypto.randomUUID();

  await db.execute({
    sql: "INSERT INTO accommodations (id, trip_id, name, check_in, check_out, address, url, memo) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
    args: [id, tripId, name, checkIn, checkOut, address, url, memo],
  });

  return {
    id,
    tripId,
    name:  name,
    checkIn: checkIn,
    checkOut: checkOut,
    address: address ?? "",
    url: url ?? "",
    memo: memo ?? "",
  };
}

export async function deleteAccommodation(id: string): Promise<void> {
  await db.execute({
    sql: "DELETE FROM accommodations WHERE id = ?",
    args: [id],
  });
}       

export async function updateAccommodation(
    id: string,
    name: string,
    checkIn: string,
    checkOut: string,
    address: string | null,
    url: string | null,
    memo: string | null
): Promise<Accommodation> {
  await db.execute({
    sql: "UPDATE accommodations SET name = ?, check_in = ?, check_out = ?, address = ?, url = ?, memo = ? WHERE id = ?",
    args: [name, checkIn, checkOut, address, url, memo, id],
  });

  return {
    id,
    tripId: "",
    name,
    checkIn,
    checkOut,
    address: address ?? "",
    url: url ?? "",
    memo: memo ?? "",
  };
}