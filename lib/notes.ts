import { db } from "./db";
import { Note } from "./type";

export async function getNotesByTripId(tripId: string): Promise<Note[]> {
  const result = await db.execute({
    sql: "SELECT * FROM notes WHERE trip_id = ? ORDER BY created_at ASC",
    args: [tripId],
  });

  return result.rows.map((row) => ({
    id: String(row.id),
    text: String(row.text),
    type: row.type as "task" | "memo",
    completed: Boolean(row.completed),
  }));
}

export async function addNote(
  tripId: string,
  text: string,
  type: "task" | "memo"
): Promise<Note> {
  const id = crypto.randomUUID();

  await db.execute({
    sql: "INSERT INTO notes (id, trip_id, text, type, completed) VALUES (?, ?, ?, ?, ?)",
    args: [id, tripId, text, type, 0],
  });

  return {
    id,
    text,
    type,
    completed: false,
  };
}