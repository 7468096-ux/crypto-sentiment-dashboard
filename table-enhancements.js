// TABLE ENHANCEMENTS
// Sortable historical data table with filters

// ========== SORTABLE TABLE ==========

let sortDirection = {
    date: 'desc',
    fearGreed: null,
    btcPrice: null,
    change24h: null
};

function makeSortable() {
    const table = document.querySelector('.history-table');
    if (!table) return;
    
    const headers = table.querySelectorAll('thead th');
    const tbody = table.querySelector('tbody');
    
    if (!tbody) return;
    
    headers.forEach((header, index) => {
        // Add sort indicator
        header.style.cursor = 'pointer';
        header.style.userSelect = 'none';
        header.style.position = 'relative';
        header.style.paddingRight = '2rem';
        
        const sortIcon = document.createElement('span');
        sortIcon.className = 'sort-icon';
        sortIcon.innerHTML = '⇅';
        sortIcon.style.position = 'absolute';
        sortIcon.style.right = '0.5rem';
        sortIcon.style.opacity = '0.3';
        sortIcon.style.transition = 'all 0.3s ease';
        header.appendChild(sortIcon);
        
        header.addEventListener('click', () => {
            sortTable(index, header, tbody);
        });
    });
}

function sortTable(columnIndex, header, tbody) {
    const rows = Array.from(tbody.querySelectorAll('tr'));
    const headerText = header.textContent.trim().replace('⇅↑↓', '').trim();
    
    // Determine sort direction
    let direction = 'asc';
    const currentIcon = header.querySelector('.sort-icon');
    
    if (currentIcon.innerHTML === '↑') {
        direction = 'desc';
        currentIcon.innerHTML = '↓';
    } else {
        direction = 'asc';
        currentIcon.innerHTML = '↑';
    }
    
    // Reset other headers
    const allIcons = tbody.parentElement.querySelectorAll('.sort-icon');
    allIcons.forEach(icon => {
        if (icon !== currentIcon) {
            icon.innerHTML = '⇅';
            icon.style.opacity = '0.3';
        }
    });
    currentIcon.style.opacity = '1';
    
    // Sort rows
    rows.sort((a, b) => {
        let aValue = a.children[columnIndex]?.textContent.trim() || '';
        let bValue = b.children[columnIndex]?.textContent.trim() || '';
        
        // Handle different column types
        if (columnIndex === 0) {
            // Date column
            aValue = new Date(aValue);
            bValue = new Date(bValue);
        } else if (columnIndex === 1) {
            // Fear & Greed (number only)
            aValue = parseInt(aValue);
            bValue = parseInt(bValue);
        } else if (columnIndex === 2) {
            // BTC Price (remove $ and commas)
            aValue = parseFloat(aValue.replace(/[$,]/g, ''));
            bValue = parseFloat(bValue.replace(/[$,]/g, ''));
        } else if (columnIndex === 3) {
            // Change % (remove % and +/-)
            aValue = parseFloat(aValue.replace(/[%+]/g, ''));
            bValue = parseFloat(bValue.replace(/[%+]/g, ''));
        }
        
        if (aValue < bValue) return direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return direction === 'asc' ? 1 : -1;
        return 0;
    });
    
    // Re-append sorted rows
    rows.forEach(row => tbody.appendChild(row));
    
    // Add animation
    rows.forEach((row, i) => {
        row.style.animation = 'none';
        setTimeout(() => {
            row.style.animation = `fadeIn 0.3s ease ${i * 0.05}s`;
        }, 10);
    });
}

// ========== TIME FILTER ==========

function addTimeFilter() {
    const historyCard = document.querySelector('.history-card');
    if (!historyCard) return;
    
    // Check if filter already exists
    if (document.getElementById('timeFilter')) return;
    
    const header = historyCard.querySelector('h2');
    if (!header) return;
    
    const filterContainer = document.createElement('div');
    filterContainer.className = 'time-filter-container';
    filterContainer.innerHTML = `
        <div class="time-filter">
            <button class="filter-btn active" data-days="7">Last 7 Days</button>
            <button class="filter-btn" data-days="14">Last 14 Days</button>
            <button class="filter-btn" data-days="30">Last 30 Days</button>
            <button class="filter-btn" data-days="all">All Time</button>
        </div>
    `;
    
    header.parentNode.insertBefore(filterContainer, header.nextSibling);
    
    // Add event listeners
    const filterBtns = filterContainer.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const days = btn.dataset.days;
            filterTableByDays(days);
        });
    });
}

async function filterTableByDays(days) {
    try {
        const response = await fetch('./data/history.json?t=' + Date.now());
        if (!response.ok) throw new Error('Failed to load history');
        
        let history = await response.json();
        
        if (days !== 'all') {
            const limit = parseInt(days);
            history = history.slice(0, limit);
        }
        
        renderHistoryTable(history);
        
        // Show count
        showToast(`Showing ${history.length} days`, 'info', 1500);
    } catch (error) {
        console.error('Error filtering table:', error);
        showToast('Error filtering data', 'error');
    }
}

