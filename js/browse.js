/**
 * ComicVerse Hub - Browse Page JavaScript
 * 
 * This file handles all interactive functionality for the browse page,
 * including filtering, sorting, and dynamic comic display.
 */

let allComics = [];
let filteredComics = [];

/**
 * Initialize the browse page when DOM is loaded
 */
document.addEventListener('DOMContentLoaded', () => {
    initializeMobileMenu();
    loadAllComics();
    setupFilters();
    setupSorting();
    setupSearch();
    checkURLParameters();
});

/**
 * Load all comics and display them
 */
function loadAllComics() {
    allComics = [...COMICS_DATA];
    filteredComics = [...allComics];
    displayComics(filteredComics);
    populateFilterOptions();
    updateResultsInfo(filteredComics.length);
}

/**
 * Display comics in the grid
 * @param {Array} comics - Array of comic objects to display
 */
function displayComics(comics) {
    const grid = document.getElementById('comics-grid');
    const noResults = document.getElementById('no-results');
    
    if (!grid) return;
    
    // Clear existing content
    grid.innerHTML = '';
    
    if (comics.length === 0) {
        grid.style.display = 'none';
        if (noResults) {
            noResults.style.display = 'block';
        }
        return;
    }
    
    grid.style.display = 'grid';
    if (noResults) {
        noResults.style.display = 'none';
    }
    
    // Create and append comic cards
    comics.forEach(comic => {
        grid.appendChild(createComicCard(comic));
    });
}

/**
 * Create a comic card element
 * @param {Object} comic - The comic object
 * @returns {HTMLElement} - The comic card element
 */
function createComicCard(comic) {
    const card = document.createElement('div');
    card.className = 'comic-card';
    card.addEventListener('click', () => {
        window.location.href = `comic-detail.html?id=${comic.id}`;
    });
    
    card.innerHTML = `
        <div class="comic-card-image">
            <img src="${comic.coverImage}" alt="${comic.title}" 
                 onerror="this.parentElement.innerHTML='${comic.title.substring(0, 20)}...'"
                 style="width: 100%; height: 100%; object-fit: cover;">
        </div>
        <div class="comic-card-content">
            <h3 class="comic-card-title">${comic.title}</h3>
            <p class="comic-card-publisher">${comic.publisher}</p>
            <p class="comic-card-price">${formatPrice(comic.price)}</p>
        </div>
    `;
    
    return card;
}

/**
 * Populate filter dropdowns with available options
 */
function populateFilterOptions() {
    // Populate publishers
    const publisherFilter = document.getElementById('publisher-filter');
    if (publisherFilter) {
        const publishers = getAllPublishers();
        publishers.forEach(publisher => {
            const option = document.createElement('option');
            option.value = publisher;
            option.textContent = publisher;
            publisherFilter.appendChild(option);
        });
    }
    
    // Populate genres
    const genreFilter = document.getElementById('genre-filter');
    if (genreFilter) {
        const genres = getAllGenres();
        genres.forEach(genre => {
            const option = document.createElement('option');
            option.value = genre;
            option.textContent = genre;
            genreFilter.appendChild(option);
        });
    }
}

/**
 * Setup filter event listeners
 */
function setupFilters() {
    const publisherFilter = document.getElementById('publisher-filter');
    const genreFilter = document.getElementById('genre-filter');
    const characterFilter = document.getElementById('character-filter');
    const clearFiltersBtn = document.getElementById('clear-filters-btn');
    
    if (publisherFilter) {
        publisherFilter.addEventListener('change', applyFilters);
    }
    
    if (genreFilter) {
        genreFilter.addEventListener('change', applyFilters);
    }
    
    if (characterFilter) {
        characterFilter.addEventListener('input', debounce(applyFilters, 300));
    }
    
    if (clearFiltersBtn) {
        clearFiltersBtn.addEventListener('click', clearAllFilters);
    }
}

/**
 * Setup search functionality
 */
function setupSearch() {
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('input', debounce(applyFilters, 300));
    }
}

/**
 * Setup sorting functionality
 */
function setupSorting() {
    const sortSelect = document.getElementById('sort-by');
    if (sortSelect) {
        sortSelect.addEventListener('change', applySorting);
    }
}

