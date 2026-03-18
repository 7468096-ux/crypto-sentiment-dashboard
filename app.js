// Crypto Sentiment Dashboard - Main App
// Load and render sentiment data

const DATA_URL = './data/sentiment.json';
const HISTORY_URL = './data/history.json';

// Tooltip descriptions for signal cards
const SIGNAL_TOOLTIPS = {
    'Fear & Greed': 'Crypto Fear & Greed Index (0-100). Extreme Fear (<25) often signals buying opportunities as sentiment is oversold. Extreme Greed (>75) suggests caution.',
    'BTC Dominance': 'Bitcoin\'s market cap as % of total crypto market. High dominance (>60%) = BTC season. Low dominance (<50%) = altseason (alts outperform BTC). Currently a key rotation indicator.',
    'ETF Flows': 'Net institutional money flowing into Bitcoin ETFs. Higher flows indicate institutional adoption and long-term confidence. Strong predictor of price action.',
    'Fed Policy': 'Federal Reserve interest rate policy. Rate cuts increase liquidity → risk-on assets (crypto) perform better. Rate hikes = tighter monetary policy = risk-off.'
};

// Color mapping for Fear & Greed Index (0-100)
function getColorForIndex(value) {
    // 0-25: Red (Extreme Fear)
    // 25-45: Orange (Fear)
    // 45-55: Yellow (Neutral)
    // 55-75: Light Green (Greed)
    // 75-100: Green (Extreme Greed)
    
    if (value <= 25) return '#ff3366'; // Red
    if (value <= 45) return '#ff6644'; // Orange
    if (value <= 55) return '#ffaa00'; // Yellow
    if (value <= 75) return '#88ff44'; // Light Green
    return '#00ff88'; // Green
}

// Draw the gauge arc based on index value
function drawGauge(value) {
    const gaugeArc = document.getElementById('gaugeArc');
    const gaugeNeedle = document.getElementById('gaugeNeedle');
    const gaugeSvg = document.getElementById('gaugeSvg');
    
    // Create gradient for full spectrum
    let defs = gaugeSvg.querySelector('defs');
    if (!defs) {
        defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
        gaugeSvg.insertBefore(defs, gaugeSvg.firstChild);
    }
    
    defs.innerHTML = `
        <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style="stop-color:#ff3366;stop-opacity:1" />
            <stop offset="25%" style="stop-color:#ff6644;stop-opacity:1" />
            <stop offset="50%" style="stop-color:#ffaa00;stop-opacity:1" />
            <stop offset="75%" style="stop-color:#88ff44;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#00ff88;stop-opacity:1" />
        </linearGradient>
    `;
    
    // Calculate angle (180 degrees total, from left to right)
    const angle = (value / 100) * 180;
    const radian = (angle - 90) * (Math.PI / 180);
    
    // Needle position
    const needleLength = 65;
    const centerX = 100;
    const centerY = 100;
    const needleX = centerX + needleLength * Math.cos(radian);
    const needleY = centerY + needleLength * Math.sin(radian);
    
    // Animate needle movement
    gaugeNeedle.style.transition = 'all 1s cubic-bezier(0.4, 0, 0.2, 1)';
    gaugeNeedle.setAttribute('x2', needleX);
    gaugeNeedle.setAttribute('y2', needleY);
    
    // Apply gradient to arc
    gaugeArc.setAttribute('stroke', 'url(#gaugeGradient)');
    
    // Create gradient path effect
    const largeArcFlag = angle > 180 ? 1 : 0;
    const endX = centerX + 80 * Math.cos(radian);
    const endY = centerY + 80 * Math.sin(radian);
    
    // Animate the arc growing to needle position
    gaugeArc.style.transition = 'all 1s ease-out';
    gaugeArc.setAttribute('d', `M 20 100 A 80 80 0 ${largeArcFlag} 1 ${endX} ${endY}`);
    
    // Add glow effect to needle based on value
    const color = getColorForIndex(value);
    gaugeNeedle.style.filter = `drop-shadow(0 0 8px ${color})`;
    
    // Update gauge value color
    const valueElement = document.getElementById('fearGreedValue');
    valueElement.style.color = color;
}

