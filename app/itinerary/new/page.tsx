'use client';

import { useState } from 'react';

export default function NewItineraryPage() {
    const [formData, setFormData] = useState({
        title: '',
        date: '',
        startTime: '',
        endTime: '',
        notes: '',
        cost: '',
        currency: 'JPY',
        paidBy: '',
        splitWith: '',
        location: '',
    });
    const [attachment, setAttachment] = useState<File | null>(null);

    const handleInputChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setAttachment(e.target.files[0]);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Form submitted:', { ...formData, attachment });
    };

    return (
        <div className="max-w-2xl mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6">新しい旅程を追加</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-1">タイトル</label>
                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        className="w-full border rounded px-3 py-2"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">日付</label>
                    <input
                        type="date"
                        name="date"
                        value={formData.date}
                        onChange={handleInputChange}
                        className="w-full border rounded px-3 py-2"
                        required
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">開始時刻</label>
                        <input
                            type="time"
                            name="startTime"
                            value={formData.startTime}
                            onChange={handleInputChange}
                            className="w-full border rounded px-3 py-2"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">終了時刻</label>
                        <input
                            type="time"
                            name="endTime"
                            value={formData.endTime}
                            onChange={handleInputChange}
                            className="w-full border rounded px-3 py-2"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">位置情報</label>
                    <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleInputChange}
                        className="w-full border rounded px-3 py-2"
                        placeholder="住所または座標"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">メモ</label>
                    <textarea
                        name="notes"
                        value={formData.notes}
                        onChange={handleInputChange}
                        className="w-full border rounded px-3 py-2"
                        rows={3}
                    />
                </div>

                <div className="grid grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">費用</label>
                        <input
                            type="number"
                            name="cost"
                            value={formData.cost}
                            onChange={handleInputChange}
                            className="w-full border rounded px-3 py-2"
                            step="0.01"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">通貨</label>
                        <select
                            name="currency"
                            value={formData.currency}
                            onChange={handleInputChange}
                            className="w-full border rounded px-3 py-2"
                        >
                            <option value="JPY">JPY</option>
                            <option value="USD">USD</option>
                            <option value="EUR">EUR</option>
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">支払った人</label>
                        <input
                            type="text"
                            name="paidBy"
                            value={formData.paidBy}
                            onChange={handleInputChange}
                            className="w-full border rounded px-3 py-2"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">割り勘する人</label>
                        <input
                            type="text"
                            name="splitWith"
                            value={formData.splitWith}
                            onChange={handleInputChange}
                            className="w-full border rounded px-3 py-2"
                            placeholder="カンマ区切りで入力"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">添付ファイル</label>
                    <input
                        type="file"
                        onChange={handleFileChange}
                        className="w-full border rounded px-3 py-2"
                    />
                </div>

                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 rounded font-medium hover:bg-blue-700"
                >
                    保存
                </button>
            </form>
        </div>
    );
}