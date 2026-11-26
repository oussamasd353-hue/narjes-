import React, { useState } from 'react';
import { Check, Plus, Sparkles, Trash2 } from 'lucide-react';

// ============================================================================
// [إضافة جديدة #1]: متتبع العادات اليومية (Habit Tracker) مع تصفير تلقائي يومي
// ============================================================================

export interface HabitItem {
  id: string;
  name: string;
  completedToday: boolean;
}

export interface HabitState {
  lastResetDate: string; // بصيغة YYYY-MM-DD للتحقق من بدء يوم جديد
  habits: HabitItem[];
}

export const DEFAULT_HABITS: HabitItem[] = [
  { id: 'habit-water', name: 'شرب الماء (8 أكواب)', completedToday: false },
  { id: 'habit-prayer', name: 'الصلوات في وقتها', completedToday: false },
  { id: 'habit-read', name: 'قراءة 15 دقيقة', completedToday: false },
  { id: 'habit-azkar', name: 'أذكار الصباح والمساء', completedToday: false },
];

interface HabitTrackerSectionProps {
  habits: HabitItem[];
  onToggleHabit: (id: string) => void;
  onAddHabit: (name: string) => void;
  onDeleteHabit: (id: string) => void;
}

export const HabitTrackerSection: React.FC<HabitTrackerSectionProps> = ({
  habits,
  onToggleHabit,
  onAddHabit,
  onDeleteHabit,
}) => {
  const [newHabit, setNewHabit] = useState('');

  const completedCount = habits.filter((h) => h.completedToday).length;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newHabit.trim();
    if (!trimmed) return;
    onAddHabit(trimmed);
    setNewHabit('');
  };

  return (
    <section
      aria-labelledby="habits-heading"
      className="flex flex-col rounded-3xl border border-violet-200/75 bg-white p-5 sm:p-6 shadow-sm dark:border-violet-800/50 dark:bg-[#211A2D]"
    >
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-violet-600 dark:text-violet-400" aria-hidden="true" />
          <h2
            id="habits-heading"
            className="text-xl font-bold text-[#342547] dark:text-[#F5EFFB]"
          >
            عاداتي اليومية
          </h2>
        </div>

        <span className="text-xs text-[#73618E] dark:text-violet-300/75 tabular-nums">
          {completedCount} من {habits.length} اليوم
        </span>
      </div>

      <p className="mt-1 text-xs text-[#7A6894] dark:text-violet-300/70">
        تُعاد تهيئة المربعات تلقائياً مع بداية كل يوم جديد.
      </p>

      {/* نموذج إضافة عادة جديدة */}
      <form onSubmit={handleSubmit} className="mt-4 flex items-center gap-2">
        <label htmlFor="new-habit-input" className="sr-only">
          أضيفي عادة يومية جديدة
        </label>
        <input
          id="new-habit-input"
          type="text"
          value={newHabit}
          onChange={(e) => setNewHabit(e.target.value)}
          placeholder="أضيفي عادة جديدة (مثلاً: رياضة خفيفة)..."
          maxLength={60}
          className="min-h-[46px] flex-1 rounded-2xl border border-violet-200 bg-[#FAF6FD] px-4 py-2.5 text-sm text-[#342547] placeholder:text-[#9684B0] transition-colors focus:border-violet-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/20 dark:border-violet-800/70 dark:bg-[#1A1425] dark:text-violet-50 dark:placeholder:text-violet-400/50 dark:focus:border-violet-400"
        />
        <button
          type="submit"
          disabled={!newHabit.trim()}
          className="inline-flex min-h-[46px] items-center justify-center gap-1.5 rounded-2xl bg-violet-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:bg-violet-700 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-45 whitespace-nowrap shrink-0"
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          <span>إضافة</span>
        </button>
      </form>

      {/* قائمة مربعات العادات */}
      {habits.length === 0 ? (
        <div className="mt-5 rounded-2xl border border-dashed border-violet-200/80 bg-[#FAF6FD]/60 px-4 py-8 text-center text-sm text-[#6E5C8A] dark:border-violet-800/50 dark:bg-[#1B1426]/60 dark:text-violet-300/75">
          لا توجد عادات مضافة حالياً — أضيفي عادتكِ الأولى أعلاه.
        </div>
      ) : (
        <ul className="mt-4 divide-y divide-violet-100 dark:divide-violet-800/40">
          {habits.map((habit) => (
            <li key={habit.id} className="group flex items-center gap-2 py-2">
              <button
                type="button"
                onClick={() => onToggleHabit(habit.id)}
                aria-pressed={habit.completedToday}
                aria-label={
                  habit.completedToday
                    ? `إلغاء تحديد عادة: ${habit.name}`
                    : `تحديد عادة: ${habit.name}`
                }
                className="flex min-h-[44px] flex-1 items-center gap-3 rounded-xl px-1 text-right transition-colors hover:bg-violet-50/70 dark:hover:bg-violet-900/25"
              >
                <span
                  className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border-2 transition-all duration-150 ${
                    habit.completedToday
                      ? 'border-violet-600 bg-violet-600 text-white dark:border-violet-500 dark:bg-violet-500'
                      : 'border-violet-300 bg-white group-hover:border-violet-500 dark:border-violet-700 dark:bg-[#1A1425]'
                  }`}
                >
                  {habit.completedToday && (
                    <Check className="h-3.5 w-3.5 stroke-[3]" aria-hidden="true" />
                  )}
                </span>
                <span
                  className={`text-sm sm:text-base transition-colors ${
                    habit.completedToday
                      ? 'font-medium text-violet-800 dark:text-violet-200'
                      : 'text-[#342547] dark:text-[#F5EFFB]'
                  }`}
                >
                  {habit.name}
                </span>
              </button>

              <button
                type="button"
                onClick={() => onDeleteHabit(habit.id)}
                aria-label={`حذف عادة: ${habit.name}`}
                className="flex min-h-[44px] min-w-[44px] shrink-0 items-center justify-center rounded-xl text-[#9887B0] transition-colors hover:bg-rose-50 hover:text-rose-600 dark:text-violet-400/60 dark:hover:bg-rose-950/40 dark:hover:text-rose-400"
              >
                <Trash2 className="h-4 w-4" aria-hidden="true" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};