// Format currency
function formatCurrency(value) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(value);
}

// Render signal cards with tooltips
function renderSignals(signals) {
    const grid = document.getElementById('signalsGrid');
    grid.innerHTML = '';
    
    signals.forEach((signal, index) => {
        const card = document.createElement('div');
        card.className = 'signal-card fade-in';
        card.style.animationDelay = `${index * 0.1}s`;
        
        // Normalize signal class for CSS
        const signalClass = signal.signal.toLowerCase().replace(/ /g, '-');
        
        // Trend arrow
        const trendArrows = {
            'up': '↑',
            'down': '↓',
            'neutral': '→'
        };
        const trendArrow = signal.trend ? `<span class="trend-arrow ${signal.trend}">${trendArrows[signal.trend]}</span>` : '';
        
        // Tooltip
        const tooltip = SIGNAL_TOOLTIPS[signal.name] || 'Market indicator';
        
        card.innerHTML = `
            <h3 class="tooltip">
                ${signal.name}
                <span class="tooltip-text">${tooltip}</span>
            </h3>
            <span class="value">
                ${signal.value}
                ${trendArrow}
            </span>
            <span class="signal-label ${signalClass}">${signal.signal}</span>
        `;
        
        grid.appendChild(card);
    });
}

// Load historical data and calculate trends
async function loadHistoricalComparison(currentFG) {
    try {
        const response = await fetch(HISTORY_URL + '?t=' + Date.now());
        if (!response.ok) return null;
        
        const history = await response.json();
        if (!history || history.length < 7) return null;
        
        // Get value from 7 days ago (index 6, since index 0 is today)
        const sevenDaysAgo = history[6];
        if (!sevenDaysAgo) return null;
        
        const change7d = currentFG - sevenDaysAgo.fearGreed;
        const historyElement = document.getElementById('fearGreedHistory');
        
        if (historyElement) {
            const changeArrow = change7d > 0 ? '↑' : change7d < 0 ? '↓' : '→';
            const changeText = `${changeArrow} ${Math.abs(change7d)} vs 7 days ago (was ${sevenDaysAgo.fearGreed})`;
            historyElement.textContent = changeText;
        }
        
        return { change7d, sevenDaysAgo, history };
    } catch (error) {
        console.error('Error loading history:', error);
        return null;
    }
}

// Calculate consecutive days in current zone
function calculateDaysInZone(currentFG, history) {
    if (!history || history.length < 2) return 0;
    
    // Define zones: Fear (0-44), Neutral (45-55), Greed (56-100)
    const getZone = (value) => {
        if (value <= 44) return 'Fear';
        if (value <= 55) return 'Neutral';
        return 'Greed';
    };
    
    const currentZone = getZone(currentFG);
    let daysInZone = 1; // Today counts
    
    // Count backwards through history
    for (let i = 0; i < history.length; i++) {
        const historicalValue = history[i].fearGreed;
        if (getZone(historicalValue) === currentZone) {
            daysInZone++;
        } else {
            break; // Zone changed, stop counting
        }
    }
    
    return daysInZone;
}

// Show alert banner for extreme market conditions
function showAlertBanner(data) {
    const banner = document.getElementById('alertBanner');
    const fgValue = data.fearGreedIndex;
    const whaleAccumulation = parseFloat(data.whaleAccumulation);
    
    let alertType = null;
    let alertMessage = '';
    let alertIcon = '';
    
    // Priority 1: Extreme Fear (strong buy signal)
    if (fgValue <= 20) {
        alertType = 'extreme-fear';
        alertIcon = '🚨';
        alertMessage = `<strong>STRONG BUY SIGNAL</strong> — Fear & Greed at ${fgValue} (Extreme Fear). Historical data shows this is often a great buying opportunity.`;
    }
    // Priority 2: Extreme Greed (take profits warning)
    else if (fgValue >= 80) {
        alertType = 'extreme-greed';
        alertIcon = '⚠️';
        alertMessage = `<strong>TAKE PROFITS ZONE</strong> — Fear & Greed at ${fgValue} (Extreme Greed). Consider reducing exposure or taking profits.`;
    }
    // Priority 3: High whale accumulation
    else if (whaleAccumulation >= 20) {
        alertType = 'whale-active';
        alertIcon = '🐋';
        alertMessage = `<strong>WHALES ACTIVE</strong> — Whale accumulation at ${data.whaleAccumulation}. Large holders are accumulating.`;
    }
    
    // Show or hide banner
    if (alertType) {
        banner.className = `alert-banner ${alertType}`;
        banner.innerHTML = `<span style="font-size: 1.5rem;">${alertIcon}</span> <span>${alertMessage}</span>`;
    } else {
        banner.className = 'alert-banner hidden';
    }
}

