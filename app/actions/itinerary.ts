'use server';

import { revalidatePath } from "next/cache";
import { createItinerary, deleteItinerary, updateItinerary } from "@/lib/itinerary";

export async function addItineraryAction(tripId: string, date: string, title: string,startTime: string, endTime: string,  memo: string, cost: number, costCurrency: string) {
    const itinerary = await createItinerary(tripId, date, title, startTime, endTime, memo, cost, costCurrency);
    revalidatePath(`/trips/${tripId}`);
    return itinerary;
}

export async function deleteItineraryAction(id: string, tripId: string) {
    const itinerary = await deleteItinerary(id);
    revalidatePath(`/trips/${tripId}`);
    return itinerary;
}

export async function updateItineraryAction(
    id: string,
    tripId: string,
    date: string,
    title: string,
    startTime: string,
    endTime: string,
    memo: string,
    cost: number,
    costCurrency: string
) {
    const updatedItinerary = await updateItinerary(id, tripId, date, title, startTime, endTime, memo, cost, costCurrency);
    revalidatePath(`/trips/${tripId}`);
    return updatedItinerary;
}   