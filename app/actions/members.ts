'use server';

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { createMember } from "@/lib/members";

export async function addMemberAction(tripId: string, name: string) {
    const member = await createMember(tripId, name);
    revalidatePath(`/trips/${tripId}`);
    return member;
}

export async function deleteMemberAction(id: string, tripId: string) {
    await db.execute({
        sql: "DELETE FROM members WHERE id = ?",
        args: [id]
    });
    revalidatePath(`/trips/${tripId}`);
}