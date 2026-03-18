'use client';

import { addTripAction } from '@/app/actions/trips';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import DetailHeader from '@/components/DetailHeader';

export default function NewTripPage() {
    const route = useRouter();
    const [formData, setFormData] = useState({
        title: '',
        destination: '',
        startDate: '',
        endDate: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const id = await addTripAction(formData.title, formData.destination, formData.startDate, formData.endDate);
        route.push(`/trips/${id}`);
    };

    return (
        <div className="max-w-lg">
            <DetailHeader title="新しい旅行を追加" />
            
            <form onSubmit={handleSubmit} className="space-y-4 bg-surface rounded-xl shadow-sm p-6 m-3 mt-6">
                <div>
                    <label className="block text-sm font-medium mb-1">タイトル</label>
                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        className="w-full border rounded px-3 py-2"
                        placeholder="旅行のタイトルを入力"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">目的地</label>
                    <input
                        type="text"
                        name="destination"
                        value={formData.destination}
                        onChange={handleChange}
                        className="w-full border rounded px-3 py-2"
                        placeholder="旅行の目的地を入力"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">開始日</label>
                    <input
                        type="date"
                        name="startDate"
                        value={formData.startDate}
                        onChange={handleChange}
                        className="w-full border rounded px-3 py-2"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">終了日</label>
                    <input
                        type="date"
                        name="endDate"
                        value={formData.endDate}
                        onChange={handleChange}
                        className="w-full border rounded px-3 py-2"
                        required
                    />
                </div>

                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white font-medium py-2 rounded hover:bg-blue-600"
                >
                    追加
                </button>
            </form>
        </div>
    );
}