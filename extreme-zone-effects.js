// Extreme Zone Visual Effects
// Enhanced visual feedback for Extreme Fear (<25) and Extreme Greed (>75)

function applyExtremeZoneEffects(fearGreedValue) {
    const value = parseInt(fearGreedValue);
    if (isNaN(value)) return;
    
    const heroCard = document.querySelector('.hero-card');
    const gaugeContainer = document.querySelector('.gauge-container');
    const fearGreedValueEl = document.getElementById('fearGreedValue');
    
    if (!heroCard || !gaugeContainer || !fearGreedValueEl) return;
    
    // Remove all existing extreme classes
    heroCard.classList.remove('extreme-fear-zone', 'extreme-greed-zone');
    gaugeContainer.classList.remove('extreme-glow-red', 'extreme-glow-green');
    fearGreedValueEl.classList.remove('extreme-pulse');
    
    // Apply effects based on zone
    if (value <= 25) {
        // Extreme Fear - BUY SIGNAL
        heroCard.classList.add('extreme-fear-zone');
        gaugeContainer.classList.add('extreme-glow-red');
        fearGreedValueEl.classList.add('extreme-pulse');
        
        // Show opportunity banner
        showExtremeZoneBanner('fear', value);
        
        console.log('🟢 EXTREME FEAR - Buy opportunity!');
        
    } else if (value >= 75) {
        // Extreme Greed - SELL SIGNAL
        heroCard.classList.add('extreme-greed-zone');
        gaugeContainer.classList.add('extreme-glow-green');
        fearGreedValueEl.classList.add('extreme-pulse');
        
        // Show caution banner
        showExtremeZoneBanner('greed', value);
        
        console.log('🔴 EXTREME GREED - Take profits!');
    }
}

function showExtremeZoneBanner(type, value) {
    const existingBanner = document.getElementById('extremeZoneBanner');
    if (existingBanner) existingBanner.remove();
    
    const banner = document.createElement('div');
    banner.id = 'extremeZoneBanner';
    banner.className = `extreme-zone-banner extreme-zone-${type}`;
    
    if (type === 'fear') {
        banner.innerHTML = `
            <span class="banner-icon">🎯</span>
            <div class="banner-content">
                <strong>BUYING OPPORTUNITY</strong>
                <span>Extreme Fear (${value}) — Market oversold, consider DCA entry</span>
            </div>
            <button class="banner-close" onclick="this.parentElement.remove()">×</button>
        `;
    } else {
        banner.innerHTML = `
            <span class="banner-icon">⚠️</span>
            <div class="banner-content">
                <strong>TAKE PROFITS ZONE</strong>
                <span>Extreme Greed (${value}) — Market overheated, consider reducing exposure</span>
            </div>
            <button class="banner-close" onclick="this.parentElement.remove()">×</button>
        `;
    }
    
    const container = document.querySelector('.container');
    const header = document.querySelector('header');
    
    if (container && header) {
        container.insertBefore(banner, header.nextSibling);
        
        // Animate in
        setTimeout(() => banner.classList.add('banner-visible'), 100);
    }
}