// Show loading skeleton
function showLoadingSkeleton() {
    const grid = document.getElementById('signalsGrid');
    grid.innerHTML = '';
    
    for (let i = 0; i < 4; i++) {
        const skeleton = document.createElement('div');
        skeleton.className = 'skeleton';
        grid.appendChild(skeleton);
    }
}

// Load and render data with retry mechanism
async function loadData(retryCount = 0) {
    const maxRetries = 3;
    
    try {
        const response = await fetch(DATA_URL + '?t=' + Date.now()); // Cache bust
        if (!response.ok) throw new Error(`HTTP ${response.status}: Failed to load data`);
        
        const data = await response.json();
        
        // Update header
        document.getElementById('lastUpdate').textContent = data.lastUpdate;
        
        // Update Fear & Greed Index
        const fgValue = data.fearGreedIndex;
        document.getElementById('fearGreedValue').textContent = fgValue;
        document.getElementById('fearGreedLabel').textContent = data.fearGreedLabel;
        drawGauge(fgValue);
        
        // Update dynamic favicon
        if (typeof window.updateFavicon === 'function') {
            window.updateFavicon(fgValue);
        }
        
        // Calculate and display F&G change from yesterday
        const fgChangeElement = document.getElementById('fearGreedChange');
        if (data.fearGreedChange !== undefined) {
            const changeValue = data.fearGreedChange;
            const changeClass = changeValue > 0 ? 'positive' : changeValue < 0 ? 'negative' : 'neutral';
            const changeArrow = changeValue > 0 ? '↑' : changeValue < 0 ? '↓' : '→';
            fgChangeElement.textContent = `${changeArrow} ${Math.abs(changeValue)} vs yesterday`;
            fgChangeElement.className = `gauge-change ${changeClass}`;
        } else {
            fgChangeElement.textContent = '';
        }
        
        // Add fade-in animation to hero card
        document.querySelector('.hero-card').classList.add('fade-in');
        
        // Load historical comparison and calculate days in zone
        loadHistoricalComparison(fgValue).then(historyData => {
            if (historyData && historyData.history) {
                const daysInZone = calculateDaysInZone(fgValue, historyData.history);
                const daysElement = document.getElementById('daysInZone');
                if (daysElement && daysInZone > 0) {
                    const zone = fgValue <= 44 ? 'Fear' : fgValue <= 55 ? 'Neutral' : 'Greed';
                    daysElement.textContent = `${daysInZone} consecutive ${daysInZone === 1 ? 'day' : 'days'} in ${zone} zone`;
                    daysElement.style.display = 'block';
                }
            }
        });
        
        // Update BTC Price
        document.getElementById('btcPrice').textContent = formatCurrency(data.btcPrice);
        
        // Update BTC Price Change
        const btcChangeElement = document.getElementById('btcChange');
        const changeValue = data.btcChange24h || 0;
        const changeClass = changeValue > 0 ? 'positive' : changeValue < 0 ? 'negative' : 'neutral';
        const changeArrow = changeValue > 0 ? '↑' : changeValue < 0 ? '↓' : '→';
        btcChangeElement.textContent = `${changeArrow} ${Math.abs(changeValue).toFixed(2)}% (24h)`;
        btcChangeElement.className = `price-change ${changeClass}`;
        
        // Calculate and Update Overall Sentiment (using smart calculator)
        const sentimentResult = calculateOverallSentiment(data);
        const sentimentBadge = document.getElementById('overallSentiment');
        sentimentBadge.textContent = `${sentimentResult.sentiment.toUpperCase()} (${sentimentResult.confidence})`;
        sentimentBadge.className = `badge ${sentimentResult.sentiment.toLowerCase()}`;
        sentimentBadge.title = `Sentiment Score: ${sentimentResult.score}/100\n\nBreakdown:\n` +
            `Fear & Greed: ${sentimentResult.breakdown.fearGreed}\n` +
            `Whale Activity: ${sentimentResult.breakdown.whaleActivity}\n` +
            `Price Action: ${sentimentResult.breakdown.priceAction}\n` +
            `ETF Flows: ${sentimentResult.breakdown.etfFlows}\n` +
            `Fed Policy: ${sentimentResult.breakdown.fedPolicy}`;
        
        // Log sentiment analysis to console for debugging
        console.log('📊 Sentiment Analysis:', sentimentResult);
        
        // Show alert banner for extreme conditions
        showAlertBanner(data);
        
        // Render signal cards
        renderSignals(data.signals);
        
        // Dispatch event for other scripts
        document.dispatchEvent(new Event('dataRefreshed'));
        
    } catch (error) {
        console.error('Error loading data:', error);
        
        // Retry logic
        if (retryCount < maxRetries) {
            console.log(`Retrying... (${retryCount + 1}/${maxRetries})`);
            await new Promise(resolve => setTimeout(resolve, 1000 * (retryCount + 1))); // Exponential backoff
            return loadData(retryCount + 1);
        }
        
        // Show error state after all retries
        document.getElementById('lastUpdate').textContent = 'Error loading data';
        document.getElementById('fearGreedValue').textContent = '?';
        document.getElementById('fearGreedLabel').textContent = 'Error';
        document.getElementById('btcPrice').textContent = '$--';
        document.getElementById('btcChange').textContent = 'Failed to load';
        document.getElementById('overallSentiment').textContent = 'ERROR';
        
        // Show error message in grid
        const grid = document.getElementById('signalsGrid');
        grid.innerHTML = `
            <div class="error-message" style="grid-column: 1/-1; text-align: center; padding: 2rem;">
                <p style="font-size: 1.5rem; color: var(--accent-red); margin-bottom: 1rem;">⚠️ Failed to load data</p>
                <p style="color: var(--text-secondary);">Please try refreshing the page or check back later.</p>
            </div>
        `;
    }
}

