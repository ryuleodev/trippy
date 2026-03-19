"use client";

import React, { useState } from "react";
import { addAccommodationAction } from "@/app/actions/accommodations";
import { Accommodation } from "@/lib/type";

interface Props {
  tripId: string;
  checkIn: string;
  onClose: () => void;
  onAdd: (accommodation: Accommodation) => void;
}

export default function AccommodationForm({ tripId, checkIn, onClose, onAdd }: Props) {
  const [name, setName] = useState("");
  const [checkInDate, setCheckInDate] = useState(checkIn);
  const [checkOutDate, setCheckOutDate] = useState("");
  const [address, setAddress] = useState("");
  const [url, setUrl] = useState("");
  const [memo, setMemo] = useState("");

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;

    switch (name) {
      case "name":
        setName(value);
        break;
      case "checkInDate":
        setCheckInDate(value);
        break;
      case "checkOutDate":
        setCheckOutDate(value);
        break;
      case "address":
        setAddress(value);
        break;
      case "url":
        setUrl(value);
        break;
      case "memo":
        setMemo(value);
        break;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newAccommodation = await addAccommodationAction(
      tripId,
      name,
      checkInDate,
      checkOutDate,
      address,
      url,  
      memo,
    );

    onAdd(newAccommodation);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-40" onClick={onClose}>
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-surface rounded-t-2xl p-8 animate-slide-up" onClick={(e) => e.stopPropagation()}>
        <h1 className="text-3xl font-bold mb-6">新しい旅程を追加</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">宿泊施設名</label>
            <input
              type="text"
              name="name"
              value={name}
              onChange={handleInputChange}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>

          <div className="flex flex-col gap-3">
            <div>
              <label className="block text-sm font-medium mb-1">チェックイン日</label>
              <input
                type="date"
                name="checkInDate"
                value={checkInDate}
                onChange={handleInputChange}
                className="w-full border rounded py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">チェックアウト日</label>
              <input
                type="date"
                name="checkOutDate"
                value={checkOutDate}
                onChange={handleInputChange}
                className="w-full border rounded py-2"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">住所</label>
            <textarea
              name="address"
              value={address}
              onChange={handleInputChange}
              className="w-full border rounded px-3 py-2"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">URL</label>
            <textarea
              name="url"
              value={url}
              onChange={handleInputChange}
              className="w-full border rounded px-3 py-2"
              rows={3}
            />
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
              保存
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
