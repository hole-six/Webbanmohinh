// API Configuration
// Auto-detect API URL based on environment
const API_URL = (() => {
    const hostname = window.location.hostname;
    const protocol = window.location.protocol;
    
    // Local development detection
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
        return 'http://localhost:5000/api';  // Local backend server
    }
    
    // Production - use current domain
    return `${protocol}//${hostname}/api`;
})();

console.log('🔗 API URL:', API_URL);

// Helper function to make API calls
// Helper function to make API calls
async function apiCall(endpoint, options = {}) {
    try {
        const response = await fetch(`${API_URL}${endpoint}`, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            }
        });

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('API Error:', error);
        return { success: false, message: error.message };
    }
}

// ============================================
// PRODUCTS API
// ============================================

async function getFeaturedProducts() {
    return await apiCall('/products?badge=HOT,NEW,BEST SELLER');
}

async function getAllProducts(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return await apiCall(`/products${queryString ? '?' + queryString : ''}`);
}

async function getProductById(id) {
    return await apiCall(`/products/${id}`);
}

async function getProductsByCategory(categoryId) {
    return await apiCall(`/products?category=${categoryId}`);
}

async function searchProducts(keyword) {
    return await apiCall(`/products?search=${encodeURIComponent(keyword)}`);
}

// ============================================
// CATEGORIES API
// ============================================

async function getAllCategories() {
    return await apiCall('/categories');
}

async function getCategoryById(id) {
    return await apiCall(`/categories/${id}`);
}

// ============================================
// BRANDS API
// ============================================

async function getAllBrands() {
    return await apiCall('/brands');
}

// ============================================
// HELPER FUNCTIONS
// ============================================

// Convert image URL to absolute URL
function getAbsoluteImageUrl(url) {
    if (!url) return '';
    
    // If already absolute URL (starts with http:// or https://)
    if (url.startsWith('http://') || url.startsWith('https://')) {
        // Replace old domain with current domain
        if (url.includes('mohinhcaocap.wavestore.id.vn')) {
            return url.replace('mohinhcaocap.wavestore.id.vn', window.location.hostname);
        }
        return url;
    }

    // Determine API base (handles localhost:5000 vs production)
    const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    const base = isLocal ? 'http://localhost:5000' : `${window.location.protocol}//${window.location.hostname}`;
    
    // If relative path starting with /
    if (url.startsWith('/')) {
        return `${base}${url}`;
    }
    
    // If just filename, assume it's in uploads folder
    return `${base}/uploads/${url}`;
}

// Convert Google Drive URL to direct image URL
function convertGoogleDriveUrl(url) {
    if (!url) return '';
    
    // Check if it's a Google Drive link
    const driveMatch = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
    if (driveMatch) {
        const fileId = driveMatch[1];
        return `https://drive.google.com/thumbnail?id=${fileId}&sz=w1000`;
    }
    
    // If already a direct link or other URL, return as is
    return url;
}

// Get product image with URL conversion
function getProductImage(product, index = 0) {
    const imageUrl = product.images?.[index] || product.image || '';
    
    // First try Google Drive conversion
    const driveUrl = convertGoogleDriveUrl(imageUrl);
    if (driveUrl !== imageUrl) {
        return driveUrl;
    }
    
    // Then convert to absolute URL
    return getAbsoluteImageUrl(imageUrl);
}

function formatPrice(price) {
    return new Intl.NumberFormat('ko-KR', {
        style: 'currency',
        currency: 'KRW'
    }).format(price);
}

function getDiscountPercent(newPrice, oldPrice) {
    if (!oldPrice) return 0;
    return Math.round(((oldPrice - newPrice) / oldPrice) * 100);
}

// ============================================
// EXPORT (for use in other files)
// ============================================

// Make functions available globally
window.API = {
    getAllProducts,
    getFeaturedProducts,  // Add new function
    getProductById,
    getProductsByCategory,
    searchProducts,
    getAllCategories,
    getCategoryById,
    getAllBrands,
    formatPrice,
    getDiscountPercent,
    getProductImage,
    getAbsoluteImageUrl
};

