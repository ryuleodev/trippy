'use server';

import { createTrip, deleteTrip } from "@/lib/trip";
import { revalidatePath } from "next/cache";

export async function addTripAction(title: string, destination: string, startDate: string, endDate: string) {
    const id = crypto.randomUUID();
    await createTrip(title, destination, startDate, endDate);
    revalidatePath("/trips");
    return id;
}

export async function deleteTripAction(id: string) {
    await deleteTrip(id);
    revalidatePath("/trips");
}

