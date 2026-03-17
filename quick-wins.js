// Quick Wins - Additional Features
// 1. Copy Market Snapshot (all data at once)
// 2. Days in Fear/Greed Zone counter

// ========== 1. COPY MARKET SNAPSHOT ==========

function setupCopySnapshot() {
    // Add button to header controls
    const headerControls = document.querySelector('.header-controls');
    if (!headerControls) return;
    
    // Check if button already exists
    if (document.getElementById('copySnapshotBtn')) return;
    
    const snapshotBtn = document.createElement('button');
    snapshotBtn.id = 'copySnapshotBtn';
    snapshotBtn.className = 'copy-snapshot-btn';
    snapshotBtn.title = 'Copy market snapshot to clipboard';
    snapshotBtn.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
        </svg>
        <span>Copy Snapshot</span>
    `;
    
    snapshotBtn.addEventListener('click', copyMarketSnapshot);
    
    // Insert after share button
    const shareBtn = document.getElementById('shareBtn');
    if (shareBtn && shareBtn.parentNode) {
        shareBtn.parentNode.insertBefore(snapshotBtn, shareBtn.nextSibling);
    } else {
        headerControls.appendChild(snapshotBtn);
    }
}

async function copyMarketSnapshot() {
    const fgValue = document.getElementById('fearGreedValue')?.textContent || '--';
    const fgLabel = document.getElementById('fearGreedLabel')?.textContent || '';
    const fgChange = document.getElementById('fearGreedChange')?.textContent || '';
    const btcPrice = document.getElementById('btcPrice')?.textContent || '--';
    const btcChange = document.getElementById('btcChange')?.textContent || '';
    const sentiment = document.getElementById('overallSentiment')?.textContent || '--';
    const lastUpdate = document.getElementById('lastUpdate')?.textContent || '';
    
    // Collect signal cards
    const signals = Array.from(document.querySelectorAll('.signal-card')).map(card => {
        const name = card.querySelector('h3')?.textContent.trim() || '';
        const value = card.querySelector('.value')?.textContent.trim() || '';
        const signal = card.querySelector('.signal-label')?.textContent.trim() || '';
        return `${name}: ${value} → ${signal}`;
    }).join('\n');
    
    const snapshot = `🚀 CRYPTO MARKET SNAPSHOT

📊 Fear & Greed Index
${fgValue} (${fgLabel})
${fgChange}

💰 Bitcoin Price
${btcPrice}
${btcChange}

🎯 Overall Sentiment: ${sentiment}

📈 Key Indicators:
${signals}

⏰ Last Update: ${lastUpdate}
🔗 ${window.location.href}`;
    
    try {
        await navigator.clipboard.writeText(snapshot);
        
        // Show toast notification
        showToast('📋 Market snapshot copied!', 'success');
        
        // Visual feedback on button
        const btn = document.getElementById('copySnapshotBtn');
        if (btn) {
            const originalHTML = btn.innerHTML;
            btn.innerHTML = `
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
                <span>Copied!</span>
            `;
            btn.style.borderColor = 'var(--accent-green)';
            
            setTimeout(() => {
                btn.innerHTML = originalHTML;
                btn.style.borderColor = '';
            }, 2000);
        }
        
        console.log('✅ Market snapshot copied to clipboard');
    } catch (error) {
        console.error('❌ Failed to copy snapshot:', error);
        showToast('❌ Failed to copy snapshot', 'error');
    }
}

// ========== 2. DAYS IN ZONE COUNTER ==========

async function calculateDaysInZone() {
    try {
        const response = await fetch('./data/history.json?t=' + Date.now());
        if (!response.ok) return null;
        
        const history = await response.json();
        if (!history || history.length < 2) return null;
        
        // Current value (most recent)
        const current = history[0];
        const currentZone = getFearGreedZone(current.fearGreed);
        
        // Count consecutive days in same zone
        let daysInZone = 1;
        for (let i = 1; i < history.length; i++) {
            const zone = getFearGreedZone(history[i].fearGreed);
            if (zone === currentZone) {
                daysInZone++;
            } else {
                break; // Stop when zone changes
            }
        }
        
        return {
            zone: currentZone,
            days: daysInZone,
            emoji: getZoneEmoji(currentZone)
        };
    } catch (error) {
        console.error('Error calculating days in zone:', error);
        return null;
    }
}

function getFearGreedZone(value) {
    if (value <= 25) return 'Extreme Fear';
    if (value <= 45) return 'Fear';
    if (value <= 55) return 'Neutral';
    if (value <= 75) return 'Greed';
    return 'Extreme Greed';
}

function getZoneEmoji(zone) {
    const emojiMap = {
        'Extreme Fear': '🟢',  // Green = buy opportunity
        'Fear': '🟡',
        'Neutral': '⚪',
        'Greed': '🟠',
        'Extreme Greed': '🔴'  // Red = sell signal
    };
    return emojiMap[zone] || '⚪';
}

async function displayDaysInZone() {
    const result = await calculateDaysInZone();
    if (!result) return;
    
    // Find or create display element
    let zoneCounter = document.getElementById('daysInZone');
    
    if (!zoneCounter) {
        // Create new element below gauge-history
        const gaugeHistory = document.getElementById('fearGreedHistory');
        if (!gaugeHistory || !gaugeHistory.parentNode) return;
        
        zoneCounter = document.createElement('span');
        zoneCounter.id = 'daysInZone';
        zoneCounter.className = 'days-in-zone';
        
        gaugeHistory.parentNode.insertBefore(zoneCounter, gaugeHistory.nextSibling);
    }
    
    // Update content
    const dayText = result.days === 1 ? 'day' : 'days';
    zoneCounter.textContent = `${result.emoji} ${result.zone} for ${result.days} ${dayText}`;
    zoneCounter.title = `Market has been in "${result.zone}" zone for ${result.days} consecutive days`;
    
    console.log(`📅 Days in zone: ${result.zone} for ${result.days} days`);
}

// ========== 3. TOAST NOTIFICATIONS ==========

function showToast(message, type = 'success', duration = 3000) {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'toastSlideOut 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, duration);
}

// ========== 4. 7-DAY TREND INDICATOR ==========

async function calculate7DayTrend() {
    try {
        const response = await fetch('./data/history.json?t=' + Date.now());
        if (!response.ok) return null;
        
        const history = await response.json();
        if (!history || history.length < 7) return null;
        
        const recent7 = history.slice(0, 7);
        const avg = recent7.reduce((sum, day) => sum + day.fearGreed, 0) / 7;
        const current = history[0].fearGreed;
        
        const trend = current > avg + 5 ? 'up' : current < avg - 5 ? 'down' : 'neutral';
        const diff = current - avg;
        
        return { 
            avg: avg.toFixed(1), 
            trend, 
            diff: diff.toFixed(1),
            current 
        };
    } catch (error) {
        console.error('Error calculating 7-day trend:', error);
        return null;
    }
}

async function display7DayTrend() {
    const trendData = await calculate7DayTrend();
    if (!trendData) return;
    
    const fearGreedValue = document.getElementById('fearGreedValue');
    if (!fearGreedValue) return;
    
    let trendElement = document.getElementById('trendMini');
    if (!trendElement) {
        trendElement = document.createElement('div');
        trendElement.id = 'trendMini';
        trendElement.className = 'trend-mini';
        fearGreedValue.parentNode.appendChild(trendElement);
    }
    
    const arrow = trendData.trend === 'up' ? '↗' : trendData.trend === 'down' ? '↘' : '→';
    const sign = trendData.diff > 0 ? '+' : '';
    
    trendElement.className = `trend-mini ${trendData.trend}`;
    trendElement.innerHTML = `
        <span class="trend-arrow-mini">${arrow}</span>
        <span>7d avg: ${trendData.avg} (${sign}${trendData.diff})</span>
    `;
    trendElement.title = `7-day average: ${trendData.avg}. Current value is ${Math.abs(trendData.diff)} points ${trendData.trend === 'up' ? 'above' : trendData.trend === 'down' ? 'below' : 'near'} the average.`;
    
    console.log(`📈 7-day trend: ${trendData.trend} (avg: ${trendData.avg}, current: ${trendData.current})`);
}

// ========== 5. ENHANCED STYLES INJECTION ==========

function injectEnhancedStyles() {
    const style = document.createElement('style');
    style.id = 'quick-wins-styles';
    style.textContent = `
        /* Toast Notifications */
        .toast {
            position: fixed;
            bottom: 2rem;
            right: 2rem;
            background: var(--bg-card);
            border: 2px solid var(--accent-green);
            border-radius: 12px;
            padding: 1rem 1.5rem;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
            z-index: 1000;
            animation: toastSlideIn 0.3s ease;
            max-width: 300px;
            font-weight: 500;
        }
        
        .toast-success { border-color: var(--accent-green); }
        .toast-error { border-color: var(--accent-red); }
        .toast-info { border-color: var(--accent-blue); }
        
        @keyframes toastSlideIn {
            from {
                transform: translateX(400px);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes toastSlideOut {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(400px);
                opacity: 0;
            }
        }
        
        /* 7-Day Trend Mini Indicator */
        .trend-mini {
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
            font-size: 0.9rem;
            color: var(--text-secondary);
            margin-top: 0.5rem;
            padding: 0.25rem 0.75rem;
            background: rgba(255, 255, 255, 0.05);
            border-radius: 8px;
            border: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .trend-mini.up {
            color: var(--accent-green);
            border-color: rgba(0, 255, 136, 0.3);
        }
        
        .trend-mini.down {
            color: var(--accent-red);
            border-color: rgba(255, 51, 102, 0.3);
        }
        
        .trend-mini.neutral {
            color: var(--accent-yellow);
            border-color: rgba(255, 170, 0, 0.3);
        }
        
        .trend-arrow-mini {
            font-size: 1.2rem;
            font-weight: bold;
        }
        
        /* Enhanced Card Hover Effects */
        .signal-card,
        .stat-card {
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
        }
        
        .signal-card:hover {
            transform: translateY(-8px) scale(1.02) !important;
            box-shadow: 
                0 10px 30px rgba(0, 0, 0, 0.3),
                0 0 20px rgba(77, 159, 255, 0.2) !important;
        }
        
        .stat-card:hover {
            transform: translateY(-8px) scale(1.02) !important;
            box-shadow: 
                0 10px 30px rgba(0, 0, 0, 0.3),
                0 0 20px rgba(0, 255, 136, 0.2) !important;
        }
        
        /* Button Pulse Effect */
        .copy-snapshot-btn {
            transition: all 0.3s ease !important;
        }
        
        .copy-snapshot-btn:hover {
            transform: scale(1.05);
            box-shadow: 0 5px 20px rgba(77, 159, 255, 0.4);
        }
        
        .copy-snapshot-btn:active {
            transform: scale(0.95);
        }
        
        /* Days in Zone Enhanced */
        .days-in-zone {
            animation: fadeInUp 0.5s ease;
        }
        
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(10px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
    `;
    
    // Only inject once
    if (!document.getElementById('quick-wins-styles')) {
        document.head.appendChild(style);
    }
}

// ========== INITIALIZATION ==========

document.addEventListener('DOMContentLoaded', () => {
    // Inject enhanced styles
    injectEnhancedStyles();
    
    // Wait for main app to load first
    setTimeout(() => {
        setupCopySnapshot();
        displayDaysInZone();
        display7DayTrend();
    }, 1000);
});

// Re-calculate after data refresh
document.addEventListener('dataRefreshed', () => {
    displayDaysInZone();
    display7DayTrend();
});