// Inject enhanced styles
function injectExtremeZoneStyles() {
    if (document.getElementById('extreme-zone-styles')) return;
    
    const style = document.createElement('style');
    style.id = 'extreme-zone-styles';
    style.textContent = `
        /* Extreme Fear Zone - Red Glow */
        .extreme-glow-red {
            animation: extremeGlowRed 2s ease-in-out infinite;
        }
        
        @keyframes extremeGlowRed {
            0%, 100% {
                filter: drop-shadow(0 0 20px rgba(255, 51, 102, 0.4));
            }
            50% {
                filter: drop-shadow(0 0 40px rgba(255, 51, 102, 0.8));
            }
        }
        
        /* Extreme Greed Zone - Green Glow */
        .extreme-glow-green {
            animation: extremeGlowGreen 2s ease-in-out infinite;
        }
        
        @keyframes extremeGlowGreen {
            0%, 100% {
                filter: drop-shadow(0 0 20px rgba(0, 255, 136, 0.4));
            }
            50% {
                filter: drop-shadow(0 0 40px rgba(0, 255, 136, 0.8));
            }
        }
        
        /* Extreme Value Pulse */
        .extreme-pulse {
            animation: extremePulse 1.5s ease-in-out infinite;
        }
        
        @keyframes extremePulse {
            0%, 100% {
                transform: scale(1);
                opacity: 1;
            }
            50% {
                transform: scale(1.1);
                opacity: 0.9;
            }
        }
        
        /* Hero Card Extreme Zones */
        .extreme-fear-zone {
            border: 2px solid var(--accent-red);
            box-shadow: 
                0 10px 40px rgba(0, 0, 0, 0.3),
                0 0 60px rgba(255, 51, 102, 0.3),
                inset 0 0 80px rgba(255, 51, 102, 0.05);
        }
        
        .extreme-greed-zone {
            border: 2px solid var(--accent-green);
            box-shadow: 
                0 10px 40px rgba(0, 0, 0, 0.3),
                0 0 60px rgba(0, 255, 136, 0.3),
                inset 0 0 80px rgba(0, 255, 136, 0.05);
        }
        
        /* Extreme Zone Banner */
        .extreme-zone-banner {
            display: flex;
            align-items: center;
            gap: 1rem;
            padding: 1rem 1.5rem;
            margin: 1rem 0;
            border-radius: 12px;
            background: var(--bg-card);
            border: 2px solid;
            opacity: 0;
            transform: translateY(-20px);
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .extreme-zone-banner.banner-visible {
            opacity: 1;
            transform: translateY(0);
        }
        
        .extreme-zone-fear {
            border-color: var(--accent-red);
            background: linear-gradient(135deg, 
                rgba(255, 51, 102, 0.1) 0%, 
                rgba(255, 51, 102, 0.05) 100%);
        }
        
        .extreme-zone-greed {
            border-color: var(--accent-green);
            background: linear-gradient(135deg, 
                rgba(0, 255, 136, 0.1) 0%, 
                rgba(0, 255, 136, 0.05) 100%);
        }
        
        .banner-icon {
            font-size: 2rem;
            flex-shrink: 0;
            animation: bannerIconBounce 2s ease-in-out infinite;
        }
        
        @keyframes bannerIconBounce {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-5px); }
        }
        
        .banner-content {
            display: flex;
            flex-direction: column;
            gap: 0.25rem;
            flex: 1;
        }
        
        .banner-content strong {
            font-size: 1.1rem;
            color: var(--text-primary);
        }
        
        .banner-content span {
            font-size: 0.9rem;
            color: var(--text-secondary);
        }
        
        .banner-close {
            background: none;
            border: none;
            color: var(--text-secondary);
            font-size: 1.5rem;
            cursor: pointer;
            padding: 0.25rem 0.5rem;
            border-radius: 4px;
            transition: all 0.2s ease;
        }
        
        .banner-close:hover {
            background: rgba(255, 255, 255, 0.1);
            color: var(--text-primary);
        }
        
        /* Mobile Responsiveness */
        @media (max-width: 768px) {
            .extreme-zone-banner {
                padding: 0.75rem 1rem;
            }
            
            .banner-icon {
                font-size: 1.5rem;
            }
            
            .banner-content strong {
                font-size: 1rem;
            }
            
            .banner-content span {
                font-size: 0.85rem;
            }
        }
    `;
    
    document.head.appendChild(style);
}

// Monitor Fear & Greed value changes
function watchFearGreedValue() {
    const fearGreedValueEl = document.getElementById('fearGreedValue');
    if (!fearGreedValueEl) return;
    
    // Initial check
    const initialValue = fearGreedValueEl.textContent;
    if (initialValue !== '--') {
        applyExtremeZoneEffects(initialValue);
    }
    
    // Watch for changes using MutationObserver
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'childList' || mutation.type === 'characterData') {
                const newValue = fearGreedValueEl.textContent;
                if (newValue !== '--') {
                    applyExtremeZoneEffects(newValue);
                }
            }
        });
    });
    
    observer.observe(fearGreedValueEl, {
        childList: true,
        characterData: true,
        subtree: true
    });
    
    console.log('👁️ Watching Fear & Greed for extreme zones');
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    injectExtremeZoneStyles();
    
    // Wait for app.js to populate the value first
    setTimeout(() => {
        watchFearGreedValue();
    }, 1000);
});

// Re-check on data refresh
document.addEventListener('dataRefreshed', () => {
    const fearGreedValue = document.getElementById('fearGreedValue')?.textContent;
    if (fearGreedValue) {
        applyExtremeZoneEffects(fearGreedValue);
    }
});
