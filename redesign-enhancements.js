// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// ENHANCEMENTS — INTERACTIVE FEATURES
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

class EnhancedTerminal extends SentimentTerminal {
    constructor() {
        super();
        this.settings = {
            animations: true,
            particles: true,
            sounds: false,
            notifications: true
        };
        this.loadSettings();
        this.initEnhancements();
    }

    initEnhancements() {
        this.setupKeyboardShortcuts();
        this.setupSettingsPanel();
        this.setupCopyable();
        this.setupTooltips();
        this.setupParticles();
        this.hideLoadingOverlay();
    }

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // NUMBER COUNTING ANIMATION
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

    animateNumber(element, start, end, duration = 800) {
        if (!this.settings.animations) {
            element.textContent = end;
            return;
        }

        const range = end - start;
        const increment = range / (duration / 16);
        let current = start;

        element.classList.add('updating');

        const timer = setInterval(() => {
            current += increment;
            if ((increment > 0 && current >= end) || (increment < 0 && current <= end)) {
                current = end;
                clearInterval(timer);
                element.classList.remove('updating');
            }
            element.textContent = Math.round(current);
        }, 16);
    }

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // KEYBOARD SHORTCUTS
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Ignore if typing in input
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

            switch(e.key.toLowerCase()) {
                case 'r':
                    e.preventDefault();
                    this.refresh();
                    break;
                case 's':
                    e.preventDefault();
                    this.toggleSettings();
                    break;
                case 'e':
                    e.preventDefault();
                    this.exportData();
                    break;
                case 'c':
                    e.preventDefault();
                    this.copySnapshot();
                    break;
                case '?':
                    e.preventDefault();
                    this.toggleShortcutsOverlay();
                    break;
                case 'escape':
                    this.closeAllOverlays();
                    break;
            }
        });
    }

    toggleShortcutsOverlay() {
        let overlay = document.getElementById('shortcutsOverlay');
        if (!overlay) {
            overlay = this.createShortcutsOverlay();
            document.body.appendChild(overlay);
        }
        overlay.classList.toggle('visible');
    }

    createShortcutsOverlay() {
        const overlay = document.createElement('div');
        overlay.id = 'shortcutsOverlay';
        overlay.className = 'shortcuts-overlay';
        overlay.innerHTML = `
            <div class="shortcuts-content">
                <h2 class="shortcuts-title">⌨️ Keyboard Shortcuts</h2>
                <div class="shortcut-item">
                    <span class="shortcut-key">R</span>
                    <span class="shortcut-description">Refresh data</span>
                </div>
                <div class="shortcut-item">
                    <span class="shortcut-key">S</span>
                    <span class="shortcut-description">Toggle settings</span>
                </div>
                <div class="shortcut-item">
                    <span class="shortcut-key">E</span>
                    <span class="shortcut-description">Export data (JSON)</span>
                </div>
                <div class="shortcut-item">
                    <span class="shortcut-key">C</span>
                    <span class="shortcut-description">Copy market snapshot</span>
                </div>
                <div class="shortcut-item">
                    <span class="shortcut-key">?</span>
                    <span class="shortcut-description">Show this help</span>
                </div>
                <div class="shortcut-item">
                    <span class="shortcut-key">ESC</span>
                    <span class="shortcut-description">Close overlays</span>
                </div>
            </div>
        `;
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                overlay.classList.remove('visible');
            }
        });
        return overlay;
    }

    closeAllOverlays() {
        const overlay = document.getElementById('shortcutsOverlay');
        if (overlay) overlay.classList.remove('visible');
        
        const settings = document.getElementById('settingsPanel');
        if (settings) settings.classList.remove('open');
    }

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // SETTINGS PANEL
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

    setupSettingsPanel() {
        const toggle = document.createElement('button');
        toggle.className = 'settings-toggle';
        toggle.innerHTML = '⚙️';
        toggle.addEventListener('click', () => this.toggleSettings());
        document.body.appendChild(toggle);

        const panel = document.createElement('div');
        panel.id = 'settingsPanel';
        panel.className = 'settings-panel';
        panel.innerHTML = `
            <h3 class="settings-title">Settings</h3>
            <div class="settings-option">
                <label>Animations</label>
                <div class="toggle-switch ${this.settings.animations ? 'active' : ''}" data-setting="animations"></div>
            </div>
            <div class="settings-option">
                <label>Particle Effects</label>
                <div class="toggle-switch ${this.settings.particles ? 'active' : ''}" data-setting="particles"></div>
            </div>
            <div class="settings-option">
                <label>Sound Effects</label>
                <div class="toggle-switch ${this.settings.sounds ? 'active' : ''}" data-setting="sounds"></div>
            </div>
            <div class="settings-option">
                <label>Notifications</label>
                <div class="toggle-switch ${this.settings.notifications ? 'active' : ''}" data-setting="notifications"></div>
            </div>
            <button class="export-button" id="exportJsonBtn">Export Data (JSON)</button>
            <button class="export-button" id="exportCsvBtn">Export Data (CSV)</button>
        `;
        document.body.appendChild(panel);

        // Toggle switches
        panel.querySelectorAll('.toggle-switch').forEach(toggle => {
            toggle.addEventListener('click', () => {
                const setting = toggle.dataset.setting;
                this.settings[setting] = !this.settings[setting];
                toggle.classList.toggle('active');
                this.saveSettings();
            });
        });

        // Export buttons
        document.getElementById('exportJsonBtn').addEventListener('click', () => this.exportData('json'));
        document.getElementById('exportCsvBtn').addEventListener('click', () => this.exportData('csv'));
    }

    toggleSettings() {
        const panel = document.getElementById('settingsPanel');
        panel.classList.toggle('open');
    }

    saveSettings() {
        localStorage.setItem('terminalSettings', JSON.stringify(this.settings));
    }

    loadSettings() {
        const saved = localStorage.getItem('terminalSettings');
        if (saved) {
            this.settings = { ...this.settings, ...JSON.parse(saved) };
        }
    }

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // COPY TO CLIPBOARD
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

    setupCopyable() {
        const copyableElements = [
            'fearGreedValue', 'btcPrice', 'btcDominance', 
            'athDistance', 'atlDistance'
        ];

        copyableElements.forEach(id => {
            const el = document.getElementById(id);
            if (el) {
                el.classList.add('copyable');
                el.addEventListener('click', () => this.copyToClipboard(el));
            }
        });
    }

    async copyToClipboard(element) {
        const text = element.textContent;
        try {
            await navigator.clipboard.writeText(text);
            element.classList.add('copied');
            setTimeout(() => element.classList.remove('copied'), 1500);
            this.showNotification('Copied!', `${text} copied to clipboard`);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    }

    copySnapshot() {
        const snapshot = `
🚀 CRYPTO SENTIMENT TERMINAL

Fear & Greed Index: ${this.data.fearGreedIndex}
Zone: ${this.getZoneText(this.data.fearGreedIndex)}
BTC Price: $${this.data.btcPrice.toLocaleString()}
Change 24h: ${this.data.btcChange24h >= 0 ? '+' : ''}${this.data.btcChange24h}%
BTC Dominance: ${this.data.btcDominance}%

Last Update: ${this.data.lastUpdate}
        `.trim();

        navigator.clipboard.writeText(snapshot).then(() => {
            this.showNotification('Snapshot Copied!', 'Market data copied to clipboard');
        });
    }

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // TOOLTIPS
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

    setupTooltips() {
        const tooltips = {
            fearGreedValue: 'Click to copy Fear & Greed Index',
            btcPrice: 'Click to copy Bitcoin price',
            btcDominance: 'Bitcoin\'s share of total crypto market cap',
            athDistance: 'Distance from All-Time High',
            atlDistance: 'Distance from All-Time Low'
        };

        Object.keys(tooltips).forEach(id => {
            const el = document.getElementById(id);
            if (el && !el.closest('.tooltip-wrapper')) {
                const wrapper = document.createElement('div');
                wrapper.className = 'tooltip-wrapper';
                el.parentNode.insertBefore(wrapper, el);
                wrapper.appendChild(el);

                const tooltip = document.createElement('div');
                tooltip.className = 'tooltip-content';
                tooltip.textContent = tooltips[id];
                wrapper.appendChild(tooltip);
            }
        });
    }

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // PARTICLE EFFECTS
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

    setupParticles() {
        const container = document.createElement('div');
        container.className = 'particles-container';
        container.id = 'particlesContainer';
        document.body.appendChild(container);
    }

    triggerParticles(zone) {
        if (!this.settings.particles) return;
        if (zone !== 'EXTREME FEAR' && zone !== 'EXTREME GREED') return;

        const container = document.getElementById('particlesContainer');
        const count = 20;

        for (let i = 0; i < count; i++) {
            setTimeout(() => {
                const particle = document.createElement('div');
                particle.className = 'particle';
                particle.style.left = Math.random() * 100 + '%';
                particle.style.animationDelay = Math.random() * 0.5 + 's';
                container.appendChild(particle);

                setTimeout(() => particle.remove(), 3000);
            }, i * 50);
        }
    }

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // EXPORT DATA
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

    exportData(format = 'json') {
        const filename = `crypto-sentiment-${this.data.lastUpdate}.${format}`;
        
        if (format === 'json') {
            const blob = new Blob([JSON.stringify(this.data, null, 2)], 
                                  { type: 'application/json' });
            this.downloadBlob(blob, filename);
        } else if (format === 'csv') {
            const csv = this.convertToCSV();
            const blob = new Blob([csv], { type: 'text/csv' });
            this.downloadBlob(blob, filename);
        }

        this.showNotification('Export Complete', `Data exported as ${filename}`);
    }

    convertToCSV() {
        if (!this.data.historical || this.data.historical.length === 0) {
            return 'No historical data available';
        }

        const headers = ['Date', 'Fear & Greed', 'Zone', 'BTC Price', '24h Change'];
        const rows = this.data.historical.map(entry => [
            entry.date,
            entry.fearGreedIndex,
            this.getZoneText(entry.fearGreedIndex),
            entry.btcPrice,
            entry.btcChange24h
        ]);

        return [headers, ...rows].map(row => row.join(',')).join('\n');
    }

    downloadBlob(blob, filename) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // NOTIFICATIONS
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

    showNotification(title, message, duration = 3000) {
        if (!this.settings.notifications) return;

        let toast = document.getElementById('notificationToast');
        if (!toast) {
            toast = document.createElement('div');
            toast.id = 'notificationToast';
            toast.className = 'notification-toast';
            document.body.appendChild(toast);
        }

        toast.innerHTML = `
            <div class="notification-title">${title}</div>
            <div class="notification-message">${message}</div>
        `;

        toast.classList.add('show');

        setTimeout(() => {
            toast.classList.remove('show');
        }, duration);
    }

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // LOADING OVERLAY
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

    hideLoadingOverlay() {
        setTimeout(() => {
            const overlay = document.getElementById('loadingOverlay');
            if (overlay) {
                overlay.classList.add('hidden');
                setTimeout(() => overlay.remove(), 500);
            }
        }, 1500);
    }

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // REFRESH WITH ENHANCEMENTS
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

    async refresh() {
        this.showNotification('Refreshing...', 'Loading latest market data');
        await this.loadData();
        this.render();
        this.renderHistorical(); // Ensure historical table is updated
        
        // Update chart
        if (typeof window.updateChart === 'function') {
            window.updateChart(this.data);
        }
        
        const zone = this.getZoneText(this.data.fearGreedIndex);
        this.triggerParticles(zone);
    }

    // Override render to add animations
    renderFearGreed() {
        const { fearGreedIndex } = this.data;
        const value = fearGreedIndex || 0;
        
        // Animate number
        const valueEl = document.getElementById('fearGreedValue');
        const oldValue = parseInt(valueEl.textContent) || 0;
        if (this.settings.animations && oldValue !== value) {
            this.animateNumber(valueEl, oldValue, value);
        } else {
            valueEl.textContent = value;
        }
        
        const zone = this.getZoneText(value);
        document.getElementById('fearGreedZone').textContent = zone;
        
        // Update gauge (keep original logic)
        const arc = document.getElementById('gaugeArc');
        const progress = (100 - value) / 100;
        const dashoffset = 251.2 * progress;
        arc.style.strokeDashoffset = dashoffset;
        
        const line = document.getElementById('gaugeLine');
        const rotation = -90 + (value / 100) * 180;
        line.style.transform = `rotate(${rotation}deg)`;
        line.style.opacity = '1';
        
        this.renderSignal(value);
        this.triggerParticles(zone);
    }
}

// Initialize enhanced terminal
document.addEventListener('DOMContentLoaded', () => {
    new EnhancedTerminal();
});
