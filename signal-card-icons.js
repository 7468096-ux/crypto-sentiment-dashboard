// Enhanced Signal Card Icons
// Adds professional SVG icons to signal cards for better visual hierarchy

const SIGNAL_ICONS = {
    'Fear & Greed': `
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 2v20M2 12h20M6.343 6.343l11.314 11.314M17.657 6.343L6.343 17.657"/>
        </svg>
    `,
    'BTC Dominance': `
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 2L2 7l10 5 10-5-10-5z"/>
            <path d="M2 17l10 5 10-5"/>
            <path d="M2 12l10 5 10-5"/>
        </svg>
    `,
    'Whale Activity': `
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M2.5 16.5c-1-1 0.5-4.5 3-6s5.5-1.5 8-1c2.5.5 4.5 2 5 3.5s-1 3.5-3 4-5 0-7.5-1.5"/>
            <circle cx="8" cy="12" r="1" fill="currentColor"/>
            <path d="M18 11c.5.5 1.5.5 2 0"/>
        </svg>
    `,
    'ETF Flows': `
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="12" y1="1" x2="12" y2="23"/>
            <polyline points="8 9 12 5 16 9"/>
            <polyline points="8 15 12 19 16 15"/>
        </svg>
    `,
    'Fed Policy': `
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="3" width="7" height="7"/>
            <rect x="14" y="3" width="7" height="7"/>
            <rect x="14" y="14" width="7" height="7"/>
            <rect x="3" y="14" width="7" height="7"/>
        </svg>
    `
};

function enhanceSignalCards() {
    const signalCards = document.querySelectorAll('.signal-card');
    if (!signalCards.length) return;
    
    signalCards.forEach(card => {
        const heading = card.querySelector('h3');
        if (!heading) return;
        
        const cardName = heading.textContent.trim();
        const icon = SIGNAL_ICONS[cardName];
        
        if (!icon) return;
        
        // Check if icon already added
        if (card.querySelector('.card-icon')) return;
        
        // Create icon container
        const iconContainer = document.createElement('div');
        iconContainer.className = 'card-icon';
        iconContainer.innerHTML = icon;
        
        // Insert at the beginning of the card
        card.insertBefore(iconContainer, card.firstChild);
        
        // Add enhanced class
        card.classList.add('card-with-icon');
    });
    
    console.log(`✨ Enhanced ${signalCards.length} signal cards with icons`);
}

// Inject styles
function injectSignalCardIconStyles() {
    if (document.getElementById('signal-card-icon-styles')) return;
    
    const style = document.createElement('style');
    style.id = 'signal-card-icon-styles';
    style.textContent = `
        /* Card Icon Container */
        .card-icon {
            position: absolute;
            top: 1rem;
            right: 1rem;
            width: 48px;
            height: 48px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: rgba(255, 255, 255, 0.05);
            border-radius: 12px;
            border: 1px solid rgba(255, 255, 255, 0.1);
            transition: all 0.3s ease;
            opacity: 0.6;
        }
        
        .card-icon svg {
            color: var(--text-secondary);
            transition: all 0.3s ease;
        }
        
        /* Icon glow on hover */
        .signal-card:hover .card-icon {
            opacity: 1;
            background: rgba(255, 255, 255, 0.1);
            border-color: rgba(77, 159, 255, 0.5);
            box-shadow: 0 0 20px rgba(77, 159, 255, 0.3);
        }
        
        .signal-card:hover .card-icon svg {
            color: var(--accent-blue);
            transform: scale(1.1) rotate(-5deg);
        }
        
        /* Different colors for different signal types */
        .signal-card:has(h3:contains("Fear & Greed")):hover .card-icon {
            border-color: rgba(255, 170, 0, 0.5);
            box-shadow: 0 0 20px rgba(255, 170, 0, 0.3);
        }
        
        .signal-card:has(h3:contains("Fear & Greed")):hover .card-icon svg {
            color: var(--accent-yellow);
        }
        
        .signal-card:has(h3:contains("Whale")):hover .card-icon {
            border-color: rgba(0, 255, 136, 0.5);
            box-shadow: 0 0 20px rgba(0, 255, 136, 0.3);
        }
        
        .signal-card:has(h3:contains("Whale")):hover .card-icon svg {
            color: var(--accent-green);
        }
        
        .signal-card:has(h3:contains("ETF")):hover .card-icon {
            border-color: rgba(157, 78, 221, 0.5);
            box-shadow: 0 0 20px rgba(157, 78, 221, 0.3);
        }
        
        .signal-card:has(h3:contains("ETF")):hover .card-icon svg {
            color: var(--accent-purple);
        }
        
        /* Mobile adjustments */
        @media (max-width: 768px) {
            .card-icon {
                width: 40px;
                height: 40px;
                top: 0.75rem;
                right: 0.75rem;
            }
            
            .card-icon svg {
                width: 24px;
                height: 24px;
            }
        }
        
        /* Light theme adjustments */
        [data-theme="light"] .card-icon {
            background: rgba(0, 0, 0, 0.05);
            border-color: rgba(0, 0, 0, 0.1);
        }
        
        [data-theme="light"] .signal-card:hover .card-icon {
            background: rgba(0, 0, 0, 0.08);
        }
    `;
    
    document.head.appendChild(style);
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    injectSignalCardIconStyles();
    
    // Wait for signal cards to be rendered by app.js
    setTimeout(() => {
        enhanceSignalCards();
    }, 1500);
});

// Re-enhance after data refresh
document.addEventListener('dataRefreshed', () => {
    setTimeout(enhanceSignalCards, 500);
});
