// Keyboard Shortcuts for Crypto Dashboard
// R - Refresh, E - Export, T - Theme, ? - Help

let helpOverlayVisible = false;

// Keyboard event listener
document.addEventListener('keydown', (e) => {
    // Ignore if user is typing in an input field
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
    
    const key = e.key.toLowerCase();
    
    switch(key) {
        case 'r':
            e.preventDefault();
            const refreshBtn = document.getElementById('refreshBtn');
            if (refreshBtn) refreshBtn.click();
            showKeyboardFeedback('🔄 Refreshing...');
            break;
            
        case 'e':
            e.preventDefault();
            const exportBtn = document.getElementById('exportBtn');
            if (exportBtn) exportBtn.click();
            showKeyboardFeedback('📥 Exporting data...');
            break;
            
        case 't':
            e.preventDefault();
            const themeToggle = document.querySelector('.theme-toggle');
            if (themeToggle) themeToggle.click();
            showKeyboardFeedback('🎨 Theme toggled');
            break;
            
        case '?':
            e.preventDefault();
            toggleHelpOverlay();
            break;
            
        case 'escape':
            if (helpOverlayVisible) {
                e.preventDefault();
                toggleHelpOverlay();
            }
            break;
    }
});

// Visual feedback for keyboard actions
function showKeyboardFeedback(message) {
    const existing = document.querySelector('.keyboard-feedback');
    if (existing) existing.remove();
    
    const feedback = document.createElement('div');
    feedback.className = 'keyboard-feedback';
    feedback.textContent = message;
    document.body.appendChild(feedback);
    
    setTimeout(() => feedback.classList.add('show'), 10);
    setTimeout(() => {
        feedback.classList.remove('show');
        setTimeout(() => feedback.remove(), 300);
    }, 2000);
}

// Help overlay
function toggleHelpOverlay() {
    let overlay = document.getElementById('helpOverlay');
    
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.id = 'helpOverlay';
        overlay.className = 'help-overlay';
        overlay.innerHTML = `
            <div class="help-content">
                <h2>⌨️ Keyboard Shortcuts</h2>
                <div class="shortcuts-grid">
                    <div class="shortcut-item">
                        <kbd>R</kbd>
                        <span>Refresh Data</span>
                    </div>
                    <div class="shortcut-item">
                        <kbd>E</kbd>
                        <span>Export JSON</span>
                    </div>
                    <div class="shortcut-item">
                        <kbd>T</kbd>
                        <span>Toggle Theme</span>
                    </div>
                    <div class="shortcut-item">
                        <kbd>?</kbd>
                        <span>Show/Hide Help</span>
                    </div>
                    <div class="shortcut-item">
                        <kbd>Esc</kbd>
                        <span>Close Help</span>
                    </div>
                </div>
                <p class="help-footer">Built with ⚡ by Mission Control</p>
            </div>
        `;
        document.body.appendChild(overlay);
        
        // Close on click outside
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) toggleHelpOverlay();
        });
    }
    
    helpOverlayVisible = !helpOverlayVisible;
    overlay.classList.toggle('show');
}

// Add CSS for keyboard shortcuts
const style = document.createElement('style');
style.textContent = `
    /* Keyboard Feedback */
    .keyboard-feedback {
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--bg-card);
        color: var(--text-primary);
        padding: 12px 20px;
        border-radius: 8px;
        border: 1px solid var(--border-color);
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
        font-size: 14px;
        font-weight: 500;
        opacity: 0;
        transform: translateX(20px);
        transition: all 0.3s ease;
        z-index: 10000;
    }
    
    .keyboard-feedback.show {
        opacity: 1;
        transform: translateX(0);
    }
    
    /* Help Overlay */
    .help-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.85);
        backdrop-filter: blur(5px);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
    }
    
    .help-overlay.show {
        opacity: 1;
        visibility: visible;
    }
    
    .help-content {
        background: var(--bg-card);
        border: 1px solid var(--border-color);
        border-radius: 16px;
        padding: 40px;
        max-width: 500px;
        width: 90%;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
        transform: scale(0.9);
        transition: transform 0.3s ease;
    }
    
    .help-overlay.show .help-content {
        transform: scale(1);
    }
    
    .help-content h2 {
        margin-bottom: 30px;
        font-size: 24px;
        text-align: center;
        color: var(--accent-blue);
    }
    
    .shortcuts-grid {
        display: grid;
        gap: 16px;
    }
    
    .shortcut-item {
        display: flex;
        align-items: center;
        gap: 16px;
        padding: 12px;
        background: var(--bg-dark);
        border-radius: 8px;
        transition: background 0.2s ease;
    }
    
    .shortcut-item:hover {
        background: var(--bg-card-hover);
    }
    
    .shortcut-item kbd {
        display: inline-block;
        min-width: 40px;
        padding: 8px 12px;
        background: linear-gradient(180deg, #2a2a2a 0%, #1a1a1a 100%);
        border: 1px solid var(--border-color);
        border-radius: 6px;
        font-family: 'SF Mono', 'Monaco', 'Courier New', monospace;
        font-size: 14px;
        font-weight: 600;
        text-align: center;
        color: var(--accent-blue);
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    }
    
    [data-theme="light"] .shortcut-item kbd {
        background: linear-gradient(180deg, #ffffff 0%, #f5f5f7 100%);
        color: var(--accent-blue);
    }
    
    .shortcut-item span {
        flex: 1;
        color: var(--text-secondary);
        font-size: 14px;
    }
    
    .help-footer {
        margin-top: 30px;
        text-align: center;
        color: var(--text-secondary);
        font-size: 12px;
        opacity: 0.6;
    }
    
    /* Mobile adjustments */
    @media (max-width: 768px) {
        .help-content {
            padding: 30px 20px;
        }
        
        .keyboard-feedback {
            top: 10px;
            right: 10px;
            font-size: 13px;
            padding: 10px 16px;
        }
    }
`;
document.head.appendChild(style);

console.log('⌨️ Keyboard shortcuts loaded: R (refresh), E (export), T (theme), ? (help)');
