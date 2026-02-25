// Crypto Sentiment Dashboard - Main App
// Load and render sentiment data

const DATA_URL = './data/sentiment.json';

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
    
    gaugeNeedle.setAttribute('x2', needleX);
    gaugeNeedle.setAttribute('y2', needleY);
    
    // Apply gradient to arc
    gaugeArc.setAttribute('stroke', 'url(#gaugeGradient)');
    
    // Create gradient path effect
    const largeArcFlag = angle > 180 ? 1 : 0;
    const endX = centerX + 80 * Math.cos(radian);
    const endY = centerY + 80 * Math.sin(radian);
    
    // Animate the arc growing to needle position
    gaugeArc.setAttribute('d', `M 20 100 A 80 80 0 ${largeArcFlag} 1 ${endX} ${endY}`);
    
    // Add glow effect to needle based on value
    const color = getColorForIndex(value);
    gaugeNeedle.style.filter = `drop-shadow(0 0 8px ${color})`;
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

// Render signal cards
function renderSignals(signals) {
    const grid = document.getElementById('signalsGrid');
    grid.innerHTML = '';
    
    signals.forEach(signal => {
        const card = document.createElement('div');
        card.className = 'signal-card fade-in';
        
        // Normalize signal class for CSS
        const signalClass = signal.signal.toLowerCase().replace(/ /g, '-');
        
        // Trend arrow
        const trendArrows = {
            'up': '↑',
            'down': '↓',
            'neutral': '→'
        };
        const trendArrow = signal.trend ? `<span class="trend-arrow ${signal.trend}">${trendArrows[signal.trend]}</span>` : '';
        
        card.innerHTML = `
            <h3>${signal.name}</h3>
            <span class="value">
                ${signal.value}
                ${trendArrow}
            </span>
            <span class="signal-label ${signalClass}">${signal.signal}</span>
        `;
        
        grid.appendChild(card);
    });
}

// Load and render data
async function loadData() {
    try {
        const response = await fetch(DATA_URL);
        if (!response.ok) throw new Error('Failed to load data');
        
        const data = await response.json();
        
        // Update header
        document.getElementById('lastUpdate').textContent = data.lastUpdate;
        
        // Update Fear & Greed Index
        document.getElementById('fearGreedValue').textContent = data.fearGreedIndex;
        document.getElementById('fearGreedLabel').textContent = data.fearGreedLabel;
        drawGauge(data.fearGreedIndex);
        
        // Add fade-in animation
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
        sentimentBadge.textContent = data.overallSentiment;
        sentimentBadge.className = `badge ${data.overallSentiment.toLowerCase()}`;
        
        // Render signal cards
        renderSignals(data.signals);
        
    } catch (error) {
        console.error('Error loading data:', error);
        document.getElementById('lastUpdate').textContent = 'Error loading data';
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

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    loadData();
    setupRefreshButton();
});
