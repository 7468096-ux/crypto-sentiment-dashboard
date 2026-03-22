# Changelog

## [2.1.0] - 2026-03-21

### 🎉 Added

#### Table Enhancements (`table-enhancements.js`)
- **Sortable Historical Table**: Click column headers to sort by Date, Fear & Greed, BTC Price, or 24h Change
- **Time Filters**: Quick filter buttons (Last 7/14/30 days, All Time)
- **Live Search**: Real-time search with result counter
- **Smooth Animations**: Fade-in effects when sorting/filtering

#### Price Alerts System (`price-alerts.js`)
- **Custom Price Alerts**: Set alerts for BTC price going above/below thresholds
- **Browser Notifications**: Desktop notifications when alerts trigger (permission required)
- **Alert Management**: View active and triggered alerts in sidebar panel
- **Persistent Storage**: Alerts saved to localStorage (survive page refresh)
- **Auto-monitoring**: Check price every 30 seconds against active alerts
- **Badge Counter**: Shows number of active alerts on button

#### Visual Upgrades (`visual-upgrades.js`)
- **Market Temperature Thermometer**: Animated visual representation of Fear & Greed Index
  - 5 temperature zones with emoji indicators (❄️ → 🌋)
  - Smooth gradient fill animation
  - Pulsing marker at current position
- **Enhanced Card Effects**:
  - Gradient overlays following mouse movement
  - Particle burst on hover
  - Improved shadows and glows
- **Value Change Animations**: Pulse effect when BTC price or F&G changes
- **Loading Skeleton**: Multi-layer shimmer effect
- **Price Change Glow**: Animated background glow for 24h change indicator

### 🔧 Improved
- Mobile responsiveness for new features
- Accessibility with better keyboard navigation
- Performance with CSS animations instead of JS
- Toast notification system for user feedback

### 📊 Data Update
- Fear & Greed: **12** (Extreme Fear) — ✅ Strong buy signal
- BTC Price: **$70,694** (-0.22%)
- BTC Dominance: **56.5%** (BTC season)
- Whale Activity: **+18%** (accumulating)
- Overall Sentiment: **Extreme Fear (buy signal)**

---

## [2.0.0] - 2026-03-20

### Initial Release
- Fear & Greed Index gauge
- BTC price tracking
- Signal cards (Dominance, Whale Activity, ETF Flows, Fed Policy)
- Historical data table (7 days)
- Price chart with multiple timeframes
- Sparklines for trends
- Dark/Light theme toggle
- Keyboard shortcuts
- PWA support
- Export to JSON
- Share functionality

---

## Upcoming (v2.2.0)

See `IMPROVEMENTS_ROADMAP.md` for planned features.

**High Priority:**
- Multi-timeframe charts (1h, 4h, 1d, 1w)
- Portfolio tracker
- Social sentiment integration
- Advanced alerts (percentage change, compound conditions)

---

*Built with ⚡ by Mission Control*
