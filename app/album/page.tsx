'use client';

import { useState } from 'react';
// import { Share2, ExternalLink, Calendar } from 'lucide-react';

interface Album {
    id: string;
    title: string;
    description: string;
    iCloudLink: string;
    date: string;
    thumbnail: string;
    itemCount: number;
}

const albums: Album[] = [
    {
        id: '1',
        title: '夏休みの思い出',
        description: '家族との楽しい夏の思い出を共有フォルダに保存',
        iCloudLink: 'https://www.icloud.com/sharedalbum/...',
        date: '2024年8月',
        thumbnail: '🏖️',
        itemCount: 42,
    },
    {
        id: '2',
        title: 'イベント2024',
        description: 'さまざまなイベントの写真をまとめたアルバム',
        iCloudLink: 'https://www.icloud.com/sharedalbum/...',
        date: '2024年7月',
        thumbnail: '🎉',
        itemCount: 28,
    },
    {
        id: '3',
        title: 'トラベル記録',
        description: '世界中の旅の思い出を共有',
        iCloudLink: 'https://www.icloud.com/sharedalbum/...',
        date: '2024年6月',
        thumbnail: '✈️',
        itemCount: 156,
    },
    {
        id: '4',
        title: '日常のスナップ',
        description: '毎日の何気ない瞬間をキャプチャ',
        iCloudLink: 'https://www.icloud.com/sharedalbum/...',
        date: '2024年5月',
        thumbnail: '📸',
        itemCount: 89,
    },
];

export default function AlbumPage() {
    const [hoveredId, setHoveredId] = useState<string | null>(null);

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
            <div className="max-w-6xl mx-auto">
                {/* ヘッダー */}
                <div className="mb-12">
                    <h1 className="text-4xl font-bold text-gray-800 mb-2 flex items-center gap-3">
                        {/* <Share2 className="w-10 h-10 text-indigo-600" /> */}
                        共有アルバム
                    </h1>
                    <p className="text-gray-600 text-lg">
                        iCloud共有フォルダから思い出を一緒に楽しもう
                    </p>
                </div>

                {/* アルバムグリッド */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                    {albums.map((album) => (
                        <div
                            key={album.id}
                            onMouseEnter={() => setHoveredId(album.id)}
                            onMouseLeave={() => setHoveredId(null)}
                            className="group cursor-pointer"
                        >
                            <div className="bg-white rounded-lg shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-2">
                                {/* サムネイル領域 */}
                                <div className="h-48 bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center relative overflow-hidden">
                                    <div className="text-7xl transform transition-transform duration-300 group-hover:scale-110">
                                        {album.thumbnail}
                                    </div>
                                    <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                                </div>

                                {/* コンテンツ領域 */}
                                <div className="p-6">
                                    <h2 className="text-xl font-bold text-gray-800 mb-2">
                                        {album.title}
                                    </h2>
                                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                                        {album.description}
                                    </p>

                                    {/* メタ情報 */}
                                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                                        <div className="flex items-center gap-1">
                                            {/* <Calendar className="w-4 h-4" /> */}
                                            <span>{album.date}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <span>📷 {album.itemCount}個</span>
                                        </div>
                                    </div>

                                    {/* リンクボタン */}
                                    <a
                                        href={album.iCloudLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 w-full justify-center bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200 transform hover:scale-105"
                                    >
                                        {/* <ExternalLink className="w-4 h-4" /> */}
                                        アルバムを開く
                                    </a>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* フッター */}
                <div className="mt-12 text-center">
                    <p className="text-gray-600">
                        新しいアルバムをiCloud共有フォルダで追加してください
                    </p>
                </div>
            </div>
        </div>
    );
}