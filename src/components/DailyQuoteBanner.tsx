import React from 'react';
import { Quote } from 'lucide-react';
import { getDayOfYear } from '../utils/dateUtils';

// ============================================================================
// [إضافة جديدة #5]: اقتباس/جملة تحفيزية يومية تتغير حسب رقم اليوم في السنة
// ============================================================================

const DAILY_QUOTES: readonly string[] = [
  'خطوة صغيرة كل يوم تصنع فرقاً كبيراً مع مرور الوقت.',
  'أنتِ قادرة على إنجاز ما تضعينه في أولوياتكِ بهدوء وثقة.',
  'لا تقارني بدايتكِ بنهاية غيركِ، لكلّ زهرة وقتها لتتفتح.',
  'الاهتمام بتفاصيل يومكِ البسيطة هو سر السكينة والإنجاز.',
  'تذكّري أن الراحة جزء مهم من الاستمرار والنجاح.',
  'كل صباح هو فرصة جديدة لكتابة صفحة أجمل في يومياتكِ.',
  'ثقي بقدرتكِ على تجاوز الصعاب، فأنتِ أقوى مما تظنين.',
  'الإنجاز لا يعني الكمال، بل الاستمرار رغم التحديات.',
  'احرصي على أن تمنحي نفسكِ اليوم لحظة هدوء وامتنان.',
  'الأفكار الجميلة تبدأ عندما نمنح عقولنا مساحة للتنفس والكتابة.',
  'اجعلي نيتكِ صافية، وخطواتكِ ثابتة، والباقي سيأتي في وقته.',
  'حتى في الأيام المزدحمة، هناك دائماً ما يستحق أن نبتسم لأجله.',
  'العادات اليومية الصغيرة هي التي تبني مستقبلكِ بصمت.',
  'رفقكِ بنفسكِ اليوم يمنحكِ طاقة مضاعفة للغد.',
  'لا تؤجلي فرحتكِ بإنجازاتكِ الصغيرة؛ فهي تستحق الاحتفاء.',
  'التركيز على مهمة واحدة بقلب حاضر خير من التشتت في عشر مهام.',
  'كوني فخورة بكل خطوة تقدمتِها مهما بدت بسيطة.',
  'السعادة أحياناً كوب دافئ، وقائمة مرتبة، وبال مطمئن.',
  'ما تزرعينه اليوم من صبر ومثابرة ستجنينه ثماراً طيبة قريباً.',
  'أنتِ تستحقين يوماً هادئاً، منظماً، ومليئاً بالخير.',
];

interface DailyQuoteBannerProps {
  now: Date;
}

export const DailyQuoteBanner: React.FC<DailyQuoteBannerProps> = ({ now }) => {
  // اختيار الجملة بناءً على رقم اليوم في السنة لتظل ثابتة طوال اليوم نفسه
  const dayNumber = getDayOfYear(now);
  const quoteText = DAILY_QUOTES[dayNumber % DAILY_QUOTES.length];

  return (
    <section
      aria-label="إلهام اليوم"
      className="mt-5 mx-auto max-w-2xl rounded-2xl border border-violet-200/70 bg-white/80 px-5 py-3.5 text-center shadow-xs dark:border-violet-800/45 dark:bg-[#211A2D]/80"
    >
      <div className="flex items-center justify-center gap-2 text-xs font-medium text-violet-700 dark:text-violet-300">
        <Quote className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
        <span>كلمة اليوم</span>
      </div>
      <p className="mt-1 text-sm sm:text-base font-medium leading-relaxed text-[#35274D] dark:text-violet-100/90">
        «{quoteText}»
      </p>
    </section>
  );
};
