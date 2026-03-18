'use client';

import { useState } from 'react';

export default function SettingsPage() {
    const [notifications, setNotifications] = useState(true);
    const [darkMode, setDarkMode] = useState(false);
    const [language, setLanguage] = useState('ja');

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-2xl mx-auto">
                <h1 className="text-3xl font-bold mb-8">設定</h1>

                {/* Notifications Section */}
                <div className="bg-white rounded-lg shadow p-6 mb-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-xl font-semibold">通知</h2>
                            <p className="text-gray-600">アプリからの通知を受け取る</p>
                        </div>
                        <input
                            type="checkbox"
                            checked={notifications}
                            onChange={(e) => setNotifications(e.target.checked)}
                            className="w-6 h-6"
                        />
                    </div>
                </div>

                {/* Dark Mode Section */}
                <div className="bg-white rounded-lg shadow p-6 mb-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-xl font-semibold">ダークモード</h2>
                            <p className="text-gray-600">ダークテーマを使用する</p>
                        </div>
                        <input
                            type="checkbox"
                            checked={darkMode}
                            onChange={(e) => setDarkMode(e.target.checked)}
                            className="w-6 h-6"
                        />
                    </div>
                </div>

                {/* Language Section */}
                <div className="bg-white rounded-lg shadow p-6 mb-6">
                    <label className="block">
                        <h2 className="text-xl font-semibold mb-4">言語</h2>
                        <select
                            value={language}
                            onChange={(e) => setLanguage(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded"
                        >
                            <option value="ja">日本語</option>
                            <option value="en">English</option>
                            <option value="zh">中文</option>
                        </select>
                    </label>
                </div>
            </div>
        </div>
    );
}