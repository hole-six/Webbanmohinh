// Category Page JavaScript

let currentCategory = null;
let allProducts = [];
let filteredProducts = [];
let categories = [];
let totalProductsCount = []; // Store all products for counting categories

// Export to global scope for use in category.html
window.filteredProducts = filteredProducts;

// Get category slug from URL
function getCategoryFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('cat');
}

// Load page data
async function loadCategoryPage() {
    try {
        console.log('🔄 Starting to load category page...');

        // Always load all products first - this is what category.html expects
        const allProductsData = await API.getAllProducts();
        if (allProductsData.success) {
            allProducts = allProductsData.data;
            totalProductsCount = allProductsData.data;
            
            // Set filteredProducts to all products initially
            filteredProducts = [...allProducts];
            
            // Update global references for category.html
            window.filteredProducts = filteredProducts;
            window.products = allProducts; // Make sure category.html can access all products
            
            console.log('📊 All products loaded:', allProducts.length);
        } else {
            console.error('❌ Failed to load products:', allProductsData.message);
            allProducts = [];
            filteredProducts = [];
            totalProductsCount = [];
            window.filteredProducts = [];
            window.products = [];
        }

        // Load categories
        const categoriesData = await API.getAllCategories();
        console.log('📁 Categories loaded:', categoriesData);

        if (categoriesData.success) {
            categories = categoriesData.data;
            
            // Make categories available globally for category.html
            window.categories = categories;
            
            loadTopCategories();
        }

        // Get category slug from URL
        const categorySlug = getCategoryFromURL();
        console.log('� Category slug from URL:', categorySlug);

        // Find current category from loaded categories
        if (categorySlug && categories.length > 0) {
            currentCategory = categories.find(c => c.slug === categorySlug);
            console.log('✅ Current category found:', currentCategory);
            
            // Filter products by category if one is selected
            if (currentCategory) {
                filteredProducts = allProducts.filter(p => p.categoryId === currentCategory.id);
                window.filteredProducts = filteredProducts;
                console.log('📦 Filtered products for category:', filteredProducts.length);
            }
        }

        // Check for special filters from URL
        const urlParams = new URLSearchParams(window.location.search);
        const saleFilter = urlParams.get('sale');
        const fastDeliveryFilter = urlParams.get('fastDelivery');
        
        if (saleFilter === 'true') {
            console.log('💰 Applying sale filter...');
            filteredProducts = filteredProducts.filter(p => p.oldPrice != null && p.oldPrice !== '');
            window.filteredProducts = filteredProducts;
            console.log('💰 Sale products found:', filteredProducts.length);
        }
        
        if (fastDeliveryFilter === 'true') {
            console.log('🚚 Applying fast delivery filter...');
            filteredProducts = filteredProducts.filter(p => p.fastDelivery === true);
            window.filteredProducts = filteredProducts;
            console.log('� Fast delivery products found:', filteredProducts.length);
        }

        // Apply priority sorting
        applyPrioritySorting();
        
        // Signal that category.js has finished loading
        window.categoryJsLoaded = true;

        console.log('✅ Category page loaded successfully');
        console.log('📊 Final filtered products count:', filteredProducts.length);
        
    } catch (error) {
        console.error('❌ Error loading category page:', error);
        allProducts = [];
        filteredProducts = [];
        totalProductsCount = [];
        window.filteredProducts = [];
        window.categoryJsLoaded = true; // Still signal completion to prevent infinite waiting
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
        if (title) title.textContent = '';
        if (description) description.textContent = '';
        if (icon) icon.textContent = '';
    }
}

