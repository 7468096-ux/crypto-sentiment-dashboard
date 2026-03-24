// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// HISTORICAL CHART — LUXURY TERMINAL VISUALIZATION (ENHANCED)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

class HistoricalChart {
    constructor(data) {
        this.data = data;
        this.chart = null;
        this.init();
    }

    init() {
        const ctx = document.getElementById('historicalChart');
        if (!ctx) {
            console.error('Chart canvas not found');
            return;
        }

        const historical = this.data.historical || [];
        if (historical.length === 0) {
            console.warn('No historical data for chart');
            return;
        }

        // Prepare data (chronological order: Jan → Mar)
        const labels = historical.map(entry => {
            const date = new Date(entry.date);
            return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        });
        
        const fearGreedData = historical.map(entry => entry.fearGreedIndex);
        const btcPriceData = historical.map(entry => entry.btcPrice);

        // Background zones plugin
        const backgroundZones = {
            id: 'backgroundZones',
            beforeDraw: (chart) => {
                const {ctx, chartArea: {left, right, top, bottom, width, height}, scales: {y}} = chart;
                ctx.save();

                // Define zones
                const zones = [
                    {min: 0, max: 20, color: 'rgba(239, 68, 68, 0.05)', label: 'EXTREME FEAR'},
                    {min: 20, max: 40, color: 'rgba(251, 191, 36, 0.05)', label: 'FEAR'},
                    {min: 40, max: 60, color: 'rgba(156, 163, 175, 0.03)', label: 'NEUTRAL'},
                    {min: 60, max: 80, color: 'rgba(34, 197, 94, 0.05)', label: 'GREED'},
                    {min: 80, max: 100, color: 'rgba(34, 197, 94, 0.08)', label: 'EXTREME GREED'}
                ];

                zones.forEach(zone => {
                    const yTop = y.getPixelForValue(zone.max);
                    const yBottom = y.getPixelForValue(zone.min);
                    
                    ctx.fillStyle = zone.color;
                    ctx.fillRect(left, yTop, width, yBottom - yTop);
                    
                    // Zone labels (right side)
                    ctx.fillStyle = 'rgba(153, 153, 153, 0.3)';
                    ctx.font = '9px IBM Plex Mono';
                    ctx.textAlign = 'right';
                    ctx.fillText(zone.label, right - 5, yTop + (yBottom - yTop) / 2);
                });

                ctx.restore();
            }
        };

        // Create gradient for Fear & Greed line
        const gradient = ctx.getContext('2d').createLinearGradient(0, 0, 0, 400);
        gradient.addColorStop(0, 'rgba(34, 197, 94, 0.2)');
        gradient.addColorStop(0.5, 'rgba(251, 191, 36, 0.15)');
        gradient.addColorStop(1, 'rgba(239, 68, 68, 0.2)');

        // Create chart
        this.chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'Fear & Greed Index',
                        data: fearGreedData,
                        borderColor: '#D4AF37',
                        backgroundColor: gradient,
                        borderWidth: 3,
                        pointRadius: 0,
                        pointHoverRadius: 6,
                        pointHoverBackgroundColor: '#D4AF37',
                        pointHoverBorderColor: '#0a0a0a',
                        pointHoverBorderWidth: 2,
                        tension: 0.4,
                        fill: true,
                        yAxisID: 'y'
                    },
                    {
                        label: 'BTC Price (USD)',
                        data: btcPriceData,
                        borderColor: '#ffffff',
                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                        borderWidth: 2,
                        pointRadius: 0,
                        pointHoverRadius: 5,
                        pointHoverBackgroundColor: '#ffffff',
                        pointHoverBorderColor: '#0a0a0a',
                        pointHoverBorderWidth: 2,
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
                        align: 'end',
                        labels: {
                            color: '#e5e5e5',
                            font: {
                                family: 'IBM Plex Mono, monospace',
                                size: 11,
                                weight: '600'
                            },
                            padding: 20,
                            usePointStyle: true,
                            pointStyle: 'line',
                            boxWidth: 30,
                            boxHeight: 2
                        }
                    },
                    tooltip: {
                        enabled: true,
                        backgroundColor: '#0a0a0a',
                        titleColor: '#D4AF37',
                        bodyColor: '#e5e5e5',
                        borderColor: '#D4AF37',
                        borderWidth: 2,
                        padding: 16,
                        displayColors: true,
                        titleFont: {
                            family: 'IBM Plex Mono, monospace',
                            size: 13,
                            weight: '600'
                        },
                        bodyFont: {
                            family: 'IBM Plex Mono, monospace',
                            size: 12
                        },
                        bodySpacing: 8,
                        callbacks: {
                            title: function(context) {
                                return '◆ ' + context[0].label;
                            },
                            label: function(context) {
                                let label = context.dataset.label || '';
                                if (label) {
                                    label += ': ';
                                }
                                if (context.parsed.y !== null) {
                                    if (context.datasetIndex === 0) {
                                        // Fear & Greed Index
                                        const value = context.parsed.y;
                                        const zone = value < 20 ? '🔴 EXTREME FEAR' :
                                                     value < 40 ? '🟠 FEAR' :
                                                     value < 60 ? '🟡 NEUTRAL' :
                                                     value < 80 ? '🟢 GREED' : '🟢 EXTREME GREED';
                                        label += value + ' — ' + zone;
                                    } else {
                                        // BTC Price
                                        label += '$' + context.parsed.y.toLocaleString('en-US', {maximumFractionDigits: 0});
                                    }
                                }
                                return label;
                            },
                            afterBody: function(context) {
                                if (context.length > 0) {
                                    const index = context[0].dataIndex;
                                    const historical = window.terminalData?.historical;
                                    if (historical && historical[index]) {
                                        const entry = historical[index];
                                        const change = entry.btcChange24h;
                                        const sign = change >= 0 ? '+' : '';
                                        const color = change >= 0 ? '🟢' : '🔴';
                                        return `\n${color} 24h Change: ${sign}${change.toFixed(2)}%`;
                                    }
                                }
                                return '';
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        grid: {
                            display: true,
                            color: 'rgba(26, 26, 26, 0.4)',
                            lineWidth: 1
                        },
                        ticks: {
                            color: '#999999',
                            font: {
                                family: 'IBM Plex Mono, monospace',
                                size: 10,
                                weight: '400'
                            },
                            padding: 10,
                            maxRotation: 0,
                            autoSkip: true,
                            autoSkipPadding: 20
                        },
                        border: {
                            display: true,
                            color: '#1a1a1a',
                            width: 2
                        }
                    },
                    y: {
                        type: 'linear',
                        display: true,
                        position: 'left',
                        min: 0,
                        max: 100,
                        grid: {
                            display: true,
                            color: 'rgba(26, 26, 26, 0.3)',
                            lineWidth: 1
                        },
                        ticks: {
                            color: '#D4AF37',
                            font: {
                                family: 'IBM Plex Mono, monospace',
                                size: 11,
                                weight: '600'
                            },
                            padding: 12,
                            stepSize: 20,
                            callback: function(value) {
                                return value;
                            }
                        },
                        border: {
                            display: true,
                            color: '#D4AF37',
                            width: 2
                        },
                        title: {
                            display: true,
                            text: 'FEAR & GREED INDEX',
                            color: '#D4AF37',
                            font: {
                                family: 'IBM Plex Mono, monospace',
                                size: 10,
                                weight: '600'
                            },
                            padding: 10
                        }
                    },
                    y1: {
                        type: 'linear',
                        display: true,
                        position: 'right',
                        grid: {
                            display: false
                        },
                        ticks: {
                            color: '#ffffff',
                            font: {
                                family: 'IBM Plex Mono, monospace',
                                size: 11,
                                weight: '500'
                            },
                            padding: 12,
                            callback: function(value) {
                                return '$' + (value / 1000).toFixed(0) + 'K';
                            }
                        },
                        border: {
                            display: true,
                            color: '#ffffff',
                            width: 2
                        },
                        title: {
                            display: true,
                            text: 'BTC PRICE',
                            color: '#ffffff',
                            font: {
                                family: 'IBM Plex Mono, monospace',
                                size: 10,
                                weight: '600'
                            },
                            padding: 10
                        }
                    }
                },
                animation: {
                    duration: 1500,
                    easing: 'easeInOutQuart',
                    delay: function(context) {
                        let delay = 0;
                        if (context.type === 'data' && context.mode === 'default') {
                            delay = context.dataIndex * 15;
                        }
                        return delay;
                    }
                }
            },
            plugins: [backgroundZones]
        });

        console.log('Chart rendered with', historical.length, 'data points');
    }

    update(data) {
        if (!this.chart) return;

        const historical = data.historical || [];
        if (historical.length === 0) return;

        const labels = historical.map(entry => {
            const date = new Date(entry.date);
            return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        });
        
        const fearGreedData = historical.map(entry => entry.fearGreedIndex);
        const btcPriceData = historical.map(entry => entry.btcPrice);

        this.chart.data.labels = labels;
        this.chart.data.datasets[0].data = fearGreedData;
        this.chart.data.datasets[1].data = btcPriceData;
        this.chart.update('none'); // Disable animation on update

        console.log('Chart updated');
    }

    destroy() {
        if (this.chart) {
            this.chart.destroy();
            this.chart = null;
        }
    }
}

// Global chart instance
let globalChart = null;

// Initialize chart after SentimentTerminal loads data
window.addEventListener('DOMContentLoaded', () => {
    // Wait for data to be loaded by SentimentTerminal
    setTimeout(() => {
        const terminalData = window.terminalData;
        if (terminalData && terminalData.historical) {
            globalChart = new HistoricalChart(terminalData);
        }
    }, 800);
});

// Export for use in refresh
window.updateChart = function(data) {
    if (globalChart) {
        globalChart.update(data);
    } else {
        globalChart = new HistoricalChart(data);
    }
};
