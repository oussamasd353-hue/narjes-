import React, { useEffect, useState } from 'react';
import {
  BookHeart,
  CalendarClock,
  Check,
  CheckSquare,
  Monitor,
  Moon,
  Pencil,
  Sparkles,
  Sun,
  Timer,
  X,
} from 'lucide-react';

// [الكود الأصلي]: المكونات الأساسية الموجودة مسبقاً
import { NotesSection } from './components/NotesSection';
import { OfflineIndicator } from './components/OfflineIndicator';
import { PWAInstallButton } from './components/PWAInstallButton';
import { TodoItem, TodoSection } from './components/TodoSection';
import { WelcomeScreen } from './components/WelcomeScreen';
import { useTheme } from './hooks/useTheme';

// ============================================================================
// [إضافات جديدة #1 إلى #9]: استيراد المكونات وأدوات التاريخ الجديدة
// ============================================================================
import { CountdownEvent, CountdownSection } from './components/CountdownSection';
import { DailyQuoteBanner } from './components/DailyQuoteBanner';
import { EventReminderBanner } from './components/EventReminderBanner';
import {
  DEFAULT_HABITS,
  HabitState,
  HabitTrackerSection,
} from './components/HabitTrackerSection';
import { MoodHistory, MoodTrackerSection } from './components/MoodTrackerSection';
import { PomodoroSection } from './components/PomodoroSection';
import { RomanticBackground } from './components/RomanticBackground';
import { ShoppingItem, ShoppingListSection } from './components/ShoppingListSection';
import { TaskProgressBar } from './components/TaskProgressBar';
import {
  DayKey,
  EMPTY_WEEKLY_SCHEDULE,
  WeeklySchedule,
  WeeklyScheduleSection,
} from './components/WeeklyScheduleSection';
import { getLocalDateKey } from './utils/dateUtils';

const PHOTO_SRC = '/assets/aistudio/Screenshot_20260831_133529_c87e9c68.jpg';

// [الكود الأصلي + الإضافات الجديدة]: مفاتيح التخزين المحلي في localStorage
const STORAGE_KEYS = {
  // --- مفاتيح الكود الأصلي ---
  name: 'yawmiyati_name',
  tasks: 'yawmiyati_tasks',
  notes: 'yawmiyati_notes',
  notesUpdated: 'yawmiyati_notes_updated',
  dailyGoal: 'yawmiyati_daily_goal',

  // --- مفاتيح الميزات الجديدة ---
  habits: 'yawmiyati_habits', // [إضافة #1] العادات اليومية + تاريخ آخر تصفير
  schedule: 'yawmiyati_schedule', // [إضافة #2] الجدول الأسبوعي (7 أيام)
  shopping: 'yawmiyati_shopping', // [إضافة #3] قائمة التسوق والاحتياجات
  countdowns: 'yawmiyati_countdowns', // [إضافة #4] مناسبات العد التنازلي
  moods: 'yawmiyati_moods', // [إضافة #6] سجل الحالة المزاجية حسب التاريخ
} as const;

// [إضافة جديدة]: تعريف التبويبات لتنظيم الميزات دون ازدحام الصفحة
type AppTab = 'today' | 'habits-mood' | 'focus-schedule' | 'shopping-events';

// ============================================================================
// [الكود الأصلي]: دوال قراءة البيانات الأساسية من localStorage
// ============================================================================
function readStoredDailyGoal(): string {
  try {
    return localStorage.getItem(STORAGE_KEYS.dailyGoal) || '';
  } catch {
    return '';
  }
}

function readStoredName(): string {
  try {
    return localStorage.getItem(STORAGE_KEYS.name) || '';
  } catch {
    return '';
  }
}

function readStoredTasks(): TodoItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.tasks);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function readStoredNotes(): string {
  try {
    return localStorage.getItem(STORAGE_KEYS.notes) || '';
  } catch {
    return '';
  }
}

