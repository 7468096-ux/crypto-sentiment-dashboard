// Dynamic Favicon - Changes color based on Fear & Greed Index
// Red (< 25), Yellow (25-75), Green (> 75)

function updateFavicon(fearGreedValue) {
    // Determine color based on F&G Index
    let color;
    if (fearGreedValue < 25) {
        color = '#ff3366'; // Red - Extreme Fear
    } else if (fearGreedValue >= 75) {
        color = '#00ff88'; // Green - Extreme Greed
    } else {
        color = '#ffaa00'; // Yellow - Neutral
    }
    
    // Create SVG
    const svg = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
            <defs>
                <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style="stop-color:${color};stop-opacity:1" />
                    <stop offset="100%" style="stop-color:${adjustBrightness(color, -20)};stop-opacity:1" />
                </linearGradient>
            </defs>
            <circle cx="50" cy="50" r="45" fill="url(#grad)" stroke="${adjustBrightness(color, -40)}" stroke-width="3"/>
            <text x="50" y="65" font-family="Arial, sans-serif" font-size="45" font-weight="bold" fill="white" text-anchor="middle">${fearGreedValue}</text>
        </svg>
    `;
    
    // Convert to base64
    const blob = new Blob([svg], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    
    // Update favicon
    let link = document.querySelector('link[rel="icon"]');
    if (!link) {
        link = document.createElement('link');
        link.rel = 'icon';
        document.head.appendChild(link);
    }
    link.type = 'image/svg+xml';
    link.href = url;
    
    console.log(`🎨 Favicon updated: ${fearGreedValue} (${color})`);
}

// Helper: Adjust color brightness
function adjustBrightness(hex, percent) {
    // Remove # if present
    hex = hex.replace('#', '');
    
    // Convert to RGB
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    
    // Adjust brightness
    const newR = Math.max(0, Math.min(255, r + percent));
    const newG = Math.max(0, Math.min(255, g + percent));
    const newB = Math.max(0, Math.min(255, b + percent));
    
    // Convert back to hex
    return `#${((1 << 24) + (newR << 16) + (newG << 8) + newB).toString(16).slice(1)}`;
}

// Export for use in app.js
window.updateFavicon = updateFavicon;
