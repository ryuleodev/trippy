'use server';

import { revalidatePath } from "next/cache";
import { createItinerary, deleteItinerary } from "@/lib/itinerary";

export async function addItineraryAction(tripId: string, date: string, title: string,startTime: string, endTime: string,  memo: string, cost: number, costCurrency: string) {
    await createItinerary(tripId, date, title, startTime, endTime, memo, cost, costCurrency);
    revalidatePath(`/trips/${tripId}`);
    return;
}

export async function deleteItineraryAction(id: string, tripId: string) {
    await deleteItinerary(id);
    revalidatePath(`/trips/${tripId}`);
}

