// BTC Enhanced Metrics Component
// Shows: 24h High/Low, ATH distance, Market Cap, Volume

function renderBTCMetrics(data) {
    // Check if enhanced metrics exist
    if (!data.btcHigh24h && !data.btcATH) return;
    
    const container = document.querySelector('.container');
    if (!container) return;
    
    // Find hero card to insert after it
    const heroCard = document.querySelector('.hero-card');
    if (!heroCard) return;
    
    // Check if metrics card already exists
    let metricsCard = document.getElementById('btcMetricsCard');
    if (!metricsCard) {
        metricsCard = document.createElement('div');
        metricsCard.id = 'btcMetricsCard';
        metricsCard.className = 'btc-metrics-card';
        heroCard.parentNode.insertBefore(metricsCard, heroCard.nextSibling);
    }
    
    // Format large numbers
    const formatLargeNumber = (num) => {
        if (!num) return '--';
        const value = parseFloat(num);
        if (value >= 1e12) return `$${(value / 1e12).toFixed(2)}T`;
        if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
        if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`;
        return `$${value.toLocaleString()}`;
    };
    
    // Format currency
    const formatCurrency = (num) => {
        if (!num) return '--';
        return `$${parseFloat(num).toLocaleString('en-US', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        })}`;
    };
    
    // Calculate 24h range percentage
    let rangePercent = 0;
    if (data.btcHigh24h && data.btcLow24h) {
        const high = parseFloat(data.btcHigh24h);
        const low = parseFloat(data.btcLow24h);
        rangePercent = ((high - low) / low * 100).toFixed(2);
    }
    
    // ATH distance color
    const athChange = parseFloat(data.btcATHChangePercent) || 0;
    const athColor = athChange > -10 ? '#00ff88' : athChange > -30 ? '#ffaa00' : '#ff6644';
    
    // Build metrics HTML
    metricsCard.innerHTML = `
        <h2>📊 Bitcoin Metrics</h2>
        <div class="btc-metrics-grid">
            ${data.btcHigh24h ? `
            <div class="metric-item">
                <div class="metric-label">24h Range</div>
                <div class="metric-value">
                    <span class="range-low">${formatCurrency(data.btcLow24h)}</span>
                    <span class="range-separator">→</span>
                    <span class="range-high">${formatCurrency(data.btcHigh24h)}</span>
                </div>
                <div class="metric-subtext">${rangePercent}% volatility</div>
            </div>
            ` : ''}
            
            ${data.btcATH ? `
            <div class="metric-item">
                <div class="metric-label">All-Time High</div>
                <div class="metric-value">${formatCurrency(data.btcATH)}</div>
                <div class="metric-subtext" style="color: ${athColor}">
                    ${athChange > 0 ? '+' : ''}${athChange.toFixed(1)}% from ATH
                </div>
            </div>
            ` : ''}
            
            ${data.btcMarketCap ? `
            <div class="metric-item">
                <div class="metric-label">Market Cap</div>
                <div class="metric-value">${formatLargeNumber(data.btcMarketCap)}</div>
                <div class="metric-subtext">
                    ${data.btcDominance ? `${data.btcDominance}% dominance` : ''}
                </div>
            </div>
            ` : ''}
            
            ${data.btcVolume24h ? `
            <div class="metric-item">
                <div class="metric-label">24h Volume</div>
                <div class="metric-value">${formatLargeNumber(data.btcVolume24h)}</div>
                <div class="metric-subtext">Trading activity</div>
            </div>
            ` : ''}
        </div>
    `;
    
    // Add fade-in animation
    metricsCard.style.animation = 'fadeIn 0.5s ease-out';
}

// Add CSS styles
const style = document.createElement('style');
style.textContent = `
.btc-metrics-card {
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.03) 0%, rgba(255, 255, 255, 0.01) 100%);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 20px;
    padding: 30px;
    margin-bottom: 30px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
}

.btc-metrics-card h2 {
    margin: 0 0 20px 0;
    font-size: 1.5rem;
    color: #fff;
    font-weight: 600;
}

.btc-metrics-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 20px;
}

.metric-item {
    background: rgba(255, 255, 255, 0.02);
    border: 1px solid rgba(255, 255, 255, 0.05);
    border-radius: 12px;
    padding: 15px;
    transition: all 0.3s ease;
}

.metric-item:hover {
    background: rgba(255, 255, 255, 0.05);
    border-color: rgba(255, 255, 255, 0.1);
    transform: translateY(-2px);
}

.metric-label {
    font-size: 0.85rem;
    color: rgba(255, 255, 255, 0.6);
    margin-bottom: 8px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    font-weight: 500;
}

.metric-value {
    font-size: 1.3rem;
    color: #fff;
    font-weight: 600;
    margin-bottom: 5px;
}

.metric-subtext {
    font-size: 0.85rem;
    color: rgba(255, 255, 255, 0.5);
}

.range-low {
    color: #ff6644;
}

.range-high {
    color: #00ff88;
}

.range-separator {
    color: rgba(255, 255, 255, 0.3);
    margin: 0 8px;
}

@media (max-width: 768px) {
    .btc-metrics-grid {
        grid-template-columns: repeat(2, 1fr);
        gap: 15px;
    }
    
    .btc-metrics-card {
        padding: 20px;
    }
    
    .metric-value {
        font-size: 1.1rem;
    }
}

@media (max-width: 480px) {
    .btc-metrics-grid {
        grid-template-columns: 1fr;
    }
}

@keyframes fadeIn {
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
document.head.appendChild(style);

// Export for use in app.js
window.renderBTCMetrics = renderBTCMetrics;

console.log('✅ BTC Enhanced Metrics loaded');
