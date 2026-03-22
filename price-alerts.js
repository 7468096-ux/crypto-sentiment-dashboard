// PRICE ALERTS SYSTEM
// Set custom price alerts with browser notifications

// ========== ALERT STORAGE ==========

const ALERTS_KEY = 'cryptoDashboard_priceAlerts';

function getAlerts() {
    const stored = localStorage.getItem(ALERTS_KEY);
    return stored ? JSON.parse(stored) : [];
}

function saveAlerts(alerts) {
    localStorage.setItem(ALERTS_KEY, JSON.stringify(alerts));
}

function addAlert(price, direction) {
    const alerts = getAlerts();
    const newAlert = {
        id: Date.now(),
        price: parseFloat(price),
        direction: direction, // 'above' or 'below'
        created: new Date().toISOString(),
        triggered: false
    };
    
    alerts.push(newAlert);
    saveAlerts(alerts);
    return newAlert;
}

function removeAlert(id) {
    let alerts = getAlerts();
    alerts = alerts.filter(a => a.id !== id);
    saveAlerts(alerts);
}

function checkAlerts(currentPrice) {
    const alerts = getAlerts();
    let triggered = [];
    
    alerts.forEach(alert => {
        if (alert.triggered) return;
        
        const shouldTrigger = 
            (alert.direction === 'above' && currentPrice >= alert.price) ||
            (alert.direction === 'below' && currentPrice <= alert.price);
        
        if (shouldTrigger) {
            alert.triggered = true;
            triggered.push(alert);
            
            // Show notification
            showAlertNotification(alert, currentPrice);
        }
    });
    
    if (triggered.length > 0) {
        saveAlerts(alerts);
        renderAlertsList();
    }
}

// ========== NOTIFICATION ==========

function showAlertNotification(alert, currentPrice) {
    const direction = alert.direction === 'above' ? 'above' : 'below';
    const emoji = alert.direction === 'above' ? '🚀' : '⚠️';
    
    const message = `${emoji} BTC ${direction} $${alert.price.toLocaleString()}! Current: $${currentPrice.toLocaleString()}`;
    
    // Browser notification (if permitted)
    if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('🚨 Price Alert Triggered!', {
            body: message,
            icon: '/favicon.svg',
            badge: '/favicon.svg',
            tag: `alert-${alert.id}`,
            requireInteraction: true
        });
    }
    
    // In-app toast
    showToast(message, 'success', 5000);
    
    console.log(`🔔 Alert triggered: ${message}`);
}

// ========== UI COMPONENTS ==========

