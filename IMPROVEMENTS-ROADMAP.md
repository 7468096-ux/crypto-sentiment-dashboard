# Crypto Dashboard - Improvements Roadmap
*Generated: 2026-03-24*

## ✅ Implemented Today (Quick Wins)

### Visual Polish
- ✅ Enhanced extreme zone visual feedback with pulsing gradients
- ✅ Better signal card hierarchy with hover effects
- ✅ Improved typography hierarchy (bigger, bolder numbers)
- ✅ Enhanced tooltips with smooth animations
- ✅ Glass-morphism effect for hero card
- ✅ Better loading states with skeleton animations
- ✅ Improved mobile touch targets (44px minimum)
- ✅ Smooth data update animations

### Functionality
- ✅ ATH/ATL distance tracker with visual indicators
- ✅ Enhanced market snapshot copy with rich formatting
- ✅ Automatic zone detection (extreme-fear/fear/neutral/greed/extreme-greed)
- ✅ Buy/sell signal visual indicators on cards
- ✅ Enhanced keyboard shortcuts (S = Share, E = Export)
- ✅ Better mobile touch feedback

---

## 📊 Priority 1: Core Functionality (Next Sprint)

### Volume Analysis
**Impact:** High | **Effort:** Medium | **Status:** Not Started

Add 24h trading volume metrics:
- Volume chart overlay on price chart
- Volume spike detection (>2x average = high interest)
- Volume trend indicator (increasing/decreasing)
- Compare volume vs. historical average

**Files to modify:**
- `data/sentiment.json` (add volume data)
- `btc-metrics.js` (volume calculations)
- `price-chart.js` (volume bars overlay)

---

### Portfolio Tracker (ROI Calculator)
**Impact:** High | **Effort:** Medium | **Status:** Not Started

Simple calculator for entry/exit scenarios:
- Input: Entry price, Amount, Date
- Output: Current P&L, ROI%, Days held
- Save multiple positions to localStorage
- Show aggregate portfolio performance
- Quick "What if I bought at Fear Index < 20?" analysis

**New files:**
- `portfolio-tracker.js`
- `portfolio-ui.css`
- Add button to hero card: "Track This Price"

---

### Price Targets & Levels
**Impact:** Medium | **Effort:** Medium | **Status:** Not Started

Visual resistance/support levels:
- Fibonacci retracement levels
- Recent swing highs/lows
- Psychological levels ($70k, $75k, $80k)
- Draw lines on price chart
- Distance to next level indicator

**Files to modify:**
- `price-chart.js` (add horizontal lines)
- `btc-metrics.js` (calculate levels)

---

## 🎨 Priority 2: Visual Design (Next Sprint)

### Enhanced Color Palette
**Impact:** Medium | **Effort:** Low | **Status:** Not Started

More scientific approach to color coding:
- 5 distinct zones (not just 2-3)
- Color transitions between zones
- Better contrast ratios for accessibility
- Colorblind-friendly palette option

**Files to modify:**
- `style.css` (new color variables)
- `app.js` (zone detection logic)

---

### Micro-animations
**Impact:** Low | **Effort:** Low | **Status:** Partially Done

Add subtle motion:
- Number counting animations (when values update)
- Sparkline drawing animation on load
- Chart fade-in on timeframe change
- Smooth gauge needle movement

**Files to modify:**
- `update-animations.js` (enhance)
- `sparklines.js` (add draw animation)

---

### Dark/Light Theme Refinement
**Impact:** Low | **Effort:** Low | **Status:** Needs Polish

Current theme switcher works but needs:
- Better color palette for light mode (currently washed out)
- Smooth theme transition animation
- System preference detection on first load
- Theme-specific gradient backgrounds

**Files to modify:**
- `style.css` (light theme colors)
- `theme-switcher.js` (add transitions)

---

## ⚡ Priority 3: UX/UI (Future)

### Smart Notifications
**Impact:** Medium | **Effort:** High | **Status:** Not Started

AI-powered alerts with context:
- Instead of "Fear Index is 9", say "Fear Index hit 9 — historically strong buy signal (average 30-day gain: +42%)"
- Price alerts with "Why this matters" explanations
- Personalized threshold settings

**New files:**
- `smart-notifications.js`
- Update `alert-notifications.js`

---

### Quick Filters for History
**Impact:** Low | **Effort:** Low | **Status:** Not Started

Table filtering:
- Buttons: 1D / 7D / 30D / All
- Filter by signal type (buy/sell/neutral)
- Sort by column (date, F&G, price, change)

**Files to modify:**
- `table-enhancements.js`
- Add filter buttons to history card

---

### Swipe Gestures (Mobile)
**Impact:** Low | **Effort:** Medium | **Status:** Not Started

Touch-friendly navigation:
- Swipe left/right on price chart for timeframes
- Swipe down to refresh
- Pinch to zoom on chart

**New files:**
- `mobile-gestures.js`

---

### Onboarding Tour
**Impact:** Low | **Effort:** Medium | **Status:** Not Started

First-time user guide:
- Highlight key features with tooltips
- "Skip tour" option
- localStorage flag to show once

**New files:**
- `onboarding.js`
- Library: Shepherd.js or Driver.js

---

## 🔬 Priority 4: Advanced Features (Future)

### Correlation Matrix
**Impact:** Medium | **Effort:** High

Compare BTC with:
- ETH
- Top 10 altcoins
- S&P 500
- Gold
- DXY (Dollar Index)

Visualize as heatmap.

---

### Multi-timeframe Analysis
**Impact:** Medium | **Effort:** High

Compare current week with:
- Previous week
- Same week last month
- Same week last year

Side-by-side view or overlay.

---

### On-chain Metrics
**Impact:** High | **Effort:** Very High

Integrate:
- Active addresses (7D MA)
- Exchange inflows/outflows
- MVRV ratio
- Network hash rate
- Miner reserves

Requires API: Glassnode or CryptoQuant (paid).

---

### Price Predictions
**Impact:** Medium | **Effort:** Very High

ML-based price targets:
- Simple linear regression on historical data
- Display confidence intervals
- "If this trend continues..." projections

**Caution:** High complexity, needs disclaimer.

---

## 🐛 Known Issues

1. **Data Push Issue**
   - Script updates local data but push fails (auth needed)
   - **Fix:** Set up Git credentials or SSH key

2. **Loading Race Condition**
   - Sometimes sparklines don't render on first load
   - **Fix:** Ensure Chart.js loads before sparklines.js

3. **Mobile: Horizontal Scroll**
   - Tables cause overflow on small screens
   - **Fix:** Improve table-wrapper max-width

---

## 📝 Implementation Notes

### Quick Win Guidelines
- Each quick win should take <30 minutes
- Must be visual or functional improvement
- No dependencies on external APIs
- Test on mobile

### Priority Scoring
- **High Impact + Low Effort** = Quick Win (do now)
- **High Impact + High Effort** = Plan carefully (next sprint)
- **Low Impact + Low Effort** = Nice to have (backlog)
- **Low Impact + High Effort** = Skip (unless specific request)

---

## 🚀 Next Actions

1. **Fix data push issue** (auth/SSH setup)
2. **Implement Volume Analysis** (Priority 1)
3. **Build Portfolio Tracker** (Priority 1)
4. **Refine light theme colors** (Priority 2)
5. **Add quick history filters** (Priority 3)

---

*Last updated: 2026-03-24*
*Maintained by: Mission Control*
