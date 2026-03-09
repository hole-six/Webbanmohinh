// Dữ liệu sản phẩm mới
let newProducts = [
    {
        id: 1,
        name: "Threezero 320564 Transformers: Rise of the Beasts - DLX Mirage",
        price: 5000000,
        image: "https://images.unsplash.com/photo-1531525645387-7f14be1bdbbd?w=400&h=450&fit=crop",
        badge: "NEW"
    },
    {
        id: 2,
        name: "Mô hình lắp ráp Blokees Transformers Bumblebee DOTM",
        price: 390000,
        image: "https://images.unsplash.com/photo-1608889476561-6242cfdbf622?w=400&h=450&fit=crop",
        badge: "NEW"
    },
    {
        id: 3,
        name: "Mô hình lắp ráp Blokees Transformers Megatron DOTM",
        price: 390000,
        image: "https://images.unsplash.com/photo-1608889825103-eb5ed706fc64?w=400&h=450&fit=crop",
        badge: "NEW"
    },
    {
        id: 4,
        name: "Mô hình Transformers Premium Edition",
        price: 800000,
        image: "https://images.unsplash.com/photo-1608889825232-1e0b1d3b3f6f?w=400&h=450&fit=crop",
        badge: "NEW"
    }
];

// Dữ liệu mô hình lắp ráp
let modelKits = [
    {
        id: 5,
        name: "Motor Nuclear - MNP XH02 CAOREN (Model Kit)",
        price: 1100000,
        image: "https://images.unsplash.com/photo-1551269901-5c5e14c25df7?w=400&h=450&fit=crop",
        badge: null
    },
    {
        id: 6,
        name: "YOLOPARK AMK series Transformers: Rise Of The Beasts - Rhineetor Model Kit",
        price: 600000,
        oldPrice: 850000,
        image: "https://images.unsplash.com/photo-1563207153-f403bf289096?w=400&h=450&fit=crop",
        badge: "-34%"
    },
    {
        id: 7,
        name: "Mô hình Yolopark AMK PRO Optimus Prime/Orion Pax & Megatron/D-16",
        price: 400000,
        priceRange: "400,000VNĐ - 3,400,000VNĐ",
        image: "https://images.unsplash.com/photo-1589254065878-42c9da997008?w=400&h=450&fit=crop",
        badge: null
    },
    {
        id: 8,
        name: "Yolopark AMK PRO Series 20cm Optimus Prime TLK Model Kit (Overseas Version)",
        price: 1850000,
        image: "https://images.unsplash.com/photo-1601814933824-fd0b574dd592?w=400&h=450&fit=crop",
        badge: null
    }
];

// Dữ liệu sản phẩm giảm giá
let saleProducts = [
    {
        id: 9,
        name: "Mô hình ZD toys Iron Man Mk9",
        price: 650000,
        oldPrice: 750000,
        image: "https://images.unsplash.com/photo-1635805737707-575885ab0820?w=350&h=400&fit=crop",
        badge: "SALE"
    },
    {
        id: 10,
        name: "Mô hình ZD toys Iron Man Mk15",
        price: 650000,
        oldPrice: 800000,
        image: "https://images.unsplash.com/photo-1608889476518-738c9b1dcb90?w=350&h=400&fit=crop",
        badge: "-20%"
    },
    {
        id: 11,
        name: "Mô hình ZD toys 1/10 Iron Man Mk26",
        price: 650000,
        oldPrice: 800000,
        image: "https://images.unsplash.com/photo-1608889335941-32ac5f2041b9?w=350&h=400&fit=crop",
        badge: "-20%"
    },
    {
        id: 12,
        name: "Mô hình ZD toys 1/10 Iron Man Mk25",
        price: 650000,
        oldPrice: 800000,
        image: "https://images.unsplash.com/photo-1608889825271-fc0db00e5e1f?w=350&h=400&fit=crop",
        badge: "-20%"
    },
    {
        id: 13,
        name: "Mô hình ZD toys Iron Man Mk2",
        price: 650000,
        oldPrice: 800000,
        image: "https://images.unsplash.com/photo-1608889825205-eebdb9fc5806?w=350&h=400&fit=crop",
        badge: "-20%"
    },
    {
        id: 14,
        name: "Mô hình ZD toys Iron Man Mk27",
        price: 650000,
        oldPrice: 800000,
        image: "https://images.unsplash.com/photo-1608889476561-6242cfdbf622?w=350&h=400&fit=crop",
        badge: "-20%"
    },
    {
        id: 15,
        name: "Threezero Transformers: Rise of the Beasts DLX Nemesis Prime HQ LB",
        price: 7500000,
        oldPrice: 8500000,
        image: "https://images.unsplash.com/photo-1531525645387-7f14be1bdbbd?w=350&h=400&fit=crop",
        badge: "SALE"
    },
    {
        id: 16,
        name: "Mô hình lắp ráp Empire Studio Pacific Rim Model Kit",
        price: 500000,
        oldPrice: 900000,
        image: "https://images.unsplash.com/photo-1608889825103-eb5ed706fc64?w=350&h=400&fit=crop",
        badge: "-20%"
    }
];

