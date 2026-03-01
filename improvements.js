// CRYPTO DASHBOARD IMPROVEMENTS
// Quick wins implementation

// ==================== THEME TOGGLE ====================

let currentTheme = localStorage.getItem('theme') || 'dark';

const THEMES = {
    dark: {
        '--bg-dark': '#0a0a0a',
        '--bg-card': '#1a1a1a',
        '--bg-card-hover': '#252525',
        '--text-primary': '#ffffff',
        '--text-secondary': '#a0a0a0',
        '--border-color': '#333',
    },
    light: {
        '--bg-dark': '#f5f5f5',
        '--bg-card': '#ffffff',
        '--bg-card-hover': '#f0f0f0',
        '--text-primary': '#0a0a0a',
        '--text-secondary': '#666666',
        '--border-color': '#e0e0e0',
    }
};

function applyTheme(theme) {
    const root = document.documentElement;
    Object.entries(THEMES[theme]).forEach(([key, value]) => {
        root.style.setProperty(key, value);
    });
    currentTheme = theme;
    localStorage.setItem('theme', theme);
    
    // Update toggle button icon
    const toggleBtn = document.getElementById('themeToggle');
    if (toggleBtn) {
        toggleBtn.innerHTML = theme === 'dark' 
            ? '🌙' 
            : '☀️';
    }
}

function toggleTheme() {
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    applyTheme(newTheme);
}

// ==================== KEYBOARD SHORTCUTS ====================

const SHORTCUTS = {
    'r': () => document.getElementById('refreshBtn')?.click(),
    'c': () => document.getElementById('btcPrice')?.click(),
    't': () => toggleTheme(),
    '?': () => toggleShortcutsHelp(),
};

function handleKeyPress(e) {
    // Ignore if typing in input
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
    
    const key = e.key.toLowerCase();
    if (SHORTCUTS[key]) {
        e.preventDefault();
        SHORTCUTS[key]();
    }
}

function toggleShortcutsHelp() {
    let helpPanel = document.getElementById('shortcutsHelp');
    
    if (!helpPanel) {
        helpPanel = document.createElement('div');
        helpPanel.id = 'shortcutsHelp';
        helpPanel.className = 'shortcuts-help';
        helpPanel.innerHTML = `
            <div class="shortcuts-panel">
                <h3>⌨️ Keyboard Shortcuts</h3>
                <div class="shortcuts-list">
                    <div class="shortcut-item">
                        <kbd>R</kbd>
                        <span>Refresh data</span>
                    </div>
                    <div class="shortcut-item">
                        <kbd>C</kbd>
                        <span>Copy BTC price</span>
                    </div>
                    <div class="shortcut-item">
                        <kbd>T</kbd>
                        <span>Toggle theme</span>
                    </div>
                    <div class="shortcut-item">
                        <kbd>?</kbd>
                        <span>Toggle this help</span>
                    </div>
                </div>
                <button class="close-help" onclick="toggleShortcutsHelp()">Close</button>
            </div>
        `;
        document.body.appendChild(helpPanel);
    }
    
    helpPanel.classList.toggle('visible');
}

// ==================== ENHANCED CARD EFFECTS ====================

