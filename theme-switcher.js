// Theme Switcher - Dark/Light Mode
// Adds theme toggle functionality with localStorage persistence

(function() {
    'use strict';
    
    // Check saved theme or default to dark
    const savedTheme = localStorage.getItem('crypto-dashboard-theme') || 'dark';
    
    // Apply theme on load
    document.documentElement.setAttribute('data-theme', savedTheme);
    
    // Create theme toggle button
    function createThemeToggle() {
        const headerControls = document.querySelector('.header-controls');
        if (!headerControls) return;
        
        const themeBtn = document.createElement('button');
        themeBtn.className = 'theme-toggle-btn';
        themeBtn.setAttribute('aria-label', 'Toggle theme');
        themeBtn.title = 'Switch between dark and light mode';
        
        themeBtn.innerHTML = `
            <svg class="theme-icon sun-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="5"/>
                <line x1="12" y1="1" x2="12" y2="3"/>
                <line x1="12" y1="21" x2="12" y2="23"/>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                <line x1="1" y1="12" x2="3" y2="12"/>
                <line x1="21" y1="12" x2="23" y2="12"/>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
            </svg>
            <svg class="theme-icon moon-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
            </svg>
            <span>Theme</span>
        `;
        
        // Insert before share button
        const shareBtn = document.getElementById('shareBtn');
        if (shareBtn) {
            headerControls.insertBefore(themeBtn, shareBtn);
        } else {
            headerControls.appendChild(themeBtn);
        }
        
        // Toggle theme on click
        themeBtn.addEventListener('click', toggleTheme);
        
        // Update icon visibility
        updateThemeIcon();
    }
    
    function toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('crypto-dashboard-theme', newTheme);
        
        updateThemeIcon();
        
        // Animate transition
        document.body.style.transition = 'background-color 0.3s ease, color 0.3s ease';
        setTimeout(() => {
            document.body.style.transition = '';
        }, 300);
    }
    
    function updateThemeIcon() {
        const theme = document.documentElement.getAttribute('data-theme');
        const sunIcon = document.querySelector('.sun-icon');
        const moonIcon = document.querySelector('.moon-icon');
        
        if (!sunIcon || !moonIcon) return;
        
        if (theme === 'dark') {
            sunIcon.style.display = 'block';
            moonIcon.style.display = 'none';
        } else {
            sunIcon.style.display = 'none';
            moonIcon.style.display = 'block';
        }
    }
    
    // Keyboard shortcut: T to toggle theme
    document.addEventListener('keydown', (e) => {
        if (e.key === 't' || e.key === 'T') {
            // Only if not typing in input/textarea
            if (!['INPUT', 'TEXTAREA'].includes(e.target.tagName)) {
                e.preventDefault();
                toggleTheme();
            }
        }
    });
    
    // Initialize on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', createThemeToggle);
    } else {
        createThemeToggle();
    }
})();