// Dữ liệu hero grid
const heroGridItems = [
    {
        title: "TRANSFORMERS",
        image: "https://images.unsplash.com/photo-1531525645387-7f14be1bdbbd?w=500&h=600&fit=crop"
    },
    {
        title: "MARVEL",
        image: "https://images.unsplash.com/photo-1635805737707-575885ab0820?w=500&h=600&fit=crop"
    },
    {
        title: "GUNDAM",
        image: "https://images.unsplash.com/photo-1589254065878-42c9da997008?w=500&h=600&fit=crop"
    },
    {
        title: "ACTION FIGURE",
        image: "https://images.unsplash.com/photo-1608889825271-fc0db00e5e1f?w=500&h=600&fit=crop"
    }
];

// Format giá tiền
function formatPrice(price) {
    return '₩' + price.toLocaleString('ko-KR');
}

// Render sản phẩm
function renderProduct(product, showAddToCart = true) {
    const badgeHTML = product.badge ? `<span class="badge ${product.badge === 'NEW' ? 'new' : product.badge === 'SALE' ? 'sale' : 'discount'}">${product.badge}</span>` : '';
    const oldPriceHTML = product.oldPrice ? `<span class="old-price">${formatPrice(product.oldPrice)}</span>` : '';
    const priceDisplay = product.priceRange || formatPrice(product.price);
    const buyNowBtn = showAddToCart ? `<a href="product-detail.html?id=${product.id}" class="add-to-cart">⚡ MUA NGAY</a>` : '';
    
    // Chỉ hiển thị nút admin nếu đã đăng nhập
    const adminActionsStyle = isAdmin ? 'display: flex;' : 'display: none;';
    
    // Sử dụng 2 ảnh đầu tiên nếu có
    const primaryImage = product.image || (product.images ? product.images[0] : '');
    const secondaryImage = product.images && product.images[1] ? product.images[1] : primaryImage;
    
    return `
        <div class="product-card" data-id="${product.id}" onclick="window.location.href='product-detail.html?id=${product.id}'">
            <div class="product-image">
                <img class="primary" src="${primaryImage}" alt="${product.name}">
                <img class="secondary" src="${secondaryImage}" alt="${product.name}">
                ${badgeHTML}
            </div>
            <div class="product-info">
                <h3>${product.name}</h3>
                <p class="price">${priceDisplay} ${oldPriceHTML}</p>
                ${buyNowBtn}
                <div class="product-actions" style="${adminActionsStyle}">
                    <button class="btn-edit" onclick="event.stopPropagation(); editProduct(${product.id}, '${getProductCategory(product.id)}')">Sửa</button>
                    <button class="btn-delete" onclick="event.stopPropagation(); deleteProduct(${product.id}, '${getProductCategory(product.id)}')">Xóa</button>
                </div>
            </div>
        </div>
    `;
}

// Xác định danh mục sản phẩm
function getProductCategory(id) {
    if (newProducts.find(p => p.id === id)) return 'new';
    if (modelKits.find(p => p.id === id)) return 'model';
    if (saleProducts.find(p => p.id === id)) return 'sale';
    return null;
}

// Render tất cả sản phẩm
function renderAllProducts() {
    // Render sản phẩm mới
    const newProductsGrid = document.getElementById('new-products-grid');
    if (newProductsGrid) {
        newProductsGrid.innerHTML = newProducts.map(p => renderProduct(p)).join('');
    }
    
    // Render mô hình lắp ráp
    const modelKitsGrid = document.getElementById('model-kits-grid');
    if (modelKitsGrid) {
        modelKitsGrid.innerHTML = modelKits.map(p => renderProduct(p)).join('');
    }
    
    // Render sản phẩm giảm giá
    const saleProductsGrid = document.getElementById('sale-products-grid');
    if (saleProductsGrid) {
        saleProductsGrid.innerHTML = saleProducts.map(p => renderProduct(p, false)).join('');
    }
}

// Render hero grid
function renderHeroGrid() {
    const heroGrid = document.querySelector('.grid-4');
    if (heroGrid) {
        heroGrid.innerHTML = heroGridItems.map(item => `
            <div class="grid-item">
                <img src="${item.image}" alt="${item.title}">
                <div class="grid-overlay">
                    <h3>${item.title}</h3>
                </div>
            </div>
        `).join('');
    }
}

// Thêm sản phẩm vào giỏ hàng
function addToCart(productId) {
    alert(`Đã thêm sản phẩm ID ${productId} vào giỏ hàng!`);
    // Có thể mở rộng thêm logic giỏ hàng ở đây
}

