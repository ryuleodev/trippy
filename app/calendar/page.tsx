'use client';

import { useState } from 'react';

interface TripPeriod {
    start: Date;
    end: Date;
}

interface Trip {
    title: string;
    period: TripPeriod;
    description?: string;
}

interface CalendarPageProps {
    trip?: Trip;
}

export default function CalendarPage({ trip = {
    title: 'サンプル旅行',
    period: {
        start: new Date(2024, 0, 15),
        end: new Date(2024, 0, 22),
    },
    description: '楽しい旅行です',
} }: CalendarPageProps) {
    const [currentDate, setCurrentDate] = useState(new Date(2024, 0, 1));
    const [selectedDay, setSelectedDay] = useState<number | null>(null);

    const getDaysInMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    const getFirstDayOfMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay();

    const isInTripPeriod = (day: number) => {
        const dateToCheck = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
        return dateToCheck >= trip.period.start && dateToCheck <= trip.period.end;
    };

    const previousMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
        setSelectedDay(null);
    };

    const nextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
        setSelectedDay(null);
    };

    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

    const handleDayClick = (day: number) => {
        if (isInTripPeriod(day)) {
            setSelectedDay(day);
        }
    };

    const selectedDate = selectedDay ? new Date(currentDate.getFullYear(), currentDate.getMonth(), selectedDay) : null;

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
            <div className="max-w-2xl mx-auto">
                <div className="bg-white rounded-lg shadow-lg p-6">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                        <button onClick={previousMonth} className="p-2 hover:bg-gray-100 rounded">←</button>
                        <h2 className="text-2xl font-bold">
                            {currentDate.toLocaleDateString('ja-JP', { year: 'numeric', month: 'long' })}
                        </h2>
                        <button onClick={nextMonth} className="p-2 hover:bg-gray-100 rounded">→</button>
                    </div>

                    {/* Weekday Headers */}
                    <div className="grid grid-cols-7 gap-2 mb-2">
                        {['日', '月', '火', '水', '木', '金', '土'].map((day) => (
                            <div key={day} className="text-center font-semibold text-gray-600 py-2">{day}</div>
                        ))}
                    </div>

                    {/* Calendar Grid */}
                    <div className="grid grid-cols-7 gap-2">
                        {Array.from({ length: firstDay }).map((_, i) => (
                            <div key={`empty-${i}`} className="aspect-square" />
                        ))}
                        {days.map((day) => (
                            <div
                                key={day}
                                onClick={() => handleDayClick(day)}
                                className={`aspect-square flex items-center justify-center rounded-lg font-semibold transition-colors cursor-pointer ${
                                    isInTripPeriod(day)
                                        ? selectedDay === day
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-blue-500 text-white hover:bg-blue-600'
                                        : 'bg-gray-50 text-gray-900 hover:bg-gray-100'
                                }`}
                            >
                                {day}
                            </div>
                        ))}
                    </div>

                    {/* Selected Day Card */}
                    {selectedDay && selectedDate && (
                        <div className="mt-8 p-4 bg-blue-50 rounded-lg">
                            <h3 className="font-semibold text-gray-900 mb-2">{trip.title}</h3>
                            <p className="text-sm text-gray-700 mb-2">{selectedDate.toLocaleDateString('ja-JP', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                            {trip.description && <p className="text-sm text-gray-600">{trip.description}</p>}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
