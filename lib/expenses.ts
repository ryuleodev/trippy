import { db } from "./db";
import { Expense } from "./type";

export async function getExpensesByTripId(tripId: string): Promise<Expense[]> {
  const result = await db.execute({
    sql: "SELECT * FROM expenses WHERE trip_id = ?",
    args: [tripId],
  });

  const expenses: Expense[] = [];

  for (const row of result.rows) {
    const splitResult = await db.execute({
      sql: "SELECT * FROM expense_splits WHERE expense_id = ?",
      args: [row.id],
    });

    const splitMemberIds = splitResult.rows.map((splitRow) =>
      String(splitRow.member_id),
    );

    expenses.push({
      id: String(row.id),
      tripId: String(row.trip_id),
      amount: Number(row.amount),
      currency: String(row.currency),
      paidByMemberId: String(row.paid_by_member_id),
      splitMemberIds,
      title: row.title ? String(row.title) : "",
      date: String(row.date),
    });
  }

  return expenses;
}

export async function createExpense(
  tripId: string,
  amount: number,
  currency: string,
  paidByMemberId: string,
  title: string | null,
  date: string,
  splitMemberIds: string[],
): Promise<Expense> {
  const id = crypto.randomUUID();

  const finalSplitMemberIds =
    splitMemberIds.length > 0 ? splitMemberIds : [paidByMemberId];

  const result = await db.execute({
    sql: "INSERT INTO expenses (id, trip_id, amount, currency, paid_by_member_id, title, date) VALUES (?, ?, ?, ?, ?, ?, ?) RETURNING *",
    args: [id, tripId, amount, currency, paidByMemberId, title, date],
  });

  const row = result.rows[0];

  const splitAmount = amount / finalSplitMemberIds.length;

  for (const memberId of finalSplitMemberIds) {
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
    splitMemberIds: finalSplitMemberIds,
    title: row.title ? String(row.title) : "",
    date: String(row.date),
  };
}

export async function deleteExpense(expenseId: string) {
  await db.execute({
    sql: "DELETE FROM expense_splits WHERE expense_id = ?",
    args: [expenseId],
  });

  await db.execute({
    sql: "DELETE FROM expenses WHERE id = ?",
    args: [expenseId],
  });
}