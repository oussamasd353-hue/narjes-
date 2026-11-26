import React, { useState } from 'react';
import { Download, Share, X } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  if (isInstalled) {
    return null;
  }

  if (isInstallable) {
    return (
      <button
        type="button"
        onClick={install}
        className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-violet-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-violet-700 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-500 whitespace-nowrap shrink-0"
      >
        <Download className="h-4 w-4" aria-hidden="true" />
        <span>تثبيت التطبيق</span>
      </button>
    );
  }

  if (isIOS) {
    return (
      <>
        <button
          type="button"
          onClick={() => setShowIOSGuide(true)}
          className="inline-flex min-h-[44px] items-center gap-2 rounded-xl border border-violet-200 bg-white px-3.5 py-2 text-xs font-medium text-violet-800 transition-colors hover:bg-violet-50 dark:border-violet-800/70 dark:bg-[#241C33] dark:text-violet-200 dark:hover:bg-violet-950/60 whitespace-nowrap shrink-0"
        >
          <Share className="h-3.5 w-3.5" aria-hidden="true" />
          <span>أضيفي للشاشة</span>
        </button>

        {showIOSGuide && (
          <div
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-xs p-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="ios-install-title"
          >
            <div className="w-full max-w-sm rounded-3xl border border-violet-200/70 bg-white p-6 shadow-xl dark:border-violet-800/60 dark:bg-[#211A2D]">
              <div className="flex items-center justify-between gap-4">
                <h3
                  id="ios-install-title"
                  className="text-lg font-bold text-[#342547] dark:text-[#F5EFFB]"
                >
                  تثبيت يومياتي على آيفون
                </h3>
                <button
                  type="button"
                  onClick={() => setShowIOSGuide(false)}
                  aria-label="إغلاق"
                  className="flex h-11 w-11 items-center justify-center rounded-xl text-violet-600 hover:bg-violet-50 dark:text-violet-300 dark:hover:bg-violet-900/40"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <ol className="mt-4 space-y-3 text-sm leading-relaxed text-[#4C3D63] dark:text-violet-200/85">
                <li>1. اضغطي على زر المشاركة في شريط متصفح Safari بالأسفل.</li>
                <li>2. مرّري للأسفل واختاري «إضافة إلى الشاشة الرئيسية».</li>
                <li>3. اضغطي على «إضافة» ليظهر التطبيق كأيقونة مستقلة.</li>
              </ol>
              <button
                type="button"
                onClick={() => setShowIOSGuide(false)}
                className="mt-6 min-h-[44px] w-full rounded-xl bg-violet-600 py-2.5 text-sm font-medium text-white transition-colors hover:bg-violet-700"
              >
                فهمت
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
};
