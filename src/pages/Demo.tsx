import { useState, useRef, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Shield, Send, ArrowLeft, AlertTriangle, CheckCircle, XCircle, Clock, BarChart3 } from "lucide-react";
import {
  generateMockTrades,
  detectPatterns,
  generateAIResponse,
  type Trade,
  type PatternAlert,
  type AIResponse,
} from "@/lib/tradeEngine";

interface ChatMessage {
  role: "user" | "ai";
  content: string;
  response?: AIResponse;
}

const severityColor: Record<string, string> = {
  high: "border-destructive animate-pulse-warning",
  medium: "border-primary",
  low: "border-muted",
};

const typeIcon: Record<string, string> = {
  revenge: "Revenge Trading",
  fomo: "FOMO Chasing",
  overleverage: "Over-Leverage",
  tilt: "Tilt Streak",
};

const Demo = () => {
  const navigate = useNavigate();
  const [trades] = useState<Trade[]>(() => generateMockTrades(60));
  const patterns = useMemo(() => detectPatterns(trades), [trades]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("Buy SOL 10x long");
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Auto-trigger demo on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      handleSend("Buy SOL 10x long");
    }, 800);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSend = (text?: string) => {
    const msg = text || input;
    if (!msg.trim()) return;

    const userMsg: ChatMessage = { role: "user", content: msg };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      const response = generateAIResponse(msg, trades);
      const aiMsg: ChatMessage = {
        role: "ai",
        content: response.quip,
        response,
      };
      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, 1200);
  };

  const handleAction = (action: string) => {
    const responses: Record<string, string> = {
      proceed: "Alright, proceeding. But I am watching you. Next time I might not be so nice.",
      paper: "Smart move. Running paper trade simulation for the next 4 hours. I will report back.",
      cooldown: "Cooldown timer set for 30 minutes. Go touch grass. I will hold the fort.",
      better: "Looking at the 4h chart, a better entry would be 2.3% lower with a tighter stop. Patience pays.",
    };

    const aiMsg: ChatMessage = {
      role: "ai",
      content: responses[action] || "Got it.",
    };
    setMessages((prev) => [...prev, aiMsg]);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <nav className="border-b border-border px-4 py-3 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <Shield className="h-5 w-5 text-primary" />
          <span className="font-display font-bold text-foreground">MindClaw Demo</span>
        </div>
        <Button variant="outline" size="sm" onClick={() => navigate("/history")}>
          <BarChart3 className="h-4 w-4 mr-1" /> Trade History
        </Button>
      </nav>

      {/* Main Layout */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Pattern Detection Sidebar */}
        <aside className="lg:w-80 border-b lg:border-b-0 lg:border-r border-border p-4 overflow-y-auto shrink-0">
          <h2 className="font-display font-bold text-sm text-muted-foreground uppercase tracking-wider mb-3">
            Pattern Detection
          </h2>
          {patterns.length === 0 ? (
            <div className="text-muted-foreground font-mono text-xs p-3 bg-card rounded">
              No harmful patterns detected. Trading looks healthy.
            </div>
          ) : (
            <div className="space-y-3">
              {patterns.map((p, i) => (
                <PatternCard key={i} pattern={p} />
              ))}
            </div>
          )}

          {/* Quick Stats */}
          <div className="mt-6">
            <h2 className="font-display font-bold text-sm text-muted-foreground uppercase tracking-wider mb-3">
              Session Stats
            </h2>
            <div className="grid grid-cols-2 gap-2">
              <StatCard label="Trades" value={trades.length.toString()} />
              <StatCard
                label="Win Rate"
                value={`${Math.round((trades.filter((t) => t.pnl > 0).length / trades.length) * 100)}%`}
              />
              <StatCard
                label="Avg Leverage"
                value={`${Math.round(trades.reduce((s, t) => s + t.leverage, 0) / trades.length)}x`}
              />
              <StatCard label="Alerts" value={patterns.length.toString()} isAlert={patterns.length > 0} />
            </div>
          </div>
        </aside>

        {/* AI Chat Panel */}
        <main className="flex-1 flex flex-col min-h-0">
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* Welcome */}
            {messages.length === 0 && (
              <div className="text-center py-12 animate-fade-in">
                <Shield className="h-12 w-12 text-primary mx-auto mb-4" />
                <h2 className="font-display font-bold text-xl text-foreground mb-2">AI Trade Intercept</h2>
                <p className="text-muted-foreground font-mono text-sm">
                  Enter a trade and MindClaw will analyze it against your history.
                </p>
              </div>
            )}

            {messages.map((msg, i) => (
              <div
                key={i}
                className={`animate-fade-in ${msg.role === "user" ? "flex justify-end" : "flex justify-start"}`}
                style={{ animationDelay: `${i * 50}ms` }}
              >
                {msg.role === "user" ? (
                  <div className="bg-accent border border-border rounded px-4 py-2 max-w-md">
                    <p className="font-mono text-sm text-foreground">{msg.content}</p>
                  </div>
                ) : (
                  <AIMessageBubble msg={msg} onAction={handleAction} />
                )}
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start animate-fade-in">
                <div className="bg-card border border-border rounded px-4 py-3">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Input */}
          <div className="border-t border-border p-4 shrink-0">
            <div className="flex gap-2 max-w-2xl mx-auto">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Enter trade... e.g. Buy SOL 10x long"
                className="flex-1 bg-card border border-border rounded px-4 py-2.5 font-mono text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors duration-150"
              />
              <Button variant="hero" size="default" onClick={() => handleSend()}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

function PatternCard({ pattern }: { pattern: PatternAlert }) {
  return (
    <div className={`bg-card border-2 rounded p-3 ${severityColor[pattern.severity]}`}>
      <div className="flex items-center gap-2 mb-1">
        <AlertTriangle className="h-4 w-4 text-destructive shrink-0" />
        <span className="font-display font-bold text-sm text-foreground">{pattern.message}</span>
      </div>
      <p className="font-mono text-xs text-muted-foreground">{pattern.detail}</p>
      <span className="inline-block mt-2 px-2 py-0.5 rounded bg-destructive/10 text-destructive font-mono text-xs uppercase">
        {pattern.severity}
      </span>
    </div>
  );
}

function StatCard({ label, value, isAlert }: { label: string; value: string; isAlert?: boolean }) {
  return (
    <div className="bg-card border border-border rounded p-3">
      <p className="font-mono text-xs text-muted-foreground">{label}</p>
      <p className={`font-display font-bold text-lg ${isAlert ? "text-destructive" : "text-foreground"}`}>{value}</p>
    </div>
  );
}

function AIMessageBubble({ msg, onAction }: { msg: ChatMessage; onAction: (a: string) => void }) {
  const r = msg.response;

  return (
    <div className="bg-card border border-border rounded p-4 max-w-lg space-y-3">
      {/* Quip */}
      <p className="font-mono text-sm text-primary">{msg.content}</p>

      {r && (
        <>
          {/* Pattern Callout */}
          <div className="bg-accent/50 border border-border rounded p-3">
            <p className="font-mono text-sm text-foreground">{r.patternCallout}</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-background rounded p-2">
              <p className="font-mono text-xs text-muted-foreground">Win Rate</p>
              <p className="font-display font-bold text-foreground">{r.winRate}%</p>
            </div>
            <div className="bg-background rounded p-2">
              <p className="font-mono text-xs text-muted-foreground">Avg Loss</p>
              <p className="font-display font-bold text-destructive">{r.avgLoss}%</p>
            </div>
          </div>

          {/* Outcome Simulation */}
          <div className="space-y-1">
            <p className="font-mono text-xs text-muted-foreground uppercase tracking-wider">Outcome Simulation</p>
            <div className="flex gap-2">
              <div className="flex-1 bg-destructive/10 border border-destructive/30 rounded p-2">
                <p className="font-mono text-xs text-muted-foreground">If proceed</p>
                <p className="font-display font-bold text-destructive">{r.outcomeIfProceed}%</p>
              </div>
              <div className="flex-1 bg-success/10 border border-success/30 rounded p-2">
                <p className="font-mono text-xs text-muted-foreground">If wait</p>
                <p className="font-display font-bold text-success">+{r.outcomeIfWait}%</p>
              </div>
            </div>
          </div>

          {/* Emotional State */}
          {r.emotionalState && (
            <div className="bg-destructive/10 border border-destructive/30 rounded p-3">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="h-4 w-4 text-destructive" />
                <span className="font-display font-bold text-sm text-destructive">Emotional State Alert</span>
              </div>
              <p className="font-mono text-xs text-foreground mb-2">{r.emotionalState}</p>
              <ul className="space-y-1">
                {r.checklist.map((item, i) => (
                  <li key={i} className="flex items-center gap-2 font-mono text-xs text-muted-foreground">
                    <XCircle className="h-3 w-3 text-destructive shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            <Button variant="destructive" size="sm" className="font-mono text-xs" onClick={() => onAction("proceed")}>
              Proceed Anyway
            </Button>
            <Button variant="outline" size="sm" className="font-mono text-xs" onClick={() => onAction("paper")}>
              <CheckCircle className="h-3 w-3 mr-1" /> Paper Trade
            </Button>
            <Button variant="outline" size="sm" className="font-mono text-xs" onClick={() => onAction("cooldown")}>
              <Clock className="h-3 w-3 mr-1" /> Set Cooldown
            </Button>
            <Button variant="success" size="sm" className="font-mono text-xs" onClick={() => onAction("better")}>
              Better Entry
            </Button>
          </div>
        </>
      )}
    </div>
  );
}

export default Demo;
