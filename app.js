// Crypto Sentiment Dashboard - Main App
// Load and render sentiment data

const DATA_URL = './data/sentiment.json';

// Tooltip descriptions for signal cards
const SIGNAL_TOOLTIPS = {
    'Fear & Greed': 'Crypto Fear & Greed Index (0-100). Extreme Fear (<25) often signals buying opportunities as sentiment is oversold. Extreme Greed (>75) suggests caution.',
    'Whale Activity': 'On-chain tracking of large holders (whales). Positive percentage = accumulation = bullish. Negative = distribution = bearish. Whales often lead market movements.',
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
        
        // Add fade-in animation to hero card
        document.querySelector('.hero-card').classList.add('fade-in');
        
        // Update BTC Price
        document.getElementById('btcPrice').textContent = formatCurrency(data.btcPrice);
        
        // Update BTC Price Change
        const btcChangeElement = document.getElementById('btcChange');
        const changeValue = data.btcChange24h || 0;
        const changeClass = changeValue > 0 ? 'positive' : changeValue < 0 ? 'negative' : 'neutral';
        const changeArrow = changeValue > 0 ? '↑' : changeValue < 0 ? '↓' : '→';
        btcChangeElement.textContent = `${changeArrow} ${Math.abs(changeValue).toFixed(2)}% (24h)`;
        btcChangeElement.className = `price-change ${changeClass}`;
        
        // Update Overall Sentiment
        const sentimentBadge = document.getElementById('overallSentiment');
        sentimentBadge.textContent = data.overallSentiment.toUpperCase();
        sentimentBadge.className = `badge ${data.overallSentiment.toLowerCase()}`;
        
        // Render signal cards
        renderSignals(data.signals);
        
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

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    showLoadingSkeleton();
    loadData();
    setupRefreshButton();
    setupCopyPrice();
    setupExportButton();
});
