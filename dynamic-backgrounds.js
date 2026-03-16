// Dynamic Gradient Backgrounds based on Fear & Greed Index
// Applies visual zones to hero-card for better sentiment visualization

function updateHeroCardGradient(fearGreedValue) {
    const heroCard = document.querySelector('.hero-card');
    if (!heroCard) return;

    // Remove all zone classes first
    heroCard.classList.remove('extreme-fear', 'fear', 'neutral', 'greed', 'extreme-greed');

    // Apply appropriate class based on value
    let zoneClass = '';
    
    if (fearGreedValue <= 25) {
        zoneClass = 'extreme-fear';
    } else if (fearGreedValue <= 45) {
        zoneClass = 'fear';
    } else if (fearGreedValue <= 55) {
        zoneClass = 'neutral';
    } else if (fearGreedValue <= 75) {
        zoneClass = 'greed';
    } else {
        zoneClass = 'extreme-greed';
    }

    heroCard.classList.add(zoneClass);
    
    console.log(`🎨 Applied gradient: ${zoneClass} (F&G: ${fearGreedValue})`);
}

// Hook into app.js data loading
document.addEventListener('DOMContentLoaded', () => {
    // Wait for main app to load data
    setTimeout(() => {
        const fgValue = parseInt(document.getElementById('fearGreedValue')?.textContent);
        if (!isNaN(fgValue)) {
            updateHeroCardGradient(fgValue);
        }
    }, 1500);
});

// Also update on data refresh
document.addEventListener('dataRefreshed', (event) => {
    if (event.detail && event.detail.fearGreedIndex) {
        updateHeroCardGradient(event.detail.fearGreedIndex);
    }
});

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { updateHeroCardGradient };
}
