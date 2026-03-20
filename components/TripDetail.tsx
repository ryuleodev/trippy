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

/* ── BottomSheet ──────────────────────────────────── */
function BottomSheet({ onClose, children }: { onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-[60] flex flex-col justify-end" onClick={onClose}>
      <div className="absolute inset-0 bg-black/50 animate-fade-in" />
      <div
        className="relative bg-surface rounded-t-3xl max-h-[85vh] overflow-y-auto animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full bg-ink-subtle/30" />
        </div>
        <div className="px-5 pb-12 safe-area-pb">
          {children}
        </div>
      </div>
    </div>
  );
}

/* ── DetailRow ────────────────────────────────────── */
function DetailRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="bg-surface-sub rounded-xl p-4">
      <p className="text-xs text-ink-muted mb-1.5 font-medium">{label}</p>
      <div className="text-sm text-foreground">{children}</div>
    </div>
  );
}

/* ── ActionButtons ────────────────────────────────── */
function ActionButtons({
  onClose,
  onEdit,
  onDelete,
  isDeleting,
}: {
  onClose: () => void;
  onEdit?: () => void;
  onDelete: () => void;
  isDeleting: boolean;
}) {
  return (
    <div className="flex gap-2.5 mt-6 mb-4">
      <button
        onClick={onClose}
        className="flex-1 bg-surface-sub text-foreground py-3.5 rounded-xl font-medium text-sm
          active:scale-95 transition-transform duration-150"
      >
        閉じる
      </button>
      {onEdit && (
        <button
          onClick={onEdit}
          className="flex-1 bg-navy-light text-white py-3.5 rounded-xl font-medium text-sm
            active:scale-95 transition-transform duration-150"
        >
          編集
        </button>
      )}
      <button
        onClick={onDelete}
        disabled={isDeleting}
        className="flex-1 bg-red-500/90 text-white py-3.5 rounded-xl font-medium text-sm
          active:scale-95 transition-transform duration-150 disabled:opacity-50"
      >
        {isDeleting ? "削除中..." : "削除"}
      </button>
    </div>
  );
}

