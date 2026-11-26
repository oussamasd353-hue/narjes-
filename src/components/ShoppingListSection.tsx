import React, { useState } from 'react';
import { Check, Plus, ShoppingBag, Trash2 } from 'lucide-react';

// ============================================================================
// [إضافة جديدة #3]: قائمة التسوق والاحتياجات المنفصلة عن المهام اليومية
// ============================================================================

export interface ShoppingItem {
  id: string;
  name: string;
  bought: boolean;
}

interface ShoppingListSectionProps {
  items: ShoppingItem[];
  onAddItem: (name: string) => void;
  onToggleItem: (id: string) => void;
  onDeleteItem: (id: string) => void;
  onClearBought: () => void;
}

export const ShoppingListSection: React.FC<ShoppingListSectionProps> = ({
  items,
  onAddItem,
  onToggleItem,
  onDeleteItem,
  onClearBought,
}) => {
  const [newItem, setNewItem] = useState('');

  const remainingCount = items.filter((i) => !i.bought).length;
  const boughtCount = items.length - remainingCount;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newItem.trim();
    if (!trimmed) return;
    onAddItem(trimmed);
    setNewItem('');
  };

  return (
    <section
      aria-labelledby="shopping-heading"
      className="flex flex-col rounded-3xl border border-violet-200/75 bg-white p-5 sm:p-6 shadow-sm dark:border-violet-800/50 dark:bg-[#211A2D]"
    >
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <div className="flex items-center gap-2">
          <ShoppingBag className="h-5 w-5 text-violet-600 dark:text-violet-400" aria-hidden="true" />
          <h2
            id="shopping-heading"
            className="text-xl font-bold text-[#342547] dark:text-[#F5EFFB]"
          >
            قائمة التسوق والاحتياجات
          </h2>
        </div>

        <div className="flex items-center gap-2 text-xs text-[#73618E] dark:text-violet-300/75 tabular-nums">
          <span>المتبقي {remainingCount}</span>
          <span aria-hidden="true">·</span>
          <span>تم شراؤه {boughtCount}</span>
        </div>
      </div>

      {/* نموذج إضافة غرض */}
      <form onSubmit={handleSubmit} className="mt-4 flex items-center gap-2">
        <label htmlFor="new-shopping-input" className="sr-only">
          أضيفي غرضاً للتسوق
        </label>
        <input
          id="new-shopping-input"
          type="text"
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          placeholder="أضيفي غرضاً أو مستلزماً..."
          maxLength={80}
          className="min-h-[46px] flex-1 rounded-2xl border border-violet-200 bg-[#FAF6FD] px-4 py-2.5 text-sm text-[#342547] placeholder:text-[#9684B0] transition-colors focus:border-violet-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/20 dark:border-violet-800/70 dark:bg-[#1A1425] dark:text-violet-50 dark:placeholder:text-violet-400/50 dark:focus:border-violet-400"
        />
        <button
          type="submit"
          disabled={!newItem.trim()}
          className="inline-flex min-h-[46px] items-center justify-center gap-1.5 rounded-2xl bg-violet-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:bg-violet-700 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-45 whitespace-nowrap shrink-0"
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          <span>إضافة</span>
        </button>
      </form>

      {boughtCount > 0 && (
        <div className="mt-3 flex justify-end">
          <button
            type="button"
            onClick={onClearBought}
            className="min-h-[36px] px-2 text-xs font-medium text-[#7B6996] underline-offset-4 transition-colors hover:text-violet-700 hover:underline dark:text-violet-300/75 dark:hover:text-violet-200"
          >
            مسح المشتريات المكتملة
          </button>
        </div>
      )}

      {items.length === 0 ? (
        <div className="mt-4 rounded-2xl border border-dashed border-violet-200/80 bg-[#FAF6FD]/60 px-4 py-8 text-center text-sm text-[#6E5C8A] dark:border-violet-800/50 dark:bg-[#1B1426]/60 dark:text-violet-300/75">
          قائمة الاحتياجات فارغة حالياً — أضيفي ما تحتاجين شراءه.
        </div>
      ) : (
        <ul className="mt-3 divide-y divide-violet-100 dark:divide-violet-800/40">
          {items.map((item) => (
            <li key={item.id} className="group flex items-center gap-2 py-2">
              <button
                type="button"
                onClick={() => onToggleItem(item.id)}
                aria-pressed={item.bought}
                aria-label={item.bought ? `إلغاء شراء: ${item.name}` : `تم شراء: ${item.name}`}
                className="flex min-h-[44px] flex-1 items-center gap-3 rounded-xl px-1 text-right transition-colors hover:bg-violet-50/70 dark:hover:bg-violet-900/25"
              >
                <span
                  className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border-2 transition-all duration-150 ${
                    item.bought
                      ? 'border-violet-600 bg-violet-600 text-white dark:border-violet-500 dark:bg-violet-500'
                      : 'border-violet-300 bg-white group-hover:border-violet-500 dark:border-violet-700 dark:bg-[#1A1425]'
                  }`}
                >
                  {item.bought && <Check className="h-3.5 w-3.5 stroke-[3]" aria-hidden="true" />}
                </span>
                <span
                  className={`text-sm sm:text-base ${
                    item.bought
                      ? 'line-through text-[#8D7CA8] dark:text-violet-300/45'
                      : 'text-[#342547] dark:text-[#F5EFFB]'
                  }`}
                >
                  {item.name}
                </span>
              </button>

              <button
                type="button"
                onClick={() => onDeleteItem(item.id)}
                aria-label={`حذف: ${item.name}`}
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