function readStoredNotesUpdated(): number | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.notesUpdated);
    if (!raw) return null;
    const num = Number(raw);
    return Number.isFinite(num) ? num : null;
  } catch {
    return null;
  }
}

// ============================================================================
// [إضافات جديدة]: دوال قراءة البيانات الجديدة من localStorage
// ============================================================================

/** [إضافة #1]: قراءة العادات مع تصفير تلقائي إذا بدأ يوم جديد */
function readStoredHabits(todayKey: string): HabitState {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.habits);
    if (!raw) {
      return { lastResetDate: todayKey, habits: DEFAULT_HABITS };
    }
    const parsed = JSON.parse(raw) as Partial<HabitState>;
    const habitsList = Array.isArray(parsed.habits) ? parsed.habits : DEFAULT_HABITS;

    // إذا اختلف التاريخ المسجل عن تاريخ اليوم، نعيد تصفير جميع المربعات تلقائياً
    if (parsed.lastResetDate !== todayKey) {
      return {
        lastResetDate: todayKey,
        habits: habitsList.map((h) => ({ ...h, completedToday: false })),
      };
    }

    return { lastResetDate: todayKey, habits: habitsList };
  } catch {
    return { lastResetDate: todayKey, habits: DEFAULT_HABITS };
  }
}

/** [إضافة #2]: قراءة الجدول الأسبوعي */
function readStoredSchedule(): WeeklySchedule {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.schedule);
    if (!raw) return EMPTY_WEEKLY_SCHEDULE;
    const parsed = JSON.parse(raw) as Partial<WeeklySchedule>;
    return { ...EMPTY_WEEKLY_SCHEDULE, ...parsed };
  } catch {
    return EMPTY_WEEKLY_SCHEDULE;
  }
}

/** [إضافة #3]: قراءة قائمة التسوق */
function readStoredShopping(): ShoppingItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.shopping);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

/** [إضافة #4]: قراءة مناسبات العد التنازلي */
function readStoredCountdowns(): CountdownEvent[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.countdowns);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

/** [إضافة #6]: قراءة سجل المزاج اليومي */
function readStoredMoods(): MoodHistory {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.moods);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
}

