# Crypto Sentiment Dashboard 🚀

Real-time cryptocurrency market sentiment analysis with Fear & Greed Index, whale activity, ETF flows, and macro indicators.

## Features

### Core Metrics
- 📊 **Fear & Greed Index** — Visual gauge (0-100) with color coding & sparklines
- 💰 **Bitcoin Price** — Real-time BTC/USD with 24h change
- 📈 **Interactive Price Chart** — 24H, 7D, 30D, 90D timeframes
- 📅 **Historical Data Table** — Last 7 days trend analysis
- 🐋 **Whale Activity** — On-chain accumulation tracking
- 💼 **ETF Flows** — Institutional money movement
- 🏦 **Fed Policy** — Macro risk-on/risk-off signals

### UX/UI Features
- 🌙 **Theme Switcher** — Dark/Light modes (keyboard shortcut: T)
- ⌨️ **Keyboard Shortcuts** — Quick actions (press ? for help)
  - **R** — Refresh data
  - **C** — Copy BTC price
  - **T** — Toggle theme
  - **?** — Show shortcuts help
- 🔔 **Alert Notifications** — Browser push for extreme Fear/Greed zones
- 📸 **Copy Market Snapshot** — Share current state to clipboard
- 📊 **CSV Export** — Download historical data for analysis
- 📆 **Days in Zone Counter** — Track consecutive days in sentiment zones
- 🎨 **Dynamic Gradients** — Hero card changes based on market sentiment
- 📱 **Mobile Optimized** — Touch-friendly with larger tap targets
- 🎯 **Tooltips** — Contextual help for all metrics
- 🔄 **Auto Favicon** — Changes color based on Fear & Greed level

## Quick Start

### Local Development
```bash
# Clone the repo
git clone <repo-url>
cd crypto-dashboard

# Start a local server
python3 -m http.server 8888
# or
npx serve

# Open http://localhost:8888
```

### GitHub Pages Deployment
1. Push to GitHub
2. Go to Settings → Pages
3. Set source to `main` branch, root directory
4. Access at `https://<username>.github.io/crypto-dashboard/`

## Structure
```
crypto-dashboard/
├── index.html        # Main dashboard
├── style.css         # Dark theme styling
├── app.js            # Data loading & gauge rendering
├── data/
│   └── sentiment.json  # Market data (update daily)
└── README.md
```

## Updating Data
Edit `data/sentiment.json` with fresh market data:
```json
{
  "lastUpdate": "2026-02-10",
  "fearGreedIndex": 9,
  "btcPrice": 68000,
  "signals": [...]
}
```

## Data Sources
- Fear & Greed Index: [Alternative.me](https://alternative.me/crypto/fear-and-greed-index/)
- On-chain analytics: Glassnode, CryptoQuant
- ETF flows: Bloomberg, SOSO Value
- Macro data: Federal Reserve, economic calendars

## Tech Stack
- **Pure vanilla** HTML/CSS/JS (no frameworks)
- **GitHub Pages** ready (all paths relative)
- **Responsive design** with CSS Grid
- **SVG gauge** with dynamic rendering

## Recent Improvements (v2.0)

### March 2026 Update
- ✅ **Alert Notifications** — Push notifications for extreme zones (<20, >80)
- ✅ **CSV Export** — Export historical data to CSV
- ✅ **Dynamic Gradients** — Hero card visual feedback based on sentiment
- ✅ **Mobile Enhancements** — Better touch targets, improved responsiveness
- ✅ **Skeleton Loaders** — Smooth loading states
- ✅ **Copy Snapshot** — One-click market summary to clipboard
- ✅ **Days in Zone Counter** — Track sentiment persistence

### Roadmap (Next)
- [ ] **RSI Indicator** — Overbought/oversold momentum
- [ ] **Volatility Index** — 30-day rolling volatility
- [ ] **Stablecoin Dominance** — Market liquidity indicator
- [ ] **Comparison Mode** — Compare two dates side-by-side
- [ ] **Settings Panel** — Customize alerts & visibility
- [ ] **PWA Offline Mode** — Works without internet

## Philosophy
MVP → Ship fast → Iterate based on feedback

---
Created: 2026-02-10 | Updated: 2026-03-16 | Built with ⚡ by Mission Control
