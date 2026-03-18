import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Shield, ArrowLeft, TrendingUp, TrendingDown } from "lucide-react";
import { generateMockTrades, type Trade } from "@/lib/tradeEngine";

const History = () => {
  const navigate = useNavigate();
  const [trades] = useState<Trade[]>(() => generateMockTrades(60));

  const stats = useMemo(() => {
    const wins = trades.filter((t) => t.pnl > 0);
    const losses = trades.filter((t) => t.pnl < 0);
    const totalPnl = trades.reduce((s, t) => s + t.pnl, 0);
    const avgLeverage = Math.round(trades.reduce((s, t) => s + t.leverage, 0) / trades.length);
    return {
      totalTrades: trades.length,
      winRate: Math.round((wins.length / trades.length) * 100),
      totalPnl: Math.round(totalPnl * 100) / 100,
      avgLeverage,
      biggestWin: Math.max(...trades.map((t) => t.pnl)),
      biggestLoss: Math.min(...trades.map((t) => t.pnl)),
    };
  }, [trades]);

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b border-border px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <Shield className="h-5 w-5 text-primary" />
          <span className="font-display font-bold text-foreground">Trade History</span>
        </div>
        <Button variant="hero" size="sm" onClick={() => navigate("/demo")}>
          Launch Demo
        </Button>
      </nav>

      {/* Stats Grid */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
          <StatBox label="Total Trades" value={stats.totalTrades.toString()} />
          <StatBox label="Win Rate" value={`${stats.winRate}%`} color={stats.winRate > 50 ? "success" : "destructive"} />
          <StatBox
            label="Total PnL"
            value={`$${stats.totalPnl > 0 ? "+" : ""}${stats.totalPnl.toFixed(0)}`}
            color={stats.totalPnl > 0 ? "success" : "destructive"}
          />
          <StatBox label="Avg Leverage" value={`${stats.avgLeverage}x`} color={stats.avgLeverage > 15 ? "destructive" : "default"} />
          <StatBox label="Biggest Win" value={`+$${stats.biggestWin.toFixed(0)}`} color="success" />
          <StatBox label="Biggest Loss" value={`-$${Math.abs(stats.biggestLoss).toFixed(0)}`} color="destructive" />
        </div>

        {/* Trade Table */}
        <div className="bg-card border border-border rounded overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left px-4 py-3 font-mono text-xs text-muted-foreground uppercase tracking-wider">Time</th>
                  <th className="text-left px-4 py-3 font-mono text-xs text-muted-foreground uppercase tracking-wider">Asset</th>
                  <th className="text-left px-4 py-3 font-mono text-xs text-muted-foreground uppercase tracking-wider">Side</th>
                  <th className="text-right px-4 py-3 font-mono text-xs text-muted-foreground uppercase tracking-wider">Leverage</th>
                  <th className="text-right px-4 py-3 font-mono text-xs text-muted-foreground uppercase tracking-wider">Size</th>
                  <th className="text-right px-4 py-3 font-mono text-xs text-muted-foreground uppercase tracking-wider">PnL</th>
                  <th className="text-right px-4 py-3 font-mono text-xs text-muted-foreground uppercase tracking-wider">PnL %</th>
                </tr>
              </thead>
              <tbody>
                {trades.slice().reverse().map((t) => (
                  <tr key={t.id} className="border-b border-border/50 hover:bg-accent/30 transition-colors duration-100">
                    <td className="px-4 py-2.5 font-mono text-xs text-muted-foreground">
                      {t.timestamp.toLocaleString(undefined, { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                    </td>
                    <td className="px-4 py-2.5 font-display font-bold text-sm text-foreground">{t.asset}</td>
                    <td className="px-4 py-2.5">
                      <span className={`inline-flex items-center gap-1 font-mono text-xs ${t.positionType === "LONG" ? "text-success" : "text-destructive"}`}>
                        {t.positionType === "LONG" ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                        {t.positionType}
                      </span>
                    </td>
                    <td className={`text-right px-4 py-2.5 font-mono text-xs ${t.leverage >= 20 ? "text-destructive font-bold" : "text-foreground"}`}>
                      {t.leverage}x
                    </td>
                    <td className="text-right px-4 py-2.5 font-mono text-xs text-foreground">${t.size}</td>
                    <td className={`text-right px-4 py-2.5 font-mono text-xs font-bold ${t.pnl >= 0 ? "text-success" : "text-destructive"}`}>
                      {t.pnl >= 0 ? "+" : ""}${t.pnl.toFixed(2)}
                    </td>
                    <td className={`text-right px-4 py-2.5 font-mono text-xs font-bold ${t.pnlPercent >= 0 ? "text-success" : "text-destructive"}`}>
                      {t.pnlPercent >= 0 ? "+" : ""}{t.pnlPercent}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

function StatBox({ label, value, color = "default" }: { label: string; value: string; color?: string }) {
  const colorClass = color === "success" ? "text-success" : color === "destructive" ? "text-destructive" : "text-foreground";
  return (
    <div className="bg-card border border-border rounded p-3">
      <p className="font-mono text-xs text-muted-foreground mb-1">{label}</p>
      <p className={`font-display font-bold text-lg ${colorClass}`}>{value}</p>
    </div>
  );
}

export default History;
