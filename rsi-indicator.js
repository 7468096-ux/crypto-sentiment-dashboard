// RSI Indicator - March 23, 2026
// Calculate and display Relative Strength Index

(function() {
    'use strict';
    
    const RSI_PERIOD = 14; // Standard RSI period
    
    // Calculate RSI from price history
    function calculateRSI(prices, period = RSI_PERIOD) {
        if (prices.length < period + 1) {
            return null; // Not enough data
        }
        
        const changes = [];
        for (let i = 1; i < prices.length; i++) {
            changes.push(prices[i] - prices[i - 1]);
        }
        
        // Separate gains and losses
        const gains = changes.map(c => c > 0 ? c : 0);
        const losses = changes.map(c => c < 0 ? Math.abs(c) : 0);
        
        // Calculate average gain and loss
        const avgGain = gains.slice(0, period).reduce((a, b) => a + b, 0) / period;
        const avgLoss = losses.slice(0, period).reduce((a, b) => a + b, 0) / period;
        
        if (avgLoss === 0) return 100; // All gains, RSI = 100
        
        const rs = avgGain / avgLoss;
        const rsi = 100 - (100 / (1 + rs));
        
        return rsi;
    }
    
    // Get RSI interpretation
    function getRSISignal(rsi) {
        if (rsi >= 70) {
            return {
                label: 'overbought',
                description: 'RSI > 70: Overbought, potential sell signal',
                color: '#ef4444',
                trend: 'down'
            };
        } else if (rsi <= 30) {
            return {
                label: 'oversold',
                description: 'RSI < 30: Oversold, potential buy signal',
                color: '#10b981',
                trend: 'up'
            };
        } else if (rsi >= 60) {
            return {
                label: 'strong',
                description: 'RSI 60-70: Strong bullish momentum',
                color: '#88ff44',
                trend: 'up'
            };
        } else if (rsi <= 40) {
            return {
                label: 'weak',
                description: 'RSI 30-40: Weak, potential reversal',
                color: '#ff6644',
                trend: 'down'
            };
        } else {
            return {
                label: 'neutral',
                description: 'RSI 40-60: Neutral, no clear signal',
                color: '#ffaa00',
                trend: 'neutral'
            };
        }
    }
    
    // Add RSI card to dashboard
    async function addRSICard() {
        try {
            // Fetch historical data
            const response = await fetch('./data/history.json?t=' + Date.now());
            if (!response.ok) {
                console.warn('Could not load history for RSI calculation');
                return;
            }
            
            const history = await response.json();
            
            if (!history || history.length < RSI_PERIOD + 1) {
                console.warn('Not enough historical data for RSI');
                return;
            }
            
            // Extract prices (most recent first, so reverse for calculation)
            const prices = history.map(d => d.btcPrice).reverse();
            
            // Calculate RSI
            const rsi = calculateRSI(prices);
            
            if (rsi === null) {
                console.warn('RSI calculation failed');
                return;
            }
            
            const signal = getRSISignal(rsi);
            
            // Find the signals grid
            const grid = document.getElementById('signalsGrid');
            if (!grid) return;
            
            // Check if RSI card already exists
            if (document.getElementById('rsiCard')) return;
            
            // Create RSI card
            const card = document.createElement('div');
            card.id = 'rsiCard';
            card.className = 'signal-card fade-in rsi-card';
            card.style.animationDelay = '0.5s';
            
            // Trend arrow
            const trendArrows = {
                'up': '↑',
                'down': '↓',
                'neutral': '→'
            };
            const trendArrow = `<span class="trend-arrow ${signal.trend}">${trendArrows[signal.trend]}</span>`;
            
            card.innerHTML = `
                <h3 class="tooltip">
                    RSI (${RSI_PERIOD})
                    <span class="tooltip-text">
                        Relative Strength Index measures momentum from 0-100. 
                        ${signal.description}
                    </span>
                </h3>
                <span class="value" style="color: ${signal.color}">
                    ${rsi.toFixed(1)}
                    ${trendArrow}
                </span>
                <span class="signal-label ${signal.label}">${signal.label}</span>
                <div class="rsi-bar-container">
                    <div class="rsi-bar" style="width: ${rsi}%; background: ${signal.color}"></div>
                    <div class="rsi-zones">
                        <span class="zone-marker" style="left: 30%">30</span>
                        <span class="zone-marker" style="left: 70%">70</span>
                    </div>
                </div>
            `;
            
            // Insert after first signal card (Fear & Greed)
            const firstCard = grid.querySelector('.signal-card');
            if (firstCard && firstCard.nextSibling) {
                grid.insertBefore(card, firstCard.nextSibling);
            } else {
                grid.appendChild(card);
            }
            
            console.log(`✅ RSI added: ${rsi.toFixed(1)} (${signal.label})`);
            
        } catch (error) {
            console.error('Error adding RSI card:', error);
        }
    }
    
    // Add custom CSS for RSI bar
    const style = document.createElement('style');
    style.textContent = `
        .rsi-card .value {
            font-size: 2rem;
            font-weight: 700;
        }
        
        .rsi-bar-container {
            position: relative;
            width: 100%;
            height: 8px;
            background: var(--bg-dark);
            border-radius: 4px;
            margin-top: 12px;
            overflow: hidden;
        }
        
        .rsi-bar {
            height: 100%;
            border-radius: 4px;
            transition: width 1s cubic-bezier(0.4, 0, 0.2, 1);
            box-shadow: 0 0 8px currentColor;
        }
        
        .rsi-zones {
            position: absolute;
            top: -20px;
            left: 0;
            width: 100%;
            height: 20px;
            font-size: 10px;
            color: var(--text-secondary);
        }
        
        .zone-marker {
            position: absolute;
            transform: translateX(-50%);
        }
        
        .zone-marker::after {
            content: '';
            position: absolute;
            top: 100%;
            left: 50%;
            width: 1px;
            height: 8px;
            background: var(--text-secondary);
            opacity: 0.3;
        }
    `;
    document.head.appendChild(style);
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            setTimeout(addRSICard, 500); // Wait for other cards to load
        });
    } else {
        setTimeout(addRSICard, 500);
    }
    
})();
