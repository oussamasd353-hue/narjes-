import React, { useState } from 'react';
import { ArrowLeft, BookHeart } from 'lucide-react';

interface WelcomeScreenProps {
  photoSrc: string;
  onSaveName: (name: string) => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ photoSrc, onSaveName }) => {
  const [nameInput, setNameInput] = useState('');
  const [error, setError] = useState('');
  const [imgError, setImgError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = nameInput.trim();
    if (!trimmed) {
      setError('لطفاً اكتبي اسمكِ أولاً للمتابعة.');
      return;
    }
    onSaveName(trimmed);
  };

  return (
    <div className="min-h-[100dvh] flex flex-col items-center justify-center px-5 py-8 sm:py-12">
      <div className="w-full max-w-md rounded-3xl border border-violet-200/80 bg-white/90 p-6 sm:p-8 shadow-sm backdrop-blur-sm dark:border-violet-800/50 dark:bg-[#211A2D]/90">
        <div className="text-center">
          <h1 className="font-display text-4xl sm:text-5xl font-bold tracking-tight text-violet-900 dark:text-violet-200">
            يومياتي
          </h1>
          <p className="mt-1.5 text-sm text-[#6B5A84] dark:text-violet-300/80">
            مساحتكِ الخاصة لترتيب يومكِ وأفكاركِ بهدوء
          </p>
        </div>

        {/* Dedicated medium rounded photo frame right below the title */}
        <div className="mt-5 mx-auto w-full max-w-[260px]">
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-violet-200/80 bg-violet-100/70 shadow-sm dark:border-violet-800/60 dark:bg-violet-950/50">
            {!imgError ? (
              <img
                src={photoSrc}
                alt="صورة يومياتي"
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

        <form onSubmit={handleSubmit} className="mt-6 space-y-4" noValidate>
          <div>
            <label
              htmlFor="welcome-name-input"
              className="block text-sm font-medium text-[#2E2242] dark:text-violet-100"
            >
              ما اسمكِ الجميل؟
            </label>
            <input
              id="welcome-name-input"
              type="text"
              value={nameInput}
              onChange={(e) => {
                setNameInput(e.target.value);
                if (error) setError('');
              }}
              placeholder="مثال: سلمى"
              autoComplete="given-name"
              autoFocus
              maxLength={40}
              className="mt-2 min-h-[48px] w-full rounded-2xl border border-violet-200 bg-[#FAF6FD] px-4 py-3 text-base text-[#342547] placeholder:text-[#9887B0] transition-colors focus:border-violet-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/20 dark:border-violet-800/70 dark:bg-[#1A1425] dark:text-violet-50 dark:placeholder:text-violet-400/50 dark:focus:border-violet-400 dark:focus:bg-[#1F182C]"
            />
            {error && (
              <p className="mt-2 text-xs font-medium text-rose-600 dark:text-rose-400" role="alert">
                {error}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="flex min-h-[48px] w-full items-center justify-center gap-2 rounded-2xl bg-violet-600 px-5 py-3 text-base font-medium text-white shadow-sm transition-all hover:bg-violet-700 active:scale-[0.99] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-500"
          >
            <span>ابدئي يومكِ</span>
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          </button>
        </form>

        <p className="mt-5 text-center text-xs leading-relaxed text-[#7A6894] dark:text-violet-300/70">
          يُحفظ اسمكِ ومهامكِ وملاحظاتكِ محلياً داخل متصفحكِ دون الحاجة لحساب أو إنترنت.
        </p>
      </div>
    </div>
  );
};
