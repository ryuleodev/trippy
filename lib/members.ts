import { db } from "./db";
import { Member } from "./type";

export async function getMembersByTripId(tripId: string): Promise<Member[]> {
  const result = await db.execute({
    sql: "SELECT * FROM members WHERE trip_id = ?",
    args: [tripId],
  });

  return result.rows.map((row) => ({
    id: String(row.id),
    tripId: String(row.trip_id),
    name: String(row.name),
  }));
}

export async function createMember(tripId: string, name: string): Promise<Member> {
const id = crypto.randomUUID();
  const result = await db.execute({
    sql: "INSERT INTO members (id, trip_id, name) VALUES (?, ?, ?) RETURNING *",
    args: [id, tripId, name],
  });

  const row = result.rows[0];
  return {
    id: String(row.id),
    tripId: String(row.trip_id),
    name: String(row.name),
  };
}