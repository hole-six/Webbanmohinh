// Category Page JavaScript

let currentCategory = null;
let allProducts = [];
let filteredProducts = [];
let categories = [];

// Export to global scope for use in category.html
window.filteredProducts = filteredProducts;

// Get category slug from URL
function getCategoryFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('cat');
}

// Load page data
async function loadCategoryPage() {
    // Show loading state
    showLoading();

    try {
        console.log('🔄 Starting to load category page...');

        // Load categories first and wait for it
        const categoriesData = await API.getAllCategories();
        console.log('📁 Categories loaded:', categoriesData);

        if (categoriesData.success) {
            categories = categoriesData.data;
            loadTopCategories();
        }

        // Get category slug from URL
        const categorySlug = getCategoryFromURL();
        console.log('🔍 Category slug from URL:', categorySlug);

        // Find current category from loaded categories
        if (categorySlug && categories.length > 0) {
            currentCategory = categories.find(c => c.slug === categorySlug);
            console.log('✅ Current category found:', currentCategory);
        }

        // Load products based on category
        let productsData;
        if (currentCategory) {
            console.log('📦 Loading products for category ID:', currentCategory.id);
            productsData = await API.getProductsByCategory(currentCategory.id);
        } else {
            console.log('📦 Loading all products...');
            productsData = await API.getAllProducts(); // Remove limit to get all products
        }

        console.log('📦 Products loaded:', productsData);

        if (productsData.success) {
            allProducts = productsData.data;
            filteredProducts = [...allProducts];
            
            // Update global reference
            window.filteredProducts = filteredProducts;
            
            // Check for sale filter from URL
            const urlParams = new URLSearchParams(window.location.search);
            const saleFilter = urlParams.get('sale');
            
            if (saleFilter === 'true') {
                console.log('💰 Applying sale filter...');
                console.log('📊 All products before filter:', allProducts.length);
                console.log('� Products with oldPrice:', allProducts.filter(p => p.oldPrice).map(p => ({
                    name: p.name,
                    price: p.price,
                    oldPrice: p.oldPrice
                })));
                
                filteredProducts = allProducts.filter(p => p.oldPrice != null && p.oldPrice !== '');
                console.log('💰 Sale products found:', filteredProducts.length);
                
                // Apply priority sorting for sale products
                applyPrioritySorting();
                
                // Update global reference
                window.filteredProducts = filteredProducts;
            }
            
            console.log('✅ Total products:', allProducts.length);
        } else {
            console.error('❌ Failed to load products:', productsData.message);
            allProducts = [];
            filteredProducts = [];
        }

        // Render UI after all data is loaded
        renderCategoriesList();
        updateCategoryBanner();
        displayProducts();

        console.log('✅ Category page loaded successfully');
    } catch (error) {
        console.error('❌ Error loading category page:', error);
        // Show error message to user
        const grid = document.getElementById('products-list');
        if (grid) {
            grid.innerHTML = `
                <div class="empty" style="grid-column: 1/-1; text-align: center; padding: 60px 20px;">
                    <h3 style="font-size: 18px; margin-bottom: 10px;">Lỗi tải dữ liệu</h3>
                    <p style="color: #999; margin-bottom: 20px;">Vui lòng thử lại sau</p>
                    <button onclick="location.reload()" style="padding: 10px 20px; background: #8b1a1a; color: white; border: none; border-radius: 4px; cursor: pointer;">Tải lại trang</button>
                </div>
            `;
        }
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

    const totalProducts = allProducts.length;

    if (countAll) {
        countAll.textContent = totalProducts;
    }

    list.innerHTML = categories.map(cat => {
        const count = allProducts.filter(p => p.categoryId === cat.id).length;
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
