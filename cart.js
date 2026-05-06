// Shopping Cart Logic for Lenovo LOQ
// Using localStorage to persist data across pages

const CART_KEY = 'loq_cart_items';

/**
 * Initialize cart logic: update UI on load
 */
document.addEventListener('DOMContentLoaded', () => {
    updateCartBadge();
    
    // Listen for storage changes in other tabs
    window.addEventListener('storage', (e) => {
        if (e.key === CART_KEY) {
            updateCartBadge();
        }
    });
});

/**
 * Update the cart badge count in the navbar
 */
function updateCartBadge() {
    const items = getCartItems();
    const totalCount = items.reduce((sum, item) => sum + (item.quantity || 1), 0);
    const badges = document.querySelectorAll('.cart-badge');
    
    badges.forEach(badge => {
        if (totalCount > 0) {
            badge.textContent = totalCount;
            badge.classList.add('show');
        } else {
            badge.classList.remove('show');
        }
    });
}

/**
 * Get all items from the cart
 * @returns {Array} Array of cart items
 */
function getCartItems() {
    const rawData = localStorage.getItem(CART_KEY);
    return rawData ? JSON.parse(rawData) : [];
}

/**
 * Add a product to the cart
 * @param {Object} product Product details (id, name, price, config, etc.)
 */
function addToCart(product) {
    const items = getCartItems();
    
    // Check if this specific configuration already exists in the cart
    const existingIndex = items.findIndex(item => 
        item.id === product.id && 
        JSON.stringify(item.config) === JSON.stringify(product.config)
    );
    
    if (existingIndex > -1) {
        items[existingIndex].quantity = (items[existingIndex].quantity || 1) + 1;
    } else {
        items.push({
            ...product,
            quantity: 1,
            addedAt: new Date().toISOString()
        });
    }
    
    localStorage.setItem(CART_KEY, JSON.stringify(items));
    updateCartBadge();
    
    // Trigger a custom event for local listeners
    window.dispatchEvent(new Event('cartUpdated'));
    
    // Show a small success feedback (if we have a toast system, use it)
    if (window.showToast) {
        window.showToast(`${product.name} added to cart!`, 'success');
    } else {
        alert(`${product.name} added to cart!`);
    }
}

/**
 * Remove an item from the cart
 * @param {string} timestamp The unique 'addedAt' ISO string of the item
 */
function removeFromCart(timestamp) {
    const items = getCartItems();
    const updatedItems = items.filter(item => item.addedAt !== timestamp);
    localStorage.setItem(CART_KEY, JSON.stringify(updatedItems));
    updateCartBadge();
    window.dispatchEvent(new Event('cartUpdated'));
}

/**
 * Clear the entire cart
 */
function clearCart() {
    localStorage.removeItem(CART_KEY);
    updateCartBadge();
    window.dispatchEvent(new Event('cartUpdated'));
}

/**
 * Update quantity of an item
 */
function updateQuantity(timestamp, delta) {
    const items = getCartItems();
    const index = items.findIndex(item => item.addedAt === timestamp);
    
    if (index > -1) {
        items[index].quantity = Math.max(1, (items[index].quantity || 1) + delta);
        localStorage.setItem(CART_KEY, JSON.stringify(items));
        updateCartBadge();
        window.dispatchEvent(new Event('cartUpdated'));
    }
}