function addGlassmorphism() {
    const style = document.createElement('style');
    style.textContent = `
        /* Glassmorphism for cards */
        .signal-card {
            backdrop-filter: blur(10px);
            background: linear-gradient(135deg, 
                rgba(255, 255, 255, 0.05) 0%, 
                rgba(255, 255, 255, 0.02) 100%
            );
            border: 1px solid rgba(255, 255, 255, 0.1);
            box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
            position: relative;
            overflow: hidden;
        }
        
        .signal-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(
                90deg,
                transparent,
                rgba(255, 255, 255, 0.1),
                transparent
            );
            transition: left 0.5s;
        }
        
        .signal-card:hover::before {
            left: 100%;
        }
        
        .signal-card:hover {
            transform: translateY(-8px) scale(1.02);
            box-shadow: 
                0 12px 40px 0 rgba(0, 0, 0, 0.5),
                0 0 30px rgba(0, 255, 136, 0.2);
        }
        
        /* Hero card gradient background */
        .hero-card {
            background: linear-gradient(135deg, 
                rgba(77, 159, 255, 0.1) 0%, 
                rgba(0, 255, 136, 0.1) 100%
            );
            backdrop-filter: blur(20px);
            border: 1px solid rgba(255, 255, 255, 0.15);
        }
        
        /* Animated gradient for gauge container */
        .gauge-container {
            position: relative;
        }
        
        .gauge-container::after {
            content: '';
            position: absolute;
            top: -50%;
            left: -50%;
            width: 200%;
            height: 200%;
            background: radial-gradient(
                circle,
                rgba(0, 255, 136, 0.1) 0%,
                transparent 70%
            );
            animation: rotate 10s linear infinite;
            pointer-events: none;
        }
        
        @keyframes rotate {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }
        
        /* Shortcuts help panel */
        .shortcuts-help {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            backdrop-filter: blur(10px);
            display: none;
            align-items: center;
            justify-content: center;
            z-index: 1000;
            opacity: 0;
            transition: opacity 0.3s;
        }
        
        .shortcuts-help.visible {
            display: flex;
            opacity: 1;
        }
        
        .shortcuts-panel {
            background: var(--bg-card);
            border: 1px solid var(--border-color);
            border-radius: 12px;
            padding: 2rem;
            max-width: 400px;
            width: 90%;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
        }
        
        .shortcuts-panel h3 {
            margin-bottom: 1.5rem;
            text-align: center;
            font-size: 1.5rem;
        }
        
        .shortcuts-list {
            display: flex;
            flex-direction: column;
            gap: 1rem;
            margin-bottom: 1.5rem;
        }
        
        .shortcut-item {
            display: flex;
            align-items: center;
            gap: 1rem;
        }
        
        .shortcut-item kbd {
            background: var(--bg-dark);
            border: 1px solid var(--border-color);
            border-radius: 4px;
            padding: 0.25rem 0.75rem;
            font-family: monospace;
            font-weight: bold;
            min-width: 40px;
            text-align: center;
        }
        
        .shortcut-item span {
            color: var(--text-secondary);
        }
        
        .close-help {
            width: 100%;
            padding: 0.75rem;
            background: var(--accent-green);
            color: var(--bg-dark);
            border: none;
            border-radius: 8px;
            font-weight: bold;
            cursor: pointer;
            transition: all 0.3s;
        }
        
        .close-help:hover {
            background: var(--accent-blue);
            transform: scale(1.05);
        }
        
        /* Theme toggle button */
        #themeToggle {
            background: var(--bg-card);
            border: 1px solid var(--border-color);
            border-radius: 50%;
            width: 44px;
            height: 44px;
            font-size: 1.5rem;
            cursor: pointer;
            transition: all 0.3s;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        #themeToggle:hover {
            transform: rotate(180deg) scale(1.1);
            box-shadow: 0 0 20px rgba(0, 255, 136, 0.3);
        }
    `;
    document.head.appendChild(style);
}

// ==================== INITIALIZATION ====================

function initImprovements() {
    // Apply saved theme
    applyTheme(currentTheme);
    
    // Add theme toggle button to header
    const headerControls = document.querySelector('.header-controls');
    if (headerControls) {
        const themeToggle = document.createElement('button');
        themeToggle.id = 'themeToggle';
        themeToggle.title = 'Toggle theme (T)';
        themeToggle.innerHTML = currentTheme === 'dark' ? '🌙' : '☀️';
        themeToggle.onclick = toggleTheme;
        
        // Insert before refresh button
        headerControls.insertBefore(themeToggle, headerControls.firstChild);
    }
    
    // Add keyboard shortcuts
    document.addEventListener('keydown', handleKeyPress);
    
    // Add glassmorphism styles
    addGlassmorphism();
    
    console.log('✨ Dashboard improvements loaded! Press ? for shortcuts');
}

// Auto-init when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initImprovements);
} else {
    initImprovements();
}
