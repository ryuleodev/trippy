'use server';

import { createTrip, deleteTrip } from "@/lib/trip";
import { revalidatePath } from "next/cache";

export async function addTripAction(title: string, destination: string, startDate: string, endDate: string) {
    const trip = await createTrip(title, destination, startDate, endDate);
    revalidatePath(`/trips/${trip.id}`);
    return trip.id;
}

export async function deleteTripAction(id: string) {
    const trip = await deleteTrip(id);
    revalidatePath("/trips");
    return trip;
}

