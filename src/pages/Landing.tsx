import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Shield, TrendingDown, Brain, Zap } from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "Pattern Detection",
    desc: "Detects revenge trading, FOMO, tilt streaks, and over-leverage in real time.",
  },
  {
    icon: Shield,
    title: "Trade Intercept",
    desc: "AI stops you before you confirm a bad trade with data-backed warnings.",
  },
  {
    icon: TrendingDown,
    title: "Outcome Simulation",
    desc: "See projected losses vs. gains if you proceed or wait.",
  },
  {
    icon: Zap,
    title: "Emotional State Detection",
    desc: "Identifies when you are trading on emotion, not logic.",
  },
];

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="border-b border-border px-6 py-4 flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <Shield className="h-6 w-6 text-primary" />
          <span className="font-display font-bold text-lg text-foreground">MindClaw</span>
        </div>
        <Button variant="hero" size="sm" onClick={() => navigate("/demo")}>
          Try Demo
        </Button>
      </nav>

      {/* Hero */}
      <section className="px-6 py-24 md:py-36 max-w-4xl mx-auto text-center">
        <div className="inline-block px-3 py-1 rounded bg-primary/10 text-primary font-mono text-xs mb-6 tracking-wide">
          AI-POWERED TRADING CONSCIENCE
        </div>
        <h1 className="font-display font-black text-4xl md:text-6xl text-foreground leading-tight mb-6">
          The AI That Stops You From Making Bad Trades
        </h1>
        <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
          MindClaw analyzes your trading behavior, detects your worst habits, and intercepts costly mistakes before you confirm a trade.
        </p>
        <div className="flex gap-4 justify-center">
          <Button variant="hero" size="lg" onClick={() => navigate("/demo")}>
            Try Demo
          </Button>
          <Button variant="warning" size="lg" onClick={() => navigate("/history")}>
            View Trade History
          </Button>
        </div>
      </section>

      {/* Features */}
      <section className="px-6 py-20 max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-6">
          {features.map((f) => (
            <div
              key={f.title}
              className="bg-card border border-border rounded p-6 hover:border-primary/40 transition-colors duration-150"
            >
              <f.icon className="h-8 w-8 text-primary mb-4" />
              <h3 className="font-display font-bold text-lg text-foreground mb-2">{f.title}</h3>
              <p className="text-muted-foreground font-mono text-sm">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-20 text-center">
        <div className="max-w-xl mx-auto bg-card border border-primary/30 rounded p-10 animate-pulse-glow">
          <h2 className="font-display font-bold text-2xl text-foreground mb-3">
            Ready to stop bleeding money?
          </h2>
          <p className="text-muted-foreground font-mono text-sm mb-6">
            Load sample data with bad trading patterns and see MindClaw intercept in action.
          </p>
          <Button variant="hero" size="lg" onClick={() => navigate("/demo")}>
            Launch Demo
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border px-6 py-6 text-center">
        <p className="text-muted-foreground font-mono text-xs">
          MindClaw - Your Binance Trading Conscience. Built for smarter trading.
        </p>
      </footer>
    </div>
  );
};

export default Landing;
