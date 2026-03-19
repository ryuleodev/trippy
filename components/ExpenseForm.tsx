"use client";

import React, { useState } from "react";
import { addExpenseAction, updateExpenseAction } from "@/app/actions/expense";
import { Expense, Member } from "@/lib/type";

interface Props {
  tripId: string;
  initialDate: string;
  members: Member[];
  onClose: () => void;
  onAdd: (expense: Expense) => void;
  initialValues?: Expense;
  submitLabel?: string;
}

export default function ExpenseForm({
  tripId,
  initialDate,
  members,
  onClose,
  onAdd,
  initialValues,
  submitLabel,
}: Props) {
  const [title, setTitle] = useState(initialValues?.title ?? "");
  const [date, setDate] = useState(initialValues?.date ?? initialDate);
  const [amount, setAmount] = useState<number | "">(initialValues?.amount ?? "");
  const [currency, setCurrency] = useState(initialValues?.currency ?? "JPY");
  const [paidByMemberId, setPaidByMemberId] = useState(
    initialValues?.paidByMemberId ?? "",
  );
  const [splitMemberIds, setSplitMemberIds] = useState<string[]>(
    initialValues?.splitMemberIds ?? [],
  );

  const handleSplitMemberToggle = (memberId: string) => {
    setSplitMemberIds((prev) =>
      prev.includes(memberId)
        ? prev.filter((id) => id !== memberId)
        : [...prev, memberId],
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const mergedtitle = title
      ? `【何を】${title}\n${title}`.trim()
      : title;

    const targetSplitIds =
      splitMemberIds.length > 0 ? splitMemberIds : [paidByMemberId];

    if (initialValues) {
      const updatedExpense = await updateExpenseAction(
        initialValues.id,
        tripId,
        Number(amount || 0),
        currency,
        paidByMemberId,
        targetSplitIds,
        mergedtitle,
        date,
      );

      onAdd(updatedExpense);
    } else {
      const newExpense = await addExpenseAction(
        tripId,
        Number(amount || 0),
        currency,
        paidByMemberId,
        targetSplitIds,
        mergedtitle,
        date,
      );

      onAdd(newExpense);
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-40" onClick={onClose}>
      <div
        className="fixed bottom-0 left-0 right-0 z-50 bg-surface rounded-t-2xl p-8 animate-slide-up max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl font-bold mb-4">
          {initialValues ? "支出を編集" : "支出を追加"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold mb-2">日付</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full rounded-xl border border-gray-300 py-3 outline-none focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">何を</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="例：ランチ、ホテル代、電車代"
              className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">いくら</label>
            <div className="flex gap-3">
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
              >
                <option value="JPY">JPY</option>
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="KRW">KRW</option>
              </select>
              <input
                type="number"
                value={amount}
                onChange={(e) =>
                  setAmount(e.target.value === "" ? "" : Number(e.target.value))
                }
                placeholder="0"
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">
              誰が払った
            </label>
            <select
              value={paidByMemberId}
              onChange={(e) => setPaidByMemberId(e.target.value)}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
              required
            >
              <option value="">選択してください</option>
              {members.map((member) => (
                <option key={member.id} value={member.id}>
                  {member.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">誰の分を</label>
            <div className="grid grid-cols-2 gap-3">
              {members.map((member) => {
                const checked = splitMemberIds.includes(member.id);
                return (
                  <label
                    key={member.id}
                    className={`flex items-center gap-3 rounded-xl border px-4 py-3 cursor-pointer transition ${
                      checked
                        ? "border-blue-600 bg-blue-50"
                        : "border-gray-300 bg-white"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => handleSplitMemberToggle(member.id)}
                      className="h-4 w-4"
                    />
                    <span className="text-sm font-medium">{member.name}</span>
                  </label>
                );
              })}
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="w-full rounded-xl bg-gray-100 py-3 font-semibold text-gray-700 hover:bg-gray-200"
            >
              キャンセル
            </button>
            <button
              type="submit"
              className="w-full rounded-xl bg-blue-600 py-3 font-semibold text-white hover:bg-blue-700"
            >
              {submitLabel ?? "保存"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}