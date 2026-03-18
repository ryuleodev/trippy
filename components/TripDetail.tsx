"use client";

import { useState } from "react";
import { Trip, Note, Itinerary } from "@/lib/type";
import {
  addNoteAction,
  toggleNoteAction,
  deleteNoteAction,
} from "@/app/actions/notes";
import ItineraryForm from "./ItineraryForm";

interface Props {
  trip: Trip;
  initialNotes: Note[];
  initialItineraries: Itinerary[];
}

export default function TripDetailPage({
  trip,
  initialNotes,
  initialItineraries,
}: Props) {
  const [activeTab, setActiveTab] = useState<"itinerary" | "notes" | "expenses">(
    "itinerary"
  );
  const [activeDay, setActiveDay] = useState(0);
  const [notes, setNotes] = useState<Note[]>(initialNotes);
  const [itineraries, setItineraries] = useState<Itinerary[]>(initialItineraries);
  const [noteType, setNoteType] = useState<"task" | "memo">("task");
  const [newNote, setNewNote] = useState("");
  const [expenses, _setExpenses] = useState([
    {
      id: "1",
      amount: 15000,
      date: new Date("2024-01-01"),
      paidBy: "太郎",
      forPerson: "太郎",
      currency: "JPY",
      memo: "ホテル1泊目",
    },
    {
      id: "2",
      amount: 8000,
      date: new Date("2024-01-01"),
      paidBy: "太郎",
      forPerson: "花子",
      currency: "JPY",
      memo: "夜食",
    },
    {
      id: "3",
      amount: 3000,
      date: new Date("2024-01-02"),
      paidBy: "花子",
      forPerson: "太郎",
      currency: "JPY",
      memo: "スカイツリーチケット",
    },
  ]);
  const [showForm, setShowForm] = useState(false);

  const tabs = [
    { id: "itinerary", label: "旅程" },
    { id: "notes", label: "メモ・タスク" },
    { id: "expenses", label: "費用" },
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
    days[activeDay].getMonth() + 1
  ).padStart(2, "0")}-${String(days[activeDay].getDate()).padStart(2, "0")}`;

  const currentDayItineraries = itineraries.filter(
    (item) => item.date === dateStr
  );

  const addNote = () => {
    if (!newNote.trim()) return;

    const newNoteObj: Note = {
      id: crypto.randomUUID(),
      text: newNote,
      type: noteType,
      completed: false,
    };

    setNotes([...notes, newNoteObj]);
    setNewNote("");

    addNoteAction(trip.id as string, newNoteObj.text, newNoteObj.type);
  };

  const deleteNote = (id: string) => {
    setNotes(notes.filter((note) => note.id !== id));
    deleteNoteAction(id, trip.id as string);
  };

  const toggleNote = (id: string) => {
    const updatedNotes = notes.map((note) =>
      note.id === id ? { ...note, completed: !note.completed } : note
    );
    setNotes(updatedNotes);

    const toggledNote = updatedNotes.find((note) => note.id === id);
    if (toggledNote) {
      toggleNoteAction(id, toggledNote.completed, trip.id as string);
    }
  };

  const tasks = notes.filter((note) => note.type === "task" && !note.completed);
  const completedTasks = notes.filter(
    (note) => note.type === "task" && note.completed
  );
  const memos = notes.filter((note) => note.type === "memo");
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);

  return (
    <>
      <div className="px-4">
        <div className="p-4">
          <div className="flex gap-2 border-b mb-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 font-medium transition-colors ${
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
                <h2 className="text-xl font-bold">日付 {activeDay + 1}</h2>
                <button
                  onClick={() => setShowForm(true)}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium whitespace-nowrap"
                >
                  旅程追加
                </button>
              </div>

              {currentDayItineraries.map((item) => (
                <div
                  key={item.id}
                  className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex gap-4">
                    <div className="text-blue-600 font-bold whitespace-nowrap">
                      {item.startTime}
                    </div>
                    <div className="text-gray-700">{item.title}</div>
                  </div>
                </div>
              ))}

              {currentDayItineraries.length === 0 && (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-gray-500">
                  この日の旅程はまだ登録されていません
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "notes" && (
          <div>
            <div className="flex gap-2 mb-6">
              <div className="flex gap-2 bg-gray-200 rounded-lg p-1">
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

              <input
                type="text"
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addNote()}
                placeholder="メモやタスクを入力..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <button
                onClick={addNote}
                className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
              >
                追加
              </button>
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
                        <span className="flex-1 text-gray-700">{note.text}</span>
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
                        <span className="flex-1 text-gray-900">{note.text}</span>
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
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <p className="text-gray-600">合計費用</p>
              <p className="text-3xl font-bold text-blue-600">
                ¥{totalExpenses.toLocaleString()}
              </p>
            </div>

            {expenses.length === 0 ? (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-gray-500">
                費用の記録はありません
              </div>
            ) : (
              <div className="space-y-4">
                {expenses.map((expense) => (
                  <div
                    key={expense.id}
                    className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="font-bold text-lg text-gray-800">
                          {expense.currency === "JPY" ? "¥" : expense.currency}
                          {expense.amount.toLocaleString()}
                        </p>
                        <p className="text-sm text-gray-500">
                          {expense.date.toLocaleDateString("ja-JP")}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">支払者:</span>
                        <span className="font-medium text-gray-800">
                          {expense.paidBy}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">対象者:</span>
                        <span className="font-medium text-gray-800">
                          {expense.forPerson}
                        </span>
                      </div>
                      {expense.memo && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">メモ:</span>
                          <span className="text-gray-800">{expense.memo}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {showForm && (
        <ItineraryForm
          tripId={trip.id as string}
          date={dateStr}
          onClose={() => setShowForm(false)}
          onAdd={(itinerary) => {setItineraries([...itineraries, itinerary])}}
        />
      )}
    </>
  );
}