/* ── メインコンポーネント ─────────────────────────── */
export default function TripDetailPage({
  trip,
  initialNotes,
  initialItineraries,
  initialAccommodations,
  initialMembers,
  initialExpenses,
}: Props) {
  const [activeTab, setActiveTab] = useState<"itinerary" | "notes" | "expenses" | "members">("itinerary");
  const [activeDay, setActiveDay] = useState(0);
  const [notes, setNotes] = useState<Note[]>(initialNotes);
  const [itineraries, setItineraries] = useState<Itinerary[]>(initialItineraries);
  const [accommodations, setAccommodations] = useState<Accommodation[]>(initialAccommodations);
  const [noteType, setNoteType] = useState<"task" | "memo">("task");
  const [newNote, setNewNote] = useState("");
  const [members, setMembers] = useState<Member[]>(initialMembers);
  const [newMemberName, setNewMemberName] = useState("");
  const [expenses, setExpenses] = useState<Expense[]>(initialExpenses);
  const [showExpenseForm, setShowExpense] = useState(false);
  const [showExpenseSummary, setShowExpenseSummary] = useState(false);
  const [selectedItinerary, setSelectedItinerary] = useState<Itinerary | null>(null);
  const [selectedAccommodation, setSelectedAccommodation] = useState<Accommodation | null>(null);
  const [editingItinerary, setEditingItinerary] = useState<Itinerary | null>(null);
  const [editingAccommodation, setEditingAccommodation] = useState<Accommodation | null>(null);
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [showAccommodationForm, setShowAccommodationForm] = useState(false);

  const tabs = [
    { id: "itinerary", label: "旅程",        icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" },
    { id: "notes",     label: "メモ",         icon: "M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" },
    { id: "expenses",  label: "費用",         icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" },
    { id: "members",   label: "メンバー",    icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" },
  ] as const;

  const getDays = () => {
    const days = [];
    const start = new Date(trip.startDate as string);
    const end = new Date(trip.endDate as string);
    for (let i = 0; i <= (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24); i++) {
      days.push(new Date(start.getTime() + i * 24 * 60 * 60 * 1000));
    }
    return days;
  };

  const days = getDays();
  const dateStr = `${days[activeDay].getFullYear()}-${String(days[activeDay].getMonth() + 1).padStart(2, "0")}-${String(days[activeDay].getDate()).padStart(2, "0")}`;
  const currentDayItineraries = itineraries.filter((item) => item.date === dateStr);

  const todayAccommodations = accommodations.filter((acc) => {
    const checkIn = new Date(acc.checkIn);
    const checkOut = new Date(acc.checkOut);
    const today = new Date(dateStr);
    return checkIn <= today && today < checkOut;
  });
  const hasAccommodationToday = todayAccommodations.length > 0;

  const addNote = () => {
    if (!newNote.trim()) return;
    const newNoteObj: Note = { id: crypto.randomUUID(), text: newNote, type: noteType, completed: false };
    setNotes([...notes, newNoteObj]);
    setNewNote("");
    addNoteAction(trip.id, newNote, newNoteObj.type);
  };

  const deleteNote = (id: string) => {
    setNotes(notes.filter((note) => note.id !== id));
    deleteNoteAction(id, trip.id as string);
  };

  const toggleNote = (id: string) => {
    const updatedNotes = notes.map((note) => note.id === id ? { ...note, completed: !note.completed } : note);
    setNotes(updatedNotes);
    const toggledNote = updatedNotes.find((note) => note.id === id);
    if (toggledNote) toggleNoteAction(id, toggledNote.completed, trip.id as string);
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
  const completedTasks = notes.filter((note) => note.type === "task" && note.completed);
  const memos = notes.filter((note) => note.type === "memo");
  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);

  const calculateSettlements = () => {
    const balanceMap: Record<string, number> = {};
    members.forEach((m) => { balanceMap[m.id] = 0; });
    expenses.forEach((expense) => {
      const participants = expense.splitMemberIds?.length ? expense.splitMemberIds : [expense.paidByMemberId];
      if (!participants.length) return;
      const share = expense.amount / participants.length;
      balanceMap[expense.paidByMemberId] = (balanceMap[expense.paidByMemberId] ?? 0) + expense.amount;
      participants.forEach((memberId) => { balanceMap[memberId] = (balanceMap[memberId] ?? 0) - share; });
    });
    const creditors = Object.entries(balanceMap).filter(([, b]) => b > 0.5).map(([id, b]) => ({ memberId: id, amount: b })).sort((a, b) => b.amount - a.amount);
    const debtors = Object.entries(balanceMap).filter(([, b]) => b < -0.5).map(([id, b]) => ({ memberId: id, amount: Math.abs(b) })).sort((a, b) => b.amount - a.amount);
    const settlements: { from: string; to: string; amount: number }[] = [];
    let i = 0, j = 0;
    while (i < debtors.length && j < creditors.length) {
      const debtor = debtors[i], creditor = creditors[j];
      const rawAmount = Math.min(debtor.amount, creditor.amount);
      const amount = Math.round(rawAmount);
      if (amount > 0) settlements.push({ from: debtor.memberId, to: creditor.memberId, amount });
      debtor.amount -= rawAmount; creditor.amount -= rawAmount;
      if (debtor.amount < 0.5) i++;
      if (creditor.amount < 0.5) j++;
    }
    return settlements;
  };

  const settlements = calculateSettlements();

  const handleDeleteItinerary = async (id: string) => {
    const ok = window.confirm("この旅程を削除しますか？");
    if (!ok) return;
    try { setIsDeleting(true); await deleteItineraryAction(id, trip.id as string); setItineraries((prev) => prev.filter((item) => item.id !== id)); setSelectedItinerary(null); }
    catch { alert("削除に失敗しました。"); }
    finally { setIsDeleting(false); }
  };

  const handleDeleteAccommodation = async (id: string) => {
    const ok = window.confirm("この宿泊施設を削除しますか？");
    if (!ok) return;
    try { setIsDeleting(true); await deleteAccommodationAction(id, trip.id as string); setAccommodations((prev) => prev.filter((item) => item.id !== id)); setSelectedAccommodation(null); }
    catch { alert("削除に失敗しました。"); }
    finally { setIsDeleting(false); }
  };

  const handleDeleteExpense = async (id: string) => {
    const ok = window.confirm("この費用を削除しますか？");
    if (!ok) return;
    try { setIsDeleting(true); await deleteExpenseAction(id, trip.id as string); setExpenses((prev) => prev.filter((item) => item.id !== id)); setSelectedExpense(null); }
    catch { alert("削除に失敗しました。"); }
    finally { setIsDeleting(false); }
  };

  /* ── アバターカラー ── */
  const AVATAR_COLORS = ["#2d3061","#00a896","#c9a84c","#6366f1","#ec4899","#f97316"];
  const getAvatarColor = (name: string) => AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length];

  return (
    <>
      {/* タブバー */}
      <div className="sticky top-14 z-30 bg-background/95 backdrop-blur-sm border-b border-surface-sub">
        <div className="flex max-w-lg mx-auto px-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex flex-col items-center gap-1 py-3 text-[11px] font-medium transition-all duration-200 relative
                ${activeTab === tab.id ? "text-navy-light" : "text-ink-muted"}`}
            >
              {activeTab === tab.id && (
                <span className="absolute bottom-0 left-1/4 right-1/4 h-0.5 rounded-full gradient-gold" />
              )}
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={tab.icon} />
              </svg>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 pt-4 max-w-lg mx-auto">

        {/* ── 旅程タブ ─────────────────────────────── */}
        {activeTab === "itinerary" && (
          <div>
            {/* 日付セレクター */}
            <div className="flex gap-2 mb-4 overflow-x-auto no-scrollbar pb-1">
              {days.map((day, index) => {
                const isActive = activeDay === index;
                return (
                  <button
                    key={index}
                    onClick={() => setActiveDay(index)}
                    className={`flex flex-col items-center px-4 py-2.5 rounded-xl whitespace-nowrap font-medium transition-all duration-200 shrink-0
                      ${isActive ? "gradient-gold text-navy-dark shadow-md" : "bg-surface text-ink-muted card-shadow"}`}
                  >
                    <span className="text-[10px] opacity-70">
                      {day.toLocaleDateString("ja-JP", { weekday: "short" })}
                    </span>
                    <span className="text-base font-bold leading-tight">{day.getDate()}</span>
                    <span className="text-[10px]">DAY {index + 1}</span>
                  </button>
                );
              })}
            </div>

            {/* アクションボタン */}
            <div className="flex gap-2 mb-4">
              <button
                onClick={() => setShowForm(true)}
                className="flex-1 flex items-center justify-center gap-1.5 bg-navy-light text-white py-2.5 rounded-xl text-sm font-medium active:scale-95 transition-transform duration-150"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                旅程追加
              </button>
              {!hasAccommodationToday && (
                <button
                  onClick={() => setShowAccommodationForm(true)}
                  className="flex-1 flex items-center justify-center gap-1.5 bg-gold/15 text-gold py-2.5 rounded-xl text-sm font-medium active:scale-95 transition-transform duration-150"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  ホテル追加
                </button>
              )}
            </div>

            {/* 旅程リスト */}
            <div className="space-y-2">
              {currentDayItineraries.length === 0 && !hasAccommodationToday && (
                <div className="bg-surface rounded-2xl card-shadow p-8 text-center">
                  <div className="w-12 h-12 rounded-full bg-surface-sub flex items-center justify-center mx-auto mb-3">
                    <svg className="w-6 h-6 text-ink-subtle" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <p className="text-sm text-ink-muted">この日の旅程はまだありません</p>
                </div>
              )}

              {currentDayItineraries.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setSelectedItinerary(item)}
                  className="w-full text-left bg-surface rounded-2xl card-shadow p-4 active:scale-[0.98] transition-all duration-150"
                >
                  <div className="flex gap-3 items-start">
                    <div className="flex flex-col items-center gap-1 shrink-0 pt-0.5">
                      <div className="w-2 h-2 rounded-full bg-gold" />
                      <div className="w-px flex-1 bg-gold/20 min-h-[16px]" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-mono text-gold font-semibold">
                          {item.startTime}{item.endTime ? ` - ${item.endTime}` : ""}
                        </span>
                      </div>
                      <p className="text-sm font-semibold text-foreground">{item.title}</p>
                      {item.memo && <p className="text-xs text-ink-muted mt-1 line-clamp-1">{item.memo}</p>}
                    </div>
                    <svg className="w-4 h-4 text-ink-subtle shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </button>
              ))}

              {/* 宿泊施設 */}
              {accommodations.filter((acc) => acc.checkIn === dateStr).map((acc) => (
                <button
                  key={acc.id}
                  type="button"
                  onClick={() => setSelectedAccommodation(acc)}
                  className="w-full text-left bg-gold/8 border border-gold/20 rounded-2xl p-4 active:scale-[0.98] transition-all duration-150"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-gold/15 flex items-center justify-center shrink-0">
                      <svg className="w-5 h-5 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                          d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gold font-medium mb-0.5">宿泊施設</p>
                      <p className="text-sm font-semibold text-foreground truncate">{acc.name}</p>
                      {acc.address && <p className="text-xs text-ink-muted truncate">{acc.address}</p>}
                    </div>
                    <svg className="w-4 h-4 text-gold/50 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── メモ・タスクタブ ───────────────────────── */}
        {activeTab === "notes" && (
          <div>
            {/* 入力エリア */}
            <div className="bg-surface rounded-2xl card-shadow p-4 mb-4">
              <div className="flex gap-2 bg-surface-sub rounded-xl p-1 mb-3">
                {(["task", "memo"] as const).map((type) => (
                  <button
                    key={type}
                    onClick={() => setNoteType(type)}
                    className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all duration-200
                      ${noteType === type ? "bg-navy-light text-white shadow-sm" : "text-ink-muted"}`}
                  >
                    {type === "task" ? "タスク" : "メモ"}
                  </button>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addNote()}
                  placeholder={noteType === "task" ? "やること..." : "メモを入力..."}
                  className="flex-1 bg-surface-sub border-0 rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-ink-subtle"
                />
                <button
                  onClick={addNote}
                  className="w-10 h-10 gradient-gold rounded-xl flex items-center justify-center active:scale-90 transition-transform shrink-0"
                >
                  <svg className="w-5 h-5 text-navy-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="space-y-5">
              {/* タスク */}
              <div>
                <div className="flex items-center gap-2 mb-2.5">
                  <h2 className="text-sm font-semibold text-foreground">タスク</h2>
                  {tasks.length > 0 && (
                    <span className="text-xs bg-navy-light/10 text-navy-light px-2 py-0.5 rounded-full">{tasks.length}</span>
                  )}
                </div>
                {tasks.length === 0 ? (
                  <p className="text-sm text-ink-subtle text-center py-4">タスクなし</p>
                ) : (
                  <div className="space-y-2">
                    {tasks.map((note) => (
                      <div key={note.id} className="bg-surface rounded-xl card-shadow flex items-center gap-3 px-4 py-3">
                        <input type="checkbox" checked={note.completed} onChange={() => toggleNote(note.id)} className="shrink-0" />
                        <span className="flex-1 text-sm text-foreground">{note.text}</span>
                        <button onClick={() => deleteNote(note.id)} className="w-7 h-7 rounded-lg bg-red-50 flex items-center justify-center shrink-0">
                          <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {completedTasks.length > 0 && (
                  <div className="mt-3">
                    <p className="text-xs text-ink-subtle mb-2 font-medium">完了済み</p>
                    <div className="space-y-2">
                      {completedTasks.map((note) => (
                        <div key={note.id} className="bg-surface-sub rounded-xl flex items-center gap-3 px-4 py-3 opacity-60">
                          <input type="checkbox" checked={note.completed} onChange={() => toggleNote(note.id)} className="shrink-0" />
                          <span className="flex-1 text-sm text-ink-muted line-through">{note.text}</span>
                          <button onClick={() => deleteNote(note.id)} className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0">
                            <svg className="w-4 h-4 text-ink-subtle" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* メモ */}
              <div>
                <div className="flex items-center gap-2 mb-2.5">
                  <h2 className="text-sm font-semibold text-foreground">メモ</h2>
                  {memos.length > 0 && (
                    <span className="text-xs bg-accent-teal/10 text-accent-teal px-2 py-0.5 rounded-full">{memos.length}</span>
                  )}
                </div>
                {memos.length === 0 ? (
                  <p className="text-sm text-ink-subtle text-center py-4">メモなし</p>
                ) : (
                  <div className="space-y-2">
                    {memos.map((note) => (
                      <div key={note.id} className="bg-surface rounded-xl card-shadow flex items-start gap-3 px-4 py-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-accent-teal mt-1.5 shrink-0" />
                        <span className="flex-1 text-sm text-foreground whitespace-pre-wrap">{note.text}</span>
                        <button onClick={() => deleteNote(note.id)} className="w-7 h-7 rounded-lg bg-red-50 flex items-center justify-center shrink-0">
                          <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ── 費用タブ ──────────────────────────────── */}
        {activeTab === "expenses" && (
          <div>
            {/* 合計カード */}
            <div className="gradient-navy rounded-2xl p-5 mb-4 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 opacity-10"
                style={{ background: 'radial-gradient(circle, #c9a84c 0%, transparent 70%)', transform: 'translate(20%, -20%)' }} />
              <p className="text-white/50 text-xs mb-1">合計費用</p>
              <p className="text-3xl font-bold text-white">
                ¥{totalExpenses.toLocaleString()}
              </p>
              <p className="text-white/30 text-xs mt-1">{expenses.length}件の支出</p>
            </div>

            <div className="flex gap-2.5 mb-4">
              <button
                onClick={() => setShowExpense(true)}
                className="flex-1 flex items-center justify-center gap-1.5 gradient-gold text-navy-dark py-3 rounded-xl text-sm font-semibold active:scale-95 transition-transform"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                費用追加
              </button>
              <button
                onClick={() => setShowExpenseSummary(true)}
                className="flex-1 flex items-center justify-center gap-1.5 bg-surface border border-surface-sub text-foreground py-3 rounded-xl text-sm font-medium card-shadow active:scale-95 transition-transform"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                精算確認
              </button>
            </div>

            {expenses.length === 0 ? (
              <div className="bg-surface rounded-2xl card-shadow p-8 text-center">
                <div className="w-12 h-12 rounded-full bg-surface-sub flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-ink-subtle" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-sm text-ink-muted">費用の記録はありません</p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {expenses.map((expense) => (
                  <button
                    key={expense.id}
                    type="button"
                    onClick={() => setSelectedExpense(expense)}
                    className="w-full text-left bg-surface rounded-2xl card-shadow p-4 active:scale-[0.98] transition-all duration-150"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm text-foreground truncate">{expense.title}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-ink-muted">
                            {new Date(expense.date).toLocaleDateString("ja-JP", { month: "numeric", day: "numeric" })}
                          </span>
                          <span className="text-xs text-ink-subtle">·</span>
                          <span className="text-xs text-ink-muted">
                            {members.find((m) => m.id === expense.paidByMemberId)?.name ?? "不明"}が支払
                          </span>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="font-bold text-base text-navy-light">
                          {expense.currency === "JPY" ? "¥" : `${expense.currency} `}
                          {expense.amount.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── メンバータブ ──────────────────────────── */}
        {activeTab === "members" && (
          <div>
            <div className="bg-surface rounded-2xl card-shadow p-4 mb-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newMemberName}
                  onChange={(e) => setNewMemberName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addMember()}
                  placeholder="メンバー名を入力..."
                  className="flex-1 bg-surface-sub border-0 rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-ink-subtle"
                />
                <button
                  onClick={addMember}
                  className="w-10 h-10 gradient-gold rounded-xl flex items-center justify-center active:scale-90 transition-transform shrink-0"
                >
                  <svg className="w-5 h-5 text-navy-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                  </svg>
                </button>
              </div>
            </div>

            {members.length === 0 ? (
              <div className="bg-surface rounded-2xl card-shadow p-8 text-center">
                <p className="text-sm text-ink-muted">メンバーが登録されていません</p>
              </div>
            ) : (
              <div className="space-y-2">
                {members.map((member) => {
                  const color = getAvatarColor(member.name);
                  return (
                    <div
                      key={member.id}
                      className="bg-surface rounded-2xl card-shadow flex items-center gap-3 px-4 py-3"
                    >
                      <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0"
                        style={{ background: color }}>
                        {member.name[0]?.toUpperCase()}
                      </div>
                      <span className="flex-1 text-sm font-medium text-foreground">{member.name}</span>
                      <button
                        onClick={() => deleteMember(member.id)}
                        className="w-7 h-7 rounded-lg bg-red-50 flex items-center justify-center shrink-0"
                      >
                        <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        <div className="h-6" />
      </div>

      {/* ── フォーム・モーダル ─────────────────────── */}
      {showForm && (
        <ItineraryForm
          tripId={trip.id as string}
          date={dateStr}
          onClose={() => setShowForm(false)}
          onAdd={(itinerary) => setItineraries([...itineraries, itinerary])}
        />
      )}

      {showAccommodationForm && (
        <AccommodationForm
          tripId={trip.id as string}
          checkIn={dateStr}
          onClose={() => setShowAccommodationForm(false)}
          onAdd={(accommodation) => setAccommodations([...accommodations, accommodation])}
        />
      )}

      {showExpenseForm && (
        <ExpenseForm
          tripId={trip.id as string}
          members={members}
          initialDate={dateStr}
          onClose={() => setShowExpense(false)}
          onAdd={(expense) => setExpenses([...expenses, expense])}
        />
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
            setExpenses((prev) => prev.map((item) => item.id === updatedExpense.id ? updatedExpense : item));
            setSelectedExpense(updatedExpense);
            setEditingExpense(null);
          }}
        />
      )}

      {editingItinerary && (
        <ItineraryForm
          tripId={trip.id as string}
          date={dateStr}
          initialValues={editingItinerary}
          submitLabel="更新"
          onClose={() => setEditingItinerary(null)}
          onAdd={(updatedItinerary) => {
            setItineraries((prev) => prev.map((item) => item.id === updatedItinerary.id ? updatedItinerary : item));
            setSelectedItinerary(updatedItinerary);
            setEditingItinerary(null);
          }}
        />
      )}

      {editingAccommodation && (
        <AccommodationForm
          tripId={trip.id as string}
          checkIn={editingAccommodation.checkIn}
          initialValues={editingAccommodation}
          submitLabel="更新"
          onClose={() => setEditingAccommodation(null)}
          onAdd={(updatedAccommodation) => {
            setAccommodations((prev) => prev.map((item) => item.id === updatedAccommodation.id ? updatedAccommodation : item));
            setSelectedAccommodation(updatedAccommodation);
            setEditingAccommodation(null);
          }}
        />
      )}

      {/* 費用精算 BottomSheet */}
      {showExpenseSummary && (
        <BottomSheet onClose={() => setShowExpenseSummary(false)}>
          <h2 className="text-xl font-bold text-foreground mt-3 mb-5">費用精算</h2>
          {settlements.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-12 h-12 rounded-full bg-accent-teal/10 flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-accent-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-sm text-ink-muted">精算する費用はありません</p>
            </div>
          ) : (
            <div className="space-y-3">
              {settlements.map((settlement, index) => {
                const fromName = members.find((m) => m.id === settlement.from)?.name ?? "不明";
                const toName = members.find((m) => m.id === settlement.to)?.name ?? "不明";
                return (
                  <div key={index} className="bg-surface-sub rounded-2xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 rounded-full gradient-navy flex items-center justify-center text-white text-xs font-bold">{fromName[0]}</div>
                      <svg className="w-4 h-4 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                      <div className="w-8 h-8 rounded-full bg-accent-teal/20 flex items-center justify-center text-accent-teal text-xs font-bold">{toName[0]}</div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-foreground">{fromName} → {toName}</p>
                      </div>
                    </div>
                    <p className="text-2xl font-bold text-navy-light">¥{settlement.amount.toLocaleString()}</p>
                  </div>
                );
              })}
            </div>
          )}
          <button
            onClick={() => setShowExpenseSummary(false)}
            className="w-full mt-6 bg-surface-sub text-foreground py-4 rounded-xl font-medium text-sm active:scale-95 transition-transform"
          >
            閉じる
          </button>
        </BottomSheet>
      )}

      {/* 費用詳細 BottomSheet */}
      {selectedExpense && (() => {
        const expense = selectedExpense;
        return (
          <BottomSheet onClose={() => setSelectedExpense(null)}>
            <p className="text-xs text-ink-muted mt-3 mb-1">費用詳細</p>
            <h2 className="text-xl font-bold text-foreground mb-5">{expense.title}</h2>
            <div className="space-y-2.5">
              <DetailRow label="日付">
                {new Date(expense.date).toLocaleDateString("ja-JP")}
              </DetailRow>
              <DetailRow label="金額">
                <span className="text-lg font-bold text-navy-light">
                  {expense.currency === "JPY" ? "¥" : `${expense.currency} `}
                  {expense.amount.toLocaleString()}
                </span>
              </DetailRow>
              <DetailRow label="支払者">
                {members.find((m) => m.id === expense.paidByMemberId)?.name ?? "不明"}
              </DetailRow>
              <DetailRow label="誰の分">
                {(expense.splitMemberIds?.length ? expense.splitMemberIds : [expense.paidByMemberId])
                  .map((id) => members.find((m) => m.id === id)?.name ?? "不明")
                  .join("、")}
              </DetailRow>
            </div>
            <ActionButtons
              onClose={() => setSelectedExpense(null)}
              onEdit={() => { const target = expense; setSelectedExpense(null); setTimeout(() => setEditingExpense(target), 0); }}
              onDelete={() => handleDeleteExpense(expense.id)}
              isDeleting={isDeleting}
            />
          </BottomSheet>
        );
      })()}

      {/* 旅程詳細 BottomSheet */}
      {selectedItinerary && (
        <BottomSheet onClose={() => setSelectedItinerary(null)}>
          <p className="text-xs text-ink-muted mt-3 mb-1">旅程詳細</p>
          <h2 className="text-xl font-bold text-foreground mb-5">{selectedItinerary.title}</h2>
          <div className="space-y-2.5">
            <DetailRow label="日付">{dateStr}</DetailRow>
            <DetailRow label="時間">
              {selectedItinerary.startTime}{selectedItinerary.endTime ? ` 〜 ${selectedItinerary.endTime}` : ""}
            </DetailRow>
            {selectedItinerary.memo && (
              <DetailRow label="メモ">
                <span className="whitespace-pre-wrap">{selectedItinerary.memo}</span>
              </DetailRow>
            )}
          </div>
          <ActionButtons
            onClose={() => setSelectedItinerary(null)}
            onEdit={() => { setEditingItinerary(selectedItinerary); setSelectedItinerary(null); }}
            onDelete={() => handleDeleteItinerary(selectedItinerary.id)}
            isDeleting={isDeleting}
          />
        </BottomSheet>
      )}

      {/* 宿泊施設詳細 BottomSheet */}
      {selectedAccommodation && (
        <BottomSheet onClose={() => setSelectedAccommodation(null)}>
          <p className="text-xs text-ink-muted mt-3 mb-1">宿泊施設</p>
          <h2 className="text-xl font-bold text-foreground mb-5">{selectedAccommodation.name}</h2>
          <div className="space-y-2.5">
            <DetailRow label="チェックイン">
              {new Date(selectedAccommodation.checkIn).toLocaleDateString("ja-JP")}
            </DetailRow>
            <DetailRow label="チェックアウト">
              {new Date(selectedAccommodation.checkOut).toLocaleDateString("ja-JP")}
            </DetailRow>
            {selectedAccommodation.address && (
              <DetailRow label="住所">
                <span className="whitespace-pre-wrap">{selectedAccommodation.address}</span>
              </DetailRow>
            )}
            {selectedAccommodation.url && (
              <DetailRow label="URL">
                <a href={selectedAccommodation.url} target="_blank" rel="noreferrer"
                  className="text-accent-teal underline break-all text-xs">
                  {selectedAccommodation.url}
                </a>
              </DetailRow>
            )}
            {selectedAccommodation.memo && (
              <DetailRow label="メモ">
                <span className="whitespace-pre-wrap">{selectedAccommodation.memo}</span>
              </DetailRow>
            )}
          </div>
          <ActionButtons
            onClose={() => setSelectedAccommodation(null)}
            onEdit={() => { setEditingAccommodation(selectedAccommodation); setSelectedAccommodation(null); }}
            onDelete={() => handleDeleteAccommodation(selectedAccommodation.id)}
            isDeleting={isDeleting}
          />
        </BottomSheet>
      )}
    </>
  );
}
