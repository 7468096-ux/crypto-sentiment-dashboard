// Alert Notifications - Browser Push for Extreme Zones
// Notify user when Fear & Greed hits extreme levels

const ALERT_THRESHOLDS = {
    extremeFear: 20,      // Buy signal
    extremeGreed: 80,     // Sell signal
    moderateFear: 30,
    moderateGreed: 70
};

const NOTIFICATION_COOLDOWN = 6 * 60 * 60 * 1000; // 6 hours in ms

class AlertSystem {
    constructor() {
        this.enabled = this.loadPreference();
        this.lastNotifications = this.loadHistory();
    }

    loadPreference() {
        return localStorage.getItem('alertsEnabled') === 'true';
    }

    savePreference(enabled) {
        localStorage.setItem('alertsEnabled', enabled.toString());
        this.enabled = enabled;
    }

    loadHistory() {
        const stored = localStorage.getItem('alertHistory');
        return stored ? JSON.parse(stored) : {};
    }

    saveHistory() {
        localStorage.setItem('alertHistory', JSON.stringify(this.lastNotifications));
    }

    async requestPermission() {
        if (!('Notification' in window)) {
            console.warn('Browser does not support notifications');
            return false;
        }

        if (Notification.permission === 'granted') {
            return true;
        }

        if (Notification.permission !== 'denied') {
            const permission = await Notification.requestPermission();
            return permission === 'granted';
        }

        return false;
    }

    canNotify(level) {
        const now = Date.now();
        const lastTime = this.lastNotifications[level] || 0;
        return (now - lastTime) > NOTIFICATION_COOLDOWN;
    }

    async checkAndNotify(fearGreedValue) {
        if (!this.enabled) return;

        let level = null;
        let title = '';
        let body = '';
        let icon = '';

        if (fearGreedValue <= ALERT_THRESHOLDS.extremeFear) {
            level = 'extremeFear';
            title = '🟢 Extreme Fear Alert!';
            body = `Fear & Greed Index: ${fearGreedValue}. Potential buying opportunity!`;
            icon = '🟢';
        } else if (fearGreedValue >= ALERT_THRESHOLDS.extremeGreed) {
            level = 'extremeGreed';
            title = '🔴 Extreme Greed Alert!';
            body = `Fear & Greed Index: ${fearGreedValue}. Consider taking profits!`;
            icon = '🔴';
        } else if (fearGreedValue <= ALERT_THRESHOLDS.moderateFear) {
            level = 'moderateFear';
            title = '🟡 Fear Zone';
            body = `Fear & Greed Index: ${fearGreedValue}. Market sentiment turning bearish.`;
            icon = '🟡';
        } else if (fearGreedValue >= ALERT_THRESHOLDS.moderateGreed) {
            level = 'moderateGreed';
            title = '🟠 Greed Zone';
            body = `Fear & Greed Index: ${fearGreedValue}. Market getting euphoric.`;
            icon = '🟠';
        }

        if (level && this.canNotify(level)) {
            await this.sendNotification(title, body, icon);
            this.lastNotifications[level] = Date.now();
            this.saveHistory();
        }
    }

    async sendNotification(title, body, icon) {
        const hasPermission = await this.requestPermission();
        if (!hasPermission) return;

        try {
            const notification = new Notification(title, {
                body,
                icon: '/favicon.svg',
                badge: '/favicon.svg',
                tag: 'crypto-sentiment-alert',
                requireInteraction: true,
                vibrate: [200, 100, 200]
            });

            notification.onclick = () => {
                window.focus();
                notification.close();
            };

            console.log(`📢 Notification sent: ${title}`);
        } catch (error) {
            console.error('Failed to send notification:', error);
        }
    }

    createSettingsUI() {
        const header = document.querySelector('.header-controls');
        if (!header) return;

        // Check if already exists
        if (document.getElementById('alertToggle')) return;

        const toggleBtn = document.createElement('button');
        toggleBtn.id = 'alertToggle';
        toggleBtn.className = 'alert-toggle-btn';
        toggleBtn.title = 'Toggle alert notifications';
        toggleBtn.innerHTML = `
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
            </svg>
            <span>${this.enabled ? 'Alerts ON' : 'Alerts OFF'}</span>
        `;

        toggleBtn.style.borderColor = this.enabled ? 'var(--accent-green)' : 'var(--border-color)';

        toggleBtn.addEventListener('click', async () => {
            if (!this.enabled) {
                const granted = await this.requestPermission();
                if (granted) {
                    this.savePreference(true);
                    toggleBtn.innerHTML = `
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                            <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                        </svg>
                        <span>Alerts ON</span>
                    `;
                    toggleBtn.style.borderColor = 'var(--accent-green)';
                    console.log('✅ Alerts enabled');
                }
            } else {
                this.savePreference(false);
                toggleBtn.innerHTML = `
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                        <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                        <line x1="1" y1="1" x2="23" y2="23"></line>
                    </svg>
                    <span>Alerts OFF</span>
                `;
                toggleBtn.style.borderColor = 'var(--border-color)';
                console.log('❌ Alerts disabled');
            }
        });

        // Insert before refresh button
        const refreshBtn = document.getElementById('refreshBtn');
        if (refreshBtn && refreshBtn.parentNode) {
            refreshBtn.parentNode.insertBefore(toggleBtn, refreshBtn);
        } else {
            header.appendChild(toggleBtn);
        }
    }
}

// Global instance
const alertSystem = new AlertSystem();

// Initialize when DOM ready
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        alertSystem.createSettingsUI();
    }, 1000);
});

// Hook into data refresh
document.addEventListener('dataRefreshed', (event) => {
    if (event.detail && event.detail.fearGreedIndex) {
        alertSystem.checkAndNotify(event.detail.fearGreedIndex);
    }
});

// Also check on initial load
window.addEventListener('load', () => {
    setTimeout(() => {
        const fgValue = parseInt(document.getElementById('fearGreedValue')?.textContent);
        if (!isNaN(fgValue)) {
            alertSystem.checkAndNotify(fgValue);
        }
    }, 2000);
});
