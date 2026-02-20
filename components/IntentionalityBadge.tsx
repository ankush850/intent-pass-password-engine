'use client';

interface IntentionalityBadgeProps {
  index: number;
  category: 'structured' | 'hack' | 'chaotic';
}

export function IntentionalityBadge({ index, category }: IntentionalityBadgeProps) {
  let bgColor = 'bg-red-100 dark:bg-red-900/30';
  let textColor = 'text-red-700 dark:text-red-300';
  let borderColor = 'border-red-200 dark:border-red-800';
  let title = 'Chaotic Pattern';
  let description = 'No discernible structure or pattern';

  if (category === 'structured') {
    bgColor = 'bg-green-100 dark:bg-green-900/30';
    textColor = 'text-green-700 dark:text-green-300';
    borderColor = 'border-green-200 dark:border-green-800';
    title = 'Structured Design';
    description = 'Intentionally designed password with clear patterns';
  } else if (category === 'hack') {
    bgColor = 'bg-yellow-100 dark:bg-yellow-900/30';
    textColor = 'text-yellow-700 dark:text-yellow-300';
    borderColor = 'border-yellow-200 dark:border-yellow-800';
    title = 'Compliance Hack';
    description = 'Designed to pass validation rules rather than maximize entropy';
  }

  // Normalize index to 0-100 for percentage display
  const percentage = Math.round(((index + 1) / 2) * 100);

  return (
    <div className={`${bgColor} border ${borderColor} p-4 rounded-lg`}>
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className={`font-semibold ${textColor}`}>{title}</p>
          <p className={`text-sm ${textColor} opacity-75`}>{description}</p>
        </div>
        <div className="flex-shrink-0">
          <div className={`text-2xl font-bold ${textColor}`}>{percentage}%</div>
          <p className={`text-xs ${textColor} opacity-75`}>intentionality</p>
        </div>
      </div>
    </div>
  );
}
