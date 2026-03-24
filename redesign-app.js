// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// CRYPTO SENTIMENT TERMINAL — DATA CONTROLLER
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

class SentimentTerminal {
    constructor() {
        this.data = null;
        this.init();
    }

    async init() {
        await this.loadData();
        this.render();
        this.setupEventListeners();
    }

    async loadData() {
        try {
            const response = await fetch('data/sentiment.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            this.data = await response.json();
            console.log('Data loaded successfully:', this.data);
        } catch (error) {
            console.error('Failed to load data:', error);
            this.data = this.getMockData();
            console.log('Using mock data');
        }
    }

    getMockData() {
        return {
            lastUpdate: new Date().toISOString().split('T')[0],
            fearGreedIndex: 45,
            btcPrice: 70000,
            btcChange24h: 2.5,
            btcDominance: 56.5,
            athPrice: 108268,
            atlPrice: 67060,
            historical: []
        };
    }

    render() {
        this.renderFearGreed();
        this.renderBTCPrice();
        this.renderDominance();
        this.renderATHATL();
        this.renderLastUpdate();
        this.renderHistorical();
        
        // Make data available globally for chart
        window.terminalData = this.data;
        
        // Update chart if it exists
        if (typeof window.updateChart === 'function') {
            window.updateChart(this.data);
        }
    }

    renderFearGreed() {
        const { fearGreedIndex } = this.data;
        const value = fearGreedIndex || 0;
        
        // Update text
        document.getElementById('fearGreedValue').textContent = value;
        document.getElementById('fearGreedZone').textContent = this.getZoneText(value);
        
        // Update gauge arc (0-100 mapped to 251.2 dashoffset range)
        const arc = document.getElementById('gaugeArc');
        const progress = (100 - value) / 100;
        const dashoffset = 251.2 * progress;
        arc.style.strokeDashoffset = dashoffset;
        
        // Update gauge line rotation
        const line = document.getElementById('gaugeLine');
        const rotation = -90 + (value / 100) * 180;
        line.style.transform = `rotate(${rotation}deg)`;
        line.style.opacity = '1';
        
        // Update signal indicator
        this.renderSignal(value);
    }

    getZoneText(value) {
        if (value < 20) return 'EXTREME FEAR';
        if (value < 40) return 'FEAR';
        if (value < 60) return 'NEUTRAL';
        if (value < 80) return 'GREED';
        return 'EXTREME GREED';
    }

    renderSignal(value) {
        const indicator = document.getElementById('signalIndicator');
        const text = document.querySelector('.signal-text');
        
        indicator.className = 'signal-indicator';
        
        if (value < 25) {
            indicator.classList.add('buy');
            text.textContent = 'SIGNAL: STRONG BUY';
        } else if (value > 75) {
            indicator.classList.add('sell');
            text.textContent = 'SIGNAL: CONSIDER SELL';
        } else {
            text.textContent = 'SIGNAL: NEUTRAL';
        }
    }

    renderBTCPrice() {
        const { btcPrice, btcChange24h } = this.data;
        const price = btcPrice || 0;
        const change = btcChange24h || 0;
        
        document.getElementById('btcPrice').textContent = 
            `$${price.toLocaleString('en-US', { maximumFractionDigits: 0 })}`;
        
        const changeEl = document.getElementById('btcChange');
        const sign = change >= 0 ? '+' : '';
        changeEl.textContent = `${sign}${change.toFixed(2)}% 24h`;
        changeEl.className = `panel-change ${change >= 0 ? 'positive' : 'negative'}`;
    }

    renderDominance() {
        const { btcDominance } = this.data;
        document.getElementById('btcDominance').textContent = 
            `${(btcDominance || 0).toFixed(1)}%`;
    }

    renderATHATL() {
        const { btcPrice, athPrice, atlPrice } = this.data;
        const price = btcPrice || 70000;
        const ath = athPrice || 108268;
        const atl = atlPrice || 67060;
        
        const athDistance = ((ath - price) / ath * 100).toFixed(1);
        const atlDistance = ((price - atl) / atl * 100).toFixed(1);
        
        document.getElementById('athDistance').textContent = `-${athDistance}%`;
        document.getElementById('athValue').textContent = `Peak: $${ath.toLocaleString()}`;
        
        document.getElementById('atlDistance').textContent = `+${atlDistance}%`;
        document.getElementById('atlValue').textContent = `Low: $${atl.toLocaleString()}`;
    }

    renderLastUpdate() {
        const { lastUpdate } = this.data;
        const date = lastUpdate || new Date().toISOString().split('T')[0];
        document.getElementById('lastUpdate').textContent = date;
    }

    renderHistorical() {
        const { historical } = this.data;
        const tbody = document.getElementById('historicalData');
        
        if (!tbody) {
            console.error('Historical table body not found');
            return;
        }
        
        tbody.innerHTML = '';
        
        if (!historical || historical.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; color: var(--white-ghost); padding: 2rem;">No historical data available</td></tr>';
            return;
        }
        
        historical.slice(0, 7).forEach(entry => {
            const row = document.createElement('tr');
            
            const change = entry.btcChange24h || 0;
            const changeClass = change >= 0 ? 'positive' : 'negative';
            const changeSign = change >= 0 ? '+' : '';
            
            const signal = this.getSignalFromIndex(entry.fearGreedIndex);
            
            row.innerHTML = `
                <td>${entry.date}</td>
                <td><strong>${entry.fearGreedIndex}</strong></td>
                <td>${this.getZoneText(entry.fearGreedIndex)}</td>
                <td><strong>$${entry.btcPrice.toLocaleString()}</strong></td>
                <td class="${changeClass}"><strong>${changeSign}${change.toFixed(2)}%</strong></td>
                <td>${signal}</td>
            `;
            
            tbody.appendChild(row);
        });
        
        console.log(`Rendered ${historical.length} historical entries`);
    }

    getSignalFromIndex(value) {
        if (value < 25) return '🟢 BUY';
        if (value > 75) return '🔴 SELL';
        return '🟡 HOLD';
    }

    setupEventListeners() {
        document.getElementById('refreshBtn').addEventListener('click', () => {
            this.init();
        });
    }
}

// Initialize terminal
document.addEventListener('DOMContentLoaded', () => {
    new SentimentTerminal();
});
