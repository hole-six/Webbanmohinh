// Product Detail Page JavaScript

let currentProduct = null;
let categories = [];

// Get product ID from URL
function getProductIdFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('id');
}

// Load product detail
async function loadProductDetail() {
    try {
        const productId = getProductIdFromURL();
        if (!productId) {
            console.error('No product ID in URL');
            window.location.href = 'index.html';
            return;
        }

        console.log('Loading product with ID:', productId);

        // Load categories
        const categoriesData = await API.getAllCategories();
        if (categoriesData.success) {
            categories = categoriesData.data;
            loadTopCategories();
        }

        // Load product
        const productData = await API.getProductById(productId);
        console.log('Product data:', productData);
        
        if (productData.success && productData.data) {
            currentProduct = productData.data;
            renderProductDetail();
            loadRelatedProducts();
        } else {
            console.error('Product not found:', productData);
            alert('Không tìm thấy sản phẩm!');
            window.location.href = 'index.html';
        }
    } catch (error) {
        console.error('Error loading product:', error);
        alert('Lỗi khi tải sản phẩm!');
        window.location.href = 'index.html';
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

// Render product detail
function renderProductDetail() {
    // Update page title
    document.title = `${currentProduct.name} - Mô Hình Cao Cấp`;

    // Product name
    const nameEl = document.getElementById('product-name');
    if (nameEl) nameEl.textContent = currentProduct.name;

    // Product images
    renderProductImages();

    // Price
    const priceEl = document.getElementById('product-price');
    if (priceEl) priceEl.textContent = API.formatPrice(currentProduct.price);

    if (currentProduct.oldPrice) {
        const oldPriceEl = document.getElementById('product-old-price');
        if (oldPriceEl) {
            oldPriceEl.textContent = API.formatPrice(currentProduct.oldPrice);
            oldPriceEl.style.display = 'inline';
        }

        const discountEl = document.getElementById('discount-badge');
        if (discountEl) {
            discountEl.textContent = `-${API.getDiscountPercent(currentProduct.price, currentProduct.oldPrice)}%`;
            discountEl.style.display = 'inline-block';
        }
    }

    // Rating
    const starsEl = document.getElementById('product-stars');
    if (starsEl) {
        starsEl.textContent = '★'.repeat(Math.floor(currentProduct.rating || 0));
    }

    const ratingTextEl = document.getElementById('product-rating-text');
    if (ratingTextEl) {
        ratingTextEl.textContent = `(${currentProduct.reviewCount || 0} đánh giá)`;
    }

    // Stock
    const stockEl = document.getElementById('stock-status');
    if (stockEl) {
        if (currentProduct.stock > 0) {
            stockEl.textContent = `Còn ${currentProduct.stock} sản phẩm`;
            stockEl.style.backgroundColor = '#4CAF50';
        } else {
            stockEl.textContent = 'Hết hàng';
            stockEl.style.backgroundColor = '#f44336';
        }
    }

    // Description
    const descEl = document.getElementById('product-description');
    if (descEl) descEl.textContent = currentProduct.description || 'Đang cập nhật...';

    // Badge
    if (currentProduct.badge) {
        const badgeEl = document.getElementById('product-badge');
        if (badgeEl) {
            badgeEl.textContent = currentProduct.badge;
            badgeEl.style.display = 'inline-block';
        }
    }
}

// Render product images
function renderProductImages() {
    const mainImage = document.getElementById('main-product-image');
    const thumbsContainer = document.getElementById('image-thumbnails');

    if (!mainImage || !thumbsContainer) return;

    // Set main image
    mainImage.src = currentProduct.images[0];

    // Render thumbnails
    thumbsContainer.innerHTML = currentProduct.images.map((img, index) => `
        <img src="${img}" 
             alt="${currentProduct.name}" 
             class="thumb ${index === 0 ? 'active' : ''}"
             onclick="changeMainImage('${img}', ${index})">
    `).join('');
}

// Change main image
function changeMainImage(imageSrc, index) {
    const mainImage = document.getElementById('main-product-image');
    if (mainImage) mainImage.src = imageSrc;

    // Update active thumbnail
    document.querySelectorAll('.thumb').forEach((thumb, i) => {
        thumb.classList.toggle('active', i === index);
    });
}

// Load related products
async function loadRelatedProducts() {
    try {
        const productsData = await API.getProductsByCategory(currentProduct.categoryId);
        if (productsData.success) {
            const relatedProducts = productsData.data
                .filter(p => p._id !== currentProduct._id)
                .slice(0, 4);

            renderRelatedProducts(relatedProducts);
        }
    } catch (error) {
        console.error('Error loading related products:', error);
    }
}

// Render related products
function renderRelatedProducts(products) {
    const grid = document.getElementById('related-products-grid');
    if (!grid) return;

    grid.innerHTML = products.map(p => `
        <div class="rcard" onclick="window.location.href='product-detail.html?id=${p._id}'">
            <div class="rcard-img">
                <img src="${p.images[0]}" alt="${p.name}">
                ${p.badge ? `<div class="rbadge rb-${p.badge.toLowerCase()}">${p.badge}</div>` : ''}
            </div>
            <div class="rcard-body">
                <div class="rcard-brand">${getBrandName(p.brandId)}</div>
                <div class="rcard-name">${p.name}</div>
                <div class="rcard-price">
                    <span class="rp-now">${API.formatPrice(p.price)}</span>
                    ${p.oldPrice ? `<span class="rp-was">${API.formatPrice(p.oldPrice)}</span>` : ''}
                </div>
            </div>
        </div>
    `).join('');
}

// Contact functions
function orderViaMessenger() {
    const message = `Xin chào! Tôi muốn đặt mua:\n${currentProduct.name}\nGiá: ${API.formatPrice(currentProduct.price)}`;
    window.open(`https://m.me/YOUR_PAGE_ID?text=${encodeURIComponent(message)}`, '_blank');
}

function orderViaFacebook() {
    alert(`Vui lòng liên hệ fanpage để đặt hàng:\n\nSản phẩm: ${currentProduct.name}\nGiá: ${API.formatPrice(currentProduct.price)}`);
    window.open('https://facebook.com/YOUR_PAGE', '_blank');
}

function orderViaPhone() {
    alert(`Gọi ngay: 0123 456 789\n\nSản phẩm: ${currentProduct.name}\nGiá: ${API.formatPrice(currentProduct.price)}`);
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
    loadProductDetail();
});
