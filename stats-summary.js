// Weekly Statistics Summary Widget
// Displays average F&G, volatility, and key insights

async function renderWeeklyStats() {
    try {
        const response = await fetch('./data/history.json?t=' + Date.now());
        if (!response.ok) return;
        
        const history = await response.json();
        if (!history || history.length < 7) return;
        
        // Calculate weekly stats
        const last7Days = history.slice(0, 7);
        const avgFG = Math.round(last7Days.reduce((sum, d) => sum + d.fearGreed, 0) / 7);
        const minFG = Math.min(...last7Days.map(d => d.fearGreed));
        const maxFG = Math.max(...last7Days.map(d => d.fearGreed));
        const avgPrice = Math.round(last7Days.reduce((sum, d) => sum + d.btcPrice, 0) / 7);
        const volatility = ((maxFG - minFG) / avgFG * 100).toFixed(1);
        
        // Days in current zone
        const currentFG = history[0].fearGreed;
        const getZone = (v) => v <= 25 ? 'Extreme Fear' : v <= 45 ? 'Fear' : v <= 55 ? 'Neutral' : v <= 75 ? 'Greed' : 'Extreme Greed';
        const currentZone = getZone(currentFG);
        let daysInZone = 1;
        for (let i = 1; i < history.length; i++) {
            if (getZone(history[i].fearGreed) === currentZone) daysInZone++;
            else break;
        }
        
        // Create stats widget
        const statsHTML = `
            <div class="stats-summary fade-in" style="
                background: var(--bg-card);
                border: 1px solid var(--border-color);
                border-radius: 12px;
                padding: 1.5rem;
                margin: 1.5rem 0;
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
                gap: 1rem;
            ">
                <div class="stat-item" style="text-align: center;">
                    <div style="font-size: 0.875rem; color: var(--text-secondary); margin-bottom: 0.5rem;">
                        7-Day Avg F&G
                    </div>
                    <div style="font-size: 1.75rem; font-weight: 600; color: ${getColorForZone(avgFG)};">
                        ${avgFG}
                    </div>
                </div>
                <div class="stat-item" style="text-align: center;">
                    <div style="font-size: 0.875rem; color: var(--text-secondary); margin-bottom: 0.5rem;">
                        Volatility
                    </div>
                    <div style="font-size: 1.75rem; font-weight: 600; color: ${parseFloat(volatility) > 30 ? 'var(--accent-red)' : 'var(--accent-green)'};">
                        ${volatility}%
                    </div>
                </div>
                <div class="stat-item" style="text-align: center;">
                    <div style="font-size: 0.875rem; color: var(--text-secondary); margin-bottom: 0.5rem;">
                        Range (7D)
                    </div>
                    <div style="font-size: 1.25rem; font-weight: 600; color: var(--text-primary);">
                        ${minFG} - ${maxFG}
                    </div>
                </div>
                <div class="stat-item" style="text-align: center;">
                    <div style="font-size: 0.875rem; color: var(--text-secondary); margin-bottom: 0.5rem;">
                        Days in ${currentZone}
                    </div>
                    <div style="font-size: 1.75rem; font-weight: 600; color: var(--accent-blue);">
                        ${daysInZone}
                    </div>
                </div>
            </div>
        `;
        
        // Insert after sentiment badge
        const sentimentBadge = document.querySelector('.sentiment-badge');
        if (sentimentBadge) {
            sentimentBadge.insertAdjacentHTML('afterend', statsHTML);
        }
        
    } catch (error) {
        console.error('Failed to render weekly stats:', error);
    }
}

function getColorForZone(value) {
    if (value <= 25) return '#ff3366';
    if (value <= 45) return '#ff6644';
    if (value <= 55) return '#ffaa00';
    if (value <= 75) return '#88ff44';
    return '#00ff88';
}

// Auto-load on data refresh
document.addEventListener('dataRefreshed', renderWeeklyStats);
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(renderWeeklyStats, 1000);
});
