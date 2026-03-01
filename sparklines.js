// Sparklines - Historical data mini-charts
// CoinGecko API for BTC/ETH prices + Alternative.me for Fear & Greed

const COINGECKO_API = 'https://api.coingecko.com/api/v3';
const ALTERNATIVE_API = 'https://api.alternative.me/fng/';

// Fetch historical BTC prices (7 days)
async function fetchBTCHistory() {
    try {
        const response = await fetch(
            `${COINGECKO_API}/coins/bitcoin/market_chart?vs_currency=usd&days=7&interval=daily`
        );
        
        if (!response.ok) throw new Error('Failed to fetch BTC history');
        
        const data = await response.json();
        // Extract prices: [[timestamp, price], ...]
        return data.prices.map(([_, price]) => price);
    } catch (error) {
        console.error('Error fetching BTC history:', error);
        return null;
    }
}

// Fetch historical Fear & Greed Index (7 days)
async function fetchFearGreedHistory() {
    try {
        const response = await fetch(`${ALTERNATIVE_API}?limit=7&format=json`);
        
        if (!response.ok) throw new Error('Failed to fetch F&G history');
        
        const data = await response.json();
        // Reverse to get chronological order (API returns newest first)
        return data.data.reverse().map(item => parseInt(item.value));
    } catch (error) {
        console.error('Error fetching F&G history:', error);
        return null;
    }
}

// Draw sparkline chart
function drawSparkline(canvasId, data, color = '#00ff88') {
    const canvas = document.getElementById(canvasId);
    if (!canvas || !data || data.length === 0) return;
    
    const ctx = canvas.getContext('2d');
    
    // Destroy existing chart if any
    if (canvas.chart) {
        canvas.chart.destroy();
    }
    
    // Determine color based on trend (first vs last value)
    const trendColor = data[data.length - 1] > data[0] ? '#00ff88' : '#ff3366';
    
    // Create gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, trendColor + '80'); // Semi-transparent top
    gradient.addColorStop(1, trendColor + '00'); // Fully transparent bottom
    
    // Chart configuration
    const config = {
        type: 'line',
        data: {
            labels: Array(data.length).fill(''),
            datasets: [{
                data: data,
                borderColor: trendColor,
                backgroundColor: gradient,
                borderWidth: 2,
                fill: true,
                tension: 0.4, // Smooth curves
                pointRadius: 0, // Hide points for clean look
                pointHoverRadius: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: { enabled: false }
            },
            scales: {
                x: { display: false },
                y: { display: false }
            },
            interaction: {
                mode: 'none'
            },
            animation: {
                duration: 1000,
                easing: 'easeOutQuart'
            }
        }
    };
    
    // Create chart
    canvas.chart = new Chart(ctx, config);
}

// Initialize sparklines
async function initSparklines() {
    console.log('🎨 Loading sparklines...');
    
    // Load BTC sparkline
    const btcHistory = await fetchBTCHistory();
    if (btcHistory) {
        drawSparkline('btcSparkline', btcHistory);
        console.log('✅ BTC sparkline loaded');
    }
    
    // Load Fear & Greed sparkline
    const fgHistory = await fetchFearGreedHistory();
    if (fgHistory) {
        drawSparkline('fgSparkline', fgHistory);
        console.log('✅ F&G sparkline loaded');
    }
}

// Auto-initialize when page loads
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSparklines);
} else {
    // DOM already loaded
    initSparklines();
}

// Export for manual refresh
window.refreshSparklines = initSparklines;
