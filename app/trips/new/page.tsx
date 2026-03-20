'use client';

import { addTripAction } from '@/app/actions/trips';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import DetailHeader from '@/components/DetailHeader';

export const dynamic = 'force-dynamic';

export default function NewTripPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: '',
    destination: '',
    startDate: '',
    endDate: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const id = await addTripAction(formData.title, formData.destination, formData.startDate, formData.endDate);
      router.push(`/trips/${id}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <DetailHeader title="新しい旅行" subtitle="旅行の情報を入力してください" />

      <div className="max-w-lg mx-auto px-4 pt-6 pb-10 animate-fade-in-up">
        {/* ヒーロー */}
        <div className="gradient-hero rounded-2xl p-6 mb-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 opacity-10"
            style={{ background: 'radial-gradient(circle, #c9a84c 0%, transparent 70%)', transform: 'translate(20%, -20%)' }} />
          <div className="w-12 h-12 rounded-2xl gradient-gold flex items-center justify-center mb-3">
            <svg className="w-6 h-6 text-navy-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" />
            </svg>
          </div>
          <h2 className="text-white font-semibold text-lg">旅の計画を始めよう</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="bg-surface rounded-2xl card-shadow p-5 space-y-5">
            {/* タイトル */}
            <div>
              <label className="block text-xs font-semibold text-ink-muted uppercase tracking-wider mb-2">
                旅行タイトル
              </label>
              <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-subtle">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </div>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full bg-surface-sub border border-surface-sub rounded-xl pl-10 pr-4 py-3
                    text-foreground placeholder:text-ink-subtle text-md"
                  placeholder="例: 沖縄家族旅行 2026"
                  required
                />
              </div>
            </div>

            {/* 目的地 */}
            <div>
              <label className="block text-xs font-semibold text-ink-muted uppercase tracking-wider mb-2">
                目的地
              </label>
              <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-subtle">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  name="destination"
                  value={formData.destination}
                  onChange={handleChange}
                  className="w-full bg-surface-sub border border-surface-sub rounded-xl pl-10 pr-4 py-3
                    text-foreground placeholder:text-ink-subtle text-md"
                  placeholder="例: 沖縄県"
                  required
                />
              </div>
            </div>
          </div>

          {/* 日程 */}
          <div className="bg-surface rounded-2xl card-shadow p-5 space-y-4">
            <h3 className="text-xs font-semibold text-ink-muted uppercase tracking-wider">旅行期間</h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-ink-muted mb-2">出発日</label>
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  className="w-full bg-surface-sub border border-surface-sub rounded-xl py-3
                    text-foreground text-md"
                  required
                />
              </div>
              <div>
                <label className="block text-xs text-ink-muted mb-2">帰宅日</label>
                <input
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  className="w-full bg-surface-sub border border-surface-sub rounded-xl py-3
                    text-foreground text-md"
                  required
                />
              </div>
            </div>

            {formData.startDate && formData.endDate && (
              <div className="flex items-center gap-2 bg-gold/8 rounded-xl px-4 py-3 animate-scale-in">
                <svg className="w-4 h-4 text-gold shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm text-gold">
                  {Math.round((new Date(formData.endDate).getTime() - new Date(formData.startDate).getTime()) / (1000 * 60 * 60 * 24))}泊の旅行
                </span>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full gradient-gold text-navy-dark font-bold py-4 rounded-2xl
              active:scale-95 transition-transform duration-150 disabled:opacity-60
              text-base tracking-wide"
            style={{ boxShadow: '0 4px 20px rgba(201, 168, 76, 0.4)' }}
          >
            {isSubmitting ? '作成中...' : '旅行を作成'}
          </button>
        </form>
      </div>
    </div>
  );
}