// Render categories list
function renderCategoriesList() {
    const list = document.getElementById('cat-items');
    const countAll = document.getElementById('cnt-all');

    if (!list) return;

    // Use totalProductsCount for accurate counting
    const totalProducts = totalProductsCount.length;
    
    console.log('🔢 Rendering categories with counts:');
    console.log('   Total products for counting:', totalProducts);
    console.log('   Current filtered products:', filteredProducts.length);

    if (countAll) {
        countAll.textContent = totalProducts;
    }

    list.innerHTML = categories.map(cat => {
        // Always count from total products, not filtered products
        const count = totalProductsCount.filter(p => p.categoryId === cat.id).length;
        console.log(`   ${cat.name}: ${count} products`);
        return `
            <div class="cat-row ${currentCategory?.id === cat.id ? 'active' : ''}" 
                 onclick="window.location.href='category.html?cat=${cat.slug}'">
                <span class="cat-n">${cat.icon || ''} ${cat.name}</span>
                <span class="cat-c">${count}</span>
            </div>
        `;
    }).join('');
}

// Display products
// Apply priority sorting to always show special products first
function applyPrioritySorting() {
    function getPriority(product) {
        let priority = 0;
        
        // Highest priority: Products with badges (HOT, NEW, BEST SELLER)
        if (product.badge && ['HOT', 'NEW', 'BEST SELLER'].includes(product.badge)) {
            priority += 1000;
            // Extra priority for specific badges
            if (product.badge === 'HOT') priority += 100;
            if (product.badge === 'BEST SELLER') priority += 80;
            if (product.badge === 'NEW') priority += 60;
        }
        
        // High priority: Fast delivery products
        if (product.fastDelivery) {
            priority += 500;
        }
        
        // Medium priority: Products on sale (have oldPrice)
        if (product.oldPrice && product.oldPrice > product.price) {
            priority += 250;
        }
        
        return priority;
    }
    
    // Sort by priority first, then by creation date
    filteredProducts.sort((a, b) => {
        const priorityDiff = getPriority(b) - getPriority(a);
        if (priorityDiff !== 0) return priorityDiff;
        return new Date(b.createdAt) - new Date(a.createdAt);
    });
    
    // Update global reference
    window.filteredProducts = filteredProducts;
}

function displayProducts() {
    const grid = document.getElementById('products-list');
    const resultTxt = document.getElementById('result-txt');

    if (!grid) return;

    // Apply priority sorting before displaying
    applyPrioritySorting();

    if (resultTxt) {
        resultTxt.innerHTML = `Hiển thị <strong>${filteredProducts.length}</strong> sản phẩm`;
    }

    if (filteredProducts.length === 0) {
        grid.innerHTML = `
            <div class="empty" style="grid-column: 1/-1; text-align: center; padding: 60px 20px;">
                <h3 style="font-size: 18px; margin-bottom: 10px;">Không tìm thấy sản phẩm</h3>
                <p style="color: #999; margin-bottom: 20px;">Thử thay đổi bộ lọc hoặc tìm kiếm khác</p>
                <button onclick="window.location.href='category.html'" style="padding: 10px 20px; background: #8b1a1a; color: white; border: none; border-radius: 4px; cursor: pointer;">Xem tất cả</button>
            </div>
        `;
        return;
    }

    grid.innerHTML = filteredProducts.map(p => {
        const badge = p.badge ? `<div class="pbadge ${p.badge.toLowerCase()}">${p.badge}</div>` : '';
        const oldPrice = p.oldPrice ? `<span class="price-was">${API.formatPrice(p.oldPrice)}</span>` : '';
        const discount = p.oldPrice ? `<span class="price-off">-${API.getDiscountPercent(p.price, p.oldPrice)}%</span>` : '';
        
        // Check if product has fast delivery
        const deliveryText = p.fastDelivery ? '🚚 Giao 2-3 ngày' : '🚚 Order 7-10 ngày';
        const deliveryColor = p.fastDelivery ? '#27ae60' : '#2e8b57';

        return `
            <div class="pcard" style="cursor: pointer;" onclick="window.location.href='product-detail.html?id=${p.id || p._id}'">
                <div class="pcard-img">
                    <img src="${p.images[0]}" alt="${p.name}">
                    ${badge}
                </div>
                <div class="pcard-body">
                    <div class="pcard-name" style="margin-bottom: 2px;">${p.name}</div>
                    <div class="pcard-rating" style="margin-bottom: 2px;">
                        <span class="stars">${'★'.repeat(Math.floor(p.rating || 0))}</span>
                        <span class="rc">(${p.reviewCount || 0})</span>
                    </div>
                    <div class="pcard-price" style="margin-bottom: 4px;">
                        <span class="price-now">${API.formatPrice(p.price)}</span>
                        ${oldPrice}
                        ${discount}
                    </div>
                    <div class="pcard-delivery" style="color: ${deliveryColor}; font-size: 10px; margin-top: 6px; margin-bottom: 10px; font-weight: 500; display: flex; align-items: center; gap: 4px;">${deliveryText}</div>
                    <button class="btn-add" onclick="event.stopPropagation(); window.location.href='product-detail.html?id=${p.id || p._id}'">⚡ MUA NGAY</button>
                </div>
            </div>
        `;
    }).join('');
}

