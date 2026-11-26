import React, { useState } from 'react';
import { Check, Eraser } from 'lucide-react';

interface NotesSectionProps {
  notes: string;
  lastSavedAt: number | null;
  onChangeNotes: (value: string) => void;
}

export const NotesSection: React.FC<NotesSectionProps> = ({
  notes,
  lastSavedAt,
  onChangeNotes,
}) => {
  const [confirmClear, setConfirmClear] = useState(false);

  const formattedTime = lastSavedAt
    ? new Intl.DateTimeFormat('ar-MA-u-nu-latn', {
        hour: '2-digit',
        minute: '2-digit',
      }).format(new Date(lastSavedAt))
    : null;

  const handleClearConfirm = () => {
    onChangeNotes('');
    setConfirmClear(false);
  };

  return (
    <section
      aria-labelledby="notes-heading"
      className="flex flex-col rounded-3xl border border-violet-200/75 bg-white p-5 sm:p-6 shadow-sm dark:border-violet-800/50 dark:bg-[#211A2D]"
    >
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2
          id="notes-heading"
          className="text-xl font-bold text-[#342547] dark:text-[#F5EFFB]"
        >
          ملاحظاتي السريعة
        </h2>
        <div className="flex items-center gap-1.5 text-xs text-[#73618E] dark:text-violet-300/75">
          <Check className="h-3.5 w-3.5 text-violet-600 dark:text-violet-400" aria-hidden="true" />
          <span>حفظ تلقائي</span>
          {formattedTime && (
            <>
              <span aria-hidden="true">·</span>
              <span className="tabular-nums">{formattedTime}</span>
            </>
          )}
        </div>
      </div>

      <label htmlFor="quick-notes-textarea" className="sr-only">
        ملاحظات سريعة
      </label>
      <textarea
        id="quick-notes-textarea"
        value={notes}
        onChange={(e) => {
          setConfirmClear(false);
          onChangeNotes(e.target.value);
        }}
        placeholder="دوّني أفكاركِ، خواطركِ، أو أي شيء تودّين تذكّره لاحقاً..."
        rows={9}
        className="mt-4 w-full flex-1 resize-y min-h-[220px] rounded-2xl border border-violet-200 bg-[#FAF6FD] p-4 text-sm sm:text-base leading-relaxed text-[#342547] placeholder:text-[#9684B0] transition-colors focus:border-violet-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/20 dark:border-violet-800/70 dark:bg-[#1A1425] dark:text-violet-50 dark:placeholder:text-violet-400/50 dark:focus:border-violet-400 dark:focus:bg-[#1F182C]"
      />

      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs text-[#7A6894] dark:text-violet-300/70">
        <span className="tabular-nums">
          {notes.length} {notes.length === 1 ? 'حرف' : 'أحرف'}
        </span>

        {notes.trim().length > 0 && (
          <div className="flex items-center gap-2">
            {!confirmClear ? (
              <button
                type="button"
                onClick={() => setConfirmClear(true)}
                className="inline-flex min-h-[36px] items-center gap-1.5 rounded-lg px-2.5 text-xs font-medium text-[#7A6894] transition-colors hover:bg-violet-50 hover:text-violet-800 dark:text-violet-300/75 dark:hover:bg-violet-900/40 dark:hover:text-violet-100"
              >
                <Eraser className="h-3.5 w-3.5" aria-hidden="true" />
                <span>مسح النص</span>
              </button>
            ) : (
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={handleClearConfirm}
                  className="min-h-[36px] rounded-lg bg-rose-600 px-3 text-xs font-medium text-white transition-colors hover:bg-rose-700"
                >
                  تأكيد المسح
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmClear(false)}
                  className="min-h-[36px] rounded-lg px-2.5 text-xs font-medium text-[#6B5A84] hover:bg-violet-50 dark:text-violet-300 dark:hover:bg-violet-900/40"
                >
                  إلغاء
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};