// ========== SEARCH FILTER ==========

function addSearchFilter() {
    const historyCard = document.querySelector('.history-card');
    if (!historyCard) return;
    
    // Check if search already exists
    if (document.getElementById('tableSearch')) return;
    
    const timeFilter = document.querySelector('.time-filter-container');
    if (!timeFilter) return;
    
    const searchContainer = document.createElement('div');
    searchContainer.className = 'search-container';
    searchContainer.innerHTML = `
        <input 
            type="text" 
            id="tableSearch" 
            class="table-search" 
            placeholder="Search by date, F&G value, or price..."
            autocomplete="off"
        />
        <span class="search-icon">🔍</span>
    `;
    
    timeFilter.appendChild(searchContainer);
    
    const searchInput = searchContainer.querySelector('#tableSearch');
    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        filterTableRows(query);
    });
}

function filterTableRows(query) {
    const tbody = document.querySelector('.history-table tbody');
    if (!tbody) return;
    
    const rows = tbody.querySelectorAll('tr');
    let visibleCount = 0;
    
    rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        const matches = text.includes(query);
        
        row.style.display = matches ? '' : 'none';
        if (matches) visibleCount++;
    });
    
    // Show result count if searching
    if (query.length > 0) {
        const historyCard = document.querySelector('.history-card h2');
        if (historyCard) {
            let badge = document.getElementById('searchResultBadge');
            if (!badge) {
                badge = document.createElement('span');
                badge.id = 'searchResultBadge';
                badge.className = 'search-result-badge';
                historyCard.appendChild(badge);
            }
            badge.textContent = `${visibleCount} results`;
        }
    } else {
        const badge = document.getElementById('searchResultBadge');
        if (badge) badge.remove();
    }
}

// ========== ENHANCED STYLES ==========

function injectTableStyles() {
    const style = document.createElement('style');
    style.id = 'table-enhancements-styles';
    style.textContent = `
        .time-filter-container {
            margin: 1.5rem 0;
            display: flex;
            flex-direction: column;
            gap: 1rem;
        }
        
        .time-filter {
            display: flex;
            gap: 0.5rem;
            flex-wrap: wrap;
        }
        
        .filter-btn {
            padding: 0.5rem 1rem;
            background: var(--bg-dark);
            border: 1px solid var(--border-color);
            border-radius: 8px;
            color: var(--text-secondary);
            cursor: pointer;
            font-weight: 600;
            font-size: 0.9rem;
            transition: all 0.3s ease;
        }
        
        .filter-btn:hover {
            background: var(--bg-card-hover);
            color: var(--text-primary);
            border-color: var(--accent-blue);
        }
        
        .filter-btn.active {
            background: var(--accent-green);
            color: var(--bg-dark);
            border-color: var(--accent-green);
        }
        
        .search-container {
            position: relative;
            max-width: 400px;
        }
        
        .table-search {
            width: 100%;
            padding: 0.75rem 1rem;
            padding-left: 2.5rem;
            background: var(--bg-dark);
            border: 1px solid var(--border-color);
            border-radius: 8px;
            color: var(--text-primary);
            font-size: 0.95rem;
            transition: all 0.3s ease;
        }
        
        .table-search:focus {
            outline: none;
            border-color: var(--accent-blue);
            box-shadow: 0 0 15px rgba(77, 159, 255, 0.2);
        }
        
        .search-icon {
            position: absolute;
            left: 0.75rem;
            top: 50%;
            transform: translateY(-50%);
            font-size: 1.2rem;
            opacity: 0.5;
            pointer-events: none;
        }
        
        .search-result-badge {
            display: inline-block;
            margin-left: 0.75rem;
            padding: 0.25rem 0.75rem;
            background: var(--accent-blue);
            color: white;
            font-size: 0.85rem;
            font-weight: 600;
            border-radius: 12px;
        }
        
        .sort-icon {
            transition: transform 0.3s ease;
        }
        
        thead th:hover .sort-icon {
            transform: scale(1.2);
        }
        
        /* Mobile adjustments */
        @media (max-width: 768px) {
            .time-filter {
                justify-content: center;
            }
            
            .filter-btn {
                flex: 1;
                min-width: 100px;
            }
            
            .search-container {
                max-width: 100%;
            }
        }
    `;
    
    if (!document.getElementById('table-enhancements-styles')) {
        document.head.appendChild(style);
    }
}

// ========== INITIALIZATION ==========

document.addEventListener('DOMContentLoaded', () => {
    injectTableStyles();
    
    // Wait for table to be rendered
    setTimeout(() => {
        makeSortable();
        addTimeFilter();
        addSearchFilter();
        
        console.log('✅ Table enhancements loaded');
    }, 1500);
});

// Re-init after data refresh
document.addEventListener('dataRefreshed', () => {
    setTimeout(() => {
        makeSortable();
    }, 500);
});
