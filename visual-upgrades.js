// VISUAL UPGRADES
// Enhanced visual effects and market temperature indicator

// ========== MARKET TEMPERATURE THERMOMETER ==========

function createMarketThermometer() {
    const sentimentBadge = document.querySelector('.sentiment-badge');
    if (!sentimentBadge) return;
    
    // Check if already exists
    if (document.getElementById('marketThermometer')) return;
    
    const thermometer = document.createElement('div');
    thermometer.id = 'marketThermometer';
    thermometer.className = 'market-thermometer';
    thermometer.innerHTML = `
        <div class="thermometer-container">
            <div class="thermometer-label">Market Temperature</div>
            <div class="thermometer-visual">
                <div class="thermometer-scale">
                    <div class="scale-mark extreme-cold"><span>❄️</span><span class="scale-text">Extreme Fear</span></div>
                    <div class="scale-mark cold"><span>🧊</span><span class="scale-text">Fear</span></div>
                    <div class="scale-mark neutral"><span>🌡️</span><span class="scale-text">Neutral</span></div>
                    <div class="scale-mark warm"><span>🔥</span><span class="scale-text">Greed</span></div>
                    <div class="scale-mark extreme-hot"><span>🌋</span><span class="scale-text">Extreme Greed</span></div>
                </div>
                <div class="thermometer-bar">
                    <div class="thermometer-fill" id="thermometerFill"></div>
                    <div class="thermometer-marker" id="thermometerMarker">
                        <div class="marker-pulse"></div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    sentimentBadge.parentNode.insertBefore(thermometer, sentimentBadge);
}

function updateThermometer(fearGreedValue) {
    const fill = document.getElementById('thermometerFill');
    const marker = document.getElementById('thermometerMarker');
    
    if (!fill || !marker) return;
    
    // Calculate position (0-100%)
    const percentage = fearGreedValue;
    
    // Update fill
    fill.style.width = `${percentage}%`;
    
    // Update marker position
    marker.style.left = `${percentage}%`;
    
    // Update fill color based on zone
    let color, emoji;
    if (fearGreedValue <= 25) {
        color = 'linear-gradient(90deg, #4d9fff, #00d4ff)';
        emoji = '❄️';
    } else if (fearGreedValue <= 45) {
        color = 'linear-gradient(90deg, #00d4ff, #00ff88)';
        emoji = '🧊';
    } else if (fearGreedValue <= 55) {
        color = 'linear-gradient(90deg, #00ff88, #ffaa00)';
        emoji = '🌡️';
    } else if (fearGreedValue <= 75) {
        color = 'linear-gradient(90deg, #ffaa00, #ff6644)';
        emoji = '🔥';
    } else {
        color = 'linear-gradient(90deg, #ff6644, #ff3366)';
        emoji = '🌋';
    }
    
    fill.style.background = color;
    
    // Update marker emoji
    const markerPulse = marker.querySelector('.marker-pulse');
    if (markerPulse) {
        markerPulse.textContent = emoji;
    }
    
    // Animate
    fill.style.transition = 'width 1s cubic-bezier(0.4, 0, 0.2, 1)';
    marker.style.transition = 'left 1s cubic-bezier(0.4, 0, 0.2, 1)';
}

// ========== GRADIENT CARDS ENHANCEMENT ==========

function enhanceCardGradients() {
    const signalCards = document.querySelectorAll('.signal-card');
    
    signalCards.forEach((card, index) => {
        // Add gradient overlay
        if (!card.querySelector('.card-gradient-overlay')) {
            const overlay = document.createElement('div');
            overlay.className = 'card-gradient-overlay';
            card.appendChild(overlay);
        }
        
        // Add hover particle effect
        card.addEventListener('mouseenter', (e) => {
            createParticles(card, e);
        });
    });
}

function createParticles(card, event) {
    const particleCount = 8;
    const rect = card.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'hover-particle';
        particle.style.left = `${x}px`;
        particle.style.top = `${y}px`;
        
        const angle = (Math.PI * 2 * i) / particleCount;
        const velocity = 2 + Math.random() * 2;
        const tx = Math.cos(angle) * velocity * 20;
        const ty = Math.sin(angle) * velocity * 20;
        
        particle.style.setProperty('--tx', `${tx}px`);
        particle.style.setProperty('--ty', `${ty}px`);
        
        card.appendChild(particle);
        
        setTimeout(() => particle.remove(), 1000);
    }
}

// ========== PRICE DIFF VISUAL ==========

function enhancePriceDiff() {
    const btcChange = document.getElementById('btcChange');
    if (!btcChange) return;
    
    const changeText = btcChange.textContent;
    const isPositive = changeText.includes('↑');
    const isNegative = changeText.includes('↓');
    
    if (isPositive || isNegative) {
        // Add animated background
        if (!btcChange.querySelector('.change-glow')) {
            const glow = document.createElement('div');
            glow.className = 'change-glow';
            btcChange.style.position = 'relative';
            btcChange.appendChild(glow);
        }
    }
}

// ========== LOADING SKELETON IMPROVEMENT ==========

function improveLoadingSkeleton() {
    const style = document.createElement('style');
    style.textContent = `
        .skeleton {
            background: linear-gradient(
                90deg,
                rgba(26, 26, 26, 0.8) 0%,
                rgba(77, 159, 255, 0.2) 50%,
                rgba(26, 26, 26, 0.8) 100%
            );
            background-size: 200% 100%;
            animation: shimmer 1.5s infinite;
            border-radius: 12px;
            position: relative;
            overflow: hidden;
        }
        
        .skeleton::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(
                90deg,
                transparent,
                rgba(255, 255, 255, 0.1),
                transparent
            );
            animation: slide 1.5s infinite;
        }
        
        @keyframes shimmer {
            0% { background-position: -200% 0; }
            100% { background-position: 200% 0; }
        }
        
        @keyframes slide {
            0% { left: -100%; }
            100% { left: 100%; }
        }
    `;
    document.head.appendChild(style);
}

// ========== PULSE EFFECT ON VALUE CHANGE ==========

function watchValueChanges() {
    const fearGreedValue = document.getElementById('fearGreedValue');
    const btcPrice = document.getElementById('btcPrice');
    
    if (!fearGreedValue || !btcPrice) return;
    
    // Store previous values
    let prevFG = fearGreedValue.textContent;
    let prevBTC = btcPrice.textContent;
    
    // Check for changes every 30 seconds
    setInterval(() => {
        const currentFG = fearGreedValue.textContent;
        const currentBTC = btcPrice.textContent;
        
        if (currentFG !== prevFG) {
            triggerPulseEffect(fearGreedValue);
            prevFG = currentFG;
        }
        
        if (currentBTC !== prevBTC) {
            triggerPulseEffect(btcPrice);
            prevBTC = currentBTC;
        }
    }, 30000);
}

function triggerPulseEffect(element) {
    element.classList.add('value-changed');
    setTimeout(() => {
        element.classList.remove('value-changed');
    }, 600);
}

// ========== STYLES ==========

function injectVisualStyles() {
    const style = document.createElement('style');
    style.id = 'visual-upgrades-styles';
    style.textContent = `
        /* Market Thermometer */
        .market-thermometer {
            margin: 2rem auto;
            padding: 1.5rem;
            max-width: 800px;
        }
        
        .thermometer-container {
            background: var(--bg-card);
            border: 1px solid var(--border-color);
            border-radius: 16px;
            padding: 1.5rem;
            backdrop-filter: blur(10px);
        }
        
        .thermometer-label {
            text-align: center;
            font-size: 1rem;
            color: var(--text-secondary);
            margin-bottom: 1.5rem;
            text-transform: uppercase;
            letter-spacing: 2px;
            font-weight: 600;
        }
        
        .thermometer-visual {
            position: relative;
            width: 100%;
        }
        
        .thermometer-scale {
            display: flex;
            justify-content: space-between;
            margin-bottom: 1rem;
            padding: 0 10px;
        }
        
        .scale-mark {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 0.25rem;
        }
        
        .scale-mark span:first-child {
            font-size: 1.5rem;
        }
        
        .scale-text {
            font-size: 0.7rem;
            color: var(--text-secondary);
            text-align: center;
            white-space: nowrap;
        }
        
        .thermometer-bar {
            position: relative;
            width: 100%;
            height: 30px;
            background: linear-gradient(
                90deg,
                rgba(77, 159, 255, 0.2) 0%,
                rgba(0, 255, 136, 0.2) 50%,
                rgba(255, 51, 102, 0.2) 100%
            );
            border-radius: 15px;
            border: 2px solid var(--border-color);
            overflow: visible;
        }
        
        .thermometer-fill {
            position: absolute;
            left: 0;
            top: 0;
            height: 100%;
            background: linear-gradient(90deg, #4d9fff, #00ff88);
            border-radius: 15px;
            transition: width 1s cubic-bezier(0.4, 0, 0.2, 1);
            box-shadow: 0 0 20px currentColor;
        }
        
        .thermometer-marker {
            position: absolute;
            top: 50%;
            transform: translate(-50%, -50%);
            width: 50px;
            height: 50px;
            transition: left 1s cubic-bezier(0.4, 0, 0.2, 1);
            z-index: 10;
        }
        
        .marker-pulse {
            width: 100%;
            height: 100%;
            background: var(--bg-dark);
            border: 3px solid var(--accent-green);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.8rem;
            box-shadow: 
                0 0 20px rgba(0, 255, 136, 0.5),
                inset 0 0 10px rgba(0, 255, 136, 0.3);
            animation: markerPulse 2s ease-in-out infinite;
        }
        
        @keyframes markerPulse {
            0%, 100% {
                transform: scale(1);
                box-shadow: 
                    0 0 20px rgba(0, 255, 136, 0.5),
                    inset 0 0 10px rgba(0, 255, 136, 0.3);
            }
            50% {
                transform: scale(1.1);
                box-shadow: 
                    0 0 30px rgba(0, 255, 136, 0.8),
                    inset 0 0 15px rgba(0, 255, 136, 0.5);
            }
        }
        
        /* Card Gradient Overlay */
        .card-gradient-overlay {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: radial-gradient(
                circle at var(--mouse-x, 50%) var(--mouse-y, 50%),
                rgba(77, 159, 255, 0.1) 0%,
                transparent 50%
            );
            opacity: 0;
            transition: opacity 0.3s ease;
            pointer-events: none;
            border-radius: inherit;
        }
        
        .signal-card:hover .card-gradient-overlay {
            opacity: 1;
        }
        
        /* Hover Particles */
        .hover-particle {
            position: absolute;
            width: 6px;
            height: 6px;
            background: var(--accent-green);
            border-radius: 50%;
            pointer-events: none;
            animation: particleFly 1s ease-out forwards;
            box-shadow: 0 0 10px var(--accent-green);
        }
        
        @keyframes particleFly {
            0% {
                transform: translate(0, 0) scale(1);
                opacity: 1;
            }
            100% {
                transform: translate(var(--tx), var(--ty)) scale(0);
                opacity: 0;
            }
        }
        
        /* Price Change Glow */
        .change-glow {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 120%;
            height: 120%;
            border-radius: 8px;
            pointer-events: none;
            z-index: -1;
            animation: glowPulse 2s ease-in-out infinite;
        }
        
        .price-change.positive .change-glow {
            background: radial-gradient(circle, rgba(0, 255, 136, 0.3) 0%, transparent 70%);
        }
        
        .price-change.negative .change-glow {
            background: radial-gradient(circle, rgba(255, 51, 102, 0.3) 0%, transparent 70%);
        }
        
        @keyframes glowPulse {
            0%, 100% {
                opacity: 0.5;
                transform: translate(-50%, -50%) scale(1);
            }
            50% {
                opacity: 1;
                transform: translate(-50%, -50%) scale(1.05);
            }
        }
        
        /* Value Change Pulse */
        .value-changed {
            animation: valuePulse 0.6s ease-out !important;
        }
        
        @keyframes valuePulse {
            0% {
                transform: scale(1);
            }
            50% {
                transform: scale(1.1);
                filter: brightness(1.5);
            }
            100% {
                transform: scale(1);
            }
        }
        
        /* Enhanced Card Shadows */
        .signal-card {
            box-shadow: 
                0 4px 6px rgba(0, 0, 0, 0.1),
                0 1px 3px rgba(0, 0, 0, 0.08);
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .signal-card:hover {
            box-shadow: 
                0 12px 24px rgba(0, 0, 0, 0.2),
                0 6px 12px rgba(77, 159, 255, 0.15),
                0 0 40px rgba(77, 159, 255, 0.1);
        }
        
        /* Gauge Enhanced Glow */
        .gauge svg {
            filter: drop-shadow(0 4px 12px rgba(0, 0, 0, 0.5));
            transition: filter 0.3s ease;
        }
        
        .gauge:hover svg {
            filter: 
                drop-shadow(0 6px 16px rgba(0, 255, 136, 0.4))
                drop-shadow(0 0 30px rgba(77, 159, 255, 0.3));
        }
        
        /* Hero Card Enhanced */
        .hero-card {
            box-shadow: 
                0 8px 16px rgba(0, 0, 0, 0.15),
                0 0 40px rgba(77, 159, 255, 0.05);
        }
        
        /* Mobile adjustments */
        @media (max-width: 768px) {
            .market-thermometer {
                padding: 1rem;
            }
            
            .thermometer-container {
                padding: 1rem;
            }
            
            .scale-text {
                font-size: 0.6rem;
            }
            
            .scale-mark span:first-child {
                font-size: 1.2rem;
            }
            
            .thermometer-marker {
                width: 40px;
                height: 40px;
            }
            
            .marker-pulse {
                font-size: 1.4rem;
            }
        }
    `;
    
    if (!document.getElementById('visual-upgrades-styles')) {
        document.head.appendChild(style);
    }
}

// ========== INITIALIZATION ==========

document.addEventListener('DOMContentLoaded', () => {
    injectVisualStyles();
    improveLoadingSkeleton();
    
    setTimeout(() => {
        createMarketThermometer();
        enhanceCardGradients();
        enhancePriceDiff();
        watchValueChanges();
        
        // Update thermometer with initial value
        const fgValue = document.getElementById('fearGreedValue');
        if (fgValue) {
            const value = parseInt(fgValue.textContent);
            if (!isNaN(value)) {
                updateThermometer(value);
            }
        }
        
        console.log('✅ Visual upgrades loaded');
    }, 1200);
});

// Update thermometer on data refresh
document.addEventListener('dataRefreshed', () => {
    const fgValue = document.getElementById('fearGreedValue');
    if (fgValue) {
        const value = parseInt(fgValue.textContent);
        if (!isNaN(value)) {
            setTimeout(() => updateThermometer(value), 300);
        }
    }
    
    enhancePriceDiff();
});

// Track mouse for gradient effect
document.addEventListener('mousemove', (e) => {
    const cards = document.querySelectorAll('.signal-card');
    cards.forEach(card => {
        const rect = card.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        
        const overlay = card.querySelector('.card-gradient-overlay');
        if (overlay) {
            overlay.style.setProperty('--mouse-x', `${x}%`);
            overlay.style.setProperty('--mouse-y', `${y}%`);
        }
    });
});
