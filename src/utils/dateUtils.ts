// ============================================================================
// [إضافة جديدة - New Feature Utils]: أدوات مساعدة للتواريخ المحلية والعد التنازلي
// ============================================================================

/**
 * إرجاع مفتاح التاريخ المحلي بصيغة YYYY-MM-DD (حسب توقيت الجهاز)
 * يُستخدم لتصفير العادات يومياً وحفظ مزاج كل يوم بدقة
 */
export function getLocalDateKey(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * حساب رقم اليوم في السنة (من 1 إلى 366)
 * يُستخدم لاختيار اقتباس يومي ثابت طوال اليوم يتغير تلقائياً كل يوم جديد
 */
export function getDayOfYear(date: Date = new Date()): number {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff =
    date.getTime() -
    start.getTime() +
    (start.getTimezoneOffset() - date.getTimezoneOffset()) * 60_000;
  const oneDay = 1000 * 60 * 60 * 24;
  return Math.floor(diff / oneDay);
}

/**
 * حساب عدد الأيام المتبقية لمناسبة محددة (YYYY-MM-DD) مقارنة ببداية اليوم الحالي
 * النتيجة:
 *  - 0  => اليوم هو موعد المناسبة
 *  - >0 => باقي X يوم
 *  - <0 => مضت المناسبة
 */
export function getDaysUntilDate(targetDateStr: string, now: Date = new Date()): number | null {
  if (!targetDateStr) return null;
  const parts = targetDateStr.split('-').map(Number);
  if (parts.length !== 3 || parts.some((n) => !Number.isFinite(n))) return null;

  const [year, month, day] = parts;
  const targetMidnight = new Date(year, month - 1, day).setHours(0, 0, 0, 0);
  const todayMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate()).setHours(
    0,
    0,
    0,
    0
  );

  return Math.round((targetMidnight - todayMidnight) / (1000 * 60 * 60 * 24));
}

const SHORT_ARABIC_DAYS = ['أحد', 'إثنين', 'ثلاثاء', 'أربعاء', 'خميس', 'جمعة', 'سبت'] as const;

/**
 * إرجاع قائمة آخر 7 أيام (من الأقدم إلى اليوم) للرسم البياني للمزاج
 */
export function getLast7Days(now: Date = new Date()): Array<{ key: string; shortLabel: string }> {
  const days: Array<{ key: string; shortLabel: string }> = [];
  for (let offset = 6; offset >= 0; offset--) {
    const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() - offset);
    days.push({
      key: getLocalDateKey(d),
      shortLabel: offset === 0 ? 'اليوم' : SHORT_ARABIC_DAYS[d.getDay()],
    });
  }
  return days;
}
