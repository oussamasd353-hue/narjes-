import React, { useState } from 'react';
import { CalendarClock, Plus, Trash2 } from 'lucide-react';
import { getDaysUntilDate } from '../utils/dateUtils';

// ============================================================================
// [إضافة جديدة #4]: عداد تنازلي (Countdown) للمناسبات المهمة
// ============================================================================

export interface CountdownEvent {
  id: string;
  title: string;
  date: string; // بصيغة YYYY-MM-DD
}

interface CountdownSectionProps {
  events: CountdownEvent[];
  now: Date;
  onAddEvent: (title: string, date: string) => void;
  onDeleteEvent: (id: string) => void;
}

export const CountdownSection: React.FC<CountdownSectionProps> = ({
  events,
  now,
  onAddEvent,
  onDeleteEvent,
}) => {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) {
      setError('لطفاً اكتبي اسم المناسبة.');
      return;
    }
    if (!date) {
      setError('لطفاً اختاري تاريخ المناسبة.');
      return;
    }
    onAddEvent(trimmed, date);
    setTitle('');
    setDate('');
    setError('');
  };

  // ترتيب المناسبات بحيث تظهر الأقرب أولاً
  const sortedEvents = [...events].sort((a, b) => a.date.localeCompare(b.date));

  const formatCountdownText = (daysLeft: number | null): string => {
    if (daysLeft === null) return '';
    if (daysLeft === 0) return 'اليوم!';
    if (daysLeft === 1) return 'باقي يوم واحد';
    if (daysLeft === 2) return 'باقي يومان';
    if (daysLeft >= 3 && daysLeft <= 10) return `باقي ${daysLeft} أيام`;
    if (daysLeft > 10) return `باقي ${daysLeft} يوم`;
    const passed = Math.abs(daysLeft);
    return passed === 1 ? 'مضى منذ يوم واحد' : `مضى منذ ${passed} أيام`;
  };

  return (
    <section
      aria-labelledby="countdown-heading"
      className="flex flex-col rounded-3xl border border-violet-200/75 bg-white p-5 sm:p-6 shadow-sm dark:border-violet-800/50 dark:bg-[#211A2D]"
    >
      <div className="flex items-center gap-2">
        <CalendarClock className="h-5 w-5 text-violet-600 dark:text-violet-400" aria-hidden="true" />
        <h2
          id="countdown-heading"
          className="text-xl font-bold text-[#342547] dark:text-[#F5EFFB]"
        >
          العد التنازلي للمناسبات
        </h2>
      </div>

      <p className="mt-1 text-xs text-[#7A6894] dark:text-violet-300/70">
        سجّلي مناسباتكِ ومواعيدكِ المهمة، وسنذكّركِ تلقائياً عندما يقترب موعدها بـ 7 أيام أو أقل.
      </p>

      {/* نموذج إضافة مناسبة */}
      <form onSubmit={handleSubmit} className="mt-4 space-y-2.5" noValidate>
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
          <div className="sm:col-span-7">
            <label htmlFor="countdown-title-input" className="sr-only">
              اسم المناسبة
            </label>
            <input
              id="countdown-title-input"
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (error) setError('');
              }}
              placeholder="اسم المناسبة (مثلاً: امتحان، سفر، عيد ميلاد)..."
              maxLength={70}
              className="min-h-[46px] w-full rounded-2xl border border-violet-200 bg-[#FAF6FD] px-4 py-2.5 text-sm text-[#342547] placeholder:text-[#9684B0] transition-colors focus:border-violet-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/20 dark:border-violet-800/70 dark:bg-[#1A1425] dark:text-violet-50 dark:placeholder:text-violet-400/50 dark:focus:border-violet-400"
            />
          </div>

          <div className="sm:col-span-5">
            <label htmlFor="countdown-date-input" className="sr-only">
              تاريخ المناسبة
            </label>
            <input
              id="countdown-date-input"
              type="date"
              value={date}
              onChange={(e) => {
                setDate(e.target.value);
                if (error) setError('');
              }}
              className="min-h-[46px] w-full rounded-2xl border border-violet-200 bg-[#FAF6FD] px-3 py-2.5 text-sm text-[#342547] transition-colors focus:border-violet-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/20 dark:border-violet-800/70 dark:bg-[#1A1425] dark:text-violet-50 dark:focus:border-violet-400"
            />
          </div>
        </div>

        {error && (
          <p className="text-xs font-medium text-rose-600 dark:text-rose-400" role="alert">
            {error}
          </p>
        )}

        <button
          type="submit"
          className="inline-flex min-h-[44px] w-full items-center justify-center gap-1.5 rounded-2xl bg-violet-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:bg-violet-700 active:scale-[0.99]"
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          <span>إضافة مناسبة</span>
        </button>
      </form>

      {/* قائمة المناسبات */}
      {sortedEvents.length === 0 ? (
        <div className="mt-5 rounded-2xl border border-dashed border-violet-200/80 bg-[#FAF6FD]/60 px-4 py-8 text-center text-sm text-[#6E5C8A] dark:border-violet-800/50 dark:bg-[#1B1426]/60 dark:text-violet-300/75">
          لا توجد مناسبات مسجلة حالياً — أضيفي أول مناسبة لمتابعة الأيام المتبقية.
        </div>
      ) : (
        <ul className="mt-4 divide-y divide-violet-100 dark:divide-violet-800/40">
          {sortedEvents.map((ev) => {
            const daysLeft = getDaysUntilDate(ev.date, now);
            const isSoon = daysLeft !== null && daysLeft >= 0 && daysLeft <= 7;

            return (
              <li key={ev.id} className="flex items-center justify-between gap-3 py-3">
                <div className="min-w-0 flex-1 text-right">
                  <p className="truncate text-sm sm:text-base font-bold text-[#342547] dark:text-[#F5EFFB]">
                    {ev.title}
                  </p>
                  <div className="mt-0.5 flex flex-wrap items-center gap-2 text-xs text-[#73618E] dark:text-violet-300/75 tabular-nums">
                    <span dir="ltr">{ev.date}</span>
                    <span aria-hidden="true">·</span>
                    <span
                      className={
                        isSoon
                          ? 'font-bold text-violet-700 dark:text-violet-300'
                          : ''
                      }
                    >
                      {formatCountdownText(daysLeft)}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onDeleteEvent(ev.id)}
                  aria-label={`حذف مناسبة: ${ev.title}`}
                  className="flex min-h-[44px] min-w-[44px] shrink-0 items-center justify-center rounded-xl text-[#9887B0] transition-colors hover:bg-rose-50 hover:text-rose-600 dark:text-violet-400/60 dark:hover:bg-rose-950/40 dark:hover:text-rose-400"
                >
                  <Trash2 className="h-4 w-4" aria-hidden="true" />
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
};
