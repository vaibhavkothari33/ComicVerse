/**
 * ComicVerse Hub - Cart Page JavaScript
 * 
 * This file handles all cart page functionality including displaying cart items,
 * updating quantities, removing items, and checkout.
 */

/**
 * Initialize the cart page when DOM is loaded
 */
document.addEventListener('DOMContentLoaded', () => {
    initializeMobileMenu();
    loadCart();
    setupClearCart();
});

/**
 * Load and display cart items
 */
function loadCart() {
    const cart = getCart();
    const cartItemsContainer = document.getElementById('cart-items-container');
    const cartSummaryContainer = document.getElementById('cart-summary-container');
    const emptyCartMessage = document.getElementById('empty-cart-message');
    
    if (cart.length === 0) {
        // Show empty cart message
        if (cartItemsContainer) cartItemsContainer.innerHTML = '';
        if (cartSummaryContainer) cartSummaryContainer.innerHTML = '';
        if (emptyCartMessage) emptyCartMessage.style.display = 'block';
        return;
    }
    
    // Hide empty cart message
    if (emptyCartMessage) emptyCartMessage.style.display = 'none';
    
    // Display cart items
    displayCartItems(cart, cartItemsContainer);
    
    // Display cart summary
    displayCartSummary(cart, cartSummaryContainer);
}

/**
 * Display cart items
 * @param {Array} cart - Array of cart items
 * @param {HTMLElement} container - Container element
 */
function displayCartItems(cart, container) {
    if (!container) return;
    
    const itemsDiv = document.createElement('div');
    itemsDiv.className = 'cart-items';
    
    cart.forEach((item, index) => {
        const comic = getComicById(item.id);
        const itemTotal = item.price * item.quantity;
        
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.setAttribute('data-item-id', item.id);
        
        cartItem.innerHTML = `
            <img src="${item.coverImage}" 
                 alt="${item.title}" 
                 class="cart-item-image"
                 onerror="this.style.display='none'">
            <div class="cart-item-info">
                <h3 class="cart-item-title">${escapeHtml(item.title)}</h3>
                <p class="cart-item-price">${formatPrice(item.price)} each</p>
            </div>
            <div class="cart-item-quantity">
                <button class="quantity-btn" data-action="decrease" data-item-id="${item.id}">−</button>
                <input type="number" 
                       class="quantity-input" 
                       value="${item.quantity}" 
                       min="1" 
                       max="99"
                       data-item-id="${item.id}">
                <button class="quantity-btn" data-action="increase" data-item-id="${item.id}">+</button>
            </div>
            <div class="cart-item-total">${formatPrice(itemTotal)}</div>
            <button class="cart-item-remove" data-item-id="${item.id}">Remove</button>
        `;
        
        itemsDiv.appendChild(cartItem);
    });
    
    container.innerHTML = '';
    container.appendChild(itemsDiv);
    
    // Attach event listeners
    attachCartItemListeners();
}

/**
 * Attach event listeners to cart item controls
 */
function attachCartItemListeners() {
    // Quantity decrease buttons
    document.querySelectorAll('[data-action="decrease"]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const itemId = e.target.getAttribute('data-item-id');
            const cart = getCart();
            const item = cart.find(i => i.id === itemId);
            
            if (item && item.quantity > 1) {
                updateCartQuantity(itemId, item.quantity - 1);
                loadCart();
            }
        });
    });
    
    // Quantity increase buttons
    document.querySelectorAll('[data-action="increase"]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const itemId = e.target.getAttribute('data-item-id');
            const cart = getCart();
            const item = cart.find(i => i.id === itemId);
            
            if (item && item.quantity < 99) {
                updateCartQuantity(itemId, item.quantity + 1);
                loadCart();
            }
        });
    });
    
    // Quantity input fields
    document.querySelectorAll('.quantity-input').forEach(input => {
        input.addEventListener('change', (e) => {
            const itemId = e.target.getAttribute('data-item-id');
            const quantity = parseInt(e.target.value) || 1;
            
            if (quantity >= 1 && quantity <= 99) {
                updateCartQuantity(itemId, quantity);
                loadCart();
            } else {
                // Reset to current quantity
                const cart = getCart();
                const item = cart.find(i => i.id === itemId);
                if (item) {
                    e.target.value = item.quantity;
                }
            }
        });
    });
    
    // Remove buttons
    document.querySelectorAll('.cart-item-remove').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const itemId = e.target.getAttribute('data-item-id');
            
            if (confirm('Are you sure you want to remove this item from your cart?')) {
                removeFromCart(itemId);
                loadCart();
            }
        });
    });
}

/**
 * Display cart summary with totals
 * @param {Array} cart - Array of cart items
 * @param {HTMLElement} container - Container element
 */
function displayCartSummary(cart, container) {
    if (!container) return;
    
    const subtotal = getCartTotal();
    const tax = subtotal * 0.08; // 8% tax (example)
    const total = subtotal + tax;
    
    container.innerHTML = `
        <div class="cart-summary">
            <div class="summary-row">
                <span class="summary-label">Subtotal:</span>
                <span class="summary-value">${formatPrice(subtotal)}</span>
            </div>
            <div class="summary-row">
                <span class="summary-label">Tax (8%):</span>
                <span class="summary-value">${formatPrice(tax)}</span>
            </div>
            <div class="summary-row">
                <span class="summary-label">Total:</span>
                <span class="summary-value summary-total">${formatPrice(total)}</span>
            </div>
            <button class="btn btn-primary checkout-btn" id="checkout-btn">Proceed to Checkout</button>
        </div>
    `;
    
    // Attach checkout button listener
    const checkoutBtn = document.getElementById('checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', handleCheckout);
    }
}

/**
 * Handle checkout process
 */
function handleCheckout() {
    const cart = getCart();
    
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }
    
    // Show checkout confirmation
    const total = getCartTotal() * 1.08; // Include tax
    
    if (confirm(`Proceed with checkout?\n\nTotal: ${formatPrice(total)}\n\nThis is a demonstration site. No actual purchase will be made.`)) {
        // Clear the cart
        clearCart();
        
        // Show thank you message
        showThankYouMessage();
    }
}

/**
 * Show thank you message after checkout
 */
function showThankYouMessage() {
    const container = document.querySelector('.cart-container');
    if (!container) return;
    
    container.innerHTML = `
        <div class="empty-cart" style="padding: var(--spacing-xxl);">
            <h2 style="color: var(--color-primary); font-size: 3rem; margin-bottom: var(--spacing-lg);">Thank You!</h2>
            <p style="font-size: 1.2rem; margin-bottom: var(--spacing-md);">Your order has been placed successfully.</p>
            <p style="color: var(--color-text-muted); margin-bottom: var(--spacing-xl);">
                This is a demonstration site. No actual purchase was made.
            </p>
            <div style="display: flex; gap: var(--spacing-md); justify-content: center; flex-wrap: wrap;">
                <a href="browse.html" class="btn btn-primary">Continue Shopping</a>
                <a href="index.html" class="btn btn-secondary">Return Home</a>
            </div>
        </div>
    `;
}

/**
 * Setup clear cart button
 */
function setupClearCart() {
    const clearCartBtn = document.getElementById('clear-cart-btn');
    
    if (clearCartBtn) {
        clearCartBtn.addEventListener('click', () => {
            const cart = getCart();
            
            if (cart.length === 0) {
                alert('Your cart is already empty!');
                return;
            }
            
            if (confirm('Are you sure you want to clear your entire cart?')) {
                clearCart();
                loadCart();
            }
        });
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