// Show loading state
function showLoading() {
    const grid = document.getElementById('products-list');
    const resultTxt = document.getElementById('result-txt');

    if (grid) {
        grid.innerHTML = `
            <div class="empty" style="grid-column: 1/-1; text-align: center; padding: 60px 20px;">
                <h3 style="font-size: 18px; margin-bottom: 10px;">Đang tải sản phẩm...</h3>
                <p style="color: #999;">Vui lòng đợi</p>
            </div>
        `;
    }

    if (resultTxt) {
        resultTxt.innerHTML = 'Hiển thị <strong>0</strong> sản phẩm';
    }
}

// Filter by price
function filterByPrice() {
    const minPrice = parseInt(document.getElementById('price-min')?.value) || 0;
    const maxPrice = parseInt(document.getElementById('price-max')?.value) || Infinity;

    // Filter from allProducts (current category products), not totalProductsCount
    filteredProducts = allProducts.filter(p =>
        p.price >= minPrice && p.price <= maxPrice
    );

    // Apply priority sorting after filtering
    applyPrioritySorting();
    
    // Update global reference
    window.filteredProducts = filteredProducts;
    
    displayProducts();
}

// Sort products with priority for special items
function sortProducts(sortBy) {
    // First, create a priority sorting function
    function getPriority(product) {
        let priority = 0;
        
        // Highest priority: Products with badges (HOT, NEW, BEST SELLER)
        if (product.badge && ['HOT', 'NEW', 'BEST SELLER'].includes(product.badge)) {
            priority += 1000;
        }
        
        // High priority: Fast delivery products
        if (product.fastDelivery) {
            priority += 500;
        }
        
        // Medium priority: Products on sale (have oldPrice)
        if (product.oldPrice && product.oldPrice > product.price) {
            priority += 250;
        }
        
        return priority;
    }
    
    // Apply the requested sorting, but maintain priority order
    switch (sortBy) {
        case 'price-asc':
            filteredProducts.sort((a, b) => {
                const priorityDiff = getPriority(b) - getPriority(a);
                if (priorityDiff !== 0) return priorityDiff;
                return a.price - b.price;
            });
            break;
        case 'price-desc':
            filteredProducts.sort((a, b) => {
                const priorityDiff = getPriority(b) - getPriority(a);
                if (priorityDiff !== 0) return priorityDiff;
                return b.price - a.price;
            });
            break;
        case 'name':
            filteredProducts.sort((a, b) => {
                const priorityDiff = getPriority(b) - getPriority(a);
                if (priorityDiff !== 0) return priorityDiff;
                return a.name.localeCompare(b.name);
            });
            break;
        case 'newest':
            filteredProducts.sort((a, b) => {
                const priorityDiff = getPriority(b) - getPriority(a);
                if (priorityDiff !== 0) return priorityDiff;
                return new Date(b.createdAt) - new Date(a.createdAt);
            });
            break;
        default:
            // Default sorting: Priority first, then by creation date
            filteredProducts.sort((a, b) => {
                const priorityDiff = getPriority(b) - getPriority(a);
                if (priorityDiff !== 0) return priorityDiff;
                return new Date(b.createdAt) - new Date(a.createdAt);
            });
    }
    displayProducts();
}



// Initialize
document.addEventListener('DOMContentLoaded', function () {
    loadCategoryPage();
});
