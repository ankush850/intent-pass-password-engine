'use client';

export enum IntentionalityTier {
  BRONZE = 'BRONZE',
  SILVER = 'SILVER',
  GOLD = 'GOLD',
  PLATINUM = 'PLATINUM',
}

interface TierBadgeProps {
  intentionalityIndex: number;
}

export function TierBadge({ intentionalityIndex }: TierBadgeProps) {
  let tier: IntentionalityTier;
  let tierColor: string;
  let tierLabel: string;
  let tierDescription: string;

  if (intentionalityIndex >= 76) {
    tier = IntentionalityTier.PLATINUM;
    tierColor = 'bg-blue-600 text-white';
    tierLabel = 'Platinum';
    tierDescription = 'Exceptional intentionality — expertly designed';
  } else if (intentionalityIndex >= 51) {
    tier = IntentionalityTier.GOLD;
    tierColor = 'bg-amber-500 text-white';
    tierLabel = 'Gold';
    tierDescription = 'High intentionality — well-designed password';
  } else if (intentionalityIndex >= 26) {
    tier = IntentionalityTier.SILVER;
    tierColor = 'bg-slate-400 text-white';
    tierLabel = 'Silver';
    tierDescription = 'Moderate intentionality — adequate design';
  } else {
    tier = IntentionalityTier.BRONZE;
    tierColor = 'bg-orange-600 text-white';
    tierLabel = 'Bronze';
    tierDescription = 'Low intentionality — weak design';
  }

  const getTierIcon = () => {
    switch (tier) {
      case IntentionalityTier.PLATINUM:
        return '♦';
      case IntentionalityTier.GOLD:
        return '★';
      case IntentionalityTier.SILVER:
        return '◆';
      case IntentionalityTier.BRONZE:
        return '●';
    }
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <div className={`${tierColor} px-4 py-2 rounded-lg flex items-center gap-2 shadow-lg`}>
        <span className="text-xl">{getTierIcon()}</span>
        <div className="text-center">
          <p className="font-bold text-sm">{tierLabel}</p>
          <p className="text-xs opacity-90">{intentionalityIndex}/100</p>
        </div>
      </div>
      <p className="text-xs text-muted-foreground text-center max-w-xs">{tierDescription}</p>
    </div>
  );
}