function generateId(): string {
  return typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random()}`;
}

// ============================================================================
// [الكود الأصلي]: تنسيق التاريخ العربي
// ============================================================================
const ARABIC_WEEKDAYS = [
  'الأحد',
  'الإثنين',
  'الثلاثاء',
  'الأربعاء',
  'الخميس',
  'الجمعة',
  'السبت',
] as const;

const ARABIC_MONTHS = [
  'يناير',
  'فبراير',
  'مارس',
  'أبريل',
  'مايو',
  'يونيو',
  'يوليو',
  'أغسطس',
  'سبتمبر',
  'أكتوبر',
  'نوفمبر',
  'ديسمبر',
] as const;

function formatArabicDate(date: Date): string {
  const weekday = ARABIC_WEEKDAYS[date.getDay()];
  const day = date.getDate();
  const month = ARABIC_MONTHS[date.getMonth()];
  const year = date.getFullYear();
  return `${weekday}، ${day} ${month} ${year}`;
}

export default function App() {
  // --- [الكود الأصلي]: الحالات الأساسية ---
  const { preference, isDark, cycleTheme } = useTheme();
  const [userName, setUserName] = useState<string>(readStoredName);
  const [tasks, setTasks] = useState<TodoItem[]>(readStoredTasks);
  const [dailyGoal, setDailyGoal] = useState<string>(readStoredDailyGoal);
  const [notes, setNotes] = useState<string>(readStoredNotes);
  const [notesUpdatedAt, setNotesUpdatedAt] = useState<number | null>(readStoredNotesUpdated);
  const [now, setNow] = useState<Date>(() => new Date());

  const [isEditingName, setIsEditingName] = useState(false);
  const [nameDraft, setNameDraft] = useState('');
  const [imgError, setImgError] = useState(false);

  // --- [إضافات جديدة]: حالات التبويب والميزات التسع ---
  const [activeTab, setActiveTab] = useState<AppTab>('today');
  const [habitState, setHabitState] = useState<HabitState>(() =>
    readStoredHabits(getLocalDateKey(new Date()))
  );
  const [weeklySchedule, setWeeklySchedule] = useState<WeeklySchedule>(readStoredSchedule);
  const [shoppingItems, setShoppingItems] = useState<ShoppingItem[]>(readStoredShopping);
  const [countdownEvents, setCountdownEvents] = useState<CountdownEvent[]>(readStoredCountdowns);
  const [moodHistory, setMoodHistory] = useState<MoodHistory>(readStoredMoods);

  // [الكود الأصلي]: تحديث الوقت كل دقيقة للتحية والتاريخ
  useEffect(() => {
    const interval = window.setInterval(() => {
      setNow(new Date());
    }, 60_000);
    return () => window.clearInterval(interval);
  }, []);

  // [إضافة جديدة #1]: التحقق التلقائي من تصفير العادات إذا تغيّر اليوم والتطبيق مفتوح
  const todayKey = getLocalDateKey(now);
  useEffect(() => {
    if (habitState.lastResetDate !== todayKey) {
      const resetState: HabitState = {
        lastResetDate: todayKey,
        habits: habitState.habits.map((h) => ({ ...h, completedToday: false })),
      };
      setHabitState(resetState);
      try {
        localStorage.setItem(STORAGE_KEYS.habits, JSON.stringify(resetState));
      } catch {
        // تجاهل أخطاء التخزين
      }
    }
  }, [todayKey, habitState]);

  // ==========================================================================
  // [الكود الأصلي]: دوال إدارة الاسم والمهام والهدف والملاحظات
  // ==========================================================================
  const handleSaveName = (name: string) => {
    const cleaned = name.trim();
    if (!cleaned) return;
    setUserName(cleaned);
    try {
      localStorage.setItem(STORAGE_KEYS.name, cleaned);
    } catch {
      // Ignore storage quota errors
    }
  };

  const persistTasks = (next: TodoItem[]) => {
    setTasks(next);
    try {
      localStorage.setItem(STORAGE_KEYS.tasks, JSON.stringify(next));
    } catch {
      // Ignore storage quota errors
    }
  };

  const handleAddTask = (text: string) => {
    const item: TodoItem = {
      id: generateId(),
      text,
      completed: false,
      createdAt: Date.now(),
    };
    persistTasks([item, ...tasks]);
  };

  const handleToggleTask = (id: string) => {
    persistTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const handleDeleteTask = (id: string) => {
    persistTasks(tasks.filter((task) => task.id !== id));
  };

  const handleClearCompleted = () => {
    persistTasks(tasks.filter((task) => !task.completed));
  };

  const handleChangeDailyGoal = (value: string) => {
    setDailyGoal(value);
    try {
      localStorage.setItem(STORAGE_KEYS.dailyGoal, value);
    } catch {
      // Ignore storage quota errors
    }
  };

  const handleChangeNotes = (value: string) => {
    const timestamp = Date.now();
    setNotes(value);
    setNotesUpdatedAt(timestamp);
    try {
      localStorage.setItem(STORAGE_KEYS.notes, value);
      localStorage.setItem(STORAGE_KEYS.notesUpdated, String(timestamp));
    } catch {
      // Ignore storage quota errors
    }
  };

  const startEditName = () => {
    setNameDraft(userName);
    setIsEditingName(true);
  };

  const submitEditName = (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = nameDraft.trim();
    if (cleaned) {
      handleSaveName(cleaned);
    }
    setIsEditingName(false);
  };

  // ==========================================================================
  // [إضافات جديدة]: دوال حفظ وإدارة الميزات الجديدة في localStorage
  // ==========================================================================

  // [إضافة #1]: إدارة العادات اليومية
  const persistHabits = (next: HabitState) => {
    setHabitState(next);
    try {
      localStorage.setItem(STORAGE_KEYS.habits, JSON.stringify(next));
    } catch {
      // Ignore storage quota errors
    }
  };

  const handleToggleHabit = (id: string) => {
    persistHabits({
      lastResetDate: todayKey,
      habits: habitState.habits.map((h) =>
        h.id === id ? { ...h, completedToday: !h.completedToday } : h
      ),
    });
  };

  const handleAddHabit = (name: string) => {
    persistHabits({
      lastResetDate: todayKey,
      habits: [
        ...habitState.habits,
        { id: generateId(), name, completedToday: false },
      ],
    });
  };

  const handleDeleteHabit = (id: string) => {
    persistHabits({
      lastResetDate: todayKey,
      habits: habitState.habits.filter((h) => h.id !== id),
    });
  };

  // [إضافة #2]: إدارة الجدول الأسبوعي
  const persistSchedule = (next: WeeklySchedule) => {
    setWeeklySchedule(next);
    try {
      localStorage.setItem(STORAGE_KEYS.schedule, JSON.stringify(next));
    } catch {
      // Ignore storage quota errors
    }
  };

  const handleAddScheduleEntry = (day: DayKey, text: string) => {
    const updatedDay = [...(weeklySchedule[day] || []), { id: generateId(), text, done: false }];
    persistSchedule({ ...weeklySchedule, [day]: updatedDay });
  };

  const handleToggleScheduleEntry = (day: DayKey, id: string) => {
    const updatedDay = (weeklySchedule[day] || []).map((entry) =>
      entry.id === id ? { ...entry, done: !entry.done } : entry
    );
    persistSchedule({ ...weeklySchedule, [day]: updatedDay });
  };

  const handleDeleteScheduleEntry = (day: DayKey, id: string) => {
    const updatedDay = (weeklySchedule[day] || []).filter((entry) => entry.id !== id);
    persistSchedule({ ...weeklySchedule, [day]: updatedDay });
  };

  // [إضافة #3]: إدارة قائمة التسوق
  const persistShopping = (next: ShoppingItem[]) => {
    setShoppingItems(next);
    try {
      localStorage.setItem(STORAGE_KEYS.shopping, JSON.stringify(next));
    } catch {
      // Ignore storage quota errors
    }
  };

  const handleAddShoppingItem = (name: string) => {
    persistShopping([{ id: generateId(), name, bought: false }, ...shoppingItems]);
  };

  const handleToggleShoppingItem = (id: string) => {
    persistShopping(
      shoppingItems.map((item) =>
        item.id === id ? { ...item, bought: !item.bought } : item
      )
    );
  };

  const handleDeleteShoppingItem = (id: string) => {
    persistShopping(shoppingItems.filter((item) => item.id !== id));
  };

  const handleClearBoughtShopping = () => {
    persistShopping(shoppingItems.filter((item) => !item.bought));
  };

  // [إضافة #4]: إدارة مناسبات العد التنازلي
  const persistCountdowns = (next: CountdownEvent[]) => {
    setCountdownEvents(next);
    try {
      localStorage.setItem(STORAGE_KEYS.countdowns, JSON.stringify(next));
    } catch {
      // Ignore storage quota errors
    }
  };

  const handleAddCountdown = (title: string, date: string) => {
    persistCountdowns([...countdownEvents, { id: generateId(), title, date }]);
  };

  const handleDeleteCountdown = (id: string) => {
    persistCountdowns(countdownEvents.filter((ev) => ev.id !== id));
  };

  // [إضافة #6]: تسجيل مزاج اليوم
  const handleSelectTodayMood = (score: number) => {
    const nextHistory: MoodHistory = {
      ...moodHistory,
      [todayKey]: score,
    };
    setMoodHistory(nextHistory);
    try {
      localStorage.setItem(STORAGE_KEYS.moods, JSON.stringify(nextHistory));
    } catch {
      // Ignore storage quota errors
    }
  };

  // [الكود الأصلي]: حساب التحية والتاريخ ونسب المهام
  const currentHour = now.getHours();
  const isMorning = currentHour >= 5 && currentHour < 12;
  const greetingText = isMorning ? 'صباح الخير' : 'مساء الخير';
  const formattedDate = formatArabicDate(now);

  const completedTasksCount = tasks.filter((t) => t.completed).length;

  const themeLabel =
    preference === 'auto'
      ? 'الوضع التلقائي حسب النظام'
      : preference === 'dark'
        ? 'الوضع الليلي'
        : 'الوضع النهاري';

  // [الكود الأصلي]: شاشة الترحيب لأول مرة
  if (!userName) {
    return (
      <main className="relative min-h-[100dvh] bg-[#FAF6FD] dark:bg-[#16111E]">
        <RomanticBackground />
        <div className="relative z-10">
          <WelcomeScreen photoSrc={PHOTO_SRC} onSaveName={handleSaveName} />
        </div>
        <OfflineIndicator />
      </main>
    );
  }

  // [إضافة جديدة]: تعريف أزرار التبويبات
  const tabs: ReadonlyArray<{
    id: AppTab;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
  }> = [
    { id: 'today', label: 'اليوم', icon: CheckSquare },
    { id: 'habits-mood', label: 'العادات والمزاج', icon: Sparkles },
    { id: 'focus-schedule', label: 'التركيز والجدول', icon: Timer },
    { id: 'shopping-events', label: 'التسوق والمناسبات', icon: CalendarClock },
  ];

  return (
    <div className="relative min-h-[100dvh] bg-[#FAF6FD] text-[#342547] dark:bg-[#16111E] dark:text-[#F5EFFB]">
      {/* [إضافة جديدة]: خلفية القلوب البنفسجية الهادئة */}
      <RomanticBackground />

      {/* [الكود الأصلي]: الشريط العلوي المدمج */}
      <header className="sticky top-0 z-30 border-b border-violet-200/60 bg-[#FAF6FD]/85 backdrop-blur-md dark:border-violet-900/50 dark:bg-[#16111E]/85">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between gap-4 px-4 sm:px-6">
          <span className="font-display text-xl font-bold text-violet-900 dark:text-violet-200 whitespace-nowrap shrink-0">
            يومياتي
          </span>

          <div className="flex items-center gap-2 shrink-0">
            <PWAInstallButton />
            <button
              type="button"
              onClick={cycleTheme}
              title={themeLabel}
              aria-label={themeLabel}
              className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-xl border border-violet-200/70 bg-white/80 text-violet-700 transition-colors hover:bg-violet-50 dark:border-violet-800/60 dark:bg-[#211A2D] dark:text-violet-300 dark:hover:bg-violet-950/60"
            >
              {preference === 'auto' ? (
                <Monitor className="h-4 w-4" aria-hidden="true" />
              ) : isDark ? (
                <Moon className="h-4 w-4" aria-hidden="true" />
              ) : (
                <Sun className="h-4 w-4" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-5xl px-4 pb-12 pt-6 sm:px-6 sm:pt-8">
        {/* [الكود الأصلي]: العنوان + الصورة + التحية والتاريخ */}
        <section aria-label="الترحيب" className="flex flex-col items-center text-center">
          <h1 className="font-display text-4xl sm:text-5xl font-bold tracking-tight text-violet-900 dark:text-violet-100">
            يومياتي
          </h1>

          <div className="mt-4 w-full max-w-[270px] sm:max-w-[310px]">
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-3xl border border-violet-200/80 bg-violet-100/70 shadow-sm dark:border-violet-800/60 dark:bg-[#211A2D]">
              {!imgError ? (
                <img
                  src={PHOTO_SRC}
                  alt={`صورة ${userName}`}
                  referrerPolicy="no-referrer"
                  onError={() => setImgError(true)}
                  className="h-full w-full object-cover object-[50%_52%] scale-[1.06]"
                />
              ) : (
                <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-gradient-to-br from-violet-100 to-purple-200 text-violet-700 dark:from-violet-950 dark:to-purple-900/60 dark:text-violet-300">
                  <BookHeart className="h-8 w-8" aria-hidden="true" />
                  <span className="text-xs font-medium">يومياتي</span>
                </div>
              )}
            </div>
          </div>

          <div className="mt-5 flex flex-col items-center">
            {!isEditingName ? (
              <div className="flex items-center justify-center gap-1.5">
                {isMorning ? (
                  <Sun className="h-5 w-5 text-violet-600 dark:text-violet-400 shrink-0" aria-hidden="true" />
                ) : (
                  <Moon className="h-5 w-5 text-violet-600 dark:text-violet-400 shrink-0" aria-hidden="true" />
                )}
                <p className="text-xl sm:text-2xl font-bold text-[#342547] dark:text-[#F5EFFB]">
                  {greetingText}، {userName}
                </p>
                <button
                  type="button"
                  onClick={startEditName}
                  aria-label="تعديل الاسم"
                  title="تعديل الاسم"
                  className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-xl text-[#8A77A6] transition-colors hover:bg-violet-100/70 hover:text-violet-800 dark:text-violet-400/70 dark:hover:bg-violet-900/40 dark:hover:text-violet-200"
                >
                  <Pencil className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            ) : (
              <form
                onSubmit={submitEditName}
                className="flex items-center justify-center gap-2"
              >
                <label htmlFor="edit-name-input" className="sr-only">
                  تعديل الاسم
                </label>
                <input
                  id="edit-name-input"
                  type="text"
                  value={nameDraft}
                  onChange={(e) => setNameDraft(e.target.value)}
                  autoFocus
                  maxLength={40}
                  className="min-h-[44px] w-44 rounded-xl border border-violet-300 bg-white px-3 text-sm font-medium text-[#342547] focus:border-violet-500 focus:outline-none dark:border-violet-700 dark:bg-[#211A2D] dark:text-violet-50"
                />
                <button
                  type="submit"
                  aria-label="حفظ الاسم"
                  className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-xl bg-violet-600 text-white hover:bg-violet-700"
                >
                  <Check className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditingName(false)}
                  aria-label="إلغاء"
                  className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-xl border border-violet-200 bg-white text-[#6B5A84] hover:bg-violet-50 dark:border-violet-800 dark:bg-[#211A2D] dark:text-violet-300"
                >
                  <X className="h-4 w-4" />
                </button>
              </form>
            )}

            <p className="mt-1 text-sm text-[#6E5C8A] dark:text-violet-300/80">
              {formattedDate}
            </p>
          </div>
        </section>

        {/* [إضافة جديدة #5]: اقتباس اليوم التحفيزي */}
        <DailyQuoteBanner now={now} />

        {/* [إضافة جديدة #9]: تنبيه تلقائي عند اقتراب مناسبة مهمة (7 أيام أو أقل) */}
        <EventReminderBanner
          events={countdownEvents}
          now={now}
          onOpenCountdownTab={() => setActiveTab('shopping-events')}
        />

        {/* [إضافة جديدة #8]: شريط التقدم لنسبة إنجاز مهام اليوم */}
        <TaskProgressBar
          totalCount={tasks.length}
          completedCount={completedTasksCount}
        />

        {/* [إضافة جديدة]: شريط التبويبات لتنظيم الميزات بسلاسة دون ازدحام */}
        <nav aria-label="أقسام يومياتي" className="mt-6">
          <div
            role="tablist"
            className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 rounded-2xl border border-violet-200/75 bg-violet-100/50 p-1.5 dark:border-violet-800/50 dark:bg-[#1E172B]"
          >
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isSelected = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={isSelected}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex min-h-[44px] items-center justify-center gap-2 rounded-xl px-3 py-2 text-xs sm:text-sm font-medium transition-all whitespace-nowrap ${
                    isSelected
                      ? 'bg-white text-violet-900 shadow-xs dark:bg-violet-700/80 dark:text-white'
                      : 'text-[#655380] hover:bg-white/50 hover:text-violet-900 dark:text-violet-300/80 dark:hover:bg-violet-900/35 dark:hover:text-violet-100'
                  }`}
                >
                  <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                  <span className="truncate">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </nav>

        {/* ==================================================================== */}
        {/* محتوى التبويب المختار                                                 */}
        {/* ==================================================================== */}
        <div className="mt-5">
          {/* التبويب 1 (الافتراضي): [الكود الأصلي] المهام اليومية + هدف اليوم + الملاحظات السريعة */}
          {activeTab === 'today' && (
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-12 lg:gap-6 items-start">
              <div className="lg:col-span-7">
                <TodoSection
                  dailyGoal={dailyGoal}
                  onChangeDailyGoal={handleChangeDailyGoal}
                  tasks={tasks}
                  onAddTask={handleAddTask}
                  onToggleTask={handleToggleTask}
                  onDeleteTask={handleDeleteTask}
                  onClearCompleted={handleClearCompleted}
                />
              </div>

              <div className="lg:col-span-5">
                <NotesSection
                  notes={notes}
                  lastSavedAt={notesUpdatedAt}
                  onChangeNotes={handleChangeNotes}
                />
              </div>
            </div>
          )}

          {/* التبويب 2: [إضافات #1 و #6] متتبع العادات اليومية + متتبع المزاج والرسم البياني */}
          {activeTab === 'habits-mood' && (
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-12 lg:gap-6 items-start">
              <div className="lg:col-span-6">
                <HabitTrackerSection
                  habits={habitState.habits}
                  onToggleHabit={handleToggleHabit}
                  onAddHabit={handleAddHabit}
                  onDeleteHabit={handleDeleteHabit}
                />
              </div>

              <div className="lg:col-span-6">
                <MoodTrackerSection
                  moodHistory={moodHistory}
                  now={now}
                  onSelectTodayMood={handleSelectTodayMood}
                />
              </div>
            </div>
          )}

          {/* التبويب 3: [إضافات #7 و #2] مؤقت بومودورو + الجدول الأسبوعي */}
          {activeTab === 'focus-schedule' && (
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-12 lg:gap-6 items-start">
              <div className="lg:col-span-5">
                <PomodoroSection />
              </div>

              <div className="lg:col-span-7">
                <WeeklyScheduleSection
                  schedule={weeklySchedule}
                  now={now}
                  onAddEntry={handleAddScheduleEntry}
                  onToggleEntry={handleToggleScheduleEntry}
                  onDeleteEntry={handleDeleteScheduleEntry}
                />
              </div>
            </div>
          )}

          {/* التبويب 4: [إضافات #3 و #4] قائمة التسوق والاحتياجات + العد التنازلي للمناسبات */}
          {activeTab === 'shopping-events' && (
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-12 lg:gap-6 items-start">
              <div className="lg:col-span-6">
                <ShoppingListSection
                  items={shoppingItems}
                  onAddItem={handleAddShoppingItem}
                  onToggleItem={handleToggleShoppingItem}
                  onDeleteItem={handleDeleteShoppingItem}
                  onClearBought={handleClearBoughtShopping}
                />
              </div>

              <div className="lg:col-span-6">
                <CountdownSection
                  events={countdownEvents}
                  now={now}
                  onAddEvent={handleAddCountdown}
                  onDeleteEvent={handleDeleteCountdown}
                />
              </div>
            </div>
          )}
        </div>
      </main>

      <OfflineIndicator />
    </div>
  );
}
