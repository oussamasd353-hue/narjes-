import React, { useState } from 'react';
import { Check, CheckSquare, Plus, Target, Trash2, X } from 'lucide-react';

export interface TodoItem {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
}

type FilterMode = 'all' | 'active' | 'completed';

interface TodoSectionProps {
  dailyGoal: string;
  onChangeDailyGoal: (value: string) => void;
  tasks: TodoItem[];
  onAddTask: (text: string) => void;
  onToggleTask: (id: string) => void;
  onDeleteTask: (id: string) => void;
  onClearCompleted: () => void;
}

export const TodoSection: React.FC<TodoSectionProps> = ({
  dailyGoal,
  onChangeDailyGoal,
  tasks,
  onAddTask,
  onToggleTask,
  onDeleteTask,
  onClearCompleted,
}) => {
  const [newTask, setNewTask] = useState('');
  const [filter, setFilter] = useState<FilterMode>('all');

  const remainingCount = tasks.filter((t) => !t.completed).length;
  const completedCount = tasks.length - remainingCount;

  const filteredTasks = tasks.filter((t) => {
    if (filter === 'active') return !t.completed;
    if (filter === 'completed') return t.completed;
    return true;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newTask.trim();
    if (!trimmed) return;
    onAddTask(trimmed);
    setNewTask('');
  };

  return (
    <section
      aria-labelledby="todo-heading"
      className="flex flex-col rounded-3xl border border-violet-200/75 bg-white p-5 sm:p-6 shadow-sm dark:border-violet-800/50 dark:bg-[#211A2D]"
    >
      {/* Daily Goal Input */}
      <div className="mb-5 pb-5 border-b border-violet-100 dark:border-violet-800/40">
        <label
          htmlFor="daily-goal-input"
          className="flex items-center gap-1.5 text-xs font-medium text-violet-800 dark:text-violet-300"
        >
          <Target className="h-3.5 w-3.5 text-violet-600 dark:text-violet-400" aria-hidden="true" />
          <span>هدف اليوم</span>
        </label>
        <div className="relative mt-2 flex items-center">
          <input
            id="daily-goal-input"
            type="text"
            value={dailyGoal}
            onChange={(e) => onChangeDailyGoal(e.target.value)}
            placeholder="ما تركيزكِ الرئيسي لهذا اليوم؟"
            maxLength={120}
            className="min-h-[46px] w-full rounded-2xl border border-violet-200/90 bg-violet-50/70 pr-4 pl-11 py-2.5 text-sm sm:text-base font-medium text-[#342547] placeholder:font-normal placeholder:text-[#9684B0] transition-colors focus:border-violet-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/20 dark:border-violet-800/60 dark:bg-[#1B1426] dark:text-violet-50 dark:placeholder:text-violet-400/50 dark:focus:border-violet-400 dark:focus:bg-[#1F182C]"
          />
          {dailyGoal.length > 0 && (
            <button
              type="button"
              onClick={() => onChangeDailyGoal('')}
              aria-label="مسح هدف اليوم"
              className="absolute left-1 flex min-h-[40px] min-w-[40px] items-center justify-center rounded-xl text-[#8D7CA8] transition-colors hover:bg-violet-100/80 hover:text-violet-800 dark:text-violet-400/70 dark:hover:bg-violet-900/50 dark:hover:text-violet-200"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          )}
        </div>
      </div>

      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2
          id="todo-heading"
          className="text-xl font-bold text-[#342547] dark:text-[#F5EFFB]"
        >
          مهامي اليومية
        </h2>
        <div className="flex items-center gap-2 text-xs text-[#73618E] dark:text-violet-300/75 tabular-nums">
          <span>المتبقية {remainingCount}</span>
          <span aria-hidden="true">·</span>
          <span>المنجزة {completedCount}</span>
        </div>
      </div>

      {/* Add Task Input */}
      <form onSubmit={handleSubmit} className="mt-4 flex items-center gap-2">
        <label htmlFor="new-task-input" className="sr-only">
          أضيفي مهمة جديدة
        </label>
        <input
          id="new-task-input"
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="أضيفي مهمة جديدة..."
          maxLength={140}
          className="min-h-[46px] flex-1 rounded-2xl border border-violet-200 bg-[#FAF6FD] px-4 py-2.5 text-sm sm:text-base text-[#342547] placeholder:text-[#9684B0] transition-colors focus:border-violet-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/20 dark:border-violet-800/70 dark:bg-[#1A1425] dark:text-violet-50 dark:placeholder:text-violet-400/50 dark:focus:border-violet-400 dark:focus:bg-[#1F182C]"
        />
        <button
          type="submit"
          disabled={!newTask.trim()}
          className="inline-flex min-h-[46px] items-center justify-center gap-1.5 rounded-2xl bg-violet-600 px-4 sm:px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:bg-violet-700 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-45 whitespace-nowrap shrink-0"
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          <span>إضافة</span>
        </button>
      </form>

      {/* Filter Tabs */}
      {tasks.length > 0 && (
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <div
            role="tablist"
            aria-label="تصفية المهام"
            className="inline-flex items-center gap-1 rounded-xl bg-violet-50 p-1 dark:bg-[#1A1425]"
          >
            {(
              [
                { id: 'all', label: 'الكل' },
                { id: 'active', label: 'قيد الإنجاز' },
                { id: 'completed', label: 'المنجزة' },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={filter === tab.id}
                onClick={() => setFilter(tab.id)}
                className={`min-h-[36px] rounded-lg px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                  filter === tab.id
                    ? 'bg-white text-violet-900 shadow-xs dark:bg-violet-800/70 dark:text-violet-50'
                    : 'text-[#6B5A84] hover:text-violet-900 dark:text-violet-300/75 dark:hover:text-violet-100'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {completedCount > 0 && (
            <button
              type="button"
              onClick={onClearCompleted}
              className="min-h-[36px] px-2 text-xs font-medium text-[#7B6996] underline-offset-4 transition-colors hover:text-violet-700 hover:underline dark:text-violet-300/75 dark:hover:text-violet-200 whitespace-nowrap shrink-0"
            >
              مسح المنجزة
            </button>
          )}
        </div>
      )}

      {/* Task List */}
      <div className="mt-4 flex-1">
        {filteredTasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-violet-200/80 bg-[#FAF6FD]/60 px-4 py-10 text-center dark:border-violet-800/50 dark:bg-[#1B1426]/60">
            <CheckSquare
              className="h-8 w-8 text-violet-300 dark:text-violet-700"
              aria-hidden="true"
            />
            <p className="mt-2.5 text-sm font-medium text-[#5D4C77] dark:text-violet-200/80">
              {tasks.length === 0
                ? 'قائمتكِ فارغة الآن — أضيفي أولى مهامكِ اليوم'
                : filter === 'active'
                  ? 'أحسنتِ! أتممتِ جميع مهامكِ الحالية'
                  : 'لا توجد مهام منجزة بعد'}
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-violet-100 dark:divide-violet-800/40">
            {filteredTasks.map((task) => (
              <li
                key={task.id}
                className="group flex items-center gap-2 py-2 transition-colors"
              >
                <button
                  type="button"
                  onClick={() => onToggleTask(task.id)}
                  aria-label={task.completed ? `إلغاء إنجاز: ${task.text}` : `تحديد كمنجزة: ${task.text}`}
                  aria-pressed={task.completed}
                  className="flex min-h-[44px] min-w-[44px] shrink-0 items-center justify-center rounded-xl transition-colors hover:bg-violet-50 dark:hover:bg-violet-900/30"
                >
                  <span
                    className={`flex h-6 w-6 items-center justify-center rounded-lg border-2 transition-all duration-150 ${
                      task.completed
                        ? 'border-violet-600 bg-violet-600 text-white dark:border-violet-500 dark:bg-violet-500'
                        : 'border-violet-300 bg-white group-hover:border-violet-500 dark:border-violet-700 dark:bg-[#1A1425]'
                    }`}
                  >
                    {task.completed && <Check className="h-3.5 w-3.5 stroke-[3]" aria-hidden="true" />}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => onToggleTask(task.id)}
                  className="flex-1 min-h-[44px] py-2 text-right text-sm sm:text-base leading-snug transition-colors focus-visible:outline-2 focus-visible:outline-violet-500 rounded-lg"
                >
                  <span
                    className={
                      task.completed
                        ? 'line-through text-[#8D7CA8] dark:text-violet-300/45'
                        : 'text-[#342547] dark:text-[#F5EFFB]'
                    }
                  >
                    {task.text}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => onDeleteTask(task.id)}
                  aria-label={`حذف المهمة: ${task.text}`}
                  className="flex min-h-[44px] min-w-[44px] shrink-0 items-center justify-center rounded-xl text-[#9887B0] transition-colors hover:bg-rose-50 hover:text-rose-600 dark:text-violet-400/60 dark:hover:bg-rose-950/40 dark:hover:text-rose-400"
                >
                  <Trash2 className="h-4 w-4" aria-hidden="true" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
};