// Countdown to next update (daily at 08:00 UTC)
function updateCountdown() {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setUTCHours(8, 0, 0, 0);
    
    // If we're past 08:00 today, target tomorrow
    if (now.getUTCHours() >= 8) {
        tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);
    }
    
    const diff = tomorrow - now;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    
    document.getElementById('nextUpdate').textContent = 
        `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

// Refresh functionality
function setupRefreshButton() {
    const refreshBtn = document.getElementById('refreshBtn');
    refreshBtn.addEventListener('click', async () => {
        refreshBtn.classList.add('loading');
        refreshBtn.disabled = true;
        
        // Show loading skeleton
        showLoadingSkeleton();
        
        // Simulate network delay for smooth UX
        await new Promise(resolve => setTimeout(resolve, 300));
        await loadData();
        
        setTimeout(() => {
            refreshBtn.classList.remove('loading');
            refreshBtn.disabled = false;
        }, 600);
    });
    
    // Start countdown timer
    updateCountdown();
    setInterval(updateCountdown, 1000);
}

// Copy BTC price to clipboard
function setupCopyPrice() {
    const priceElement = document.getElementById('btcPrice');
    const notification = document.getElementById('copyNotification');
    
    priceElement.addEventListener('click', async () => {
        const priceText = priceElement.textContent;
        
        try {
            await navigator.clipboard.writeText(priceText);
            
            // Show notification
            notification.classList.add('show');
            
            // Hide after 2 seconds
            setTimeout(() => {
                notification.classList.remove('show');
            }, 2000);
        } catch (error) {
            console.error('Failed to copy:', error);
        }
    });
}

// Export data as JSON
function setupExportButton() {
    const exportBtn = document.getElementById('exportBtn');
    if (!exportBtn) return;
    
    exportBtn.addEventListener('click', () => {
        // Gather current dashboard data
        const exportData = {
            timestamp: new Date().toISOString(),
            date: new Date().toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                timeZoneName: 'short'
            }),
            metrics: {
                fearGreedIndex: {
                    value: parseInt(document.getElementById('fearGreedValue')?.textContent || '0'),
                    label: document.getElementById('fearGreedLabel')?.textContent || 'Unknown',
                    interpretation: getFearGreedInterpretation(
                        parseInt(document.getElementById('fearGreedValue')?.textContent || '0')
                    )
                },
                bitcoinPrice: {
                    value: document.getElementById('btcPrice')?.textContent || '$0',
                    change24h: document.getElementById('btcChange')?.textContent || '0%',
                    numericValue: parseFloat(
                        document.getElementById('btcPrice')?.textContent.replace(/[$,]/g, '') || '0'
                    )
                },
                overallSentiment: document.getElementById('overallSentiment')?.textContent || 'Unknown'
            },
            signals: Array.from(document.querySelectorAll('.signal-card')).map(card => {
                const name = card.querySelector('h3')?.textContent || '';
                const value = card.querySelector('.value')?.textContent || '';
                const signal = card.querySelector('.signal-label')?.textContent || '';
                const badge = card.querySelector('.badge');
                const status = badge?.classList.contains('bullish') ? 'bullish' : 
                              badge?.classList.contains('bearish') ? 'bearish' : 'neutral';
                
                return { name, value, signal, status };
            }),
            metadata: {
                source: 'Crypto Sentiment Dashboard',
                url: window.location.href,
                version: '2.0',
                exportedBy: 'User',
                disclaimer: 'This data is for informational purposes only. Not financial advice.'
            }
        };
        
        // Create downloadable JSON file
        const blob = new Blob([JSON.stringify(exportData, null, 2)], { 
            type: 'application/json' 
        });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        const filename = `crypto-sentiment-${new Date().toISOString().split('T')[0]}.json`;
        
        link.href = url;
        link.download = filename;
        link.click();
        
        // Cleanup
        URL.revokeObjectURL(url);
        
        // Visual feedback
        exportBtn.innerHTML = `
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
            <span>Exported!</span>
        `;
        
        setTimeout(() => {
            exportBtn.innerHTML = `
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/>
                </svg>
                <span>Export</span>
            `;
        }, 2000);
    });
}

// Helper function for F&G interpretation
function getFearGreedInterpretation(value) {
    if (value <= 25) return 'Extreme Fear - Potential buying opportunity';
    if (value <= 45) return 'Fear - Market is cautious';
    if (value <= 55) return 'Neutral - Balanced sentiment';
    if (value <= 75) return 'Greed - Market is optimistic';
    return 'Extreme Greed - Potential market top';
}

// Real-time price polling (every 60 seconds)
let priceUpdateInterval = null;

async function updateLivePrice() {
    try {
        const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd&include_24hr_change=true');
        if (!response.ok) return;
        
        const data = await response.json();
        const newPrice = data.bitcoin.usd;
        const newChange = data.bitcoin.usd_24h_change;
        
        // Smooth update
        document.getElementById('btcPrice').textContent = formatCurrency(newPrice);
        
        const btcChangeElement = document.getElementById('btcChange');
        const changeClass = newChange > 0 ? 'positive' : newChange < 0 ? 'negative' : 'neutral';
        const changeArrow = newChange > 0 ? '↑' : newChange < 0 ? '↓' : '→';
        btcChangeElement.textContent = `${changeArrow} ${Math.abs(newChange).toFixed(2)}% (24h)`;
        btcChangeElement.className = `price-change ${changeClass}`;
        
        console.log('💰 Live price updated:', formatCurrency(newPrice));
    } catch (error) {
        console.error('Failed to update live price:', error);
    }
}

function startLivePriceUpdates() {
    // Update every 60 seconds (CoinGecko free tier friendly)
    priceUpdateInterval = setInterval(updateLivePrice, 60000);
    console.log('🔄 Live price updates started (60s interval)');
}

function stopLivePriceUpdates() {
    if (priceUpdateInterval) {
        clearInterval(priceUpdateInterval);
        priceUpdateInterval = null;
        console.log('⏸️ Live price updates stopped');
    }
}

// Load and render historical data
async function loadHistoricalData() {
    try {
        const response = await fetch('./data/history.json?t=' + Date.now());
        if (!response.ok) throw new Error('Failed to load history');
        
        const history = await response.json();
        renderHistoryTable(history);
    } catch (error) {
        console.error('Error loading historical data:', error);
    }
}

function renderHistoryTable(history) {
    const tbody = document.querySelector('.history-table tbody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    history.forEach(row => {
        const tr = document.createElement('tr');
        
        // Format date
        const date = new Date(row.date);
        const formattedDate = date.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric' 
        });
        
        // Fear & Greed color class
        let fgClass = 'fg-neutral';
        if (row.fearGreed <= 25) fgClass = 'fg-extreme-fear';
        else if (row.fearGreed <= 45) fgClass = 'fg-fear';
        
        // Change color class
        let changeClass = 'change-neutral';
        let changeSymbol = '';
        if (row.change24h > 0) {
            changeClass = 'change-positive';
            changeSymbol = '+';
        } else if (row.change24h < 0) {
            changeClass = 'change-negative';
        }
        
        tr.innerHTML = `
            <td>${formattedDate}</td>
            <td><span class="fg-value ${fgClass}">${row.fearGreed}</span></td>
            <td><span class="price-value">${formatCurrency(row.btcPrice)}</span></td>
            <td><span class="${changeClass}">${changeSymbol}${row.change24h.toFixed(2)}%</span></td>
        `;
        
        tbody.appendChild(tr);
    });
}

// Register Service Worker for PWA
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('✅ Service Worker registered:', registration.scope);
            })
            .catch(error => {
                console.error('❌ Service Worker registration failed:', error);
            });
    });
}

// Share functionality
function setupShareButton() {
    const shareBtn = document.getElementById('shareBtn');
    if (!shareBtn) return;
    
    shareBtn.addEventListener('click', async () => {
        const fgValue = document.getElementById('fearGreedValue')?.textContent || '--';
        const fgLabel = document.getElementById('fearGreedLabel')?.textContent || '';
        const btcPrice = document.getElementById('btcPrice')?.textContent || '--';
        const sentiment = document.getElementById('overallSentiment')?.textContent || '--';
        
        const shareText = `🚀 Crypto Market Update\n\n` +
            `Fear & Greed: ${fgValue} (${fgLabel})\n` +
            `BTC: ${btcPrice}\n` +
            `Sentiment: ${sentiment}\n\n` +
            `${window.location.href}`;
        
        // Try native Web Share API first
        if (navigator.share) {
            try {
                await navigator.share({
                    title: '🚀 Crypto Sentiment Dashboard',
                    text: shareText,
                    url: window.location.href
                });
                console.log('✅ Shared successfully');
            } catch (error) {
                if (error.name !== 'AbortError') {
                    console.error('Share failed:', error);
                    fallbackCopyShare(shareText);
                }
            }
        } else {
            // Fallback: copy to clipboard
            fallbackCopyShare(shareText);
        }
    });
}

function fallbackCopyShare(text) {
    navigator.clipboard.writeText(text).then(() => {
        // Show notification
        const btn = document.getElementById('shareBtn');
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
    }).catch(err => {
        console.error('Copy failed:', err);
    });
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    showLoadingSkeleton();
    loadData();
    loadHistoricalData(); // Load historical data table
    setupRefreshButton();
    setupCopyPrice();
    setupExportButton();
    setupShareButton();
    
    // Start live price updates after initial load
    setTimeout(() => {
        startLivePriceUpdates();
    }, 5000); // Wait 5 seconds after page load
});

// Stop updates when page is hidden (battery saving)
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        stopLivePriceUpdates();
    } else {
        startLivePriceUpdates();
    }
});
