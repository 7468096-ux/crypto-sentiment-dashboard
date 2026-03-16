// CSV Export for Historical Data
// Export dashboard data to CSV for analysis in Excel, Google Sheets, etc.

async function exportToCSV() {
    try {
        // Load historical data
        const response = await fetch('./data/history.json?t=' + Date.now());
        if (!response.ok) {
            throw new Error('Failed to load historical data');
        }

        const history = await response.json();
        if (!history || history.length === 0) {
            alert('No historical data available to export');
            return;
        }

        // Build CSV content
        const headers = ['Date', 'Fear & Greed Index', 'Sentiment', 'BTC Price (USD)', '24h Change (%)'];
        const rows = history.map(row => [
            row.date,
            row.fearGreed,
            getFearGreedLabel(row.fearGreed),
            row.btcPrice,
            row.btcChange.toFixed(2)
        ]);

        const csvContent = [
            headers.join(','),
            ...rows.map(row => row.join(','))
        ].join('\n');

        // Create blob and download
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `crypto-dashboard-export-${getCurrentDate()}.csv`;
        link.style.display = 'none';
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        console.log('✅ CSV export successful');
        showExportSuccess();
        
    } catch (error) {
        console.error('❌ CSV export failed:', error);
        alert('Failed to export data. Please try again.');
    }
}

function getFearGreedLabel(value) {
    if (value <= 25) return 'Extreme Fear';
    if (value <= 45) return 'Fear';
    if (value <= 55) return 'Neutral';
    if (value <= 75) return 'Greed';
    return 'Extreme Greed';
}

function getCurrentDate() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

function showExportSuccess() {
    const exportBtn = document.getElementById('exportBtn');
    if (!exportBtn) return;

    const originalHTML = exportBtn.innerHTML;
    exportBtn.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
        </svg>
        <span>Exported!</span>
    `;
    exportBtn.style.borderColor = 'var(--accent-green)';

    setTimeout(() => {
        exportBtn.innerHTML = originalHTML;
        exportBtn.style.borderColor = '';
    }, 2000);
}

// Hook up export button
document.addEventListener('DOMContentLoaded', () => {
    const exportBtn = document.getElementById('exportBtn');
    if (exportBtn) {
        // Remove existing export listener (if any from app.js)
        const newBtn = exportBtn.cloneNode(true);
        exportBtn.parentNode.replaceChild(newBtn, exportBtn);
        
        // Add CSV export listener
        newBtn.addEventListener('click', exportToCSV);
        console.log('📊 CSV export ready');
    }
});
