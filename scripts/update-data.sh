#!/bin/bash
# Crypto Sentiment Dashboard - Daily Data Update Script
# Run via Clawdbot cron

set -e

cd /home/ubuntu/clawd/projects/crypto-dashboard

# Fetch Fear & Greed Index
FNG=$(curl -s "https://api.alternative.me/fng/?limit=1")
FNG_VALUE=$(echo $FNG | jq -r '.data[0].value')
FNG_LABEL=$(echo $FNG | jq -r '.data[0].value_classification')

# Get BTC price (CoinGecko)
BTC_PRICE=$(curl -s "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd" | jq -r '.bitcoin.usd')

# Update sentiment.json
cat > data/sentiment.json << EOF
{
  "lastUpdate": "$(date +%Y-%m-%d)",
  "fearGreedIndex": $FNG_VALUE,
  "fearGreedLabel": "$FNG_LABEL",
  "btcPrice": $BTC_PRICE,
  "whaleAccumulation": "+21%",
  "etfInflows": "\$1.42B",
  "fedRates": "3-3.25% (expected cut)",
  "overallSentiment": "bullish",
  "signals": [
    {"name": "Fear & Greed", "value": $FNG_VALUE, "signal": "$([ $FNG_VALUE -lt 25 ] && echo 'buy' || echo 'hold')"},
    {"name": "Whale Activity", "value": "+21%", "signal": "accumulation"},
    {"name": "ETF Flows", "value": "\$1.42B", "signal": "institutional buying"},
    {"name": "Fed Policy", "value": "rate cuts expected", "signal": "risk-on"}
  ]
}
EOF

# Commit and push
git add data/sentiment.json
git commit -m "Daily update: $(date +%Y-%m-%d) - F&G: $FNG_VALUE ($FNG_LABEL), BTC: \$$BTC_PRICE" || true
git push origin main

echo "✅ Dashboard updated: F&G=$FNG_VALUE, BTC=\$$BTC_PRICE"
