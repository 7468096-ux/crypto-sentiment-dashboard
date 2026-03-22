// ATH/ATL Tracker - Days since All-Time High/Low
// Shows distance from historical extremes

async function renderATHTracker() {
    try {
        // BTC ATH: $69,000 (Nov 10, 2021)
        // BTC 2024 ATH: $73,750 (March 14, 2024) - new ATH!
        const ATH = 73750;
        const ATH_DATE = new Date('2024-03-14');
        
        // BTC 2018 Bear ATL: $3,122 (Dec 15, 2018)
        const ATL = 3122;
        const ATL_DATE = new Date('2018-12-15');
        
        const today = new Date();
        
        // Get current BTC price
        const priceElement = document.getElementById('btcPrice');
        if (!priceElement) return;
        
        const currentPrice = parseFloat(priceElement.textContent.replace(/[$,]/g, ''));
        if (!currentPrice) return;
        
        // Calculate days since ATH/ATL
        const daysSinceATH = Math.floor((today - ATH_DATE) / (1000 * 60 * 60 * 24));
        const daysSinceATL = Math.floor((today - ATL_DATE) / (1000 * 60 * 60 * 24));
        
        // Distance from ATH/ATL
        const distanceFromATH = ((currentPrice - ATH) / ATH * 100).toFixed(1);
        const distanceFromATL = ((currentPrice - ATL) / ATL * 100).toFixed(0);
        
        const trackerHTML = `
            <div class="ath-tracker" style="
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 1rem;
                margin: 1rem 0;
            ">
                <div class="ath-card" style="
                    background: linear-gradient(135deg, rgba(255, 51, 102, 0.1), transparent);
                    border: 1px solid rgba(255, 51, 102, 0.3);
                    border-radius: 12px;
                    padding: 1.5rem;
                ">
                    <div style="display: flex; align-items: center; gap: 0.75rem; margin-bottom: 1rem;">
                        <span style="font-size: 2rem;">🔺</span>
                        <div>
                            <div style="font-size: 0.875rem; color: var(--text-secondary);">All-Time High</div>
                            <div style="font-size: 1.25rem; font-weight: 600; color: var(--accent-red);">
                                $${ATH.toLocaleString()}
                            </div>
                        </div>
                    </div>
                    <div style="font-size: 0.875rem; color: var(--text-secondary); margin-bottom: 0.5rem;">
                        ${daysSinceATH} days ago (${ATH_DATE.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })})
                    </div>
                    <div style="
                        font-size: 1.5rem; 
                        font-weight: 700; 
                        color: ${distanceFromATH >= 0 ? 'var(--accent-green)' : 'var(--accent-red)'};
                    ">
                        ${distanceFromATH >= 0 ? '+' : ''}${distanceFromATH}%
                    </div>
                    <div style="font-size: 0.75rem; color: var(--text-secondary); margin-top: 0.5rem;">
                        ${distanceFromATH >= 0 ? '🎉 New ATH!' : `$${Math.abs(currentPrice - ATH).toLocaleString()} away`}
                    </div>
                </div>
                
                <div class="atl-card" style="
                    background: linear-gradient(135deg, rgba(0, 255, 136, 0.1), transparent);
                    border: 1px solid rgba(0, 255, 136, 0.3);
                    border-radius: 12px;
                    padding: 1.5rem;
                ">
                    <div style="display: flex; align-items: center; gap: 0.75rem; margin-bottom: 1rem;">
                        <span style="font-size: 2rem;">🔻</span>
                        <div>
                            <div style="font-size: 0.875rem; color: var(--text-secondary);">All-Time Low</div>
                            <div style="font-size: 1.25rem; font-weight: 600; color: var(--accent-green);">
                                $${ATL.toLocaleString()}
                            </div>
                        </div>
                    </div>
                    <div style="font-size: 0.875rem; color: var(--text-secondary); margin-bottom: 0.5rem;">
                        ${daysSinceATL} days ago (${ATL_DATE.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })})
                    </div>
                    <div style="
                        font-size: 1.5rem; 
                        font-weight: 700; 
                        color: var(--accent-green);
                    ">
                        +${distanceFromATL}%
                    </div>
                    <div style="font-size: 0.75rem; color: var(--text-secondary); margin-top: 0.5rem;">
                        ${(currentPrice / ATL).toFixed(1)}x since bottom
                    </div>
                </div>
            </div>
        `;
        
        // Insert after BTC price section
        const heroCard = document.querySelector('.hero-card');
        if (heroCard) {
            heroCard.insertAdjacentHTML('afterend', trackerHTML);
        }
        
    } catch (error) {
        console.error('Failed to render ATH tracker:', error);
    }
}

// Auto-load on data refresh
document.addEventListener('dataRefreshed', renderATHTracker);
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(renderATHTracker, 1200);
});