function createAlertsPanel() {
    const panel = document.createElement('div');
    panel.id = 'alertsPanel';
    panel.className = 'alerts-panel hidden';
    panel.innerHTML = `
        <div class="alerts-content">
            <div class="alerts-header">
                <h3>🔔 Price Alerts</h3>
                <button class="close-alerts" onclick="toggleAlertsPanel()">✕</button>
            </div>
            
            <div class="alert-form">
                <div class="form-row">
                    <label>Alert when BTC price goes</label>
                    <select id="alertDirection" class="alert-select">
                        <option value="above">Above</option>
                        <option value="below">Below</option>
                    </select>
                </div>
                <div class="form-row">
                    <input 
                        type="number" 
                        id="alertPrice" 
                        class="alert-input" 
                        placeholder="Enter price (USD)"
                        step="100"
                        min="0"
                    />
                    <button id="addAlertBtn" class="add-alert-btn">Add Alert</button>
                </div>
            </div>
            
            <div class="alerts-list-container">
                <h4>Active Alerts</h4>
                <div id="alertsList" class="alerts-list"></div>
            </div>
            
            <div class="notification-permission" id="notificationPrompt" style="display: none;">
                <p>Enable notifications to receive alerts even when the page is not open</p>
                <button id="enableNotifications" class="enable-notif-btn">Enable Notifications</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(panel);
    
    // Event listeners
    document.getElementById('addAlertBtn').addEventListener('click', handleAddAlert);
    document.getElementById('alertPrice').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleAddAlert();
    });
    
    // Check notification permission
    if ('Notification' in window && Notification.permission === 'default') {
        document.getElementById('notificationPrompt').style.display = 'block';
        document.getElementById('enableNotifications').addEventListener('click', requestNotificationPermission);
    }
    
    renderAlertsList();
}

function handleAddAlert() {
    const price = document.getElementById('alertPrice').value;
    const direction = document.getElementById('alertDirection').value;
    
    if (!price || price <= 0) {
        showToast('❌ Please enter a valid price', 'error');
        return;
    }
    
    const alert = addAlert(price, direction);
    renderAlertsList();
    
    // Clear input
    document.getElementById('alertPrice').value = '';
    
    // Show success
    const directionText = direction === 'above' ? 'rises above' : 'falls below';
    showToast(`✅ Alert set: BTC ${directionText} $${parseFloat(price).toLocaleString()}`, 'success');
}

function renderAlertsList() {
    const container = document.getElementById('alertsList');
    if (!container) return;
    
    const alerts = getAlerts();
    const activeAlerts = alerts.filter(a => !a.triggered);
    const triggeredAlerts = alerts.filter(a => a.triggered);
    
    if (activeAlerts.length === 0 && triggeredAlerts.length === 0) {
        container.innerHTML = '<p class="no-alerts">No alerts set. Create your first alert above! 👆</p>';
        return;
    }
    
    let html = '';
    
    // Active alerts
    if (activeAlerts.length > 0) {
        html += '<div class="alert-section active-alerts">';
        activeAlerts.forEach(alert => {
            const direction = alert.direction === 'above' ? '↗️' : '↘️';
            const directionText = alert.direction === 'above' ? 'rises above' : 'falls below';
            
            html += `
                <div class="alert-item">
                    <div class="alert-info">
                        <span class="alert-direction">${direction}</span>
                        <span class="alert-text">BTC ${directionText} <strong>$${alert.price.toLocaleString()}</strong></span>
                    </div>
                    <button class="delete-alert" onclick="deleteAlert(${alert.id})">🗑️</button>
                </div>
            `;
        });
        html += '</div>';
    }
    
    // Triggered alerts
    if (triggeredAlerts.length > 0) {
        html += '<h5 style="margin-top: 1rem; opacity: 0.7;">Recently Triggered</h5>';
        html += '<div class="alert-section triggered-alerts">';
        triggeredAlerts.forEach(alert => {
            const direction = alert.direction === 'above' ? '↗️' : '↘️';
            const directionText = alert.direction === 'above' ? 'rose above' : 'fell below';
            
            html += `
                <div class="alert-item triggered">
                    <div class="alert-info">
                        <span class="alert-direction">${direction}</span>
                        <span class="alert-text">BTC ${directionText} <strong>$${alert.price.toLocaleString()}</strong></span>
                        <span class="triggered-badge">✓ Triggered</span>
                    </div>
                    <button class="delete-alert" onclick="deleteAlert(${alert.id})">🗑️</button>
                </div>
            `;
        });
        html += '</div>';
    }
    
    container.innerHTML = html;
    
    // Update badge count on button
    updateAlertBadge(activeAlerts.length);
}

function updateAlertBadge(count) {
    const btn = document.getElementById('alertsBtn');
    if (!btn) return;
    
    let badge = btn.querySelector('.alert-badge');
    if (count > 0) {
        if (!badge) {
            badge = document.createElement('span');
            badge.className = 'alert-badge';
            btn.appendChild(badge);
        }
        badge.textContent = count;
    } else if (badge) {
        badge.remove();
    }
}

function deleteAlert(id) {
    removeAlert(id);
    renderAlertsList();
    showToast('Alert deleted', 'info', 1500);
}

// Make global for onclick
window.deleteAlert = deleteAlert;
window.toggleAlertsPanel = toggleAlertsPanel;

function toggleAlertsPanel() {
    const panel = document.getElementById('alertsPanel');
    if (!panel) {
        createAlertsPanel();
        setTimeout(() => toggleAlertsPanel(), 100);
        return;
    }
    
    panel.classList.toggle('hidden');
}

async function requestNotificationPermission() {
    if (!('Notification' in window)) {
        showToast('Notifications not supported', 'error');
        return;
    }
    
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
        showToast('✅ Notifications enabled!', 'success');
        document.getElementById('notificationPrompt').style.display = 'none';
    } else {
        showToast('Notifications denied', 'error');
    }
}

// ========== ADD BUTTON TO HEADER ==========

function addAlertsButton() {
    const headerControls = document.querySelector('.header-controls');
    if (!headerControls) return;
    
    // Check if already exists
    if (document.getElementById('alertsBtn')) return;
    
    const alertsBtn = document.createElement('button');
    alertsBtn.id = 'alertsBtn';
    alertsBtn.className = 'alerts-btn';
    alertsBtn.title = 'Price Alerts';
    alertsBtn.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
            <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
        </svg>
        <span>Alerts</span>
    `;
    
    alertsBtn.addEventListener('click', toggleAlertsPanel);
    
    // Insert after export button
    const exportBtn = document.getElementById('exportBtn');
    if (exportBtn && exportBtn.parentNode) {
        exportBtn.parentNode.insertBefore(alertsBtn, exportBtn.nextSibling);
    } else {
        headerControls.appendChild(alertsBtn);
    }
    
    // Update badge
    const alerts = getAlerts().filter(a => !a.triggered);
    updateAlertBadge(alerts.length);
}

