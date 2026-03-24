# 🎮 Interactive Features Guide

**Crypto Sentiment Terminal — Enhanced Edition**

---

## ⌨️ Keyboard Shortcuts

| Key | Action |
|-----|--------|
| **R** | Refresh data |
| **S** | Toggle settings panel |
| **E** | Export data (JSON) |
| **C** | Copy market snapshot to clipboard |
| **?** | Show keyboard shortcuts help |
| **ESC** | Close all overlays |

---

## 🖱️ Interactive Elements

### **1. Copyable Values**
**Click any metric to copy to clipboard:**
- Fear & Greed Index
- Bitcoin Price
- BTC Dominance
- ATH/ATL Distance

**Visual feedback:**
- Hover: Gold color + 📋 icon appears
- Click: ✓ checkmark + notification toast

---

### **2. Tooltips**
**Hover over metrics for contextual help:**
- Explains what each metric means
- Tips on how to interpret data
- Smooth fade-in animation

---

### **3. Settings Panel**
**Access via:**
- Click ⚙️ icon (top-right)
- Press **S** key

**Customize:**
- ✅ **Animations** — Number counting, smooth transitions
- ✅ **Particle Effects** — Visual effects on extreme zones
- ✅ **Sound Effects** — Audio feedback (coming soon)
- ✅ **Notifications** — Toast notifications

**Export Options:**
- Export as JSON (full data)
- Export as CSV (historical data)

---

## 🎨 Visual Enhancements

### **Number Counting Animation**
When data updates:
- Numbers smoothly count up/down
- Pulse effect on change
- Gold highlight flash

**Disable:** Turn off "Animations" in settings

---

### **Particle Effects**
**Triggered on extreme zones:**
- **Fear < 20** → Green particles rise
- **Greed > 80** → Red particles rise
- 20 particles per trigger
- 3-second float animation

**Disable:** Turn off "Particle Effects" in settings

---

### **Loading State**
On initial load:
- Full-screen overlay
- Spinning gold ring
- "INITIALIZING TERMINAL" text
- Auto-dismisses after 1.5s

---

### **Signal Indicator**
Dynamic status badge:
- 🟢 **STRONG BUY** (Fear < 25)
- 🟡 **NEUTRAL** (25-75)
- 🔴 **CONSIDER SELL** (Greed > 75)

Pulsing dot animation matches signal type.

---

## 📤 Export Features

### **Market Snapshot (Quick Copy)**
**Press C** or click "Copy Snapshot" to copy:
```
🚀 CRYPTO SENTIMENT TERMINAL

Fear & Greed Index: 45
Zone: NEUTRAL
BTC Price: $70,000
Change 24h: +2.5%
BTC Dominance: 56.5%

Last Update: 2026-03-24
```

Perfect for sharing in Telegram/Discord!

---

### **JSON Export**
**Full data structure:**
```json
{
  "lastUpdate": "2026-03-24",
  "fearGreedIndex": 45,
  "btcPrice": 70000,
  "btcChange24h": 2.5,
  "btcDominance": 56.5,
  "athPrice": 108268,
  "atlPrice": 67060,
  "historical": [...]
}
```

---

### **CSV Export**
**Historical data table:**
```csv
Date,Fear & Greed,Zone,BTC Price,24h Change
2026-03-24,45,NEUTRAL,70000,2.5
2026-03-23,42,FEAR,68000,1.2
...
```

---

## 🔔 Notification System

**Toast notifications appear for:**
- ✅ Value copied to clipboard
- ✅ Data refreshed successfully
- ✅ Export completed
- ✅ Settings saved

**Position:** Bottom-right corner  
**Duration:** 3 seconds  
**Dismissal:** Auto-fade or press ESC

---

## 🎯 Best Practices

### **For Day Traders:**
1. Enable all animations + particles
2. Keep terminal open on second monitor
3. Press **R** to refresh every 15-30 min
4. Watch for extreme zones (particles trigger)

### **For Researchers:**
1. Disable animations for cleaner data view
2. Export CSV for analysis in Excel/Sheets
3. Use tooltips to understand metrics
4. Copy snapshots for reports

### **For Presentations:**
1. Enable particle effects for "wow" factor
2. Use keyboard shortcuts for smooth demo
3. Export JSON to showcase data structure
4. Copy snapshots for slide notes

---

## 🧪 Technical Details

### **Performance:**
- All animations: CSS-only (60fps)
- No JavaScript animation loops
- Particle cleanup: auto-remove after 3s
- LocalStorage: Settings persistence

### **Accessibility:**
- Keyboard navigation: 100% supported
- Focus states: Visible on all interactive elements
- Screen reader: Proper ARIA labels (coming soon)
- Reduced motion: Respects user preference (planned)

### **Browser Support:**
- Chrome/Edge: ✅ Full support
- Firefox: ✅ Full support
- Safari: ✅ Full support
- Mobile: ✅ Responsive (shortcuts via settings)

---

## 🐛 Known Issues

1. **Particles on mobile** — Performance impact on older devices
   - Solution: Auto-disable on mobile (planned)

2. **Sound effects** — Not yet implemented
   - Coming soon: Subtle click/success sounds

3. **Clipboard on HTTP** — Copy requires HTTPS
   - Solution: Use GitHub Pages or localhost

---

## 🔮 Coming Soon

- 🎵 **Sound Effects** — Subtle audio feedback
- 📱 **PWA Support** — Add to home screen, offline mode
- 🔔 **Push Notifications** — Alerts for extreme zones
- 🌐 **Multi-language** — Russian, Spanish, Chinese
- 📊 **Chart Overlays** — Interactive price charts
- 🤖 **AI Insights** — GPT-powered market analysis

---

## 💡 Pro Tips

1. **Muscle Memory:**
   - Master **R** (refresh), **C** (copy), **?** (help)
   - Settings panel = your control center

2. **Workflow:**
   - Morning: **R** → check Fear & Greed → **C** → share with team
   - Evening: **E** → export CSV → analyze trends

3. **Customization:**
   - Disable animations if using on old laptop
   - Enable particles for presentations/demos
   - Turn off notifications if terminal stays open 24/7

4. **Data Portability:**
   - JSON export = backup for your records
   - CSV export = import into trading journal
   - Snapshot = quick share without screenshots

---

**Last Updated:** 2026-03-24  
**Version:** 2.0 Enhanced  
**Designer:** Alice (Mission Control) 🐰
