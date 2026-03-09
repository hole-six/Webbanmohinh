// API Client for Frontend
// Auto-detect API URL based on environment
const API_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000/api'  // Local development
    : 'http://mohinhcaocap.wavestore.id.vn/api';  // Production

// ============================================
// PRODUCTS API
// ============================================

async function fetchProducts(params = {}) {
    try {
        const queryString = new URLSearchParams(params).toString();
        const url = queryString ? `${API_URL}/products?${queryString}` : `${API_URL}/products`;
        
        const response = await fetch(url);
        const data = await response.json();
        
        if (data.success) {
            return data.data;
        }
        return [];
    } catch (error) {
        console.error('Error fetching products:', error);
        return [];
    }
}

async function fetchProductById(id) {
    try {
        const response = await fetch(`${API_URL}/products/${id}`);
        const data = await response.json();
        
        if (data.success) {
            return data.data;
        }
        return null;
    } catch (error) {
        console.error('Error fetching product:', error);
        return null;
    }
}

async function createProduct(productData, token) {
    try {
        const response = await fetch(`${API_URL}/products`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(productData)
        });
        
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error creating product:', error);
        return { success: false, message: error.message };
    }
}

async function updateProduct(id, productData, token) {
    try {
        const response = await fetch(`${API_URL}/products/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(productData)
        });
        
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error updating product:', error);
        return { success: false, message: error.message };
    }
}

async function deleteProduct(id, token) {
    try {
        const response = await fetch(`${API_URL}/products/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error deleting product:', error);
        return { success: false, message: error.message };
    }
}

// ============================================
// CATEGORIES API
// ============================================

async function fetchCategories() {
    try {
        const response = await fetch(`${API_URL}/categories`);
        const data = await response.json();
        
        if (data.success) {
            return data.data;
        }
        return [];
    } catch (error) {
        console.error('Error fetching categories:', error);
        return [];
    }
}

async function createCategory(categoryData, token) {
    try {
        const response = await fetch(`${API_URL}/categories`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(categoryData)
        });
        
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error creating category:', error);
        return { success: false, message: error.message };
    }
}

async function deleteCategory(id, token) {
    try {
        const response = await fetch(`${API_URL}/categories/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error deleting category:', error);
        return { success: false, message: error.message };
    }
}

// ============================================
// BRANDS API
// ============================================

async function fetchBrands() {
    try {
        const response = await fetch(`${API_URL}/brands`);
        const data = await response.json();
        
        if (data.success) {
            return data.data;
        }
        return [];
    } catch (error) {
        console.error('Error fetching brands:', error);
        return [];
    }
}

// ============================================
// AUTH API
// ============================================

async function loginAdmin(email, password) {
    try {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });
        
        const data = await response.json();
        
        if (data.success) {
            // Save token to sessionStorage
            sessionStorage.setItem('admin_token', data.data.token);
            sessionStorage.setItem('admin_email', data.data.admin.email);
            return { success: true, data: data.data };
        }
        
        return { success: false, message: data.message };
    } catch (error) {
        console.error('Error logging in:', error);
        return { success: false, message: error.message };
    }
}

async function verifyToken(token) {
    try {
        const response = await fetch(`${API_URL}/auth/verify`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error verifying token:', error);
        return { success: false };
    }
}

function logoutAdmin() {
    sessionStorage.removeItem('admin_token');
    sessionStorage.removeItem('admin_email');
    window.location.reload();
}

function getAdminToken() {
    return sessionStorage.getItem('admin_token');
}

function isAdminLoggedIn() {
    return !!sessionStorage.getItem('admin_token');
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
    if (!oldPrice || oldPrice <= newPrice) return 0;
    return Math.round(((oldPrice - newPrice) / oldPrice) * 100);
}

// ============================================
// GLOBAL VARIABLES (for compatibility)
// ============================================

let products = [];
let categories = [];
let brands = [];

// Load data on page load
async function initializeData() {
    try {
        [products, categories, brands] = await Promise.all([
            fetchProducts(),
            fetchCategories(),
            fetchBrands()
        ]);
        
        console.log('✅ Data loaded:', {
            products: products.length,
            categories: categories.length,
            brands: brands.length
        });
        
        return { products, categories, brands };
    } catch (error) {
        console.error('❌ Error initializing data:', error);
        return { products: [], categories: [], brands: [] };
    }
}

// Helper functions for compatibility with old code
function getProductById(id) {
    return products.find(p => p._id === id || p.id === id);
}

function getCategoryById(id) {
    return categories.find(c => c.id === id);
}

function getCategoryBySlug(slug) {
    return categories.find(c => c.slug === slug);
}

function getProductsByCategory(categoryId) {
    return products.filter(p => p.categoryId === categoryId);
}

function getFeaturedProducts() {
    return products.filter(p => p.featured).slice(0, 12);
}

function searchProducts(keyword) {
    const lowerKeyword = keyword.toLowerCase();
    return products.filter(p => 
        p.name.toLowerCase().includes(lowerKeyword) ||
        p.description.toLowerCase().includes(lowerKeyword)
    );
}
