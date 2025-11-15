/**
 * ComicVerse Hub - Comic Detail Page JavaScript
 * 
 * This file handles dynamic content loading for the comic detail page,
 * including displaying comic information and add to cart functionality.
 */

let currentComic = null;

/**
 * Initialize the detail page when DOM is loaded
 */
document.addEventListener('DOMContentLoaded', () => {
    initializeMobileMenu();
    loadComicDetail();
});

/**
 * Load and display comic details based on URL parameter
 */
function loadComicDetail() {
    const comicId = getURLParameter('id');
    
    if (!comicId) {
        showError();
        return;
    }
    
    currentComic = getComicById(comicId);
    
    if (!currentComic) {
        showError();
        return;
    }
    
    displayComicDetail(currentComic);
    setupAddToCart();
}

/**
 * Display comic detail information
 * @param {Object} comic - The comic object
 */
function displayComicDetail(comic) {
    const contentDiv = document.getElementById('comic-detail-content');
    const errorDiv = document.getElementById('error-message');
    
    if (!contentDiv) return;
    
    // Hide error message
    if (errorDiv) {
        errorDiv.style.display = 'none';
    }
    
    // Create detail HTML
    contentDiv.innerHTML = `
        <div class="comic-detail-container">
            <!-- Comic Cover Section -->
            <div class="comic-cover-section">
                <div class="comic-cover-wrapper">
                    <img src="${comic.coverImage}" 
                         alt="${comic.title}" 
                         class="comic-cover-image"
                         onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22400%22 height=%22600%22%3E%3Crect fill=%22%23333%22 width=%22400%22 height=%22600%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 dy=%22.3em%22 fill=%22%23fff%22 font-family=%22Arial%22 font-size=%2218%22%3E${escapeHtml(comic.title)}%3C/text%3E%3C/svg%3E'">
                </div>
            </div>
            
            <!-- Comic Info Section -->
            <div class="comic-info-section">
                <h1 class="comic-title">${escapeHtml(comic.title)}</h1>
                
                <!-- Meta Information -->
                <div class="comic-meta">
                    <div class="meta-item">
                        <span class="meta-label">Publisher</span>
                        <span class="meta-value">${escapeHtml(comic.publisher)}</span>
                    </div>
                    <div class="meta-item">
                        <span class="meta-label">Genre</span>
                        <span class="meta-value">${escapeHtml(comic.genre)}</span>
                    </div>
                    <div class="meta-item">
                        <span class="meta-label">Release Date</span>
                        <span class="meta-value">${formatDate(comic.releaseDate)}</span>
                    </div>
                    <div class="meta-item">
                        <span class="meta-label">Price</span>
                        <span class="meta-value comic-price-large">${formatPrice(comic.price)}</span>
                    </div>
                </div>
                
                <!-- Synopsis -->
                <div class="comic-synopsis">
                    <h3>Synopsis</h3>
                    <p>${escapeHtml(comic.synopsis)}</p>
                </div>
                
                <!-- Creators -->
                <div class="comic-creators">
                    <h3>Creators</h3>
                    <div class="creator-list">
                        ${comic.creators.writer ? `
                            <div class="creator-item">
                                <div class="creator-role">Writer</div>
                                <div class="creator-name">${escapeHtml(comic.creators.writer)}</div>
                            </div>
                        ` : ''}
                        ${comic.creators.artist ? `
                            <div class="creator-item">
                                <div class="creator-role">Artist</div>
                                <div class="creator-name">${escapeHtml(comic.creators.artist)}</div>
                            </div>
                        ` : ''}
                        ${comic.creators.colorist ? `
                            <div class="creator-item">
                                <div class="creator-role">Colorist</div>
                                <div class="creator-name">${escapeHtml(comic.creators.colorist)}</div>
                            </div>
                        ` : ''}
                    </div>
                </div>
                
                <!-- Characters -->
                ${comic.characters && comic.characters.length > 0 ? `
                    <div class="comic-characters">
                        <h3>Characters</h3>
                        <div class="character-tags">
                            ${comic.characters.map(char => `
                                <span class="character-tag">${escapeHtml(char)}</span>
                            `).join('')}
                        </div>
                    </div>
                ` : ''}
                
                <!-- Add to Cart Section -->
                <div class="add-to-cart-section">
                    <div class="quantity-selector">
                        <label for="quantity-input">Quantity:</label>
                        <input type="number" 
                               id="quantity-input" 
                               class="quantity-input" 
                               value="1" 
                               min="1" 
                               max="99">
                    </div>
                    <button class="btn btn-primary add-to-cart-btn" id="add-to-cart-btn">
                        Add to Cart
                    </button>
                </div>
            </div>
        </div>
    `;
    
    // Update page title
    document.title = `${comic.title} | ComicVerse Hub`;
}

/**
 * Setup add to cart functionality
 */
function setupAddToCart() {
    const addToCartBtn = document.getElementById('add-to-cart-btn');
    const quantityInput = document.getElementById('quantity-input');
    
    if (addToCartBtn && currentComic) {
        addToCartBtn.addEventListener('click', () => {
            const quantity = parseInt(quantityInput.value) || 1;
            
            if (quantity < 1 || quantity > 99) {
                alert('Please enter a valid quantity (1-99)');
                return;
            }
            
            const success = addToCart(currentComic.id, quantity);
            
            if (success) {
                // Show success feedback
                const originalText = addToCartBtn.textContent;
                addToCartBtn.textContent = 'Added to Cart!';
                addToCartBtn.style.backgroundColor = '#00cc00';
                
                setTimeout(() => {
                    addToCartBtn.textContent = originalText;
                    addToCartBtn.style.backgroundColor = '';
                }, 2000);
                
                // Update cart badge
                updateCartBadge();
            } else {
                alert('Failed to add item to cart. Please try again.');
            }
        });
    }
}

/**
 * Show error message when comic is not found
 */
function showError() {
    const contentDiv = document.getElementById('comic-detail-content');
    const errorDiv = document.getElementById('error-message');
    
    if (contentDiv) {
        contentDiv.style.display = 'none';
    }
    
    if (errorDiv) {
        errorDiv.style.display = 'block';
    }
}

/**
 * Escape HTML to prevent XSS
 * @param {string} text - Text to escape
 * @returns {string} - Escaped text
 */
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
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

