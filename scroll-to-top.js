// Scroll to Top Button
// Appears after scrolling past hero section

// Create button
const scrollButton = document.createElement('button');
scrollButton.id = 'scrollToTop';
scrollButton.className = 'scroll-to-top';
scrollButton.setAttribute('aria-label', 'Scroll to top');
scrollButton.innerHTML = `
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <polyline points="18 15 12 9 6 15"></polyline>
    </svg>
`;
document.body.appendChild(scrollButton);

// Show/hide based on scroll position
let lastScroll = 0;
window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    // Show button after scrolling 400px
    if (currentScroll > 400) {
        scrollButton.classList.add('visible');
    } else {
        scrollButton.classList.remove('visible');
    }
    
    lastScroll = currentScroll;
});

// Smooth scroll to top on click
scrollButton.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
    
    // Optional: Show feedback
    scrollButton.innerHTML = `
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
    `;
    
    setTimeout(() => {
        scrollButton.innerHTML = `
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="18 15 12 9 6 15"></polyline>
            </svg>
        `;
    }, 1000);
});

// Add CSS
const style = document.createElement('style');
style.textContent = `
    .scroll-to-top {
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        background: var(--accent-blue);
        color: white;
        border: none;
        border-radius: 50%;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 4px 20px rgba(77, 159, 255, 0.4);
        opacity: 0;
        visibility: hidden;
        transform: translateY(20px) scale(0.8);
        transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        z-index: 1000;
    }
    
    .scroll-to-top.visible {
        opacity: 1;
        visibility: visible;
        transform: translateY(0) scale(1);
    }
    
    .scroll-to-top:hover {
        background: var(--accent-blue);
        box-shadow: 0 6px 30px rgba(77, 159, 255, 0.6);
        transform: translateY(-4px) scale(1.1);
    }
    
    .scroll-to-top:active {
        transform: translateY(-2px) scale(1.05);
    }
    
    .scroll-to-top svg {
        transition: transform 0.3s ease;
    }
    
    .scroll-to-top:hover svg {
        transform: translateY(-2px);
    }
    
    /* Mobile adjustments */
    @media (max-width: 768px) {
        .scroll-to-top {
            bottom: 20px;
            right: 20px;
            width: 45px;
            height: 45px;
        }
    }
    
    /* Accessibility: reduce motion for users who prefer it */
    @media (prefers-reduced-motion: reduce) {
        .scroll-to-top {
            transition: opacity 0.3s ease, visibility 0.3s ease;
        }
        
        .scroll-to-top:hover {
            transform: none;
        }
    }
`;
document.head.appendChild(style);

console.log('⬆️ Scroll to top button loaded');
