/**
 * ComicVerse Hub - Favorites/Wishlist Page JavaScript
 * 
 * This file handles displaying and managing the wishlist page.
 */

/**
 * Initialize the favorites page when DOM is loaded
 */
document.addEventListener('DOMContentLoaded', () => {
    initializeMobileMenu();
    loadWishlist();
});

/**
 * Load and display wishlist items
 */
function loadWishlist() {
    const wishlistComics = getWishlistComics();
    const container = document.getElementById('wishlist-container');
    const emptyMessage = document.getElementById('empty-wishlist');
    
    if (!container) return;
    
    if (wishlistComics.length === 0) {
        container.innerHTML = '';
        if (emptyMessage) {
            emptyMessage.style.display = 'block';
        }
        return;
    }
    
    if (emptyMessage) {
        emptyMessage.style.display = 'none';
    }
    
    // Create grid
    const grid = document.createElement('div');
    grid.className = 'comic-grid';
    
    wishlistComics.forEach(comic => {
        grid.appendChild(createWishlistCard(comic));
    });
    
    container.innerHTML = '';
    container.appendChild(grid);
}

/**
 * Create a wishlist card element
 * @param {Object} comic - The comic object
 * @returns {HTMLElement} - The comic card element
 */
function createWishlistCard(comic) {
    const card = document.createElement('div');
    card.className = 'comic-card';
    card.setAttribute('data-comic-id', comic.id);
    
    card.innerHTML = `
        <button class="wishlist-btn active" 
                data-comic-id="${comic.id}" 
                aria-label="Remove from wishlist">
        </button>
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
    
    // Add click handlers
    const wishlistBtn = card.querySelector('.wishlist-btn');
    
    // Wishlist button handler
    if (wishlistBtn) {
        wishlistBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            removeFromWishlist(comic.id);
            loadWishlist();
        });
    }
    
    // Navigate to detail page on card click (except wishlist button)
    card.addEventListener('click', (e) => {
        if (!e.target.closest('.wishlist-btn')) {
            window.location.href = `comic-detail.html?id=${comic.id}`;
        }
    });
    
    return card;
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

