#!/bin/bash
# Crypto Sentiment Dashboard - Daily Data Update Script
# Run via Clawdbot cron

set -e

cd /home/ubuntu/clawd/projects/crypto-dashboard

# Fetch Fear & Greed Index
FNG=$(curl -s "https://api.alternative.me/fng/?limit=1")
FNG_VALUE=$(echo $FNG | jq -r '.data[0].value')
FNG_LABEL=$(echo $FNG | jq -r '.data[0].value_classification')

# Get BTC price + 24h change (CoinGecko)
BTC_DATA=$(curl -s "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd&include_24hr_change=true")
BTC_PRICE=$(echo $BTC_DATA | jq -r '.bitcoin.usd')
BTC_CHANGE=$(echo $BTC_DATA | jq -r '.bitcoin.usd_24h_change')

# Get Bitcoin Dominance (from Global market data)
GLOBAL_DATA=$(curl -s "https://api.coingecko.com/api/v3/global")
BTC_DOMINANCE=$(echo $GLOBAL_DATA | jq -r '.data.market_cap_percentage.btc // 0' | xargs printf "%.1f")
BTC_DOMINANCE_ROUNDED=$(printf "%.0f" $BTC_DOMINANCE)

# Calculate F&G change from yesterday (if history.json exists)
FNG_CHANGE=0
if [ -f data/history.json ]; then
    YESTERDAY_FNG=$(jq -r '.[0].fearGreed' data/history.json 2>/dev/null || echo $FNG_VALUE)
    FNG_CHANGE=$((FNG_VALUE - YESTERDAY_FNG))
fi

# Update sentiment.json with F&G change
cat > data/sentiment.json << EOF
{
  "lastUpdate": "$(date +%Y-%m-%d)",
  "fearGreedIndex": $FNG_VALUE,
  "fearGreedLabel": "$FNG_LABEL",
  "fearGreedChange": $FNG_CHANGE,
  "btcPrice": $BTC_PRICE,
  "btcChange24h": $BTC_CHANGE,
  "whaleAccumulation": "+21%",
  "etfInflows": "\$1.42B",
  "fedRates": "3-3.25% (expected cut)",
  "overallSentiment": "bullish",
  "signals": [
    {"name": "Fear & Greed", "value": $FNG_VALUE, "signal": "$([ $FNG_VALUE -lt 25 ] && echo 'buy' || echo 'hold')"},
    {"name": "BTC Dominance", "value": "${BTC_DOMINANCE}%", "signal": "$([ ${BTC_DOMINANCE_ROUNDED} -gt 55 ] && echo 'BTC season' || echo 'altseason coming')"},
    {"name": "ETF Flows", "value": "\$1.42B", "signal": "institutional buying"},
    {"name": "Fed Policy", "value": "rate cuts expected", "signal": "risk-on"}
  ]
}
EOF

# Update history.json (add today's data, keep last 7 days)
if [ -f data/history.json ]; then
    # Create new entry
    NEW_ENTRY=$(cat << HISTORY_EOF
{
  "date": "$(date +%Y-%m-%d)",
  "fearGreed": $FNG_VALUE,
  "btcPrice": $BTC_PRICE,
  "change24h": $BTC_CHANGE
}
HISTORY_EOF
)
    # Prepend new entry and keep only last 7 days
    jq --argjson new "$NEW_ENTRY" '. = [$new] + .[0:6]' data/history.json > data/history.json.tmp
    mv data/history.json.tmp data/history.json
else
    # Create history.json if it doesn't exist
    echo "[$NEW_ENTRY]" | jq '.' > data/history.json
fi

# Commit and push
git add data/sentiment.json data/history.json
git commit -m "Daily update: $(date +%Y-%m-%d) - F&G: $FNG_VALUE ($FNG_LABEL), BTC: \$$BTC_PRICE" || true
git push origin main

echo "✅ Dashboard updated: F&G=$FNG_VALUE (${FNG_CHANGE:+$FNG_CHANGE}), BTC=\$$BTC_PRICE"
