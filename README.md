# MindClaw: Your Binance Trading Conscience 🦞

**The supportive AI that knows your tilt patterns better than anyone, and gently stops you from revenge-trading your own stack into the ground.**

Built on OpenClaw for the Binance OpenClaw AI Assistant Contest (March 2026).  
Focus: Trading & Strategy Tools + meaningful UX improvements for **every Binance user**.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Launch%20Now-yellow?style=for-the-badge&logo=vercel)](https://mindclaw-trading-conscience.vercel.app/)
[![GitHub Repo](https://img.shields.io/badge/GitHub-View%20Code-black?style=for-the-badge&logo=github)](https://github.com/ScavenGem/MindClaw-Trading-Conscience)
[![Contest Submission](https://img.shields.io/badge/Binance-OpenClaw%20Contest-blue?style=for-the-badge)](https://binance.com/en/survey/c707e12435d44eaba19cdbc6bbe6f21d)

## The Problem We All Feel
Most losses on Binance aren't from bad markets. They're from bad moments: revenge trades after a red day, FOMO buys on green candles, tilt streaks that turn small losses into big ones, or jumping leverage when emotions run high.

New users get scared off. Long-term holders watch gains evaporate. Active participants burn out. Support gets flooded with "why did I do that?" tickets.

MindClaw changes that. It's your personal **trading conscience**, a witty, empathetic "crypto uncle" who reads your own recent behavior and intercepts risky decisions **before** you hit confirm.

## How MindClaw Saves the Day (Core Flow)
1. **Mock Trade History** - Realistic sample of 30–100 trades with built-in tilt patterns (losses, rapid-fire entries, over-leverage spikes).
2. **Pattern Detection** - Spots revenge trading, FOMO chases, tilt streaks, and leverage spikes from your history.
3. **Real-Time Intercept** (the magic) - When you simulate a bad trade like "Buy SOL 10x long", MindClaw jumps in instantly:
   - "Hold up. You've made this same revenge long 4 times this week and averaged -9.2%."
   - Stats: Win rate X%, average loss X%.
   - Simple outcomes: Proceed → -12% avg historically; Wait → +7% avg.
   - Options: Proceed Anyway | Run Paper Sim | Set Cooldown | Better Entry Ideas.
4. **Emotional Check** - Flags rapid trades post-loss: "4 trades in 18 minutes after that hit, classic revenge mode." + quick 3-question checklist to pause and reflect.
5. **Personality** - Supportive and slightly savage: "Not on my watch, champ. Let's not feed the liquidation monster today."

## Why Binance Will Love This
MindClaw isn't another scanner or bot. It's deeply human. It helps **all Binance users** (beginners finding their feet, holders protecting wealth, traders avoiding tilt) build better habits, stay profitable longer, and feel truly supported on the platform.

Result: Higher retention, more confident engagement across Spot, Futures, Earn, and beyond. Fewer emotional quits, fewer support tickets, more long-term winners on Binance.

## Demo in 10 Seconds
Watch (or try yourself): User types a tilted trade → MindClaw intercepts with evidence, empathy, and options → instant "aha" moment.

**[Launch Live Demo](https://mindclaw-trading-conscience.vercel.app/)** (preloaded bad-history sample - just click "Try Demo" and type a risky trade)

![MindClaw Intercept Demo](https://github.com/ScavenGem/MindClaw-Trading-Conscience/raw/main/public/MindClaw-demo.gif)

## Tech (Simple, Clean, Vercel-Ready)
- Frontend: React + Tailwind CSS (Binance dark theme: charcoal black, gold/yellow accents, dark greys)
- Logic: Client-side mock data + rule-based + prompt-driven detection (ready for real OpenClaw/Binance Skills integration)
- No external APIs needed for demo. Everything local/privacy-first
- Runs instantly: `npm install && npm run dev`
- Builds clean: `npm run build`

## Quick Start for Judges / Curious Users
```bash
git clone https://github.com/ScavenGem/MindClaw-Trading-Conscience.git
cd MindClaw-Trading-Conscience
npm install
npm run dev
```
## Future Vision (If This Wins Hearts)
- Plug into real Binance read-only trade history via OpenClaw Skills
- Telegram/Discord bot mode for on-the-go nudges
- Customizable sensitivity + progress tracking for habit-building

Submitted with ❤️ by Scavenger 🥷 (@ScavenGems), because we've all been there, and no one should tilt alone.

Open-source under MIT. Fork, improve, win with us.

#BuildOnBinance #OpenClaw
