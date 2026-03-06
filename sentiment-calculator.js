// Smart Overall Sentiment Calculator
// Dynamically calculates market sentiment based on multiple signals

function calculateOverallSentiment(data) {
    let score = 0;
    const weights = {
        fearGreed: 2,    // Fear & Greed is most reliable
        whale: 1,        // Whale activity is significant
        price: 1,        // Short-term price action
        etf: 1.5         // Institutional flows are important
    };
    
    // 1. Fear & Greed Index Analysis
    // Extreme Fear (<25) is contrarian bullish signal
    // Extreme Greed (>75) is contrarian bearish signal
    if (data.fearGreedIndex < 25) {
        score += 2 * weights.fearGreed;  // Strong buy signal
    } else if (data.fearGreedIndex < 45) {
        score += 1 * weights.fearGreed;  // Neutral-bullish
    } else if (data.fearGreedIndex < 55) {
        score += 0;  // Neutral
    } else if (data.fearGreedIndex < 75) {
        score -= 0.5 * weights.fearGreed;  // Slight caution
    } else {
        score -= 2 * weights.fearGreed;  // Extreme greed = danger
    }
    
    // 2. Whale Activity (On-chain)
    // Positive accumulation = bullish
    const whaleNum = parseFloat(data.whaleAccumulation);
    if (!isNaN(whaleNum)) {
        if (whaleNum > 15) score += 2 * weights.whale;      // Strong accumulation
        else if (whaleNum > 5) score += 1 * weights.whale;  // Moderate accumulation
        else if (whaleNum < -15) score -= 2 * weights.whale; // Strong distribution
        else if (whaleNum < -5) score -= 1 * weights.whale;  // Moderate distribution
    }
    
    // 3. BTC Price Momentum (24h)
    if (data.btcChange24h > 3) {
        score += 1.5 * weights.price;  // Strong upward momentum
    } else if (data.btcChange24h > 0) {
        score += 0.5 * weights.price;  // Slight upward momentum
    } else if (data.btcChange24h < -5) {
        score -= 1.5 * weights.price;  // Sharp decline
    } else if (data.btcChange24h < 0) {
        score -= 0.5 * weights.price;  // Slight decline
    }
    
    // 4. ETF Flows (Institutional Sentiment)
    // Parse ETF flows (e.g., "$1.42B" or "-$500M")
    const etfValue = parseFloat(data.etfInflows.replace(/[$B,M]/g, ''));
    const etfMultiplier = data.etfInflows.includes('B') ? 1000 : 1; // B = billions, M = millions
    const etfTotal = etfValue * etfMultiplier;
    
    if (etfTotal > 1000) {
        score += 2 * weights.etf;  // Massive institutional buying
    } else if (etfTotal > 500) {
        score += 1 * weights.etf;  // Strong inflows
    } else if (etfTotal < -500) {
        score -= 2 * weights.etf;  // Massive outflows
    } else if (etfTotal < -100) {
        score -= 1 * weights.etf;  // Moderate outflows
    }
    
    // 5. Fed Policy (Macro Environment)
    if (data.fedRates && data.fedRates.toLowerCase().includes('cut')) {
        score += 1.5;  // Rate cuts are bullish for risk assets
    } else if (data.fedRates && data.fedRates.toLowerCase().includes('hike')) {
        score -= 1.5;  // Rate hikes are bearish
    }
    
    // Calculate max possible score for normalization
    const maxScore = (2 * weights.fearGreed) + (2 * weights.whale) + 
                     (1.5 * weights.price) + (2 * weights.etf) + 1.5; // ~13.5
    
    // Determine final sentiment with confidence level
    const normalizedScore = (score / maxScore) * 100; // Convert to percentage
    
    let sentiment, confidence;
    
    if (normalizedScore >= 50) {
        sentiment = 'bullish';
        confidence = normalizedScore >= 70 ? 'high' : 'moderate';
    } else if (normalizedScore <= -30) {
        sentiment = 'bearish';
        confidence = normalizedScore <= -50 ? 'high' : 'moderate';
    } else {
        sentiment = 'neutral';
        confidence = 'moderate';
    }
    
    return {
        sentiment,
        confidence,
        score: Math.round(normalizedScore),
        breakdown: {
            fearGreed: data.fearGreedIndex < 25 ? '✓ Bullish' : data.fearGreedIndex > 75 ? '✗ Bearish' : '~ Neutral',
            whaleActivity: whaleNum > 5 ? '✓ Accumulation' : whaleNum < -5 ? '✗ Distribution' : '~ Neutral',
            priceAction: data.btcChange24h > 0 ? '✓ Rising' : '✗ Falling',
            etfFlows: etfTotal > 500 ? '✓ Strong Inflows' : etfTotal < -100 ? '✗ Outflows' : '~ Neutral',
            fedPolicy: data.fedRates?.includes('cut') ? '✓ Dovish' : data.fedRates?.includes('hike') ? '✗ Hawkish' : '~ Neutral'
        }
    };
}

// Export for use in app.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { calculateOverallSentiment };
}
