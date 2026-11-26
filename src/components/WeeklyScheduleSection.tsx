import React, { useState } from 'react';
import { CalendarDays, Check, Plus, Trash2 } from 'lucide-react';

// ============================================================================
// [إضافة جديدة #2]: جدول الدراسة والمواعيد الأسبوعي (7 أيام)
// ============================================================================

export type DayKey =
  | 'saturday'
  | 'sunday'
  | 'monday'
  | 'tuesday'
  | 'wednesday'
  | 'thursday'
  | 'friday';

export interface ScheduleEntry {
  id: string;
  text: string;
  done: boolean;
}

export type WeeklySchedule = Record<DayKey, ScheduleEntry[]>;

export const EMPTY_WEEKLY_SCHEDULE: WeeklySchedule = {
  saturday: [],
  sunday: [],
  monday: [],
  tuesday: [],
  wednesday: [],
  thursday: [],
  friday: [],
};

const WEEK_DAYS: ReadonlyArray<{ key: DayKey; label: string; short: string }> = [
  { key: 'monday', label: 'الإثنين', short: 'إثنين' },
  { key: 'tuesday', label: 'الثلاثاء', short: 'ثلاثاء' },
  { key: 'wednesday', label: 'الأربعاء', short: 'أربعاء' },
  { key: 'thursday', label: 'الخميس', short: 'خميس' },
  { key: 'friday', label: 'الجمعة', short: 'جمعة' },
  { key: 'saturday', label: 'السبت', short: 'سبت' },
  { key: 'sunday', label: 'الأحد', short: 'أحد' },
];

const JS_DAY_TO_KEY: Record<number, DayKey> = {
  0: 'sunday',
  1: 'monday',
  2: 'tuesday',
  3: 'wednesday',
  4: 'thursday',
  5: 'friday',
  6: 'saturday',
};

interface WeeklyScheduleSectionProps {
  schedule: WeeklySchedule;
  now: Date;
  onAddEntry: (day: DayKey, text: string) => void;
  onToggleEntry: (day: DayKey, id: string) => void;
  onDeleteEntry: (day: DayKey, id: string) => void;
}

