"use client";

import { useState } from "react";
import { AlbumLink } from "@/lib/type";
import { Trip } from "@/lib/type";
import { addAlbumLinkAction, deleteAlbumLinkAction } from "@/app/actions/album";

/* ── アルバムカードのアクセントカラー ── */
const CARD_COLORS = [
  { bg: "from-navy-light to-navy-dark", dot: "#c9a84c" },
  { bg: "from-[#00a896] to-[#007a6e]", dot: "#e8c96a" },
  { bg: "from-[#6366f1] to-[#4f46e5]", dot: "#c9a84c" },
  { bg: "from-[#f97316] to-[#ea580c]", dot: "#ffffff" },
];

function getColor(index: number) {
  return CARD_COLORS[index % CARD_COLORS.length];
}

/* ── 新規アルバム追加モーダル ── */
function AddAlbumModal({
  trips,
  onClose,
  onAdd,
}: {
  trips: Trip[];
  onClose: () => void;
  onAdd: (album: AlbumLink) => void;
}) {
  const [tripId, setTripId] = useState(trips[0]?.id ?? "");
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !url.trim() || !tripId) return;
    setIsSubmitting(true);
    try {
      const album = await addAlbumLinkAction(tripId, title.trim(), url.trim());
      onAdd(album);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex flex-col justify-end" onClick={onClose}>
      <div className="absolute inset-0 bg-black/50 animate-fade-in" />
      <div
        className="relative bg-surface rounded-t-3xl animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full bg-ink-subtle/30" />
        </div>
        <div className="px-5 pt-3 pb-12 safe-area-pb">
          <h2 className="text-xl font-bold text-foreground mb-5">アルバムを追加</h2>

          <form onSubmit={handleSubmit} className="space-y-4 mb-4">
            {/* 旅行選択 */}
            <div>
              <label className="block text-xs font-semibold text-ink-muted uppercase tracking-wider mb-2">
                旅行
              </label>
              <select
                value={tripId}
                onChange={(e) => setTripId(e.target.value)}
                className="w-full bg-surface-sub border-0 rounded-xl px-4 py-3 text-sm text-foreground"
                required
              >
                {trips.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.title} ({t.destination})
                  </option>
                ))}
              </select>
            </div>

            {/* タイトル */}
            <div>
              <label className="block text-xs font-semibold text-ink-muted uppercase tracking-wider mb-2">
                アルバム名
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="例: 1日目の写真"
                className="w-full bg-surface-sub border-0 rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-ink-subtle"
                required
              />
            </div>

            {/* iCloud URL */}
            <div>
              <label className="block text-xs font-semibold text-ink-muted uppercase tracking-wider mb-2">
                iCloud 共有リンク
              </label>
              <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-subtle">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                      d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                </div>
                <input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://www.icloud.com/photos/..."
                  className="w-full bg-surface-sub border-0 rounded-xl pl-10 pr-4 py-3 text-sm text-foreground placeholder:text-ink-subtle"
                  required
                />
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 bg-surface-sub text-foreground py-3.5 rounded-xl font-medium text-sm active:scale-95 transition-transform"
              >
                キャンセル
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 gradient-gold text-navy-dark py-3.5 rounded-xl font-bold text-sm active:scale-95 transition-transform disabled:opacity-60"
              >
                {isSubmitting ? "追加中..." : "追加"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

/* ── メイン ── */
export default function AlbumClient({
  initialAlbums,
  trips,
}: {
  initialAlbums: AlbumLink[];
  trips: Trip[];
}) {
  const [albums, setAlbums] = useState<AlbumLink[]>(initialAlbums);
  const [showAddModal, setShowAddModal] = useState(false);

  const handleDelete = async (id: string) => {
    const ok = window.confirm("このアルバムを削除しますか？");
    if (!ok) return;
    await deleteAlbumLinkAction(id);
    setAlbums((prev) => prev.filter((a) => a.id !== id));
  };

  return (
    <>
      {/* ヘッダー */}
      <div className="gradient-hero px-5 pt-14 pb-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 opacity-5 rounded-full"
          style={{ background: 'radial-gradient(circle, #c9a84c 0%, transparent 70%)', transform: 'translate(30%,-30%)' }} />
        <div className="relative max-w-lg mx-auto">
          <p className="text-gold/70 text-xs tracking-widest uppercase font-medium mb-1">Shared Album</p>
          <h1 className="text-4xl font-bold text-white mb-1">アルバム</h1>
          <p className="text-white/40 text-sm">iCloud共有リンクで思い出を</p>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 pt-5">
        {/* 追加ボタン */}
        <button
          onClick={() => setShowAddModal(true)}
          className="w-full mb-6 flex items-center justify-center gap-2 bg-surface rounded-2xl card-shadow py-4 text-sm font-semibold text-navy-light active:scale-[0.98] transition-transform border-2 border-dashed border-navy-light/20"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          アルバムを追加
        </button>

        {/* アルバム一覧 */}
        {albums.length === 0 ? (
          <div className="py-16 flex flex-col items-center gap-4 text-ink-muted animate-fade-in">
            <div className="w-20 h-20 rounded-full bg-surface-sub flex items-center justify-center">
              <svg className="w-10 h-10 text-ink-subtle" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="text-center">
              <p className="font-medium text-foreground mb-1">アルバムがまだありません</p>
              <p className="text-sm text-ink-subtle">iCloud共有リンクを追加しましょう</p>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {albums.map((album, index) => {
              const color = getColor(index);
              return (
                <div
                  key={album.id}
                  className="bg-surface rounded-2xl card-shadow overflow-hidden animate-fade-in-up"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {/* カラーバナー */}
                  <div className={`bg-gradient-to-r ${color.bg} px-5 py-4 flex items-center justify-between`}>
                    <div>
                      <div className="w-8 h-8 rounded-xl bg-white/15 flex items-center justify-center mb-2">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <p className="text-white font-bold text-base">{album.title}</p>
                    </div>
                    <button
                      onClick={() => handleDelete(album.id)}
                      className="w-8 h-8 rounded-full bg-white/15 flex items-center justify-center active:scale-90 transition-transform"
                    >
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>

                  {/* 情報 + リンクボタン */}
                  <div className="px-5 py-4">
                    {(album.tripTitle || album.tripDestination) && (
                      <div className="flex items-center gap-1.5 mb-3">
                        <svg className="w-3.5 h-3.5 text-ink-subtle shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                            d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" />
                        </svg>
                        <span className="text-xs text-ink-muted">
                          {album.tripTitle}{album.tripDestination ? ` · ${album.tripDestination}` : ""}
                        </span>
                      </div>
                    )}

                    <div className="flex items-center gap-2 mb-4">
                      <svg className="w-3.5 h-3.5 text-ink-subtle shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                          d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                      </svg>
                      <p className="text-xs text-ink-subtle truncate">{album.url}</p>
                    </div>

                    <a
                      href={album.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 w-full gradient-gold text-navy-dark font-bold text-sm py-3 rounded-xl active:scale-95 transition-transform"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                      iCloudで開く
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="h-24" />
      </div>

      {/* モーダル */}
      {showAddModal && (
        <AddAlbumModal
          trips={trips}
          onClose={() => setShowAddModal(false)}
          onAdd={(album) => setAlbums((prev) => [album, ...prev])}
        />
      )}
    </>
  );
}
