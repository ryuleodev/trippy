"use client";

import { useState } from "react";
import {
  Trip,
  Note,
  Itinerary,
  Accommodation,
  Member,
  Expense,
} from "@/lib/type";
import {
  addNoteAction,
  toggleNoteAction,
  deleteNoteAction,
} from "@/app/actions/notes";
import ItineraryForm from "./ItineraryForm";
import AccommodationForm from "./AccommodationForm";
import ExpenseForm from "./ExpenseForm";
import { addMemberAction, deleteMemberAction } from "@/app/actions/members";
import { deleteItineraryAction } from "@/app/actions/itinerary";
import { deleteAccommodationAction } from "@/app/actions/accommodations";
import { deleteExpenseAction } from "@/app/actions/expense";

interface Props {
  trip: Trip;
  initialNotes: Note[];
  initialItineraries: Itinerary[];
  initialAccommodations: Accommodation[];
  initialMembers: Member[];
  initialExpenses: Expense[];
}

export default function TripDetailPage({
  trip,
  initialNotes,
  initialItineraries,
  initialAccommodations,
  initialMembers,
  initialExpenses,
}: Props) {
  const [activeTab, setActiveTab] = useState<
    "itinerary" | "notes" | "expenses" | "members"
  >("itinerary");
  const [activeDay, setActiveDay] = useState(0);
  const [notes, setNotes] = useState<Note[]>(initialNotes);
  const [itineraries, setItineraries] =
    useState<Itinerary[]>(initialItineraries);
  const [accommodations, setAccommodations] = useState<Accommodation[]>(
    initialAccommodations,
  );
  const [noteType, setNoteType] = useState<"task" | "memo">("task");
  const [newNote, setNewNote] = useState("");
  const [members, setMembers] = useState<Member[]>(initialMembers);
  const [newMemberName, setNewMemberName] = useState("");
  const [expenses, setExpenses] = useState<Expense[]>(initialExpenses);
  const [showExpenseForm, setShowExpense] = useState(false);
  const [showExpenseSummary, setShowExpenseSummary] = useState(false);
  const [selectedItinerary, setSelectedItinerary] = useState<Itinerary | null>(
    null,
  );
  const [selectedAccommodation, setSelectedAccommodation] =
    useState<Accommodation | null>(null);

  const [editingItinerary, setEditingItinerary] = useState<Itinerary | null>(
    null,
  );
  const [editingAccommodation, setEditingAccommodation] =
    useState<Accommodation | null>(null);
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);

  const [isDeleting, setIsDeleting] = useState(false);

  const tabs = [
    { id: "itinerary", label: "旅程" },
    { id: "notes", label: "メモ・タスク" },
    { id: "expenses", label: "費用" },
    { id: "members", label: "メンバー" },
  ] as const;

  const getDays = () => {
    const days = [];
    const start = new Date(trip.startDate as string);
    const end = new Date(trip.endDate as string);

    for (
      let i = 0;
      i <= (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24);
      i++
    ) {
      days.push(new Date(start.getTime() + i * 24 * 60 * 60 * 1000));
    }

    return days;
  };

  const days = getDays();

  const dateStr = `${days[activeDay].getFullYear()}-${String(
    days[activeDay].getMonth() + 1,
  ).padStart(2, "0")}-${String(days[activeDay].getDate()).padStart(2, "0")}`;

  const currentDayItineraries = itineraries.filter(
    (item) => item.date === dateStr,
  );

  const addNote = () => {
    if (!newNote.trim()) return;
    if (!noteType) return;

    const newNoteObj: Note = {
      id: crypto.randomUUID(),
      text: newNote,
      type: noteType,
      completed: false,
    };

    setNotes([...notes, newNoteObj]);
    setNewNote("");

    addNoteAction(trip.id, newNote, newNoteObj.type);
  };

  const [showForm, setShowForm] = useState(false);
  const [showAccommodationForm, setShowAccommodationForm] = useState(false);
  const todayAccommodations = accommodations.filter((acc) => {
    const checkIn = new Date(acc.checkIn);
    const checkOut = new Date(acc.checkOut);
    const today = new Date(dateStr);
    return checkIn <= today && today < checkOut;
  });
  const hasAccommodationToday = todayAccommodations.length > 0;

  const deleteNote = (id: string) => {
    setNotes(notes.filter((note) => note.id !== id));
    deleteNoteAction(id, trip.id as string);
  };

  const toggleNote = (id: string) => {
    const updatedNotes = notes.map((note) =>
      note.id === id ? { ...note, completed: !note.completed } : note,
    );
    setNotes(updatedNotes);

    const toggledNote = updatedNotes.find((note) => note.id === id);
    if (toggledNote) {
      toggleNoteAction(id, toggledNote.completed, trip.id as string);
    }
  };

  const addMember = async () => {
    if (!newMemberName.trim()) return;
    const member = await addMemberAction(trip.id as string, newMemberName);
    setMembers([...members, member]);
    setNewMemberName("");
  };

  const deleteMember = (id: string) => {
    setMembers(members.filter((m) => m.id !== id));
    deleteMemberAction(id, trip.id as string);
  };

  const tasks = notes.filter((note) => note.type === "task" && !note.completed);
  const completedTasks = notes.filter(
    (note) => note.type === "task" && note.completed,
  );
  const memos = notes.filter((note) => note.type === "memo");
  const totalExpenses = expenses.reduce(
    (sum, expense) => sum + expense.amount,
    0,
  );

  const calculateSettlements = () => {
    const balanceMap: Record<string, number> = {};

    members.forEach((member) => {
      balanceMap[member.id] = 0;
    });

    expenses.forEach((expense) => {
      const participants =
        expense.splitMemberIds && expense.splitMemberIds.length > 0
          ? expense.splitMemberIds
          : [expense.paidByMemberId];

      if (!participants.length) return;

      const share = expense.amount / participants.length;

      balanceMap[expense.paidByMemberId] =
        (balanceMap[expense.paidByMemberId] ?? 0) + expense.amount;

      participants.forEach((memberId) => {
        balanceMap[memberId] = (balanceMap[memberId] ?? 0) - share;
      });
    });

    const creditors = Object.entries(balanceMap)
      .filter(([, balance]) => balance > 0.5)
      .map(([memberId, balance]) => ({
        memberId,
        amount: balance,
      }))
      .sort((a, b) => b.amount - a.amount);

    const debtors = Object.entries(balanceMap)
      .filter(([, balance]) => balance < -0.5)
      .map(([memberId, balance]) => ({
        memberId,
        amount: Math.abs(balance),
      }))
      .sort((a, b) => b.amount - a.amount);

    const settlements: { from: string; to: string; amount: number }[] = [];

    let i = 0;
    let j = 0;

    while (i < debtors.length && j < creditors.length) {
      const debtor = debtors[i];
      const creditor = creditors[j];

      const rawAmount = Math.min(debtor.amount, creditor.amount);
      const amount = Math.round(rawAmount);

      if (amount > 0) {
        settlements.push({
          from: debtor.memberId,
          to: creditor.memberId,
          amount,
        });
      }

      debtor.amount -= rawAmount;
      creditor.amount -= rawAmount;

      if (debtor.amount < 0.5) i++;
      if (creditor.amount < 0.5) j++;
    }

    return settlements;
  };

  const settlements = calculateSettlements();

  const handleDeleteItinerary = async (id: string) => {
    const ok = window.confirm("この旅程を削除しますか？");
    if (!ok) return;

    try {
      setIsDeleting(true);
      await deleteItineraryAction(id, trip.id as string);
      setItineraries((prev) => prev.filter((item) => item.id !== id));
      setSelectedItinerary(null);
    } catch (error) {
      console.error(error);
      alert("旅程の削除に失敗しました。");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteAccommodation = async (id: string) => {
    const ok = window.confirm("この宿泊施設を削除しますか？");
    if (!ok) return;

    try {
      setIsDeleting(true);
      await deleteAccommodationAction(id, trip.id as string);
      setAccommodations((prev) => prev.filter((item) => item.id !== id));
      setSelectedAccommodation(null);
    } catch (error) {
      console.error(error);
      alert("宿泊施設の削除に失敗しました。");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteExpense = async (id: string) => {
    const ok = window.confirm("この費用を削除しますか？");
    if (!ok) return;

    try {
      setIsDeleting(true);
      await deleteExpenseAction(id, trip.id as string);
      setExpenses((prev) => prev.filter((item) => item.id !== id));
      setSelectedExpense(null);
    } catch (error) {
      console.error(error);
      alert("費用の削除に失敗しました。");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <div className="px-4">
        <div className="p-4">
          <div className="flex gap-3 border-b mb-3">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-2 py-2 font-medium transition-colors ${
                  activeTab === tab.id
                    ? "border-b-2 border-blue-500 text-blue-600"
                    : "text-gray-600 hover:text-gray-800"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {activeTab === "itinerary" && (
          <div>
            <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
              {days.map((day, index) => (
                <button
                  key={index}
                  onClick={() => setActiveDay(index)}
                  className={`px-4 py-2 whitespace-nowrap font-medium transition-colors rounded ${
                    activeDay === index
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  {day.toLocaleDateString("ja-JP", {
                    month: "numeric",
                    day: "numeric",
                  })}
                </button>
              ))}
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">
                  {days[activeDay].toLocaleDateString("ja-JP", {
                    month: "numeric",
                    day: "numeric",
                  })}
                </h2>
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowForm(true)}
                    className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium whitespace-nowrap"
                  >
                    旅程追加
                  </button>
                  {!hasAccommodationToday && (
                    <button
                      onClick={() => setShowAccommodationForm(true)}
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium whitespace-nowrap"
                    >
                      ホテル追加
                    </button>
                  )}
                </div>
              </div>

              {currentDayItineraries.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setSelectedItinerary(item)}
                  className="w-full text-left bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex gap-4">
                    <div className="text-blue-600 font-bold whitespace-nowrap">
                      {item.startTime}
                      {item.endTime ? ` - ${item.endTime}` : ""}
                    </div>
                    <div className="text-gray-700">{item.title}</div>
                  </div>
                </button>
              ))}

              {currentDayItineraries.length === 0 && (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-gray-500">
                  この日の旅程はまだ登録されていません
                </div>
              )}

              {accommodations
                .filter((acc) => acc.checkIn === dateStr)
                .map((acc) => (
                  <button
                    key={acc.id}
                    type="button"
                    onClick={() => setSelectedAccommodation(acc)}
                    className="w-full text-left bg-yellow-50 border border-yellow-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow mt-4"
                  >
                    <div className="flex gap-4">
                      <div className="text-yellow-600 font-bold whitespace-nowrap">
                        宿泊: {acc.name}
                      </div>
                      <div className="text-gray-700">{acc.address}</div>
                    </div>
                  </button>
                ))}
            </div>
          </div>
        )}

        {activeTab === "notes" && (
          <div>
            <div className="mb-6 space-y-3">
              <div className="flex gap-2 bg-gray-200 rounded-lg p-1 w-fit">
                <button
                  onClick={() => setNoteType("task")}
                  className={`px-4 py-2 rounded font-medium transition-colors ${
                    noteType === "task"
                      ? "bg-blue-500 text-white"
                      : "text-gray-600 hover:text-gray-800"
                  }`}
                >
                  タスク
                </button>
                <button
                  onClick={() => setNoteType("memo")}
                  className={`px-4 py-2 rounded font-medium transition-colors ${
                    noteType === "memo"
                      ? "bg-blue-500 text-white"
                      : "text-gray-600 hover:text-gray-800"
                  }`}
                >
                  メモ
                </button>
              </div>

              <div className="flex gap-2 mb-6">
                <input
                  type="text"
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addNote()}
                  placeholder="メモやタスクを入力..."
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                <button
                  onClick={addNote}
                  className="w-fit px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
                >
                  追加
                </button>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-bold mb-4">タスク</h2>
                {tasks.length === 0 ? (
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-gray-500">
                    タスクはありません
                  </div>
                ) : (
                  <div className="space-y-2">
                    {tasks.map((note) => (
                      <div
                        key={note.id}
                        className="bg-white border border-gray-200 rounded-lg p-4 flex items-center gap-3 hover:shadow-md transition-shadow"
                      >
                        <input
                          type="checkbox"
                          checked={note.completed}
                          onChange={() => toggleNote(note.id)}
                          className="w-5 h-5 cursor-pointer"
                        />
                        <span className="flex-1 text-gray-700">
                          {note.text}
                        </span>
                        <button
                          onClick={() => deleteNote(note.id)}
                          className="text-red-500 hover:text-red-700 transition-colors"
                        >
                          削除
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {completedTasks.length > 0 && (
                  <div>
                    <h3>完了済み</h3>
                    {completedTasks.map((note) => (
                      <div
                        key={note.id}
                        className="bg-white border border-gray-200 rounded-lg p-4 flex items-center gap-3 hover:shadow-md transition-shadow"
                      >
                        <input
                          type="checkbox"
                          checked={note.completed}
                          onChange={() => toggleNote(note.id)}
                          className="w-5 h-5 cursor-pointer"
                        />
                        <span className="flex-1 line-through text-gray-400">
                          {note.text}
                        </span>
                        <button
                          onClick={() => deleteNote(note.id)}
                          className="text-red-500 hover:text-red-700 transition-colors"
                        >
                          削除
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <h2 className="text-lg font-bold mb-4">メモ</h2>
                {memos.length === 0 ? (
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-gray-500">
                    メモはありません
                  </div>
                ) : (
                  <div className="space-y-2">
                    {memos.map((note) => (
                      <div
                        key={note.id}
                        className="bg-white border border-gray-200 rounded-lg p-4 flex items-center gap-3 hover:shadow-md transition-shadow"
                      >
                        <span className="flex-1 text-gray-900">
                          {note.text}
                        </span>
                        <button
                          onClick={() => deleteNote(note.id)}
                          className="text-red-500 hover:text-red-700 transition-colors"
                        >
                          削除
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === "expenses" && (
          <div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <p className="text-gray-600">合計費用</p>
              <p className="text-3xl font-bold text-blue-600">
                ¥{totalExpenses.toLocaleString()}
              </p>
            </div>

            <div className="flex gap-3 mb-6">
              <button
                onClick={() => setShowExpense(true)}
                className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                費用追加
              </button>
              <button
                onClick={() => setShowExpenseSummary(true)}
                className="flex-1 bg-white border border-blue-300 text-blue-600 py-3 rounded-lg font-medium hover:bg-blue-50 transition-colors"
              >
                費用概要
              </button>
            </div>

            {expenses.length === 0 ? (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-gray-500">
                費用の記録はありません
              </div>
            ) : (
              <div className="space-y-4">
                {expenses.map((expense) => {
                  return (
                    <button
                      key={expense.id}
                      type="button"
                      onClick={() => setSelectedExpense(expense)}
                      className="w-full text-left bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <p className="font-bold text-lg text-gray-800">
                            {expense.title}
                          </p>
                          <p className="text-sm text-gray-500">
                            {new Date(expense.date).toLocaleDateString("ja-JP")}
                          </p>
                        </div>
                        <p className="font-bold text-lg text-blue-600">
                          {expense.currency === "JPY"
                            ? "¥"
                            : `${expense.currency} `}
                          {expense.amount.toLocaleString()}
                        </p>
                      </div>

                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">支払者:</span>
                          <span className="font-medium text-gray-800">
                            {members.find(
                              (m) => m.id === expense.paidByMemberId,
                            )?.name ?? "不明"}
                          </span>
                        </div>

                        {!!expense.splitMemberIds?.length && (
                          <div className="flex justify-between gap-4">
                            <span className="text-gray-600 shrink-0">
                              誰の分:
                            </span>
                            <span className="text-right text-gray-800">
                              {expense.splitMemberIds
                                .map(
                                  (id) =>
                                    members.find((m) => m.id === id)?.name ??
                                    "不明",
                                )
                                .join("、")}
                            </span>
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {activeTab === "members" && (
          <>
            <div className="mb-6 flex items-center gap-4">
              <input
                type="text"
                value={newMemberName}
                onChange={(e) => setNewMemberName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addMember()}
                placeholder="メンバー名を入力..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <button
                onClick={addMember}
                className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
              >
                追加
              </button>
            </div>
            <div>
              {members.length === 0 ? (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-gray-500">
                  メンバーが登録されていません
                </div>
              ) : (
                <div className="space-y-2">
                  {members.map((member) => (
                    <div
                      key={member.id}
                      className="bg-white border border-gray-200 rounded-lg p-4 flex items-center gap-3 hover:shadow-md transition-shadow"
                    >
                      <span className="flex-1 text-gray-700">
                        {member.name}
                      </span>
                      <button
                        onClick={() => deleteMember(member.id)}
                        className="text-red-500 hover:text-red-700 transition-colors"
                      >
                        削除
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {showForm && (
        <ItineraryForm
          tripId={trip.id as string}
          date={dateStr}
          onClose={() => setShowForm(false)}
          onAdd={(itinerary) => {
            setItineraries([...itineraries, itinerary]);
          }}
        />
      )}

      {showAccommodationForm && (
        <AccommodationForm
          tripId={trip.id as string}
          checkIn={dateStr}
          onClose={() => setShowAccommodationForm(false)}
          onAdd={(accommodation) => {
            setAccommodations([...accommodations, accommodation]);
          }}
        />
      )}

      {showExpenseForm && (
        <ExpenseForm
          tripId={trip.id as string}
          members={members}
          initialDate={dateStr}
          onClose={() => setShowExpense(false)}
          onAdd={(expense) => {
            setExpenses([...expenses, expense]);
          }}
        />
      )}

      {showExpenseSummary && (
        <div
          className="fixed inset-0 bg-black/40 z-40"
          onClick={() => setShowExpenseSummary(false)}
        >
          <div
            className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-2xl p-6 max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl font-bold mb-4">費用概要</h2>

            {settlements.length === 0 ? (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-gray-500">
                精算する費用はありません
              </div>
            ) : (
              <div className="space-y-3">
                {settlements.map((settlement, index) => {
                  const fromName =
                    members.find((m) => m.id === settlement.from)?.name ??
                    "不明";
                  const toName =
                    members.find((m) => m.id === settlement.to)?.name ?? "不明";

                  return (
                    <div
                      key={index}
                      className="bg-blue-50 border border-blue-200 rounded-lg p-4"
                    >
                      <p className="text-gray-800 font-medium">
                        <span className="font-bold">{fromName}</span>
                        <span className="mx-1">→</span>
                        <span className="font-bold">{toName}</span>
                      </p>
                      <p className="text-blue-600 text-lg font-bold mt-1">
                        ¥{settlement.amount.toLocaleString()}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}

            <button
              onClick={() => setShowExpenseSummary(false)}
              className="w-full mt-6 bg-gray-200 text-gray-800 py-3 rounded-lg font-medium hover:bg-gray-300"
            >
              閉じる
            </button>
          </div>
        </div>
      )}

      {editingExpense && (
        <ExpenseForm
          tripId={trip.id as string}
          members={members}
          initialDate={editingExpense.date}
          initialValues={editingExpense}
          submitLabel="更新"
          onClose={() => setEditingExpense(null)}
          onAdd={(updatedExpense) => {
            setExpenses((prev) =>
              prev.map((item) =>
                item.id === updatedExpense.id ? updatedExpense : item,
              ),
            );
            setSelectedExpense(updatedExpense);
            setEditingExpense(null);
          }}
        />
      )}

      {selectedExpense &&
        (() => {
          return (
            <div
              className="fixed inset-0 bg-black/40 z-40"
              onClick={() => setSelectedExpense(null)}
            >
              <div
                className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-2xl p-6 max-h-[80vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <p className="text-sm text-gray-500 mb-2">費用詳細</p>
                <h2 className="text-2xl font-bold mb-4">
                  {selectedExpense.title}
                </h2>

                <div className="space-y-3">
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <p className="text-sm text-gray-500 mb-1">日付</p>
                    <p className="font-medium text-gray-800">
                      {new Date(selectedExpense.date).toLocaleDateString(
                        "ja-JP",
                      )}
                    </p>
                  </div>

                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <p className="text-sm text-gray-500 mb-1">金額</p>
                    <p className="font-medium text-gray-800">
                      {selectedExpense.currency === "JPY"
                        ? "¥"
                        : `${selectedExpense.currency} `}
                      {selectedExpense.amount.toLocaleString()}
                    </p>
                  </div>

                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <p className="text-sm text-gray-500 mb-1">支払者</p>
                    <p className="font-medium text-gray-800">
                      {members.find(
                        (m) => m.id === selectedExpense.paidByMemberId,
                      )?.name ?? "不明"}
                    </p>
                  </div>

                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <p className="text-sm text-gray-500 mb-1">誰の分</p>
                    <p className="font-medium text-gray-800">
                      {(selectedExpense.splitMemberIds?.length
                        ? selectedExpense.splitMemberIds
                        : [selectedExpense.paidByMemberId]
                      )
                        .map(
                          (id) =>
                            members.find((m) => m.id === id)?.name ?? "不明",
                        )
                        .join("、")}
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => setSelectedExpense(null)}
                    className="w-full bg-gray-200 text-gray-800 py-3 rounded-lg font-medium hover:bg-gray-300"
                  >
                    閉じる
                  </button>
                  <button
                    onClick={() => {
                      const target = selectedExpense;
                      setSelectedExpense(null);
                      setTimeout(() => setEditingExpense(target), 0);
                    }}
                    className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700"
                  >
                    編集
                  </button>
                  <button
                    onClick={() => handleDeleteExpense(selectedExpense.id)}
                    disabled={isDeleting}
                    className="w-full bg-red-600 text-white py-3 rounded-lg font-medium hover:bg-red-700 disabled:opacity-50"
                  >
                    {isDeleting ? "削除中..." : "削除"}
                  </button>
                </div>
              </div>
            </div>
          );
        })()}

      {selectedItinerary && (
        <div
          className="fixed inset-0 bg-black/40 z-40"
          onClick={() => setSelectedItinerary(null)}
        >
          <div
            className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-2xl p-6 max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="text-sm text-gray-500 mb-2">旅程詳細</p>
            <h2 className="text-2xl font-bold mb-4">
              {selectedItinerary.title}
            </h2>

            <div className="space-y-3">
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <p className="text-sm text-gray-500 mb-1">日付</p>
                <p className="font-medium text-gray-800">{dateStr}</p>
              </div>

              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <p className="text-sm text-gray-500 mb-1">時間</p>
                <p className="font-medium text-gray-800">
                  {selectedItinerary.startTime}
                  {selectedItinerary.endTime
                    ? ` 〜 ${selectedItinerary.endTime}`
                    : ""}
                </p>
              </div>

              {selectedItinerary.memo && (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <p className="text-sm text-gray-500 mb-1">メモ</p>
                  <p className="text-gray-800 whitespace-pre-wrap">
                    {selectedItinerary.memo}
                  </p>
                </div>
              )}
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setSelectedItinerary(null)}
                className="w-full bg-gray-200 text-gray-800 py-3 rounded-lg font-medium hover:bg-gray-300"
              >
                閉じる
              </button>
              <button
                onClick={() => {
                  setEditingItinerary(selectedItinerary);
                  setSelectedItinerary(null);
                }}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700"
              >
                編集
              </button>
              <button
                onClick={() => handleDeleteItinerary(selectedItinerary.id)}
                disabled={isDeleting}
                className="w-full bg-red-600 text-white py-3 rounded-lg font-medium hover:bg-red-700 disabled:opacity-50"
              >
                {isDeleting ? "削除中..." : "削除"}
              </button>
            </div>
          </div>
        </div>
      )}

      {editingItinerary && (
        <ItineraryForm
          tripId={trip.id as string}
          date={dateStr}
          initialValues={editingItinerary}
          submitLabel="更新"
          onClose={() => setEditingItinerary(null)}
          onAdd={(updatedItinerary) => {
            setItineraries((prev) =>
              prev.map((item) =>
                item.id === updatedItinerary.id ? updatedItinerary : item,
              ),
            );
            setSelectedItinerary(updatedItinerary);
            setEditingItinerary(null);
          }}
        />
      )}

      {selectedAccommodation && (
        <div
          className="fixed inset-0 bg-black/40 z-40"
          onClick={() => setSelectedAccommodation(null)}
        >
          <div
            className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-2xl p-6 max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="text-sm text-gray-500 mb-2">宿泊施設詳細</p>
            <h2 className="text-2xl font-bold mb-4">
              {selectedAccommodation.name}
            </h2>

            <div className="space-y-3">
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <p className="text-sm text-gray-500 mb-1">チェックイン</p>
                <p className="font-medium text-gray-800">
                  {new Date(selectedAccommodation.checkIn).toLocaleDateString(
                    "ja-JP",
                  )}
                </p>
              </div>

              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <p className="text-sm text-gray-500 mb-1">チェックアウト</p>
                <p className="font-medium text-gray-800">
                  {new Date(selectedAccommodation.checkOut).toLocaleDateString(
                    "ja-JP",
                  )}
                </p>
              </div>

              {selectedAccommodation.address && (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <p className="text-sm text-gray-500 mb-1">住所</p>
                  <p className="text-gray-800 whitespace-pre-wrap">
                    {selectedAccommodation.address}
                  </p>
                </div>
              )}

              {selectedAccommodation.url && (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <p className="text-sm text-gray-500 mb-1">URL</p>
                  <a
                    href={selectedAccommodation.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 underline break-all"
                  >
                    {selectedAccommodation.url}
                  </a>
                </div>
              )}

              {selectedAccommodation.memo && (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <p className="text-sm text-gray-500 mb-1">メモ</p>
                  <p className="text-gray-800 whitespace-pre-wrap">
                    {selectedAccommodation.memo}
                  </p>
                </div>
              )}
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setSelectedAccommodation(null)}
                className="w-full bg-gray-200 text-gray-800 py-3 rounded-lg font-medium hover:bg-gray-300"
              >
                閉じる
              </button>
              <button
                onClick={() => {
                  setEditingAccommodation(selectedAccommodation);
                  setSelectedAccommodation(null);
                }}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700"
              >
                編集
              </button>
              <button
                onClick={() =>
                  handleDeleteAccommodation(selectedAccommodation.id)
                }
                disabled={isDeleting}
                className="w-full bg-red-600 text-white py-3 rounded-lg font-medium hover:bg-red-700 disabled:opacity-50"
              >
                {isDeleting ? "削除中..." : "削除"}
              </button>
            </div>
          </div>
        </div>
      )}

      {editingAccommodation && (
        <AccommodationForm
          tripId={trip.id as string}
          checkIn={editingAccommodation.checkIn}
          initialValues={editingAccommodation}
          submitLabel="更新"
          onClose={() => setEditingAccommodation(null)}
          onAdd={(updatedAccommodation) => {
            setAccommodations((prev) =>
              prev.map((item) =>
                item.id === updatedAccommodation.id
                  ? updatedAccommodation
                  : item,
              ),
            );
            setSelectedAccommodation(updatedAccommodation);
            setEditingAccommodation(null);
          }}
        />
      )}
    </>
  );
}
