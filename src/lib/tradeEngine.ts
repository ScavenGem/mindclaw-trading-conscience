export interface Trade {
  id: string;
  asset: string;
  positionType: "LONG" | "SHORT";
  leverage: number;
  pnl: number;
  pnlPercent: number;
  timestamp: Date;
  size: number;
}

export interface PatternAlert {
  type: "revenge" | "fomo" | "overleverage" | "tilt";
  severity: "high" | "medium" | "low";
  message: string;
  detail: string;
}

export interface AIResponse {
  patternCallout: string;
  winRate: number;
  avgLoss: number;
  outcomeIfProceed: number;
  outcomeIfWait: number;
  emotionalState: string | null;
  checklist: string[];
  quip: string;
}

const ASSETS = ["BTC", "ETH", "SOL", "DOGE", "XRP", "ADA", "AVAX", "MATIC", "LINK", "DOT"];

function randomBetween(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

function randomInt(min: number, max: number) {
  return Math.floor(randomBetween(min, max));
}

function randomId() {
  return Math.random().toString(36).substring(2, 10);
}

export function generateMockTrades(count: number = 60): Trade[] {
  const trades: Trade[] = [];
  const now = Date.now();

  for (let i = 0; i < count; i++) {
    const isLosing = Math.random() < 0.6;
    const leverage = Math.random() < 0.3 ? randomInt(15, 50) : randomInt(2, 15);
    const pnlPercent = isLosing
      ? -randomBetween(2, 25)
      : randomBetween(1, 18);
    const size = randomBetween(50, 2000);

    // Cluster some trades close together for revenge/tilt patterns
    const timeGap = i > 20 && i < 35
      ? randomInt(2, 20) * 60 * 1000 // 2-20 minutes
      : randomInt(30, 480) * 60 * 1000; // 30 min to 8 hours

    trades.push({
      id: randomId(),
      asset: ASSETS[randomInt(0, ASSETS.length)],
      positionType: Math.random() < 0.5 ? "LONG" : "SHORT",
      leverage,
      pnl: (pnlPercent / 100) * size,
      pnlPercent: Math.round(pnlPercent * 10) / 10,
      timestamp: new Date(now - (count - i) * timeGap),
      size: Math.round(size),
    });
  }

  return trades;
}

export function detectPatterns(trades: Trade[]): PatternAlert[] {
  const alerts: PatternAlert[] = [];
  const recent = trades.slice(-20);

  // Revenge trading: rapid trades after losses
  let rapidAfterLoss = 0;
  for (let i = 1; i < recent.length; i++) {
    const gap = recent[i].timestamp.getTime() - recent[i - 1].timestamp.getTime();
    if (recent[i - 1].pnl < 0 && gap < 20 * 60 * 1000) {
      rapidAfterLoss++;
    }
  }
  if (rapidAfterLoss >= 3) {
    alerts.push({
      type: "revenge",
      severity: "high",
      message: "Revenge Trading Detected",
      detail: `${rapidAfterLoss} rapid trades after losses in recent history. You are chasing losses.`,
    });
  }

  // FOMO: buying same asset repeatedly in short span
  const assetCounts: Record<string, number> = {};
  recent.forEach((t) => {
    assetCounts[t.asset] = (assetCounts[t.asset] || 0) + 1;
  });
  const fomoAsset = Object.entries(assetCounts).find(([, c]) => c >= 5);
  if (fomoAsset) {
    alerts.push({
      type: "fomo",
      severity: "medium",
      message: "FOMO Pattern on " + fomoAsset[0],
      detail: `You have traded ${fomoAsset[0]} ${fomoAsset[1]} times recently. This looks like FOMO chasing.`,
    });
  }

  // Over-leverage
  const highLevTrades = recent.filter((t) => t.leverage >= 20);
  if (highLevTrades.length >= 3) {
    alerts.push({
      type: "overleverage",
      severity: "high",
      message: "Over-Leverage Spike",
      detail: `${highLevTrades.length} trades with 20x+ leverage. Average leverage: ${Math.round(highLevTrades.reduce((s, t) => s + t.leverage, 0) / highLevTrades.length)}x.`,
    });
  }

  // Tilt: consecutive losses
  let streak = 0;
  let maxStreak = 0;
  for (const t of recent) {
    if (t.pnl < 0) { streak++; maxStreak = Math.max(maxStreak, streak); }
    else { streak = 0; }
  }
  if (maxStreak >= 4) {
    alerts.push({
      type: "tilt",
      severity: "high",
      message: "Tilt Streak Active",
      detail: `${maxStreak} consecutive losses detected. You are on tilt. Step away.`,
    });
  }

  return alerts;
}

export function generateAIResponse(input: string, trades: Trade[]): AIResponse {
  const recent = trades.slice(-20);
  const wins = recent.filter((t) => t.pnl > 0).length;
  const winRate = Math.round((wins / recent.length) * 100);
  const losses = recent.filter((t) => t.pnl < 0);
  const avgLoss = losses.length > 0
    ? Math.round((losses.reduce((s, t) => s + t.pnlPercent, 0) / losses.length) * 10) / 10
    : 0;

  // Check for rapid trades
  let rapidCount = 0;
  for (let i = 1; i < Math.min(10, recent.length); i++) {
    const gap = recent[i].timestamp.getTime() - recent[i - 1].timestamp.getTime();
    if (gap < 20 * 60 * 1000) rapidCount++;
  }

  const emotionalState = rapidCount >= 3
    ? `${rapidCount + 1} trades in ${Math.round(rapidCount * 8)} minutes after a loss. This looks like revenge trading.`
    : null;

  const asset = input.match(/\b(BTC|ETH|SOL|DOGE|XRP|ADA|AVAX|MATIC|LINK|DOT)\b/i)?.[1]?.toUpperCase() || "this asset";
  const sameAssetTrades = recent.filter((t) => t.asset === asset);
  const sameAssetAvg = sameAssetTrades.length > 0
    ? Math.round((sameAssetTrades.reduce((s, t) => s + t.pnlPercent, 0) / sameAssetTrades.length) * 10) / 10
    : avgLoss;

  const quips = [
    "Not on my watch, champ. Let us not feed the liquidation monster today.",
    "Easy there, tiger. The market will still be here in 20 minutes.",
    "I have seen this movie before. It does not end well for the protagonist.",
    "Your portfolio called. It wants a break.",
    "Remember: the best trade is sometimes no trade at all.",
    "Let us take a deep breath before we donate to the market makers.",
  ];

  return {
    patternCallout: sameAssetTrades.length > 2
      ? `Hold up. You have made this same trade ${sameAssetTrades.length} times this week and averaged ${sameAssetAvg}%.`
      : `Your recent ${recent.length} trades show a ${winRate}% win rate. Let us think about this one.`,
    winRate,
    avgLoss,
    outcomeIfProceed: Math.round(sameAssetAvg * 1.3 * 10) / 10,
    outcomeIfWait: Math.round(Math.abs(sameAssetAvg) * 0.8 * 10) / 10,
    emotionalState,
    checklist: [
      "Is this setup better than your last 3 trades?",
      "Are you trading emotionally?",
      "Did you review the chart calmly?",
    ],
    quip: quips[randomInt(0, quips.length)],
  };
}
