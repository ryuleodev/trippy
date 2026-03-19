import { db } from "./db";
import { Expense } from "./type";

export async function getExpensesByTripId(tripId: string): Promise<Expense[]> {
  const result = await db.execute({
    sql: "SELECT * FROM expenses WHERE trip_id = ?",
    args: [tripId],
  });

  return result.rows.map((row) => ({
    id: String(row.id),
    tripId: String(row.trip_id),
    amount: Number(row.amount),
    currency: String(row.currency),
    paidByMemberId: String(row.paid_by_member_id),
    memo: String(row.memo),
    date: String(row.date),
  }));
}

export async function createExpense(tripId: string, amount: number, currency: string, paidByMemberId: string, memo: string | null, date: string, splitMemberIds: string[]): Promise<Expense> {
    const id = crypto.randomUUID();
    const result = await db.execute({
        sql: "INSERT INTO expenses (id, trip_id, amount, currency, paid_by_member_id, memo, date) VALUES (?, ?, ?, ?, ?, ?, ?) RETURNING *",
        args: [id, tripId, amount, currency, paidByMemberId, memo, date],
    });

    const row = result.rows[0];

    const splitAmount = amount / splitMemberIds.length;
    for (const memberId of splitMemberIds) {
        await db.execute({
            sql: "INSERT INTO expense_splits (id, expense_id, member_id, amount) VALUES (?, ?, ?, ?)",
            args: [crypto.randomUUID(), id, memberId, splitAmount],
        });
    }

    return {
        id: String(row.id),
        tripId: String(row.trip_id),
        amount: Number(row.amount),
        currency: String(row.currency),
        paidByMemberId: String(row.paid_by_member_id),
        memo: String(row.memo),
        date: String(row.date),
    };
}

export async function deleteExpense(expenseId: string) {
    await db.execute({
        sql: "DELETE FROM expense_splits WHERE expense_id = ?",
        args: [expenseId],
    });
}  