/**
 * Apply all active filters
 */
function applyFilters() {
    const searchInput = document.getElementById('search-input');
    const publisherFilter = document.getElementById('publisher-filter');
    const genreFilter = document.getElementById('genre-filter');
    const characterFilter = document.getElementById('character-filter');
    
    const searchTerm = searchInput ? searchInput.value.toLowerCase().trim() : '';
    const publisher = publisherFilter ? publisherFilter.value : '';
    const genre = genreFilter ? genreFilter.value : '';
    const character = characterFilter ? characterFilter.value.toLowerCase().trim() : '';
    
    // Filter comics
    filteredComics = allComics.filter(comic => {
        // Search filter (title)
        const matchesSearch = !searchTerm || 
            comic.title.toLowerCase().includes(searchTerm);
        
        // Publisher filter
        const matchesPublisher = !publisher || 
            comic.publisher === publisher;
        
        // Genre filter
        const matchesGenre = !genre || 
            comic.genre === genre;
        
        // Character filter
        const matchesCharacter = !character || 
            comic.characters.some(char => 
                char.toLowerCase().includes(character)
            );
        
        return matchesSearch && matchesPublisher && matchesGenre && matchesCharacter;
    });
    
    // Apply current sorting
    applySorting();
    updateResultsInfo(filteredComics.length);
}

/**
 * Apply sorting to filtered comics
 */
function applySorting() {
    const sortSelect = document.getElementById('sort-by');
    if (!sortSelect) return;
    
    const sortValue = sortSelect.value;
    
    filteredComics.sort((a, b) => {
        switch (sortValue) {
            case 'title-asc':
                return a.title.localeCompare(b.title);
            
            case 'title-desc':
                return b.title.localeCompare(a.title);
            
            case 'price-asc':
                return a.price - b.price;
            
            case 'price-desc':
                return b.price - a.price;
            
            case 'date-asc':
                return new Date(a.releaseDate) - new Date(b.releaseDate);
            
            case 'date-desc':
                return new Date(b.releaseDate) - new Date(a.releaseDate);
            
            default:
                return 0;
        }
    });
    
    displayComics(filteredComics);
}

/**
 * Clear all filters and reset view
 */
function clearAllFilters() {
    const searchInput = document.getElementById('search-input');
    const publisherFilter = document.getElementById('publisher-filter');
    const genreFilter = document.getElementById('genre-filter');
    const characterFilter = document.getElementById('character-filter');
    const sortSelect = document.getElementById('sort-by');
    
    if (searchInput) searchInput.value = '';
    if (publisherFilter) publisherFilter.value = '';
    if (genreFilter) genreFilter.value = '';
    if (characterFilter) characterFilter.value = '';
    if (sortSelect) sortSelect.value = 'title-asc';
    
    filteredComics = [...allComics];
    applySorting();
    updateResultsInfo(filteredComics.length);
}

/**
 * Update results info text
 * @param {number} count - Number of results
 */
function updateResultsInfo(count) {
    const resultsInfo = document.getElementById('results-info');
    if (!resultsInfo) return;
    
    if (count === allComics.length) {
        resultsInfo.textContent = `Showing all ${count} comics`;
    } else {
        resultsInfo.textContent = `Showing ${count} of ${allComics.length} comics`;
    }
}

/**
 * Check URL parameters for initial filters (e.g., ?publisher=Marvel)
 */
function checkURLParameters() {
    const publisherParam = getURLParameter('publisher');
    
    if (publisherParam) {
        const publisherFilter = document.getElementById('publisher-filter');
        if (publisherFilter) {
            publisherFilter.value = publisherParam;
            applyFilters();
        }
    }
}

/**
 * Initialize mobile menu toggle
 */
function initializeMobileMenu() {
    const menuToggle = document.getElementById('menu-toggle');
    const nav = document.getElementById('main-nav');
    
    if (menuToggle && nav) {
        menuToggle.addEventListener('click', () => {
            nav.classList.toggle('active');
        });
        
        // Close menu when clicking on a nav link
        const navLinks = nav.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                nav.classList.remove('active');
            });
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!nav.contains(e.target) && !menuToggle.contains(e.target)) {
                nav.classList.remove('active');
            }
        });
    }
}