window.reviews = [];

// ============================================
// GLOBAL DATA & CART STATE
// ============================================

window.appData = {
    categories: [],
    products: [],
    brands: []
};

// Cart state
window.cart = [];

window.loadCart = function () {
    const savedCart = localStorage.getItem('cart');
    window.cart = savedCart ? JSON.parse(savedCart) : [];
};

window.saveCart = function () {
    localStorage.setItem('cart', JSON.stringify(window.cart));
};

window.addToCart = function (productId, quantity = 1) {
    window.loadCart();
    const existingItem = window.cart.find(item => item.productId === productId);
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        window.cart.push({ productId, quantity });
    }
    window.saveCart();

    // Update badge
    const badge = document.getElementById('cart-count-badge');
    if (badge) badge.textContent = window.getCartCount();

    // Toast notification
    const toast = document.createElement('div');
    toast.textContent = '✓ Đã thêm vào giỏ hàng';
    toast.style.cssText = `
        position:fixed; bottom:80px; left:50%; transform:translateX(-50%);
        background:#212529; color:#fff; padding:10px 20px;
        border-radius:24px; font-size:13px; font-weight:700;
        z-index:9999; white-space:nowrap;
        animation: fadeInUp .25s ease;
        font-family: 'Quicksand', sans-serif;
    `;
    if (!document.getElementById('toast-style')) {
        const s = document.createElement('style');
        s.id = 'toast-style';
        s.textContent = '@keyframes fadeInUp{from{opacity:0;transform:translateX(-50%) translateY(10px)}to{opacity:1;transform:translateX(-50%) translateY(0)}}';
        document.head.appendChild(s);
    }
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 2000);
};

window.removeFromCart = function (productId) {
    window.loadCart();
    window.cart = window.cart.filter(item => item.productId !== productId);
    window.saveCart();
};

window.updateCartQuantity = function (productId, quantity) {
    window.loadCart();
    const item = window.cart.find(item => item.productId === productId);
    if (item) {
        item.quantity = quantity;
        window.saveCart();
    }
};

window.getCartTotal = function () {
    let total = 0;
    window.cart.forEach(item => {
        const product = window.getProductById(item.productId);
        if (product) {
            total += product.price * item.quantity;
        }
    });
    return total;
};

window.getCartCount = function () {
    return window.cart.reduce((total, item) => parseInt(total) + parseInt(item.quantity), 0);
};

// Data helpers
window.getProductById = function (id) {
    return window.appData.products.find(p => p.id == id || p._id == id);
};

window.getBrandById = function (id) {
    return window.appData.brands.find(b => b.id == id || b._id == id);
};

window.getFeaturedProducts = function () {
    // Only show products with HOT, NEW, or BEST SELLER badges
    return window.appData.products.filter(p => 
        p.badge && ['HOT', 'NEW', 'BEST SELLER'].includes(p.badge)
    );
};

window.getSaleProducts = function () {
    return window.appData.products.filter(p => p.oldPrice > p.price || p.badge === 'SALE').slice(0, 8);
};

// Search 
window.searchProducts = function (kw) {
    const term = kw.toLowerCase();
    return window.appData.products.filter(p => p.name.toLowerCase().includes(term));
};

// Initial data load function
window.initApp = async function () {
    const [cR, pR, bR] = await Promise.all([
        window.API.getAllCategories(),
        window.API.getAllProducts(), // Remove limit to get all products
        window.API.getAllBrands()
    ]);
    if (cR.success) window.appData.categories = cR.data;
    if (pR.success) window.appData.products = pR.data;
    if (bR.success) window.appData.brands = bR.data;

    // Backward comp globals
    window.categories = window.appData.categories;
    window.products = window.appData.products;
    window.brands = window.appData.brands;
};
