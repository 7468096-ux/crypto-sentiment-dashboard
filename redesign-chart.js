// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// HISTORICAL CHART — LUXURY TERMINAL VISUALIZATION
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

        // Prepare data (reverse to show oldest first)
        const reversed = [...historical].reverse();
        const labels = reversed.map(entry => {
            const date = new Date(entry.date);
            return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        });
        
        const fearGreedData = reversed.map(entry => entry.fearGreedIndex);
        const btcPriceData = reversed.map(entry => entry.btcPrice);

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
                        backgroundColor: 'rgba(212, 175, 55, 0.1)',
                        borderWidth: 2,
                        pointRadius: 4,
                        pointHoverRadius: 6,
                        pointBackgroundColor: '#D4AF37',
                        pointBorderColor: '#0a0a0a',
                        pointBorderWidth: 2,
                        tension: 0.3,
                        fill: true,
                        yAxisID: 'y'
                    },
                    {
                        label: 'BTC Price (USD)',
                        data: btcPriceData,
                        borderColor: '#999999',
                        backgroundColor: 'rgba(153, 153, 153, 0.05)',
                        borderWidth: 2,
                        borderDash: [5, 5],
                        pointRadius: 3,
                        pointHoverRadius: 5,
                        pointBackgroundColor: '#999999',
                        pointBorderColor: '#0a0a0a',
                        pointBorderWidth: 1,
                        tension: 0.3,
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
                                weight: '500'
                            },
                            padding: 15,
                            usePointStyle: true,
                            pointStyle: 'circle'
                        }
                    },
                    tooltip: {
                        enabled: true,
                        backgroundColor: '#111111',
                        titleColor: '#D4AF37',
                        bodyColor: '#e5e5e5',
                        borderColor: '#D4AF37',
                        borderWidth: 1,
                        padding: 12,
                        displayColors: true,
                        titleFont: {
                            family: 'IBM Plex Mono, monospace',
                            size: 12,
                            weight: '600'
                        },
                        bodyFont: {
                            family: 'IBM Plex Mono, monospace',
                            size: 11
                        },
                        callbacks: {
                            title: function(context) {
                                return context[0].label;
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
                                        const zone = value < 20 ? 'EXTREME FEAR' :
                                                     value < 40 ? 'FEAR' :
                                                     value < 60 ? 'NEUTRAL' :
                                                     value < 80 ? 'GREED' : 'EXTREME GREED';
                                        label += value + ' (' + zone + ')';
                                    } else {
                                        // BTC Price
                                        label += '$' + context.parsed.y.toLocaleString();
                                    }
                                }
                                return label;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        grid: {
                            display: true,
                            color: 'rgba(26, 26, 26, 0.5)',
                            lineWidth: 1
                        },
                        ticks: {
                            color: '#999999',
                            font: {
                                family: 'IBM Plex Mono, monospace',
                                size: 10,
                                weight: '400'
                            },
                            padding: 8
                        },
                        border: {
                            display: true,
                            color: '#1a1a1a'
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
                            color: 'rgba(26, 26, 26, 0.5)',
                            lineWidth: 1
                        },
                        ticks: {
                            color: '#D4AF37',
                            font: {
                                family: 'IBM Plex Mono, monospace',
                                size: 10,
                                weight: '500'
                            },
                            padding: 8,
                            callback: function(value) {
                                return value;
                            }
                        },
                        border: {
                            display: true,
                            color: '#1a1a1a'
                        },
                        title: {
                            display: true,
                            text: 'Fear & Greed',
                            color: '#D4AF37',
                            font: {
                                family: 'IBM Plex Mono, monospace',
                                size: 10,
                                weight: '600'
                            }
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
                            color: '#999999',
                            font: {
                                family: 'IBM Plex Mono, monospace',
                                size: 10,
                                weight: '400'
                            },
                            padding: 8,
                            callback: function(value) {
                                return '$' + (value / 1000).toFixed(0) + 'K';
                            }
                        },
                        border: {
                            display: true,
                            color: '#1a1a1a'
                        },
                        title: {
                            display: true,
                            text: 'BTC Price',
                            color: '#999999',
                            font: {
                                family: 'IBM Plex Mono, monospace',
                                size: 10,
                                weight: '600'
                            }
                        }
                    }
                },
                animation: {
                    duration: 1000,
                    easing: 'easeInOutQuart',
                    delay: function(context) {
                        let delay = 0;
                        if (context.type === 'data' && context.mode === 'default') {
                            delay = context.dataIndex * 50;
                        }
                        return delay;
                    }
                }
            }
        });

        console.log('Chart rendered with', historical.length, 'data points');
    }

    update(data) {
        if (!this.chart) return;

        const historical = data.historical || [];
        if (historical.length === 0) return;

        const reversed = [...historical].reverse();
        const labels = reversed.map(entry => {
            const date = new Date(entry.date);
            return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        });
        
        const fearGreedData = reversed.map(entry => entry.fearGreedIndex);
        const btcPriceData = reversed.map(entry => entry.btcPrice);

        this.chart.data.labels = labels;
        this.chart.data.datasets[0].data = fearGreedData;
        this.chart.data.datasets[1].data = btcPriceData;
        this.chart.update();

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
    }, 500);
});

// Export for use in refresh
window.updateChart = function(data) {
    if (globalChart) {
        globalChart.update(data);
    } else {
        globalChart = new HistoricalChart(data);
    }
};
