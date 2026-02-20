'use client';

interface ScoreDisplayProps {
  score: number;
  maxScore?: number;
}

export function ScoreDisplay({ score, maxScore = 100 }: ScoreDisplayProps) {
  const percentage = Math.round((score / maxScore) * 100);
  
  let color = 'text-destructive';
  let bgColor = 'from-destructive/20 to-destructive/10';
  let textColor = 'text-destructive';
  
  if (score >= 75) {
    color = 'text-green-600 dark:text-green-400';
    bgColor = 'from-green-600/20 to-green-600/10';
    textColor = 'text-green-600 dark:text-green-400';
  } else if (score >= 50) {
    color = 'text-yellow-600 dark:text-yellow-400';
    bgColor = 'from-yellow-600/20 to-yellow-600/10';
    textColor = 'text-yellow-600 dark:text-yellow-400';
  }

  return (
    <div className={`bg-gradient-to-br ${bgColor} p-6 rounded-xl border border-border`}>
      <div className="text-center space-y-2">
        <p className="text-sm font-medium text-muted-foreground">Password Strength Score</p>
        <div className="flex items-baseline justify-center gap-2">
          <span className={`text-5xl font-bold ${textColor}`}>{score}</span>
          <span className={`text-2xl ${textColor}`}>/ {maxScore}</span>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full bg-border rounded-full h-2 mt-4 overflow-hidden">
          <div
            className={`h-full bg-gradient-to-r ${bgColor} transition-all duration-300`}
            style={{ width: `${percentage}%` }}
          />
        </div>
        
        <p className={`text-sm font-medium mt-2 ${color}`}>
          {score >= 75 && 'Strong Password'}
          {score >= 50 && score < 75 && 'Moderate Password'}
          {score < 50 && 'Weak Password'}
        </p>
      </div>
    </div>
  );
}
