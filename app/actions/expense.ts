'use server';

import { revalidatePath } from "next/cache";
import { createExpense, deleteExpense } from "@/lib/expenses";

export async function addExpenseAction(tripId: string, amount: number, currency: string, paidByMemberIds: string, splitMemnberIds: string[], title: string | null, date: string) {
    const expense = await createExpense(tripId, amount, currency, paidByMemberIds, title, date, splitMemnberIds);
    revalidatePath(`/trips/${tripId}`);
    return expense;
}

export async function deleteExpenseAction(id: string, tripId: string) {
    const expense = await deleteExpense(id);
    revalidatePath(`/trips/${tripId}`);
    return expense;
}   

export async function updateExpenseAction(
    id: string,
    tripId: string,
    amount: number,
    currency: string,
    paidByMemberIds: string,
    splitMemnberIds: string[],
    title: string | null,
    date: string
) {
    const expense = await createExpense(tripId, amount, currency, paidByMemberIds, title, date, splitMemnberIds);
    revalidatePath(`/trips/${tripId}`);
    return expense;
}