// Xóa sản phẩm
function deleteProduct(id, category) {
    if (!confirm('Bạn có chắc muốn xóa sản phẩm này?')) return;
    
    switch(category) {
        case 'new':
            newProducts = newProducts.filter(p => p.id !== id);
            break;
        case 'model':
            modelKits = modelKits.filter(p => p.id !== id);
            break;
        case 'sale':
            saleProducts = saleProducts.filter(p => p.id !== id);
            break;
    }
    
    renderAllProducts();
    alert('Đã xóa sản phẩm thành công!');
    updateAdminUIAfterChange();
}

// Sửa sản phẩm
function editProduct(id, category) {
    let product;
    let products;
    
    switch(category) {
        case 'new':
            product = newProducts.find(p => p.id === id);
            products = newProducts;
            break;
        case 'model':
            product = modelKits.find(p => p.id === id);
            products = modelKits;
            break;
        case 'sale':
            product = saleProducts.find(p => p.id === id);
            products = saleProducts;
            break;
    }
    
    if (!product) return;
    
    // Hiển thị form sửa
    const modal = document.getElementById('edit-modal');
    document.getElementById('edit-id').value = product.id;
    document.getElementById('edit-category').value = category;
    document.getElementById('edit-name').value = product.name;
    document.getElementById('edit-price').value = product.price;
    document.getElementById('edit-oldPrice').value = product.oldPrice || '';
    document.getElementById('edit-image').value = product.image;
    document.getElementById('edit-badge').value = product.badge || '';
    
    modal.style.display = 'block';
}\n\n// Lưu chỉnh sửa sản phẩm\nfunction saveEdit() {\n    const id = parseInt(document.getElementById('edit-id').value);\n    const category = document.getElementById('edit-category').value;\n    const name = document.getElementById('edit-name').value;\n    const price = parseInt(document.getElementById('edit-price').value);\n    const oldPrice = document.getElementById('edit-oldPrice').value;\n    const image = document.getElementById('edit-image').value;\n    const badge = document.getElementById('edit-badge').value;\n    \n    let products;\n    switch(category) {\n        case 'new':\n            products = newProducts;\n            break;\n        case 'model':\n            products = modelKits;\n            break;\n        case 'sale':\n            products = saleProducts;\n            break;\n    }\n    \n    const product = products.find(p => p.id === id);\n    if (product) {\n        product.name = name;\n        product.price = price;\n        product.oldPrice = oldPrice ? parseInt(oldPrice) : null;\n        product.image = image;\n        product.badge = badge || null;\n    }\n    \n    closeModal();\n    renderAllProducts();\n    alert('Đã cập nhật sản phẩm thành công!');\n}\n\n// Thêm sản phẩm mới\nfunction showAddProductModal(category) {\n    const modal = document.getElementById('add-modal');\n    document.getElementById('add-category').value = category;\n    modal.style.display = 'block';\n}\n\nfunction addNewProduct() {\n    const category = document.getElementById('add-category').value;\n    const name = document.getElementById('add-name').value;\n    const price = parseInt(document.getElementById('add-price').value);\n    const oldPrice = document.getElementById('add-oldPrice').value;\n    const image = document.getElementById('add-image').value;\n    const badge = document.getElementById('add-badge').value;\n    \n    // Tạo ID mới\n    const allProducts = [...newProducts, ...modelKits, ...saleProducts];\n    const maxId = Math.max(...allProducts.map(p => p.id));\n    const newId = maxId + 1;\n    \n    const newProduct = {\n        id: newId,\n        name: name,\n        price: price,\n        oldPrice: oldPrice ? parseInt(oldPrice) : null,\n        image: image,\n        badge: badge || null\n    };\n    \n    switch(category) {\n        case 'new':\n            newProducts.push(newProduct);\n            break;\n        case 'model':\n            modelKits.push(newProduct);\n            break;\n        case 'sale':\n            saleProducts.push(newProduct);\n            break;\n    }\n    \n    closeAddModal();\n    renderAllProducts();\n    alert('Đã thêm sản phẩm mới thành công!');\n}\n\n// Đóng modal\nfunction closeModal() {\n    document.getElementById('edit-modal').style.display = 'none';\n}\n\nfunction closeAddModal() {\n    document.getElementById('add-modal').style.display = 'none';\n    // Reset form\n    document.getElementById('add-name').value = '';\n    document.getElementById('add-price').value = '';\n    document.getElementById('add-oldPrice').value = '';\n    document.getElementById('add-image').value = '';\n    document.getElementById('add-badge').value = '';\n}\n\n// Khởi tạo khi trang load\ndocument.addEventListener('DOMContentLoaded', function() {\n    renderHeroGrid();\n    renderAllProducts();\n    \n    // Đóng modal khi click bên ngoài\n    window.onclick = function(event) {\n        const editModal = document.getElementById('edit-modal');\n        const addModal = document.getElementById('add-modal');\n        if (event.target === editModal) {\n            closeModal();\n        }\n        if (event.target === addModal) {\n            closeAddModal();\n        }\n    }\n});


// Cập nhật UI admin sau khi thay đổi
function updateAdminUIAfterChange() {
    if (typeof updateAdminUI === 'function') {
        setTimeout(updateAdminUI, 50);
    }
}