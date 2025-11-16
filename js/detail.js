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
    setupQuantityControls();
    setupAddToCart();
    setupWishlist();
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
    
    const isWishlisted = isInWishlist(comic.id);
    const releaseDate = new Date(comic.releaseDate);
    const daysSinceRelease = Math.floor((new Date() - releaseDate) / (1000 * 60 * 60 * 24));
    const isNew = daysSinceRelease <= 30;
    const isPopular = comic.popular;
    const isFeatured = comic.featured;
    
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
                    ${isNew ? '<div style="position: absolute; top: 10px; left: 10px; background: var(--color-primary); color: var(--color-text); padding: 5px 10px; border-radius: 4px; font-weight: bold; font-size: 0.8rem; z-index: 10;">NEW</div>' : ''}
                    ${isFeatured ? '<div style="position: absolute; top: 10px; right: 10px; background: var(--color-accent); color: var(--color-dark); padding: 5px 10px; border-radius: 4px; font-weight: bold; font-size: 0.8rem; z-index: 10;">FEATURED</div>' : ''}
                </div>
            </div>
            
            <!-- Comic Info Section -->
            <div class="comic-info-section">
                <h1 class="comic-title">${escapeHtml(comic.title)}</h1>
                <p class="comic-subtitle">${escapeHtml(comic.publisher)} • ${escapeHtml(comic.genre)}</p>
                
                <!-- Price Section -->
                <div class="price-section">
                    <div class="comic-price-large">${formatPrice(comic.price)}</div>
                    <div style="font-size: 0.8rem; color: var(--color-text-muted); margin-top: 5px;">Free shipping on orders over ₹2,000</div>
                </div>
                
                <!-- Wishlist Section -->
                <div class="wishlist-section">
                    <button class="wishlist-btn-detail ${isWishlisted ? 'active' : ''}" 
                            id="detail-wishlist-btn" 
                            data-comic-id="${comic.id}">
                        <span id="wishlist-icon">${isWishlisted ? '♥' : '♡'}</span>
                        <span>${isWishlisted ? 'In Wishlist' : 'Add to Wishlist'}</span>
                    </button>
                </div>
                
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
                        <span class="meta-label">Status</span>
                        <span class="meta-value">${isNew ? 'New Release' : 'Available'}</span>
                    </div>
                </div>
                
                <!-- Synopsis -->
                <div class="comic-synopsis">
                    <h3>Synopsis</h3>
                    <p>${escapeHtml(comic.synopsis)}</p>
                </div>
                
                <!-- Creators -->
                <div class="comic-creators">
                    <h3>Creative Team</h3>
                    <div class="creator-list">
                        ${comic.creators.writer ? `
                            <div class="creator-item">
                                <span class="creator-role">Writer</span>
                                <span class="creator-name">${escapeHtml(comic.creators.writer)}</span>
                            </div>
                        ` : ''}
                        ${comic.creators.artist ? `
                            <div class="creator-item">
                                <span class="creator-role">Artist</span>
                                <span class="creator-name">${escapeHtml(comic.creators.artist)}</span>
                            </div>
                        ` : ''}
                        ${comic.creators.colorist ? `
                            <div class="creator-item">
                                <span class="creator-role">Colorist</span>
                                <span class="creator-name">${escapeHtml(comic.creators.colorist)}</span>
                            </div>
                        ` : ''}
                    </div>
                </div>
                
                <!-- Characters -->
                ${comic.characters && comic.characters.length > 0 ? `
                    <div class="comic-characters">
                        <h3>Featured Characters</h3>
                        <div class="character-tags">
                            ${comic.characters.map(char => `
                                <span class="character-tag">${escapeHtml(char)}</span>
                            `).join('')}
                        </div>
                    </div>
                ` : ''}
                
                <!-- Additional Information -->
                <div class="additional-info">
                    <h3 style="color: var(--color-primary); font-size: 1.1rem; margin-bottom: var(--spacing-sm);">Additional Information</h3>
                    <div class="info-grid">
                        <div class="info-item">
                            <span class="info-label">Comic ID</span>
                            <span class="info-value">#${comic.id}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">Format</span>
                            <span class="info-value">Single Issue</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">Pages</span>
                            <span class="info-value">32 Pages</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">Rating</span>
                            <span class="info-value">${isPopular ? '★★★★★' : '★★★★☆'}</span>
                        </div>
                    </div>
                </div>
                
                <!-- Add to Cart Section -->
                <div class="add-to-cart-section">
                    <div class="quantity-selector">
                        <label for="quantity-input">Quantity:</label>
                        <div class="quantity-controls">
                            <button class="quantity-btn" id="quantity-decrease" aria-label="Decrease quantity">−</button>
                            <input type="number" 
                                   id="quantity-input" 
                                   class="quantity-input" 
                                   value="1" 
                                   min="1" 
                                   max="99"
                                   aria-label="Quantity">
                            <button class="quantity-btn" id="quantity-increase" aria-label="Increase quantity">+</button>
                        </div>
                    </div>
                    <div class="quantity-info">Min: 1 | Max: 99</div>
                    <button class="btn btn-primary add-to-cart-btn" id="add-to-cart-btn">
                        <span id="add-to-cart-text">Add to Cart</span>
                    </button>
                </div>
            </div>
        </div>
    `;
    
    // Update page title
    document.title = `${comic.title} | ComicVerse Hub`;
}

/**
 * Setup quantity controls (increment/decrement buttons)
 */
function setupQuantityControls() {
    const quantityInput = document.getElementById('quantity-input');
    const decreaseBtn = document.getElementById('quantity-decrease');
    const increaseBtn = document.getElementById('quantity-increase');
    
    if (!quantityInput) return;
    
    // Update button states based on current value
    const updateButtonStates = () => {
        const value = parseInt(quantityInput.value) || 1;
        if (decreaseBtn) {
            decreaseBtn.disabled = value <= 1;
        }
        if (increaseBtn) {
            increaseBtn.disabled = value >= 99;
        }
    };
    
    // Decrease button
    if (decreaseBtn) {
        decreaseBtn.addEventListener('click', () => {
            const currentValue = parseInt(quantityInput.value) || 1;
            if (currentValue > 1) {
                quantityInput.value = currentValue - 1;
                updateButtonStates();
                quantityInput.dispatchEvent(new Event('input', { bubbles: true }));
            }
        });
    }
    
    // Increase button
    if (increaseBtn) {
        increaseBtn.addEventListener('click', () => {
            const currentValue = parseInt(quantityInput.value) || 1;
            if (currentValue < 99) {
                quantityInput.value = currentValue + 1;
                updateButtonStates();
                quantityInput.dispatchEvent(new Event('input', { bubbles: true }));
            }
        });
    }
    
    // Input validation
    quantityInput.addEventListener('input', (e) => {
        let value = parseInt(e.target.value) || 1;
        
        if (value < 1) {
            value = 1;
        } else if (value > 99) {
            value = 99;
        }
        
        e.target.value = value;
        updateButtonStates();
    });
    
    // Handle paste and other edge cases
    quantityInput.addEventListener('blur', (e) => {
        let value = parseInt(e.target.value) || 1;
        
        if (value < 1) {
            value = 1;
            showAlert('Minimum quantity is 1', 'warning', 'Invalid Quantity');
        } else if (value > 99) {
            value = 99;
            showAlert('Maximum quantity is 99', 'warning', 'Invalid Quantity');
        }
        
        e.target.value = value;
        updateButtonStates();
    });
    
    // Keyboard shortcuts
    quantityInput.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowUp') {
            e.preventDefault();
            increaseBtn?.click();
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            decreaseBtn?.click();
        }
    });
    
    // Initialize button states
    updateButtonStates();
}

/**
 * Setup add to cart functionality
 */
function setupAddToCart() {
    const addToCartBtn = document.getElementById('add-to-cart-btn');
    const addToCartText = document.getElementById('add-to-cart-text');
    const quantityInput = document.getElementById('quantity-input');
    
    if (addToCartBtn && currentComic) {
        addToCartBtn.addEventListener('click', () => {
            const quantity = parseInt(quantityInput.value) || 1;
            
            if (quantity < 1 || quantity > 99) {
                showAlert('Please enter a valid quantity (1-99)', 'warning', 'Invalid Quantity');
                quantityInput.focus();
                quantityInput.select();
                return;
            }
            
            const success = addToCart(currentComic.id, quantity);
            
            if (success) {
                // Show success feedback
                const originalText = addToCartText ? addToCartText.textContent : addToCartBtn.textContent;
                if (addToCartText) {
                    addToCartText.textContent = 'Added to Cart!';
                } else {
                    addToCartBtn.textContent = 'Added to Cart!';
                }
                addToCartBtn.style.backgroundColor = '#00cc00';
                
                setTimeout(() => {
                    if (addToCartText) {
                        addToCartText.textContent = originalText;
                    } else {
                        addToCartBtn.textContent = originalText;
                    }
                    addToCartBtn.style.backgroundColor = '';
                }, 2000);
                
                // Reset quantity to 1
                quantityInput.value = 1;
                setupQuantityControls(); // Update button states
                
                // Update cart badge
                updateCartBadge();
                // Show success toast
                showToast(`Added ${quantity} ${quantity === 1 ? 'item' : 'items'} to cart!`, 'success', 2000);
            } else {
                showAlert('Failed to add item to cart. Please try again.', 'error', 'Error');
            }
        });
    }
}

/**
 * Setup wishlist functionality
 */
function setupWishlist() {
    const wishlistBtn = document.getElementById('detail-wishlist-btn');
    const wishlistIcon = document.getElementById('wishlist-icon');
    
    if (wishlistBtn && currentComic) {
        wishlistBtn.addEventListener('click', () => {
            const added = toggleWishlist(currentComic.id);
            
            // Update button state
            if (added) {
                wishlistBtn.classList.add('active');
                wishlistBtn.innerHTML = '<span>♥</span><span>In Wishlist</span>';
                wishlistBtn.setAttribute('aria-label', 'Remove from wishlist');
                showToast('Added to wishlist!', 'success', 2000);
            } else {
                wishlistBtn.classList.remove('active');
                wishlistBtn.innerHTML = '<span>♡</span><span>Add to Wishlist</span>';
                wishlistBtn.setAttribute('aria-label', 'Add to wishlist');
                showToast('Removed from wishlist', 'info', 2000);
            }
            
            // Update badge
            updateWishlistBadge();
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

