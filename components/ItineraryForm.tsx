"use client";

import React, { useState } from "react";
import { addItineraryAction, updateItineraryAction } from "@/app/actions/itinerary";
import { Itinerary } from "@/lib/type";

interface Props {
  tripId: string;
  date: string;
  onClose: () => void;
  onAdd: (itinerary: Itinerary) => void;
  initialValues?: Itinerary;
  submitLabel?: string;
}

export default function ItineraryForm({
  tripId,
  date,
  onClose,
  onAdd,
  initialValues,
  submitLabel,
}: Props) {
  const [title, setTitle] = useState(initialValues?.title ?? "");
  const [startTime, setStartTime] = useState(initialValues?.startTime ?? "");
  const [endTime, setEndTime] = useState(initialValues?.endTime ?? "");
  const [memo, setMemo] = useState(initialValues?.memo ?? "");
  const [formDate, setFormDate] = useState(date);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;

    switch (name) {
      case "title":
        setTitle(value);
        break;
      case "date":
        setFormDate(value);
        break;
      case "startTime":
        setStartTime(value);
        break;
      case "endTime":
        setEndTime(value);
        break;
      case "memo":
        setMemo(value);
        break;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (initialValues) {
      const updatedItinerary = await updateItineraryAction(
        initialValues.id,
        tripId,
        formDate,
        title,
        startTime,
        endTime,
        memo,
        initialValues.cost || 0,
        initialValues.costCurrency || "JPY",
      );
      onAdd(updatedItinerary);
    } else {
      const newItinerary = await addItineraryAction(
        tripId,
        formDate,
        title,
        startTime,
        endTime,
        memo,
        0,
        "JPY",
      );
  
      onAdd(newItinerary);
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-40" onClick={onClose}>
      <div
        className="fixed bottom-0 left-0 right-0 z-50 bg-surface rounded-t-2xl p-8 animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        <h1 className="text-3xl font-bold mb-6">新しい旅程を追加</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">タイトル</label>
            <input
              type="text"
              name="title"
              value={title}
              onChange={handleInputChange}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>

          <div className="flex flex-col gap-3">
            <div>
              <label className="block text-sm font-medium mb-1">開始時刻</label>
              <input
                type="time"
                name="startTime"
                value={startTime}
                onChange={handleInputChange}
                className="w-full border rounded py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">終了時刻</label>
              <input
                type="time"
                name="endTime"
                value={endTime}
                onChange={handleInputChange}
                className="w-full border rounded py-2"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">メモ</label>
            <textarea
              name="memo"
              value={memo}
              onChange={handleInputChange}
              className="w-full border rounded px-3 py-2"
              rows={3}
            />
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="w-full bg-gray-200 text-gray-800 py-2 rounded font-medium hover:bg-gray-300"
            >
              キャンセル
            </button>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded font-medium hover:bg-blue-700"
            >
              {submitLabel ?? "保存"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
