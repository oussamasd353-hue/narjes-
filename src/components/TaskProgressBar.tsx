import React from 'react';

// ============================================================================
// [إضافة جديدة #8]: شريط تقدم يبين نسبة إنجاز مهام اليوم في الأعلى
// ============================================================================

interface TaskProgressBarProps {
  totalCount: number;
  completedCount: number;
}

export const TaskProgressBar: React.FC<TaskProgressBarProps> = ({
  totalCount,
  completedCount,
}) => {
  const percentage =
    totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <section
      aria-label="نسبة إنجاز مهام اليوم"
      className="mt-5 rounded-2xl border border-violet-200/75 bg-white px-4 py-3.5 sm:px-5 shadow-xs dark:border-violet-800/50 dark:bg-[#211A2D]"
    >
      <div className="flex items-center justify-between gap-3 text-xs sm:text-sm">
        <span className="font-medium text-[#35274D] dark:text-violet-100">
          إنجاز مهام اليوم
        </span>
        <div className="flex items-center gap-2 text-[#6E5C8A] dark:text-violet-300/80 tabular-nums">
          <span>
            {completedCount} من {totalCount}
          </span>
          <span aria-hidden="true">·</span>
          <span className="font-bold text-violet-700 dark:text-violet-300">
            {percentage}%
          </span>
        </div>
      </div>

      <div
        role="progressbar"
        aria-valuenow={percentage}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`نسبة إنجاز المهام ${percentage}%`}
        className="mt-2.5 h-2.5 w-full overflow-hidden rounded-full bg-violet-100 dark:bg-[#1A1425]"
      >
        <div
          className="h-full rounded-full bg-gradient-to-l from-violet-600 to-purple-500 transition-all duration-300 ease-out dark:from-violet-500 dark:to-purple-400"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </section>
  );
};
