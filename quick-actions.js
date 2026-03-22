// Quick Actions - Fast access to popular crypto tools
// Links to exchanges, calculators, on-chain data

function renderQuickActions() {
    const actions = [
        {
            icon: '📊',
            label: 'TradingView',
            url: 'https://www.tradingview.com/chart/?symbol=BITSTAMP:BTCUSD',
            color: '#2962ff'
        },
        {
            icon: '💱',
            label: 'Binance',
            url: 'https://www.binance.com/en/trade/BTC_USDT',
            color: '#f0b90b'
        },
        {
            icon: '🔗',
            label: 'Glassnode',
            url: 'https://studio.glassnode.com/charts/btc',
            color: '#00d4aa'
        },
        {
            icon: '📈',
            label: 'CoinGecko',
            url: 'https://www.coingecko.com/en/coins/bitcoin',
            color: '#8dc63f'
        },
        {
            icon: '🧮',
            label: 'BTC Calculator',
            url: 'https://www.btcsatoshi.com/',
            color: '#ff9500'
        },
        {
            icon: '📰',
            label: 'Crypto News',
            url: 'https://cointelegraph.com/',
            color: '#f7931a'
        }
    ];
    
    const actionsHTML = `
        <div class="quick-actions" style="
            display: flex;
            gap: 0.75rem;
            overflow-x: auto;
            padding: 1rem 0;
            margin: 1.5rem 0;
            scrollbar-width: thin;
        ">
            ${actions.map(action => `
                <a href="${action.url}" 
                   target="_blank" 
                   rel="noopener noreferrer"
                   class="quick-action-btn"
                   style="
                       display: flex;
                       flex-direction: column;
                       align-items: center;
                       gap: 0.5rem;
                       padding: 1rem;
                       background: var(--bg-card);
                       border: 1px solid var(--border-color);
                       border-radius: 12px;
                       text-decoration: none;
                       color: var(--text-primary);
                       min-width: 100px;
                       transition: var(--transition-base);
                       cursor: pointer;
                   "
                   onmouseover="this.style.borderColor='${action.color}'; this.style.transform='translateY(-4px)'; this.style.boxShadow='0 8px 16px rgba(0,0,0,0.3)'"
                   onmouseout="this.style.borderColor='var(--border-color)'; this.style.transform='none'; this.style.boxShadow='none'">
                    <span style="font-size: 2rem;">${action.icon}</span>
                    <span style="font-size: 0.875rem; font-weight: 500; white-space: nowrap;">${action.label}</span>
                </a>
            `).join('')}
        </div>
    `;
    
    // Insert after hero card
    const heroCard = document.querySelector('.hero-card');
    if (heroCard) {
        heroCard.insertAdjacentHTML('afterend', actionsHTML);
    }
}

// Auto-load
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(renderQuickActions, 500);
});
