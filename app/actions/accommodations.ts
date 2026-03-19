'use server';

import { revalidatePath } from "next/cache";
import { addAccommodation, deleteAccommodation, updateAccommodation } from "@/lib/accommodations";

export async function addAccommodationAction(
    tripId: string,
    name: string,
    checkIn: string,
    checkOut: string,  
    address: string | null,
    url: string | null,
    memo: string | null
) {
    const accommodation = await addAccommodation(tripId, name, checkIn, checkOut, address, url, memo);
    revalidatePath(`/trips/${tripId}`);
    return accommodation;
}  

export async function deleteAccommodationAction(id: string, tripId: string) {   
    const accommodation = await deleteAccommodation(id);
    revalidatePath(`/trips/${tripId}`);
    return accommodation;
}

export async function updateAccommodationAction(
    id: string,
    tripId: string,       
    name: string,      
    checkIn: string,
    checkOut: string,
    address: string | null,
    url: string | null,
    memo: string | null
) {
    const accommodation = await updateAccommodation(id, name, checkIn, checkOut, address, url, memo);
    revalidatePath(`/trips/${tripId}`);
    return accommodation;
}  