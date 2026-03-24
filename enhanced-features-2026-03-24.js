// ENHANCED FEATURES - 2026-03-24
// Additional functionality improvements

(function() {
    'use strict';
    
    // ==================== ATH/ATL TRACKER ====================
    
    function initATHTracker() {
        const athData = {
            ath: 108268, // BTC ATH (Dec 2024)
            athDate: '2024-12-17',
            atl: 67060, // Recent ATL
            atlDate: '2024-08-05'
        };
        
        // Calculate distance from ATH/ATL
        function updateATHIndicators() {
            const currentPrice = parseFloat(document.getElementById('btcPrice')?.textContent.replace(/[$,]/g, ''));
            
            if (!currentPrice || isNaN(currentPrice)) return;
            
            const athDistance = ((currentPrice - athData.ath) / athData.ath * 100).toFixed(1);
            const atlDistance = ((currentPrice - athData.atl) / athData.atl * 100).toFixed(1);
            
            // Find or create ATH indicator
            let athIndicator = document.querySelector('.ath-indicator');
            if (!athIndicator) {
                athIndicator = document.createElement('div');
                athIndicator.className = 'ath-indicator';
                athIndicator.style.cssText = `
                    font-size: 0.85rem;
                    color: var(--text-secondary);
                    margin-top: 0.5rem;
                    display: flex;
                    gap: 1rem;
                    justify-content: center;
                `;
                
                const priceContainer = document.querySelector('.btc-price');
                if (priceContainer) {
                    priceContainer.appendChild(athIndicator);
                }
            }
            
            const athColor = athDistance >= 0 ? 'var(--accent-green)' : 'var(--accent-orange)';
            const atlColor = atlDistance >= 0 ? 'var(--accent-green)' : 'var(--accent-red)';
            
            athIndicator.innerHTML = `
                <span title="Distance from All-Time High ($${athData.ath.toLocaleString()})">
                    ATH: <strong style="color: ${athColor}">${athDistance}%</strong>
                </span>
                <span title="Distance from Recent Low ($${athData.atl.toLocaleString()})">
                    ATL: <strong style="color: ${atlColor}">+${atlDistance}%</strong>
                </span>
            `;
        }
        
        // Update on data load
        window.addEventListener('dataLoaded', updateATHIndicators);
        setTimeout(updateATHIndicators, 1000);
    }
    
    // ==================== MARKET SNAPSHOT WITH RICH FORMATTING ====================
    
    function enhanceSnapshotCopy() {
        const shareBtn = document.getElementById('shareBtn');
        if (!shareBtn) return;
        
        shareBtn.addEventListener('click', function() {
            const fearGreed = document.getElementById('fearGreedValue')?.textContent || '--';
            const fearGreedLabel = document.getElementById('fearGreedLabel')?.textContent || '';
            const btcPrice = document.getElementById('btcPrice')?.textContent || '--';
            const btcChange = document.getElementById('btcChange')?.textContent || '--';
            const sentiment = document.getElementById('overallSentiment')?.textContent || '--';
            const lastUpdate = document.getElementById('lastUpdate')?.textContent || 'Unknown';
            
            // Enhanced snapshot with emojis and formatting
            const snapshot = `
🚀 Crypto Market Snapshot
📅 ${lastUpdate}

📊 Fear & Greed Index: ${fearGreed}/100 (${fearGreedLabel})
💰 Bitcoin: ${btcPrice} (${btcChange})
🎯 Overall Sentiment: ${sentiment}

${parseInt(fearGreed) < 20 ? '🟢 Strong Buy Signal — Extreme Fear Zone' : ''}
${parseInt(fearGreed) > 80 ? '🔴 Caution — Extreme Greed Zone' : ''}

Built with Mission Control
https://7468096-ux.github.io/crypto-sentiment-dashboard/
            `.trim();
            
            // Copy to clipboard
            navigator.clipboard.writeText(snapshot).then(() => {
                // Show notification
                const notification = document.getElementById('copyNotification') || createNotification();
                notification.textContent = '✓ Market snapshot copied!';
                notification.classList.add('show');
                setTimeout(() => notification.classList.remove('show'), 2000);
            }).catch(err => {
                console.error('Failed to copy:', err);
            });
        });
    }
    
    function createNotification() {
        const notification = document.createElement('div');
        notification.id = 'copyNotification';
        notification.className = 'copy-notification';
        document.body.appendChild(notification);
        return notification;
    }
    
    // ==================== ENHANCED ZONE DETECTION ====================
    
    function updateZoneAttributes() {
        const fearGreed = parseInt(document.getElementById('fearGreedValue')?.textContent);
        const gaugeContainer = document.querySelector('.gauge-container');
        
        if (!gaugeContainer || isNaN(fearGreed)) return;
        
        // Set data attribute for CSS targeting
        if (fearGreed <= 20) {
            gaugeContainer.setAttribute('data-zone', 'extreme-fear');
        } else if (fearGreed <= 40) {
            gaugeContainer.setAttribute('data-zone', 'fear');
        } else if (fearGreed >= 80) {
            gaugeContainer.setAttribute('data-zone', 'extreme-greed');
        } else if (fearGreed >= 60) {
            gaugeContainer.setAttribute('data-zone', 'greed');
        } else {
            gaugeContainer.setAttribute('data-zone', 'neutral');
        }
    }
    
    // ==================== QUICK ACTIONS PANEL ====================
    
    function initQuickActions() {
        // Add quick action buttons to signal cards
        const signalCards = document.querySelectorAll('.signal-card');
        
        signalCards.forEach(card => {
            const signalBadge = card.querySelector('.signal-badge');
            if (!signalBadge) return;
            
            const signalText = signalBadge.textContent.toLowerCase();
            
            // Add visual indicators
            if (signalText.includes('buy') || signalText.includes('accumulation')) {
                card.classList.add('buy-signal');
            } else if (signalText.includes('sell') || signalText.includes('distribution')) {
                card.classList.add('sell-signal');
            }
        });
    }
    
    // ==================== DATA UPDATE ANIMATIONS ====================
    
    function animateDataUpdate(element) {
        if (!element) return;
        
        element.classList.add('data-updating');
        setTimeout(() => {
            element.classList.remove('data-updating');
        }, 300);
    }
    
    // Observer for DOM changes
    function initUpdateAnimations() {
        const targets = [
            '#fearGreedValue',
            '#btcPrice',
            '#btcChange'
        ];
        
        targets.forEach(selector => {
            const element = document.querySelector(selector);
            if (!element) return;
            
            const observer = new MutationObserver(() => {
                animateDataUpdate(element);
            });
            
            observer.observe(element, {
                childList: true,
                characterData: true,
                subtree: true
            });
        });
    }
    
    // ==================== ENHANCED MOBILE EXPERIENCE ====================
    
    function initMobileEnhancements() {
        // Detect mobile
        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
        if (!isMobile) return;
        
        // Add touch feedback to cards
        const cards = document.querySelectorAll('.signal-card, .hero-card, .chart-card');
        cards.forEach(card => {
            card.addEventListener('touchstart', function() {
                this.style.transform = 'scale(0.98)';
            });
            
            card.addEventListener('touchend', function() {
                this.style.transform = '';
            });
        });
        
        // Improve scroll performance
        document.body.style.webkitOverflowScrolling = 'touch';
    }
    
    // ==================== KEYBOARD SHORTCUTS ENHANCEMENT ====================
    
    function enhanceKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // S = Share/Copy snapshot
            if (e.key === 's' || e.key === 'S') {
                e.preventDefault();
                const shareBtn = document.getElementById('shareBtn');
                if (shareBtn) shareBtn.click();
            }
            
            // E = Export data
            if (e.key === 'e' || e.key === 'E') {
                e.preventDefault();
                const exportBtn = document.getElementById('exportBtn');
                if (exportBtn) exportBtn.click();
            }
        });
    }
    
    // ==================== INIT ====================
    
    function init() {
        // Wait for DOM
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', init);
            return;
        }
        
        console.log('🚀 Initializing enhanced features...');
        
        initATHTracker();
        enhanceSnapshotCopy();
        initQuickActions();
        initUpdateAnimations();
        initMobileEnhancements();
        enhanceKeyboardShortcuts();
        
        // Update zone attributes on data load
        window.addEventListener('dataLoaded', () => {
            updateZoneAttributes();
            setTimeout(updateZoneAttributes, 500);
        });
        
        // Update zone on initial load
        setTimeout(updateZoneAttributes, 1000);
        
        console.log('✅ Enhanced features loaded');
    }
    
    init();
    
})();
