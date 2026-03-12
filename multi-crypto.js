// Multi-Crypto Price Display
// Shows BTC, ETH, SOL, BNB prices with sparklines

(function() {
    'use strict';
    
    // Additional crypto assets to track
    const CRYPTO_ASSETS = [
        { symbol: 'ETH', name: 'Ethereum', color: '#627eea' },
        { symbol: 'SOL', name: 'Solana', color: '#14f195' },
        { symbol: 'BNB', name: 'BNB', color: '#f3ba2f' }
    ];
    
    // Mock data for now (will be replaced with real API later)
    const MOCK_PRICES = {
        'ETH': { price: 3850, change24h: 1.2 },
        'SOL': { price: 142, change24h: -0.8 },
        'BNB': { price: 595, change24h: 0.5 }
    };
    
    function createMultiCryptoSection() {
        const heroCard = document.querySelector('.hero-card');
        if (!heroCard) return;
        
        // Create multi-crypto container after hero card
        const multiCryptoCard = document.createElement('div');
        multiCryptoCard.className = 'multi-crypto-card';
        multiCryptoCard.innerHTML = `
            <h2>📊 Top Cryptocurrencies</h2>
            <div class="crypto-grid" id="cryptoGrid">
                <!-- Crypto items will be injected here -->
            </div>
        `;
        
        heroCard.parentNode.insertBefore(multiCryptoCard, heroCard.nextSibling);
        
        renderCryptoAssets();
    }
    
    function renderCryptoAssets() {
        const grid = document.getElementById('cryptoGrid');
        if (!grid) return;
        
        CRYPTO_ASSETS.forEach(asset => {
            const data = MOCK_PRICES[asset.symbol];
            if (!data) return;
            
            const changeClass = data.change24h > 0 ? 'positive' : data.change24h < 0 ? 'negative' : 'neutral';
            const changeIcon = data.change24h > 0 ? '▲' : data.change24h < 0 ? '▼' : '━';
            
            const cryptoItem = document.createElement('div');
            cryptoItem.className = 'crypto-item';
            cryptoItem.style.setProperty('--crypto-color', asset.color);
            
            cryptoItem.innerHTML = `
                <div class="crypto-header">
                    <h3>${asset.symbol}</h3>
                    <span class="crypto-name">${asset.name}</span>
                </div>
                <div class="crypto-price">
                    <span class="price-value">$${formatPrice(data.price)}</span>
                    <span class="price-change ${changeClass}">
                        ${changeIcon} ${Math.abs(data.change24h).toFixed(2)}%
                    </span>
                </div>
                <div class="crypto-sparkline-wrapper">
                    <canvas id="${asset.symbol.toLowerCase()}Sparkline" class="crypto-sparkline"></canvas>
                </div>
            `;
            
            grid.appendChild(cryptoItem);
        });
        
        // Generate mock sparkline data
        setTimeout(() => {
            CRYPTO_ASSETS.forEach(asset => {
                generateMockSparkline(asset.symbol.toLowerCase());
            });
        }, 100);
    }
    
    function formatPrice(price) {
        if (price >= 1000) {
            return new Intl.NumberFormat('en-US', {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0
            }).format(price);
        } else {
            return new Intl.NumberFormat('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }).format(price);
        }
    }
    
    function generateMockSparkline(symbol) {
        const canvas = document.getElementById(`${symbol}Sparkline`);
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        const width = canvas.parentElement.clientWidth;
        const height = 40;
        
        canvas.width = width;
        canvas.height = height;
        
        // Generate random data points (simulate 24h price movement)
        const points = 24;
        const data = [];
        let value = 50;
        
        for (let i = 0; i < points; i++) {
            value += (Math.random() - 0.5) * 10;
            value = Math.max(20, Math.min(80, value)); // Keep within bounds
            data.push(value);
        }
        
        // Determine color based on trend
        const trend = data[data.length - 1] > data[0] ? 'up' : 'down';
        const color = trend === 'up' ? '#00ff88' : '#ff3366';
        
        // Draw sparkline
        ctx.clearRect(0, 0, width, height);
        ctx.beginPath();
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.lineJoin = 'round';
        
        const stepX = width / (points - 1);
        const minVal = Math.min(...data);
        const maxVal = Math.max(...data);
        const range = maxVal - minVal || 1;
        
        data.forEach((value, i) => {
            const x = i * stepX;
            const y = height - ((value - minVal) / range) * (height - 10) - 5;
            
            if (i === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        });
        
        ctx.stroke();
        
        // Add gradient fill
        ctx.lineTo(width, height);
        ctx.lineTo(0, height);
        ctx.closePath();
        
        const gradient = ctx.createLinearGradient(0, 0, 0, height);
        gradient.addColorStop(0, color + '40'); // 25% opacity
        gradient.addColorStop(1, color + '00'); // transparent
        
        ctx.fillStyle = gradient;
        ctx.fill();
    }
    
    // Initialize on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', createMultiCryptoSection);
    } else {
        createMultiCryptoSection();
    }
})();
