# Crypto Sentiment Dashboard 🚀

Real-time cryptocurrency market sentiment analysis with Fear & Greed Index, whale activity, ETF flows, and macro indicators.

## Features
- 📊 **Fear & Greed Index** — Visual gauge (0-100) with color coding
- 🐋 **Whale Activity** — On-chain accumulation tracking
- 💰 **ETF Flows** — Institutional money movement
- 🏦 **Fed Policy** — Macro risk-on/risk-off signals
- 🌙 **Dark Theme** — Mission Control style dashboard
- 📱 **Responsive** — Works on mobile and desktop

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

## Philosophy
MVP → Ship fast → Iterate based on feedback

---
Created: 2026-02-10 | Built with ⚡ by Mission Control
