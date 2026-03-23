// Update Animations - March 23, 2026
// Add visual feedback when data updates

(function() {
    'use strict';
    
    // Add "updating" class to elements when values change
    function animateValueChange(element) {
        if (!element) return;
        
        element.classList.add('updating');
        setTimeout(() => {
            element.classList.remove('updating');
        }, 600);
    }
    
    // Observe DOM mutations to detect value changes
    const observeValueChanges = (selector, callback) => {
        const element = document.querySelector(selector);
        if (!element) return;
        
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList' || mutation.type === 'characterData') {
                    callback(element);
                }
            });
        });
        
        observer.observe(element, {
            childList: true,
            characterData: true,
            subtree: true
        });
    };
    
    // Wait for DOM to load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
    function init() {
        // Observe key elements
        observeValueChanges('#fearGreedValue', animateValueChange);
        observeValueChanges('#btcPrice', animateValueChange);
        observeValueChanges('#btcChange', animateValueChange);
        
        // Add count-up animation to numbers on first load
        setTimeout(() => {
            const numberElements = document.querySelectorAll(
                '#fearGreedValue, #btcPrice, .value'
            );
            numberElements.forEach(el => {
                if (el.textContent.trim() !== '--') {
                    el.classList.add('count-animation');
                    setTimeout(() => {
                        el.classList.remove('count-animation');
                    }, 400);
                }
            });
        }, 100);
        
        // Enhanced refresh button feedback
        const refreshBtn = document.getElementById('refreshBtn');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => {
                const svg = refreshBtn.querySelector('svg');
                if (svg) {
                    svg.style.animation = 'spin 1s ease-in-out';
                    setTimeout(() => {
                        svg.style.animation = '';
                    }, 1000);
                }
            });
        }
        
        // Add skeleton loaders while data is loading
        const showSkeletons = () => {
            const cards = document.querySelectorAll('.signal-card');
            cards.forEach(card => {
                card.classList.add('loading');
            });
        };
        
        const hideSkeletons = () => {
            const cards = document.querySelectorAll('.signal-card');
            cards.forEach(card => {
                card.classList.remove('loading');
            });
        };
        
        // Listen for custom loading events (if app.js dispatches them)
        window.addEventListener('dataLoadStart', showSkeletons);
        window.addEventListener('dataLoadComplete', hideSkeletons);
        
        console.log('✅ Update animations initialized');
    }
    
})();
