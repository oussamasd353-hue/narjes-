import React from 'react';
import { BellRing, CalendarClock } from 'lucide-react';
import { CountdownEvent } from './CountdownSection';
import { getDaysUntilDate } from '../utils/dateUtils';

// ============================================================================
// [إضافة جديدة #9]: تنبيه تلقائي عند اقتراب مناسبة مهمة (7 أيام أو أقل)
// ============================================================================

interface EventReminderBannerProps {
  events: CountdownEvent[];
  now: Date;
  onOpenCountdownTab: () => void;
}

export const EventReminderBanner: React.FC<EventReminderBannerProps> = ({
  events,
  now,
  onOpenCountdownTab,
}) => {
  // تصفية المناسبات التي تبقى لها 7 أيام أو أقل (من اليوم 0 إلى 7 أيام)
  const upcomingSoon = events
    .map((ev) => ({
      ...ev,
      daysLeft: getDaysUntilDate(ev.date, now),
    }))
    .filter((ev): ev is CountdownEvent & { daysLeft: number } =>
      ev.daysLeft !== null && ev.daysLeft >= 0 && ev.daysLeft <= 7
    )
    .sort((a, b) => a.daysLeft - b.daysLeft);

  if (upcomingSoon.length === 0) {
    return null;
  }

  return (
    <section
      role="status"
      aria-label="تذكير بمناسبة قريبة"
      className="mt-4 rounded-2xl border border-violet-300/80 bg-violet-50/90 px-4 py-3 sm:px-5 dark:border-violet-700/60 dark:bg-violet-950/50"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-start gap-3">
          <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-violet-600 text-white dark:bg-violet-500">
            <BellRing className="h-4 w-4" aria-hidden="true" />
          </span>
          <div className="space-y-1 text-right">
            <p className="text-xs font-bold text-violet-900 dark:text-violet-100">
              تذكير بمناسبة قريبة
            </p>
            <ul className="space-y-0.5 text-xs sm:text-sm text-[#3F2E5C] dark:text-violet-200/90">
              {upcomingSoon.map((ev) => (
                <li key={ev.id} className="tabular-nums">
                  {ev.daysLeft === 0 ? (
                    <span>
                      اليوم هو موعد <strong>{ev.title}</strong>!
                    </span>
                  ) : ev.daysLeft === 1 ? (
                    <span>
                      غداً موعد <strong>{ev.title}</strong> (باقي يوم واحد)
                    </span>
                  ) : (
                    <span>
                      باقي {ev.daysLeft} أيام على <strong>{ev.title}</strong>
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <button
          type="button"
          onClick={onOpenCountdownTab}
          className="inline-flex min-h-[40px] items-center gap-1.5 rounded-xl border border-violet-300 bg-white px-3 py-1.5 text-xs font-medium text-violet-800 transition-colors hover:bg-violet-100/70 dark:border-violet-700 dark:bg-[#211A2D] dark:text-violet-200 dark:hover:bg-violet-900/50 whitespace-nowrap shrink-0"
        >
          <CalendarClock className="h-3.5 w-3.5" aria-hidden="true" />
          <span>عرض العد التنازلي</span>
        </button>
      </div>
    </section>
  );
};
