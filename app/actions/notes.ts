'use server';

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { addNote } from "@/lib/notes";

export async function addNoteAction(tripId: string, text: string, type: 'task' | 'memo') {
    await addNote(tripId, text, type);
    revalidatePath(`/trips/${tripId}`);
}

export async function deleteNoteAction(noteId: string, tripId: string) {
    await db.execute({
        sql: "DELETE FROM notes WHERE id = ?",
        args: [noteId]
    });
    revalidatePath(`/trips/${tripId}`);
}

export async function toggleNoteAction(id: string, completed: boolean, tripId: string) {
    await db.execute({
        sql: "UPDATE notes SET completed = ? WHERE id = ?",
        args: [completed ? 1 : 0, id]
    });
    revalidatePath(`/trips/${tripId}`);
}