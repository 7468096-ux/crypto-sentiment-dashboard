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
        
        // Visual feedback
        const btn = document.getElementById('copySnapshotBtn');
        if (!btn) return;
        
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
        
        console.log('✅ Market snapshot copied to clipboard');
    } catch (error) {
        console.error('❌ Failed to copy snapshot:', error);
        alert('Failed to copy to clipboard. Please try again.');
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

// ========== INITIALIZATION ==========

document.addEventListener('DOMContentLoaded', () => {
    // Wait for main app to load first
    setTimeout(() => {
        setupCopySnapshot();
        displayDaysInZone();
    }, 1000);
});

// Re-calculate after data refresh
document.addEventListener('dataRefreshed', () => {
    displayDaysInZone();
});