export const WeeklyScheduleSection: React.FC<WeeklyScheduleSectionProps> = ({
  schedule,
  now,
  onAddEntry,
  onToggleEntry,
  onDeleteEntry,
}) => {
  const todayKey = JS_DAY_TO_KEY[now.getDay()];
  const [selectedDay, setSelectedDay] = useState<DayKey>(todayKey);
  const [draft, setDraft] = useState('');

  const currentEntries = schedule[selectedDay] || [];
  const selectedDayInfo = WEEK_DAYS.find((d) => d.key === selectedDay) || WEEK_DAYS[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = draft.trim();
    if (!trimmed) return;
    onAddEntry(selectedDay, trimmed);
    setDraft('');
  };

  return (
    <section
      aria-labelledby="schedule-heading"
      className="flex flex-col rounded-3xl border border-violet-200/75 bg-white p-5 sm:p-6 shadow-sm dark:border-violet-800/50 dark:bg-[#211A2D]"
    >
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <div className="flex items-center gap-2">
          <CalendarDays className="h-5 w-5 text-violet-600 dark:text-violet-400" aria-hidden="true" />
          <h2
            id="schedule-heading"
            className="text-xl font-bold text-[#342547] dark:text-[#F5EFFB]"
          >
            جدولي الأسبوعي
          </h2>
        </div>
        <span className="text-xs text-[#73618E] dark:text-violet-300/75">
          {selectedDayInfo.label}
          {selectedDay === todayKey ? ' · اليوم' : ''}
        </span>
      </div>

      {/* أزرار اختيار أيام الأسبوع السبعة */}
      <div
        role="tablist"
        aria-label="أيام الأسبوع"
        className="mt-4 grid grid-cols-7 gap-1 rounded-2xl bg-violet-50 p-1 dark:bg-[#1A1425]"
      >
        {WEEK_DAYS.map((day) => {
          const isSelected = selectedDay === day.key;
          const count = (schedule[day.key] || []).length;
          return (
            <button
              key={day.key}
              type="button"
              role="tab"
              aria-selected={isSelected}
              onClick={() => setSelectedDay(day.key)}
              className={`flex min-h-[44px] flex-col items-center justify-center rounded-xl px-1 py-1.5 text-[11px] sm:text-xs font-medium transition-colors ${
                isSelected
                  ? 'bg-white text-violet-900 shadow-xs dark:bg-violet-800/75 dark:text-violet-50'
                  : 'text-[#6B5A84] hover:text-violet-900 dark:text-violet-300/75 dark:hover:text-violet-100'
              }`}
            >
              <span className="truncate">{day.short}</span>
              <span className="mt-0.5 text-[10px] opacity-70 tabular-nums">
                {count > 0 ? count : '–'}
              </span>
            </button>
          );
        })}
      </div>

      {/* إضافة موعد أو حصة دراسية لليوم المحدد */}
      <form onSubmit={handleSubmit} className="mt-4 flex items-center gap-2">
        <label htmlFor="schedule-entry-input" className="sr-only">
          أضيفي موعداً أو مادة لـ {selectedDayInfo.label}
        </label>
        <input
          id="schedule-entry-input"
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder={`أضيفي موعداً أو دراسة ليوم ${selectedDayInfo.label}...`}
          maxLength={80}
          className="min-h-[46px] flex-1 rounded-2xl border border-violet-200 bg-[#FAF6FD] px-4 py-2.5 text-sm text-[#342547] placeholder:text-[#9684B0] transition-colors focus:border-violet-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/20 dark:border-violet-800/70 dark:bg-[#1A1425] dark:text-violet-50 dark:placeholder:text-violet-400/50 dark:focus:border-violet-400"
        />
        <button
          type="submit"
          disabled={!draft.trim()}
          className="inline-flex min-h-[46px] items-center justify-center gap-1.5 rounded-2xl bg-violet-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:bg-violet-700 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-45 whitespace-nowrap shrink-0"
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          <span>إضافة</span>
        </button>
      </form>

      {/* قائمة مواعيد اليوم المحدد */}
      {currentEntries.length === 0 ? (
        <div className="mt-4 rounded-2xl border border-dashed border-violet-200/80 bg-[#FAF6FD]/60 px-4 py-8 text-center text-sm text-[#6E5C8A] dark:border-violet-800/50 dark:bg-[#1B1426]/60 dark:text-violet-300/75">
          لا توجد مواعيد مسجلة ليوم {selectedDayInfo.label} بعد.
        </div>
      ) : (
        <ul className="mt-4 divide-y divide-violet-100 dark:divide-violet-800/40">
          {currentEntries.map((entry) => (
            <li key={entry.id} className="group flex items-center gap-2 py-2">
              <button
                type="button"
                onClick={() => onToggleEntry(selectedDay, entry.id)}
                aria-pressed={entry.done}
                aria-label={entry.text}
                className="flex min-h-[44px] flex-1 items-center gap-3 rounded-xl px-1 text-right transition-colors hover:bg-violet-50/70 dark:hover:bg-violet-900/25"
              >
                <span
                  className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 transition-colors ${
                    entry.done
                      ? 'border-violet-600 bg-violet-600 text-white dark:border-violet-500 dark:bg-violet-500'
                      : 'border-violet-300 bg-white dark:border-violet-700 dark:bg-[#1A1425]'
                  }`}
                >
                  {entry.done && <Check className="h-3 w-3 stroke-[3]" aria-hidden="true" />}
                </span>
                <span
                  className={`text-sm ${
                    entry.done
                      ? 'line-through text-[#8D7CA8] dark:text-violet-300/45'
                      : 'text-[#342547] dark:text-[#F5EFFB]'
                  }`}
                >
                  {entry.text}
                </span>
              </button>

              <button
                type="button"
                onClick={() => onDeleteEntry(selectedDay, entry.id)}
                aria-label={`حذف: ${entry.text}`}
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
