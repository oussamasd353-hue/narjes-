import React from 'react';

// ============================================================================
// [إضافة جديدة]: خلفية قلوب بنفسجية ناعمة وهادئة (Decorative Background Hearts)
// ============================================================================

interface HeartConfig {
  id: string;
  className: string;
  size: number;
  rotate: number;
  variant: 'filled' | 'outline';
}

const HEARTS: readonly HeartConfig[] = [
  { id: 'h1', className: 'top-[8%] right-[5%] opacity-35 dark:opacity-20', size: 28, rotate: 14, variant: 'filled' },
  { id: 'h2', className: 'top-[16%] left-[7%] opacity-30 dark:opacity-15', size: 22, rotate: -18, variant: 'outline' },
  { id: 'h3', className: 'top-[28%] right-[12%] opacity-25 dark:opacity-15', size: 16, rotate: -10, variant: 'filled' },
  { id: 'h4', className: 'top-[36%] left-[4%] opacity-30 dark:opacity-15', size: 32, rotate: 12, variant: 'filled' },
  { id: 'h5', className: 'top-[48%] right-[4%] opacity-25 dark:opacity-15', size: 24, rotate: 20, variant: 'outline' },
  { id: 'h6', className: 'top-[58%] left-[10%] opacity-25 dark:opacity-15', size: 18, rotate: -15, variant: 'filled' },
  { id: 'h7', className: 'top-[70%] right-[9%] opacity-30 dark:opacity-20', size: 30, rotate: -12, variant: 'filled' },
  { id: 'h8', className: 'top-[80%] left-[6%] opacity-30 dark:opacity-15', size: 24, rotate: 16, variant: 'outline' },
  { id: 'h9', className: 'bottom-[6%] right-[18%] opacity-25 dark:opacity-15', size: 20, rotate: 8, variant: 'filled' },
  { id: 'h10', className: 'bottom-[10%] left-[20%] opacity-25 dark:opacity-15', size: 16, rotate: -22, variant: 'filled' },
  { id: 'h11', className: 'top-[11%] left-[26%] hidden sm:block opacity-20 dark:opacity-12', size: 15, rotate: 10, variant: 'outline' },
  { id: 'h12', className: 'top-[62%] right-[22%] hidden lg:block opacity-20 dark:opacity-12', size: 18, rotate: -8, variant: 'filled' },
];

export const RomanticBackground: React.FC = () => {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden select-none"
    >
      {/* هالات لافندر خفيفة جداً تعطي دفئاً للخلفية */}
      <div className="absolute -top-24 right-[-10%] h-72 w-72 rounded-full bg-violet-200/30 blur-3xl dark:bg-violet-800/15" />
      <div className="absolute top-[45%] left-[-12%] h-80 w-80 rounded-full bg-purple-400/15 blur-3xl dark:bg-violet-900/15" />

      {/* قلوب بنفسجية باستيل ناعمة موزعة بهدوء */}
      {HEARTS.map((heart) => (
        <svg
          key={heart.id}
          width={heart.size}
          height={heart.size}
          viewBox="0 0 24 24"
          className={`absolute text-violet-300 dark:text-violet-400 ${heart.className}`}
          style={{ transform: `rotate(${heart.rotate}deg)` }}
          fill={heart.variant === 'filled' ? 'currentColor' : 'none'}
          stroke={heart.variant === 'outline' ? 'currentColor' : 'none'}
          strokeWidth={heart.variant === 'outline' ? 1.8 : 0}
        >
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
      ))}
    </div>
  );
};
