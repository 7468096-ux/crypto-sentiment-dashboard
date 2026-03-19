// Countdown Timer Enhancement
// Shows time until next daily update (08:00 UTC) with visual progress bar

function initCountdownTimer() {
    const nextUpdateEl = document.getElementById('nextUpdate');
    if (!nextUpdateEl) return;
    
    // Create progress bar container
    const headerControls = document.querySelector('.update-info');
    if (!headerControls || document.getElementById('updateProgressBar')) return;
    
    const progressContainer = document.createElement('div');
    progressContainer.id = 'updateProgressBar';
    progressContainer.className = 'update-progress-container';
    progressContainer.innerHTML = `
        <div class="update-progress-bar">
            <div class="update-progress-fill" id="progressFill"></div>
        </div>
    `;
    
    headerControls.appendChild(progressContainer);
    
    // Calculate next update time (08:00 UTC)
    function getNextUpdateTime() {
        const now = new Date();
        const next = new Date();
        next.setUTCHours(8, 0, 0, 0);
        
        // If it's already past 08:00 UTC today, set to tomorrow
        if (now >= next) {
            next.setUTCDate(next.getUTCDate() + 1);
        }
        
        return next;
    }
    
    // Update countdown every second
    function updateCountdown() {
        const now = new Date();
        const nextUpdate = getNextUpdateTime();
        const diff = nextUpdate - now;
        
        if (diff <= 0) {
            nextUpdateEl.textContent = 'Updating...';
            nextUpdateEl.style.color = 'var(--accent-green)';
            return;
        }
        
        // Calculate hours, minutes, seconds
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        
        // Format with leading zeros
        const formatted = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        nextUpdateEl.textContent = formatted;
        
        // Update progress bar (24h total = 86400000ms)
        const totalDayMs = 24 * 60 * 60 * 1000;
        const elapsed = totalDayMs - diff;
        const progress = (elapsed / totalDayMs) * 100;
        
        const progressFill = document.getElementById('progressFill');
        if (progressFill) {
            progressFill.style.width = `${progress}%`;
            
            // Color based on proximity to update
            if (hours < 1) {
                progressFill.style.background = 'var(--accent-green)';
                nextUpdateEl.style.color = 'var(--accent-green)';
            } else if (hours < 3) {
                progressFill.style.background = 'var(--accent-yellow)';
                nextUpdateEl.style.color = 'var(--accent-yellow)';
            } else {
                progressFill.style.background = 'linear-gradient(90deg, var(--accent-blue), var(--accent-purple))';
                nextUpdateEl.style.color = 'var(--text-secondary)';
            }
        }
    }
    
    // Initial update
    updateCountdown();
    
    // Update every second
    setInterval(updateCountdown, 1000);
    
    console.log('⏰ Countdown timer initialized');
}

// Inject styles
function injectCountdownStyles() {
    if (document.getElementById('countdown-timer-styles')) return;
    
    const style = document.createElement('style');
    style.id = 'countdown-timer-styles';
    style.textContent = `
        .update-progress-container {
            width: 100%;
            margin-top: 0.5rem;
        }
        
        .update-progress-bar {
            width: 100%;
            height: 4px;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 2px;
            overflow: hidden;
        }
        
        .update-progress-fill {
            height: 100%;
            width: 0%;
            background: linear-gradient(90deg, var(--accent-blue), var(--accent-purple));
            transition: width 1s linear, background 0.3s ease;
            border-radius: 2px;
        }
        
        #nextUpdate {
            font-weight: 600;
            font-variant-numeric: tabular-nums;
            transition: color 0.3s ease;
        }
    `;
    
    document.head.appendChild(style);
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    injectCountdownStyles();
    setTimeout(initCountdownTimer, 500);
});
