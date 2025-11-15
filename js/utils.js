/**
 * ComicVerse Hub - Utility Functions
 * 
 * This file contains shared utility functions used across the website,
 * including cart management, localStorage operations, and common helpers.
 */

/**
 * Cart Management Functions
 * Uses localStorage to persist cart data across page refreshes
 */

const CART_STORAGE_KEY = 'comicverse_cart';

/**
 * Get the current cart from localStorage
 * @returns {Array} - Array of cart items
 */
function getCart() {
    const cartJson = localStorage.getItem(CART_STORAGE_KEY);
    return cartJson ? JSON.parse(cartJson) : [];
}

/**
 * Save the cart to localStorage
 * @param {Array} cart - Array of cart items
 */
function saveCart(cart) {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
}

/**
 * Add a comic to the cart
 * @param {string} comicId - The ID of the comic to add
 * @param {number} quantity - The quantity to add (default: 1)
 * @returns {boolean} - True if successful, false otherwise
 */
function addToCart(comicId, quantity = 1) {
    const cart = getCart();
    const comic = getComicById(comicId);
    
    if (!comic) {
        console.error('Comic not found:', comicId);
        return false;
    }
    
    // Check if comic already exists in cart
    const existingItem = cart.find(item => item.id === comicId);
    
    if (existingItem) {
        // Update quantity
        existingItem.quantity += quantity;
    } else {
        // Add new item
        cart.push({
            id: comic.id,
            title: comic.title,
            price: comic.price,
            coverImage: comic.coverImage,
            quantity: quantity
        });
    }
    
    saveCart(cart);
    updateCartBadge();
    return true;
}

/**
 * Remove a comic from the cart
 * @param {string} comicId - The ID of the comic to remove
 * @returns {boolean} - True if successful, false otherwise
 */
function removeFromCart(comicId) {
    const cart = getCart();
    const filteredCart = cart.filter(item => item.id !== comicId);
    saveCart(filteredCart);
    updateCartBadge();
    return true;
}

/**
 * Update the quantity of a comic in the cart
 * @param {string} comicId - The ID of the comic
 * @param {number} quantity - The new quantity (must be > 0)
 * @returns {boolean} - True if successful, false otherwise
 */
function updateCartQuantity(comicId, quantity) {
    if (quantity <= 0) {
        return removeFromCart(comicId);
    }
    
    const cart = getCart();
    const item = cart.find(item => item.id === comicId);
    
    if (item) {
        item.quantity = quantity;
        saveCart(cart);
        updateCartBadge();
        return true;
    }
    
    return false;
}

/**
 * Clear the entire cart
 */
function clearCart() {
    localStorage.removeItem(CART_STORAGE_KEY);
    updateCartBadge();
}

/**
 * Get the total number of items in the cart
 * @returns {number} - Total quantity of items
 */
function getCartItemCount() {
    const cart = getCart();
    return cart.reduce((total, item) => total + item.quantity, 0);
}

/**
 * Get the total price of all items in the cart
 * @returns {number} - Total price
 */
function getCartTotal() {
    const cart = getCart();
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

/**
 * Update the cart badge in the navigation
 */
function updateCartBadge() {
    const badge = document.getElementById('cart-badge');
    if (badge) {
        const count = getCartItemCount();
        badge.textContent = count;
        badge.style.display = count > 0 ? 'inline-block' : 'none';
    }
}

/**
 * Format price as currency
 * @param {number} price - The price to format
 * @returns {string} - Formatted price string
 */
function formatPrice(price) {
    return `$${price.toFixed(2)}`;
}

/**
 * Format date for display
 * @param {string} dateString - ISO date string
 * @returns {string} - Formatted date string
 */
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
}

/**
 * Get URL parameter value
 * @param {string} paramName - The parameter name
 * @returns {string|null} - The parameter value or null
 */
function getURLParameter(paramName) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(paramName);
}

/**
 * Debounce function to limit function calls
 * @param {Function} func - The function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} - Debounced function
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Initialize cart badge on page load
 */
document.addEventListener('DOMContentLoaded', () => {
    updateCartBadge();
});

