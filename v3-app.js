// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// NEO-BRUTALIST DATA TERMINAL — APP LOGIC
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

class CryptoTerminal {
    constructor() {
        this.data = null;
        this.chart = null;
        this.init();
    }

    async init() {
        this.startLiveClock();
        await this.loadData();
        this.render();
        this.renderChart();
        this.setupEvents();
    }

    startLiveClock() {
        const updateClock = () => {
            const now = new Date();
            const time = now.toLocaleTimeString('en-US', { hour12: false });
            document.getElementById('liveTime').textContent = time;
        };
        updateClock();
        setInterval(updateClock, 1000);
    }

    async loadData() {
        try {
            const response = await fetch('data/sentiment.json');
            this.data = await response.json();
        } catch (error) {
            console.error('Failed to load data:', error);
            this.data = this.getMockData();
        }
    }

    getMockData() {
        return {
            lastUpdate: '2026-03-24',
            fearGreedIndex: 11,
            btcPrice: 71236,
            btcChange24h: 4.30,
            btcDominance: 56.6,
            athPrice: 108268,
            atlPrice: 67060,
            historical: []
        };
    }

    render() {
        // Fear & Greed
        const fg = this.data.fearGreedIndex;
        document.getElementById('fearNumber').textContent = fg;
        document.getElementById('fearLabel').textContent = this.getZoneText(fg);
        document.getElementById('gaugeFill').style.width = fg + '%';
        document.getElementById('gaugeMarker').style.left = fg + '%';

        // BTC Price
        document.getElementById('btcPrice').textContent = 
            '$' + this.data.btcPrice.toLocaleString();
        
        const change = this.data.btcChange24h;
        const changeEl = document.getElementById('btcChange');
        changeEl.textContent = (change >= 0 ? '+' : '') + change.toFixed(2) + '%';
        changeEl.className = 'block-change ' + (change >= 0 ? 'positive' : 'negative');

        // Dominance
        document.getElementById('btcDom').textContent = this.data.btcDominance + '%';

        // ATH Distance
        const athDist = ((this.data.athPrice - this.data.btcPrice) / this.data.athPrice * 100);
        document.getElementById('athDist').textContent = '-' + athDist.toFixed(1) + '%';

        // Last Update
        document.getElementById('lastUpdate').textContent = this.data.lastUpdate;

        // Table
        this.renderTable();
    }

    getZoneText(value) {
        if (value < 20) return 'EXTREME FEAR';
        if (value < 40) return 'FEAR';
        if (value < 60) return 'NEUTRAL';
        if (value < 80) return 'GREED';
        return 'EXTREME GREED';
    }

    renderTable() {
        const tbody = document.getElementById('tableData');
        const historical = this.data.historical || [];
        
        if (historical.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" style="text-align: center;">NO DATA</td></tr>';
            return;
        }

        tbody.innerHTML = '';
        historical.slice(-7).forEach(entry => {
            const row = document.createElement('tr');
            const change = entry.btcChange24h || 0;
            const changeClass = change >= 0 ? 'positive' : 'negative';
            const signal = entry.fearGreedIndex < 25 ? '▲ BUY' : 
                           entry.fearGreedIndex > 75 ? '▼ SELL' : '■ HOLD';
            
            row.innerHTML = `
                <td>${entry.date}</td>
                <td>${entry.fearGreedIndex}</td>
                <td>$${entry.btcPrice.toLocaleString()}</td>
                <td class="${changeClass}">${(change >= 0 ? '+' : '')}${change.toFixed(2)}%</td>
                <td>${signal}</td>
            `;
            tbody.appendChild(row);
        });
    }

    renderChart() {
        const ctx = document.getElementById('historicalChart');
        if (!ctx) return;

        const historical = this.data.historical || [];
        if (historical.length === 0) return;

        const labels = historical.map(e => {
            const date = new Date(e.date);
            return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        });
        
        const fearData = historical.map(e => e.fearGreedIndex);
        const btcData = historical.map(e => e.btcPrice);

        this.chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'F&G INDEX',
                        data: fearData,
                        borderColor: '#00FF41',
                        backgroundColor: 'rgba(0, 255, 65, 0.1)',
                        borderWidth: 2,
                        pointRadius: 0,
                        pointHoverRadius: 4,
                        pointHoverBackgroundColor: '#00FF41',
                        tension: 0.4,
                        fill: true,
                        yAxisID: 'y'
                    },
                    {
                        label: 'BTC PRICE',
                        data: btcData,
                        borderColor: '#22D3EE',
                        borderWidth: 2,
                        pointRadius: 0,
                        pointHoverRadius: 4,
                        pointHoverBackgroundColor: '#22D3EE',
                        tension: 0.4,
                        fill: false,
                        yAxisID: 'y1'
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: {
                    mode: 'index',
                    intersect: false,
                },
                plugins: {
                    legend: {
                        display: true,
                        position: 'top',
                        align: 'start',
                        labels: {
                            color: '#a0a0a0',
                            font: {
                                family: 'JetBrains Mono',
                                size: 10,
                                weight: '700'
                            },
                            padding: 15,
                            usePointStyle: true
                        }
                    },
                    tooltip: {
                        backgroundColor: '#0a0a0a',
                        titleColor: '#00FF41',
                        bodyColor: '#ffffff',
                        borderColor: '#00FF41',
                        borderWidth: 2,
                        padding: 12,
                        titleFont: {
                            family: 'JetBrains Mono',
                            size: 11,
                            weight: '700'
                        },
                        bodyFont: {
                            family: 'JetBrains Mono',
                            size: 10
                        }
                    }
                },
                scales: {
                    x: {
                        grid: {
                            color: '#1f1f1f',
                            lineWidth: 1
                        },
                        ticks: {
                            color: '#a0a0a0',
                            font: {
                                family: 'JetBrains Mono',
                                size: 9
                            },
                            maxRotation: 0,
                            autoSkipPadding: 20
                        },
                        border: {
                            color: '#1f1f1f'
                        }
                    },
                    y: {
                        position: 'left',
                        min: 0,
                        max: 100,
                        grid: {
                            color: '#1f1f1f'
                        },
                        ticks: {
                            color: '#00FF41',
                            font: {
                                family: 'JetBrains Mono',
                                size: 9,
                                weight: '700'
                            }
                        },
                        border: {
                            color: '#00FF41'
                        }
                    },
                    y1: {
                        position: 'right',
                        grid: {
                            display: false
                        },
                        ticks: {
                            color: '#22D3EE',
                            font: {
                                family: 'JetBrains Mono',
                                size: 9,
                                weight: '700'
                            },
                            callback: function(value) {
                                return '$' + (value / 1000).toFixed(0) + 'K';
                            }
                        },
                        border: {
                            color: '#22D3EE'
                        }
                    }
                },
                animation: {
                    duration: 1000,
                    easing: 'easeOutQuart'
                }
            }
        });
    }

    setupEvents() {
        document.getElementById('refreshBtn').addEventListener('click', () => {
            this.init();
        });

        document.getElementById('exportBtn').addEventListener('click', () => {
            const dataStr = JSON.stringify(this.data, null, 2);
            const blob = new Blob([dataStr], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `crypto-sentiment-${this.data.lastUpdate}.json`;
            a.click();
            URL.revokeObjectURL(url);
        });
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    new CryptoTerminal();
});
