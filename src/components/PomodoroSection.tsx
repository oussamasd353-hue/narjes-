import React, { useEffect, useRef, useState } from 'react';
import { Bell, Pause, Play, RotateCcw, Timer } from 'lucide-react';

// ============================================================================
// [إضافة جديدة #7]: مؤقت بومودورو (25 دقيقة تركيز / 5 دقائق راحة) مع تنبيه
// ============================================================================

type PomodoroMode = 'focus' | 'break';

const FOCUS_SECONDS = 25 * 60;
const BREAK_SECONDS = 5 * 60;

/**
 * تشغيل نغمة لطيفة عبر Web Audio API عند انتهاء المؤقت (دون ملفات صوتية خارجية)
 */
function playCompletionChime(): void {
  try {
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const notes = [523.25, 659.25, 783.99]; // C5 - E5 - G5
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = freq;
      const startTime = ctx.currentTime + idx * 0.16;
      gain.gain.setValueAtTime(0.001, startTime);
      gain.gain.exponentialRampToValueAtTime(0.14, startTime + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.45);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(startTime);
      osc.stop(startTime + 0.5);
    });
  } catch {
    // تجاهل أخطاء الصوت في المتصفحات المقيدة
  }
}

export const PomodoroSection: React.FC = () => {
  const [mode, setMode] = useState<PomodoroMode>('focus');
  const [secondsLeft, setSecondsLeft] = useState<number>(FOCUS_SECONDS);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [completionMessage, setCompletionMessage] = useState<string | null>(null);
  const intervalRef = useRef<number | null>(null);

  const totalForMode = mode === 'focus' ? FOCUS_SECONDS : BREAK_SECONDS;

  useEffect(() => {
    if (!isRunning) {
      if (intervalRef.current !== null) {
        window.clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    intervalRef.current = window.setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          setIsRunning(false);
          playCompletionChime();
          const msg =
            mode === 'focus'
              ? 'انتهت جلسة التركيز (25 دقيقة)! حان وقت استراحة قصيرة.'
              : 'انتهت فترة الراحة (5 دقائق)! هل أنتِ مستعدة لجلسة تركيز جديدة؟';
          setCompletionMessage(msg);

          if (
            typeof Notification !== 'undefined' &&
            Notification.permission === 'granted'
          ) {
            try {
              new Notification('يومياتي · بومودورو', { body: msg });
            } catch {
              // Ignore notification error
            }
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (intervalRef.current !== null) {
        window.clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isRunning, mode]);

  const switchMode = (nextMode: PomodoroMode) => {
    setIsRunning(false);
    setCompletionMessage(null);
    setMode(nextMode);
    setSecondsLeft(nextMode === 'focus' ? FOCUS_SECONDS : BREAK_SECONDS);
  };

  const handleStartPause = () => {
    setCompletionMessage(null);
    if (
      !isRunning &&
      typeof Notification !== 'undefined' &&
      Notification.permission === 'default'
    ) {
      Notification.requestPermission().catch(() => {});
    }
    if (secondsLeft === 0) {
      setSecondsLeft(totalForMode);
    }
    setIsRunning((prev) => !prev);
  };

  const handleReset = () => {
    setIsRunning(false);
    setCompletionMessage(null);
    setSecondsLeft(totalForMode);
  };

  const minutes = String(Math.floor(secondsLeft / 60)).padStart(2, '0');
  const seconds = String(secondsLeft % 60).padStart(2, '0');
  const progressPercent = Math.round(((totalForMode - secondsLeft) / totalForMode) * 100);

  return (
    <section
      aria-labelledby="pomodoro-heading"
      className="flex flex-col rounded-3xl border border-violet-200/75 bg-white p-5 sm:p-6 shadow-sm dark:border-violet-800/50 dark:bg-[#211A2D]"
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Timer className="h-5 w-5 text-violet-600 dark:text-violet-400" aria-hidden="true" />
          <h2
            id="pomodoro-heading"
            className="text-xl font-bold text-[#342547] dark:text-[#F5EFFB]"
          >
            مؤقت بومودورو
          </h2>
        </div>

        {/* تبديل بين التركيز (25د) والراحة (5د) */}
        <div
          role="tablist"
          aria-label="وضع المؤقت"
          className="inline-flex items-center gap-1 rounded-xl bg-violet-50 p-1 dark:bg-[#1A1425]"
        >
          <button
            type="button"
            role="tab"
            aria-selected={mode === 'focus'}
            onClick={() => switchMode('focus')}
            className={`min-h-[36px] rounded-lg px-3 py-1 text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
              mode === 'focus'
                ? 'bg-white text-violet-900 shadow-xs dark:bg-violet-800/70 dark:text-violet-50'
                : 'text-[#6B5A84] hover:text-violet-900 dark:text-violet-300/75'
            }`}
          >
            تركيز 25د
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={mode === 'break'}
            onClick={() => switchMode('break')}
            className={`min-h-[36px] rounded-lg px-3 py-1 text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
              mode === 'break'
                ? 'bg-white text-violet-900 shadow-xs dark:bg-violet-800/70 dark:text-violet-50'
                : 'text-[#6B5A84] hover:text-violet-900 dark:text-violet-300/75'
            }`}
          >
            راحة 5د
          </button>
        </div>
      </div>

      {/* عرض الوقت */}
      <div className="mt-6 flex flex-col items-center rounded-2xl border border-violet-100 bg-[#FAF6FD] px-4 py-7 dark:border-violet-800/40 dark:bg-[#1A1425]">
        <span className="text-xs font-medium text-[#6E5C8A] dark:text-violet-300/80">
          {mode === 'focus' ? 'وقت العمل والتركيز' : 'استراحة قصيرة مريحة'}
        </span>

        <div
          dir="ltr"
          className="mt-2 text-5xl sm:text-6xl font-bold tracking-tight text-violet-900 dark:text-violet-100 tabular-nums"
        >
          {minutes}:{seconds}
        </div>

        {/* شريط تقدم الجلسة */}
        <div className="mt-5 h-2 w-full max-w-xs overflow-hidden rounded-full bg-violet-200/70 dark:bg-violet-950">
          <div
            className="h-full rounded-full bg-violet-600 transition-all duration-300 dark:bg-violet-400"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* أزرار التحكم */}
        <div className="mt-6 flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={handleStartPause}
            className="inline-flex min-h-[46px] min-w-[130px] items-center justify-center gap-2 rounded-2xl bg-violet-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:bg-violet-700 active:scale-[0.98]"
          >
            {isRunning ? (
              <>
                <Pause className="h-4 w-4" aria-hidden="true" />
                <span>إيقاف مؤقت</span>
              </>
            ) : (
              <>
                <Play className="h-4 w-4" aria-hidden="true" />
                <span>{secondsLeft === 0 ? 'بدء من جديد' : 'ابدئي'}</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleReset}
            aria-label="إعادة ضبط المؤقت"
            className="inline-flex min-h-[46px] min-w-[46px] items-center justify-center rounded-2xl border border-violet-200 bg-white text-violet-700 transition-colors hover:bg-violet-50 dark:border-violet-800/60 dark:bg-[#211A2D] dark:text-violet-300 dark:hover:bg-violet-900/40"
          >
            <RotateCcw className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* تنبيه انتهاء الوقت */}
      {completionMessage && (
        <div
          role="alert"
          className="mt-4 flex items-center gap-2.5 rounded-2xl border border-violet-300 bg-violet-50 px-4 py-3 text-xs sm:text-sm font-medium text-violet-900 dark:border-violet-700 dark:bg-violet-950/60 dark:text-violet-100"
        >
          <Bell className="h-4 w-4 shrink-0 text-violet-600 dark:text-violet-400" aria-hidden="true" />
          <span>{completionMessage}</span>
        </div>
      )}
    </section>
  );
};
