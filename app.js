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
    
    // Arc color gradient
    const color = getColorForIndex(value);
    gaugeArc.setAttribute('stroke', color);
    
    // Create gradient path effect
    const largeArcFlag = angle > 180 ? 1 : 0;
    const endX = centerX + 80 * Math.cos(radian);
    const endY = centerY + 80 * Math.sin(radian);
    
    // Simple colored arc from start to needle position
    gaugeArc.setAttribute('d', `M 20 100 A 80 80 0 ${largeArcFlag} 1 ${endX} ${endY}`);
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
        card.className = 'signal-card';
        
        // Normalize signal class for CSS
        const signalClass = signal.signal.toLowerCase().replace(/ /g, '-');
        
        card.innerHTML = `
            <h3>${signal.name}</h3>
            <span class="value">${signal.value}</span>
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
        
        // Update BTC Price
        document.getElementById('btcPrice').textContent = formatCurrency(data.btcPrice);
        
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

// Initialize on page load
document.addEventListener('DOMContentLoaded', loadData);
