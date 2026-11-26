import React from 'react';
import { BarChart3 } from 'lucide-react';
import { getLast7Days, getLocalDateKey } from '../utils/dateUtils';

// ============================================================================
// [إضافة جديدة #6]: متتبع المزاج (Mood Tracker) + رسم بياني لآخر 7 أيام
// ============================================================================

export type MoodHistory = Record<string, number>; // المفتاح YYYY-MM-DD والقيمة من 1 إلى 5

interface MoodOption {
  score: number;
  emoji: string;
  label: string;
}

const MOOD_OPTIONS: readonly MoodOption[] = [
  { score: 5, emoji: '😄', label: 'مبتهجة' },
  { score: 4, emoji: '😊', label: 'هادئة' },
  { score: 3, emoji: '😐', label: 'عادية' },
  { score: 2, emoji: '😔', label: 'متعبة' },
  { score: 1, emoji: '😢', label: 'حزينة' },
];

interface MoodTrackerSectionProps {
  moodHistory: MoodHistory;
  now: Date;
  onSelectTodayMood: (score: number) => void;
}

export const MoodTrackerSection: React.FC<MoodTrackerSectionProps> = ({
  moodHistory,
  now,
  onSelectTodayMood,
}) => {
  const todayKey = getLocalDateKey(now);
  const todayScore = moodHistory[todayKey] ?? null;
  const last7Days = getLast7Days(now);

  const getOptionByScore = (score: number | undefined): MoodOption | undefined =>
    MOOD_OPTIONS.find((m) => m.score === score);

  const selectedOption = todayScore ? getOptionByScore(todayScore) : undefined;

  return (
    <section
      aria-labelledby="mood-heading"
      className="flex flex-col rounded-3xl border border-violet-200/75 bg-white p-5 sm:p-6 shadow-sm dark:border-violet-800/50 dark:bg-[#211A2D]"
    >
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <div className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-violet-600 dark:text-violet-400" aria-hidden="true" />
          <h2
            id="mood-heading"
            className="text-xl font-bold text-[#342547] dark:text-[#F5EFFB]"
          >
            مزاجي اليوم
          </h2>
        </div>

        {selectedOption && (
          <span className="text-xs font-medium text-violet-700 dark:text-violet-300">
            حالتكِ اليوم: {selectedOption.label} {selectedOption.emoji}
          </span>
        )}
      </div>

      <p className="mt-1 text-xs text-[#7A6894] dark:text-violet-300/70">
        اختاري الرمز الذي يعبّر عن شعوركِ اليوم لتسجيله في سجل الأسبوع.
      </p>

      {/* أزرار اختيار الإيموجي */}
      <div
        role="group"
        aria-label="اختيار الحالة المزاجية لليوم"
        className="mt-4 grid grid-cols-5 gap-2"
      >
        {MOOD_OPTIONS.map((option) => {
          const isSelected = todayScore === option.score;
          return (
            <button
              key={option.score}
              type="button"
              onClick={() => onSelectTodayMood(option.score)}
              aria-pressed={isSelected}
              className={`flex min-h-[64px] flex-col items-center justify-center gap-1 rounded-2xl border px-1 py-2 transition-all active:scale-[0.97] ${
                isSelected
                  ? 'border-violet-600 bg-violet-50 shadow-xs ring-2 ring-violet-500/20 dark:border-violet-400 dark:bg-violet-900/40'
                  : 'border-violet-100 bg-[#FAF6FD] hover:border-violet-300 hover:bg-violet-50/70 dark:border-violet-800/50 dark:bg-[#1A1425] dark:hover:border-violet-700'
              }`}
            >
              <span className="text-2xl leading-none" aria-hidden="true">
                {option.emoji}
              </span>
              <span
                className={`text-[11px] font-medium ${
                  isSelected
                    ? 'text-violet-900 dark:text-violet-100'
                    : 'text-[#6B5A84] dark:text-violet-300/75'
                }`}
              >
                {option.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* رسم بياني بسيط (Bar Chart) لآخر 7 أيام */}
      <div className="mt-6 rounded-2xl border border-violet-100 bg-[#FAF6FD]/80 p-4 dark:border-violet-800/40 dark:bg-[#1A1425]/80">
        <div className="flex items-center justify-between text-xs text-[#6E5C8A] dark:text-violet-300/80">
          <span className="font-medium">تطور المزاج خلال آخر 7 أيام</span>
          <span className="tabular-nums">1 – 5</span>
        </div>

        <div className="mt-4 grid grid-cols-7 items-end gap-2 h-36">
          {last7Days.map((day) => {
            const score = moodHistory[day.key];
            const option = getOptionByScore(score);
            const heightPercent = score ? (score / 5) * 100 : 10;

            return (
              <div
                key={day.key}
                className="flex h-full flex-col items-center justify-end gap-1.5"
              >
                <span className="text-sm leading-none h-5 flex items-center" aria-hidden="true">
                  {option ? option.emoji : '·'}
                </span>

                <div className="flex w-full flex-1 items-end justify-center px-1">
                  <div
                    title={option ? `${day.shortLabel}: ${option.label}` : `${day.shortLabel}: غير مسجل`}
                    className={`w-full max-w-[28px] rounded-t-xl transition-all duration-300 ${
                      score
                        ? 'bg-gradient-to-t from-violet-600 to-purple-400 dark:from-violet-600 dark:to-violet-400'
                        : 'bg-violet-200/50 dark:bg-violet-900/35'
                    }`}
                    style={{ height: `${heightPercent}%` }}
                  />
                </div>

                <span className="text-[11px] font-medium text-[#6B5A84] dark:text-violet-300/75 whitespace-nowrap">
                  {day.shortLabel}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
