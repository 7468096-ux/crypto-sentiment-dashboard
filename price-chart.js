// Interactive BTC Price Chart using Lightweight Charts
// CoinGecko API for OHLC data

const COINGECKO_API = 'https://api.coingecko.com/api/v3';

// Chart instance
let priceChart = null;
let candlestickSeries = null;
let volumeSeries = null;

// Period configurations (CoinGecko days parameter)
const PERIOD_CONFIG = {
    '24h': { days: 1, interval: null },
    '7d': { days: 7, interval: null },
    '30d': { days: 30, interval: null },
    '90d': { days: 90, interval: null }
};

// Current active period
let activePeriod = '24h';

// Fetch OHLC data from CoinGecko
async function fetchOHLCData(period) {
    const config = PERIOD_CONFIG[period];
    
    try {
        const url = `${COINGECKO_API}/coins/bitcoin/ohlc?vs_currency=usd&days=${config.days}`;
        const response = await fetch(url);
        
        if (!response.ok) throw new Error('Failed to fetch OHLC data');
        
        const data = await response.json();
        
        // Transform data: [[timestamp, open, high, low, close], ...]
        // Lightweight Charts expects: { time: unix_timestamp, open, high, low, close }
        const candlestickData = data.map(candle => ({
            time: Math.floor(candle[0] / 1000), // Convert ms to seconds
            open: candle[1],
            high: candle[2],
            low: candle[3],
            close: candle[4]
        }));
        
        return candlestickData;
    } catch (error) {
        console.error('Error fetching OHLC data:', error);
        return null;
    }
}

// Fetch volume data
async function fetchVolumeData(period) {
    const config = PERIOD_CONFIG[period];
    
    try {
        const url = `${COINGECKO_API}/coins/bitcoin/market_chart?vs_currency=usd&days=${config.days}`;
        const response = await fetch(url);
        
        if (!response.ok) throw new Error('Failed to fetch volume data');
        
        const data = await response.json();
        
        // Transform volume data: [[timestamp, volume], ...]
        const volumeData = data.total_volumes.map(vol => ({
            time: Math.floor(vol[0] / 1000),
            value: vol[1],
            color: 'rgba(0, 255, 136, 0.3)' // Semi-transparent green
        }));
        
        return volumeData;
    } catch (error) {
        console.error('Error fetching volume data:', error);
        return null;
    }
}

// Initialize the chart
function initChart() {
    const chartContainer = document.getElementById('priceChart');
    
    if (!chartContainer) return;
    
    // Create chart
    priceChart = LightweightCharts.createChart(chartContainer, {
        width: chartContainer.clientWidth,
        height: chartContainer.clientHeight,
        layout: {
            background: { color: 'transparent' },
            textColor: '#a0a0a0',
        },
        grid: {
            vertLines: { color: '#2a2a2a' },
            horzLines: { color: '#2a2a2a' },
        },
        crosshair: {
            mode: LightweightCharts.CrosshairMode.Normal,
        },
        rightPriceScale: {
            borderColor: '#333',
        },
        timeScale: {
            borderColor: '#333',
            timeVisible: true,
            secondsVisible: false,
        },
    });
    
    // Add candlestick series
    candlestickSeries = priceChart.addCandlestickSeries({
        upColor: '#00ff88',
        downColor: '#ff3366',
        borderUpColor: '#00ff88',
        borderDownColor: '#ff3366',
        wickUpColor: '#00ff88',
        wickDownColor: '#ff3366',
    });
    
    // Add volume histogram
    volumeSeries = priceChart.addHistogramSeries({
        color: '#00ff88',
        priceFormat: {
            type: 'volume',
        },
        priceScaleId: 'volume',
        scaleMargins: {
            top: 0.8, // Volume takes bottom 20% of chart
            bottom: 0,
        },
    });
    
    // Handle window resize
    const resizeObserver = new ResizeObserver(entries => {
        if (entries.length === 0 || entries[0].target !== chartContainer) return;
        const newRect = entries[0].contentRect;
        priceChart.applyOptions({ 
            width: newRect.width,
            height: newRect.height 
        });
    });
    
    resizeObserver.observe(chartContainer);
    
    // Initial data load
    loadChartData(activePeriod);
}

// Load chart data for specific period
async function loadChartData(period) {
    if (!candlestickSeries || !volumeSeries) return;
    
    console.log(`📊 Loading chart data for ${period}...`);
    
    // Show loading state
    const chartContainer = document.getElementById('priceChart');
    chartContainer.style.opacity = '0.5';
    
    // Fetch data
    const [ohlcData, volumeData] = await Promise.all([
        fetchOHLCData(period),
        fetchVolumeData(period)
    ]);
    
    if (ohlcData && volumeData) {
        // Update series
        candlestickSeries.setData(ohlcData);
        volumeSeries.setData(volumeData);
        
        // Fit content
        priceChart.timeScale().fitContent();
        
        console.log(`✅ Chart loaded: ${ohlcData.length} candles`);
    } else {
        console.error('❌ Failed to load chart data');
    }
    
    // Remove loading state
    chartContainer.style.opacity = '1';
}

// Setup period toggle buttons
function setupPeriodButtons() {
    const buttons = document.querySelectorAll('.chart-period');
    
    buttons.forEach(button => {
        button.addEventListener('click', () => {
            const period = button.dataset.period;
            
            // Update active state
            buttons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // Update chart
            activePeriod = period;
            loadChartData(period);
        });
    });
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        initChart();
        setupPeriodButtons();
    });
} else {
    initChart();
    setupPeriodButtons();
}

// Export for manual refresh
window.refreshPriceChart = () => loadChartData(activePeriod);
