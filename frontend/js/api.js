// API Configuration
// Auto-detect API URL based on environment
const API_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000/api'  // Local development
    : 'http://mohinhcaocap.wavestore.id.vn/api';  // Production

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
    getProductById,
    getProductsByCategory,
    searchProducts,
    getAllCategories,
    getCategoryById,
    getAllBrands,
    formatPrice,
    getDiscountPercent
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
    return window.appData.products.filter(p => p.featured || p.categoryId == 1).slice(0, 8);
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
        window.API.getAllProducts({ limit: 100 }),
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