// ========== PRICE MONITORING ==========

function startPriceMonitoring() {
    // Check alerts every 30 seconds
    setInterval(() => {
        const btcPriceElement = document.getElementById('btcPrice');
        if (!btcPriceElement) return;
        
        const priceText = btcPriceElement.textContent.replace(/[$,]/g, '');
        const currentPrice = parseFloat(priceText);
        
        if (!isNaN(currentPrice)) {
            checkAlerts(currentPrice);
        }
    }, 30000); // Every 30 seconds
    
    console.log('🔔 Price monitoring started');
}

// ========== STYLES ==========

function injectAlertsStyles() {
    const style = document.createElement('style');
    style.id = 'price-alerts-styles';
    style.textContent = `
        .alerts-btn {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            padding: 0.6rem 1.2rem;
            background: var(--bg-card);
            border: 1px solid var(--border-color);
            border-radius: 8px;
            color: var(--text-primary);
            cursor: pointer;
            font-size: 0.9rem;
            font-weight: 600;
            transition: all 0.3s ease;
            position: relative;
        }
        
        .alerts-btn:hover {
            background: var(--bg-card-hover);
            border-color: var(--accent-yellow);
            transform: translateY(-2px);
            box-shadow: 0 0 20px rgba(255, 170, 0, 0.3);
        }
        
        .alert-badge {
            position: absolute;
            top: -8px;
            right: -8px;
            background: var(--accent-red);
            color: white;
            font-size: 0.75rem;
            font-weight: bold;
            padding: 0.2rem 0.5rem;
            border-radius: 12px;
            min-width: 20px;
            text-align: center;
            animation: badgePulse 2s ease infinite;
        }
        
        @keyframes badgePulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.1); }
        }
        
        .alerts-panel {
            position: fixed;
            top: 0;
            right: 0;
            width: 100%;
            max-width: 450px;
            height: 100vh;
            background: var(--bg-dark);
            border-left: 2px solid var(--border-color);
            box-shadow: -10px 0 30px rgba(0, 0, 0, 0.5);
            z-index: 1000;
            transform: translateX(100%);
            transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            overflow-y: auto;
        }
        
        .alerts-panel:not(.hidden) {
            transform: translateX(0);
        }
        
        .alerts-content {
            padding: 2rem;
        }
        
        .alerts-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 1.5rem;
        }
        
        .alerts-header h3 {
            font-size: 1.5rem;
            margin: 0;
        }
        
        .close-alerts {
            background: transparent;
            border: none;
            font-size: 1.5rem;
            cursor: pointer;
            color: var(--text-secondary);
            padding: 0.25rem 0.5rem;
            transition: all 0.3s ease;
        }
        
        .close-alerts:hover {
            color: var(--accent-red);
            transform: scale(1.2);
        }
        
        .alert-form {
            background: var(--bg-card);
            border: 1px solid var(--border-color);
            border-radius: 12px;
            padding: 1.5rem;
            margin-bottom: 1.5rem;
        }
        
        .form-row {
            display: flex;
            gap: 0.75rem;
            margin-bottom: 1rem;
            flex-wrap: wrap;
        }
        
        .form-row:last-child {
            margin-bottom: 0;
        }
        
        .form-row label {
            flex: 1 0 100%;
            color: var(--text-secondary);
            font-size: 0.9rem;
            margin-bottom: 0.25rem;
        }
        
        .alert-select,
        .alert-input {
            padding: 0.75rem 1rem;
            background: var(--bg-dark);
            border: 1px solid var(--border-color);
            border-radius: 8px;
            color: var(--text-primary);
            font-size: 0.95rem;
            transition: all 0.3s ease;
        }
        
        .alert-select {
            flex: 1;
        }
        
        .alert-input {
            flex: 2;
        }
        
        .alert-select:focus,
        .alert-input:focus {
            outline: none;
            border-color: var(--accent-blue);
            box-shadow: 0 0 15px rgba(77, 159, 255, 0.2);
        }
        
        .add-alert-btn {
            flex: 1;
            padding: 0.75rem 1.5rem;
            background: var(--accent-green);
            color: var(--bg-dark);
            border: none;
            border-radius: 8px;
            font-weight: bold;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        
        .add-alert-btn:hover {
            background: var(--accent-blue);
            transform: scale(1.05);
        }
        
        .alerts-list-container h4 {
            margin-bottom: 1rem;
            color: var(--text-secondary);
        }
        
        .alerts-list {
            display: flex;
            flex-direction: column;
            gap: 0.75rem;
        }
        
        .alert-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 1rem;
            background: var(--bg-card);
            border: 1px solid var(--border-color);
            border-radius: 8px;
            transition: all 0.3s ease;
        }
        
        .alert-item:hover {
            background: var(--bg-card-hover);
            transform: translateX(-4px);
        }
        
        .alert-item.triggered {
            opacity: 0.6;
            background: rgba(0, 255, 136, 0.05);
            border-color: rgba(0, 255, 136, 0.3);
        }
        
        .alert-info {
            display: flex;
            align-items: center;
            gap: 0.75rem;
            flex: 1;
        }
        
        .alert-direction {
            font-size: 1.5rem;
        }
        
        .alert-text {
            font-size: 0.95rem;
            color: var(--text-secondary);
        }
        
        .alert-text strong {
            color: var(--text-primary);
            font-weight: 700;
        }
        
        .triggered-badge {
            margin-left: auto;
            padding: 0.25rem 0.75rem;
            background: rgba(0, 255, 136, 0.2);
            color: var(--accent-green);
            font-size: 0.8rem;
            font-weight: 600;
            border-radius: 12px;
        }
        
        .delete-alert {
            background: transparent;
            border: none;
            font-size: 1.2rem;
            cursor: pointer;
            padding: 0.25rem 0.5rem;
            opacity: 0.5;
            transition: all 0.3s ease;
        }
        
        .delete-alert:hover {
            opacity: 1;
            transform: scale(1.2);
        }
        
        .no-alerts {
            text-align: center;
            color: var(--text-secondary);
            padding: 2rem;
            font-style: italic;
        }
        
        .notification-permission {
            margin-top: 1.5rem;
            padding: 1rem;
            background: rgba(77, 159, 255, 0.1);
            border: 1px solid rgba(77, 159, 255, 0.3);
            border-radius: 8px;
        }
        
        .notification-permission p {
            margin-bottom: 0.75rem;
            color: var(--text-secondary);
            font-size: 0.9rem;
        }
        
        .enable-notif-btn {
            width: 100%;
            padding: 0.75rem;
            background: var(--accent-blue);
            color: white;
            border: none;
            border-radius: 8px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        
        .enable-notif-btn:hover {
            background: var(--accent-green);
            transform: scale(1.02);
        }
        
        /* Mobile adjustments */
        @media (max-width: 768px) {
            .alerts-panel {
                max-width: 100%;
            }
            
            .form-row {
                flex-direction: column;
            }
            
            .alert-select,
            .alert-input,
            .add-alert-btn {
                flex: 1 0 100%;
            }
        }
    `;
    
    if (!document.getElementById('price-alerts-styles')) {
        document.head.appendChild(style);
    }
}

// ========== INITIALIZATION ==========

document.addEventListener('DOMContentLoaded', () => {
    injectAlertsStyles();
    
    setTimeout(() => {
        addAlertsButton();
        createAlertsPanel();
        startPriceMonitoring();
        
        console.log('✅ Price alerts system loaded');
    }, 1000);
});

// Re-check alerts on data refresh
document.addEventListener('dataRefreshed', () => {
    const btcPriceElement = document.getElementById('btcPrice');
    if (btcPriceElement) {
        const priceText = btcPriceElement.textContent.replace(/[$,]/g, '');
        const currentPrice = parseFloat(priceText);
        if (!isNaN(currentPrice)) {
            checkAlerts(currentPrice);
        }
    }
});
