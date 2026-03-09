// Category Page JavaScript

let currentCategory = null;
let allProducts = [];
let filteredProducts = [];
let categories = [];

// Get category slug from URL
function getCategoryFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('cat');
}

// Load page data
async function loadCategoryPage() {
    try {
        // Load categories
        const categoriesData = await API.getAllCategories();
        if (categoriesData.success) {
            categories = categoriesData.data;
            loadTopCategories();
            renderCategoriesList();
        }

        // Load products
        const categorySlug = getCategoryFromURL();
        if (categorySlug) {
            currentCategory = categories.find(c => c.slug === categorySlug);
            if (currentCategory) {
                const productsData = await API.getProductsByCategory(currentCategory.id);
                if (productsData.success) {
                    allProducts = productsData.data;
                    filteredProducts = [...allProducts];
                }
            }
        } else {
            const productsData = await API.getAllProducts();
            if (productsData.success) {
                allProducts = productsData.data;
                filteredProducts = [...allProducts];
            }
        }

        updateCategoryBanner();
        displayProducts();
    } catch (error) {
        console.error('Error loading category page:', error);
    }
}

// Load top categories
function loadTopCategories() {
    const topCategoriesBar = document.getElementById('top-categories');
    if (!topCategoriesBar) return;
    
    const html = categories.map(cat => 
        `<a href="category.html?cat=${cat.slug}">${cat.name}</a>`
    ).join('<span class="sep">·</span>');
    
    topCategoriesBar.innerHTML = html;
}

// Update category banner
function updateCategoryBanner() {
    const title = document.getElementById('category-title');
    const description = document.getElementById('category-description');
    const icon = document.getElementById('category-icon');

    if (currentCategory) {
        if (title) title.textContent = currentCategory.name;
        if (description) description.textContent = currentCategory.description;
        if (icon) icon.textContent = currentCategory.icon;
        document.title = `${currentCategory.name} - Mô Hình Cao Cấp`;
    } else {
        if (title) title.textContent = 'Tất cả sản phẩm';
        if (description) description.textContent = 'Khám phá toàn bộ bộ sưu tập';
        if (icon) icon.textContent = '🎯';
    }
}

// Render categories list
function renderCategoriesList() {
    const list = document.getElementById('category-list');
    if (!list) return;

    list.innerHTML = `
        <div class="cat-row ${!currentCategory ? 'active' : ''}" onclick="window.location.href='category.html'">
            <span class="cat-n">Tất cả</span>
            <span class="cat-c">${allProducts.length}</span>
        </div>
        ${categories.map(cat => `
            <div class="cat-row ${currentCategory?.id === cat.id ? 'active' : ''}" 
                 onclick="window.location.href='category.html?cat=${cat.slug}'">
                <span class="cat-n">${cat.icon} ${cat.name}</span>
                <span class="cat-c">${allProducts.filter(p => p.categoryId === cat.id).length}</span>
            </div>
        `).join('')}
    `;
}

// Display products
function displayProducts() {
    const grid = document.getElementById('products-list');
    const resultCount = document.getElementById('results-count');
    
    if (!grid) return;

    if (resultCount) {
        resultCount.textContent = filteredProducts.length;
    }

    if (filteredProducts.length === 0) {
        grid.innerHTML = `
            <div class="empty">
                <h3>Không tìm thấy sản phẩm</h3>
                <p>Thử thay đổi bộ lọc hoặc tìm kiếm khác</p>
                <button onclick="window.location.href='category.html'">Xem tất cả</button>
            </div>
        `;
        return;
    }

    grid.innerHTML = filteredProducts.map(p => {
        const badge = p.badge ? `<div class="pbadge ${p.badge.toLowerCase()}">${p.badge}</div>` : '';
        const oldPrice = p.oldPrice ? `<span class="price-was">${API.formatPrice(p.oldPrice)}</span>` : '';
        const discount = p.oldPrice ? `<span class="price-off">-${API.getDiscountPercent(p.price, p.oldPrice)}%</span>` : '';
        
        return `
            <div class="pcard" onclick="window.location.href='product-detail.html?id=${p._id}'">
                <div class="pcard-img">
                    <img src="${p.images[0]}" alt="${p.name}">
                    ${badge}
                </div>
                <div class="pcard-body">
                    <div class="pcard-brand">${getBrandName(p.brandId)}</div>
                    <div class="pcard-name">${p.name}</div>
                    <div class="pcard-rating">
                        <span class="stars">${'★'.repeat(Math.floor(p.rating || 0))}</span>
                        <span class="rc">(${p.reviewCount || 0})</span>
                    </div>
                    <div class="pcard-price">
                        <span class="price-now">${API.formatPrice(p.price)}</span>
                        ${oldPrice}
                        ${discount}
                    </div>
                    <a href="product-detail.html?id=${p._id}" class="btn-add">⚡ MUA NGAY</a>
                </div>
            </div>
        `;
    }).join('');
}

// Filter by price
function filterByPrice() {
    const minPrice = parseInt(document.getElementById('price-min')?.value) || 0;
    const maxPrice = parseInt(document.getElementById('price-max')?.value) || Infinity;

    filteredProducts = allProducts.filter(p => 
        p.price >= minPrice && p.price <= maxPrice
    );

    displayProducts();
}

// Sort products
function sortProducts(sortBy) {
    switch(sortBy) {
        case 'price-asc':
            filteredProducts.sort((a, b) => a.price - b.price);
            break;
        case 'price-desc':
            filteredProducts.sort((a, b) => b.price - a.price);
            break;
        case 'name':
            filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
            break;
        case 'newest':
            filteredProducts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            break;
        default:
            filteredProducts = [...allProducts];
    }
    displayProducts();
}

// Get brand name
function getBrandName(brandId) {
    const brands = {
        1: 'THREEZERO',
        2: 'HOT TOYS',
        3: 'BANDAI',
        4: 'YOLOPARK',
        5: 'BLOKEES'
    };
    return brands[brandId] || 'BRAND';
}

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    loadCategoryPage();
});
