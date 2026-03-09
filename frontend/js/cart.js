// Cart Page JavaScript

// Load navigation
function loadNavigation() {
    const topNav = document.getElementById('top-nav');
    const mainNav = document.getElementById('main-nav');

    if (topNav) {
        topNav.innerHTML = '<a href="index.html">TRANG CHỦ</a>';
        categories.forEach(cat => {
            const link = document.createElement('a');
            link.href = `category.html?cat=${cat.slug}`;
            link.textContent = cat.name.toUpperCase();
            topNav.appendChild(link);
        });
    }

    if (mainNav) {
        categories.slice(0, 5).forEach(cat => {
            const link = document.createElement('a');
            link.href = `category.html?cat=${cat.slug}`;
            link.textContent = cat.name.toUpperCase();
            mainNav.appendChild(link);
        });

        const cartLink = document.createElement('a');
        cartLink.href = 'cart.html';
        cartLink.textContent = 'GIỎ HÀNG';
        cartLink.classList.add('active');
        mainNav.appendChild(cartLink);
    }
}

// Load cart items
function loadCartItems() {
    loadCart();
    const container = document.getElementById('cart-items-container');
    const emptyCart = document.getElementById('empty-cart');

    if (cart.length === 0) {
        container.style.display = 'none';
        emptyCart.style.display = 'block';
        return;
    }

    container.style.display = 'block';
    emptyCart.style.display = 'none';
    container.innerHTML = '';

    cart.forEach(item => {
        const product = getProductById(item.productId);
        if (!product) return;

        const cartItem = createCartItem(product, item.quantity);
        container.appendChild(cartItem);
    });

    updateCartSummary();
}

// Create cart item element
function createCartItem(product, quantity) {
    const div = document.createElement('div');
    div.className = 'cart-item';
    div.dataset.productId = product.id;

    const itemTotal = product.price * quantity;

    div.innerHTML = `
        <div class="cart-item-image" onclick="goToProduct(${product.id})">
            <img src="${product.images[0]}" alt="${product.name}">
        </div>
        
        <div class="cart-item-info">
            <div class="cart-item-name" onclick="goToProduct(${product.id})">${product.name}</div>
            <div class="cart-item-price">${formatPrice(product.price)}</div>
            <div class="cart-item-quantity">
                <button class="quantity-btn" onclick="decreaseQuantity(${product.id})">-</button>
                <input type="number" class="quantity-input" value="${quantity}" 
                       onchange="updateQuantity(${product.id}, this.value)" min="1">
                <button class="quantity-btn" onclick="increaseQuantity(${product.id})">+</button>
            </div>
        </div>
        
        <div class="cart-item-actions">
            <div class="cart-item-total">${formatPrice(itemTotal)}</div>
            <button class="btn-remove" onclick="removeItem(${product.id})">🗑️ Xóa</button>
        </div>
    `;

    return div;
}

// Go to product detail
function goToProduct(productId) {
    window.location.href = `product-detail.html?id=${productId}`;
}

// Increase quantity
function increaseQuantity(productId) {
    const item = cart.find(i => i.productId === productId);
    if (item) {
        updateCartQuantity(productId, item.quantity + 1);
        loadCartItems();
    }
}

// Decrease quantity
function decreaseQuantity(productId) {
    const item = cart.find(i => i.productId === productId);
    if (item && item.quantity > 1) {
        updateCartQuantity(productId, item.quantity - 1);
        loadCartItems();
    }
}

// Update quantity
function updateQuantity(productId, newQuantity) {
    const quantity = parseInt(newQuantity);
    if (quantity > 0) {
        updateCartQuantity(productId, quantity);
        loadCartItems();
    }
}

// Remove item
function removeItem(productId) {
    if (confirm('Bạn có chắc muốn xóa sản phẩm này khỏi giỏ hàng?')) {
        removeFromCart(productId);
        loadCartItems();
    }
}

// Update cart summary
function updateCartSummary() {
    const subtotal = getCartTotal();
    const itemCount = getCartCount();

    document.getElementById('subtotal').textContent = formatPrice(subtotal);
    document.getElementById('total-items').textContent = `${itemCount} sản phẩm`;
    document.getElementById('total').textContent = formatPrice(subtotal);
}

// Order via Messenger
function orderViaMessenger() {
    const orderText = generateOrderText();
    const messengerUrl = `https://m.me/YOUR_PAGE_ID?text=${encodeURIComponent(orderText)}`;

    // Show instruction
    alert('Bạn sẽ được chuyển đến Messenger để hoàn tất đơn hàng.\n\nVui lòng gửi tin nhắn với nội dung đơn hàng để chúng tôi xác nhận!');

    // Open Messenger (you need to replace YOUR_PAGE_ID with actual Facebook Page ID)
    window.open(messengerUrl, '_blank');
}

// Order via Facebook
function orderViaFacebook() {
    const orderText = generateOrderText();

    // Show instruction with order details
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0,0,0,0.8);
        z-index: 10000;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 20px;
    `;

    modal.innerHTML = `
        <div style="background: white; padding: 40px; border-radius: 12px; max-width: 600px; width: 100%;">
            <h2 style="margin-bottom: 20px;">📋 Thông tin đơn hàng</h2>
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px; white-space: pre-wrap; font-family: monospace; font-size: 14px; max-height: 300px; overflow-y: auto;">${orderText}</div>
            <p style="margin-bottom: 20px; color: #666;">Vui lòng copy nội dung trên và gửi tin nhắn đến trang Facebook của chúng tôi!</p>
            <div style="display: flex; gap: 10px;">
                <button onclick="copyOrderText('${orderText.replace(/'/g, "\\'")}'); this.textContent='✓ Đã copy!'" style="flex: 1; padding: 12px; background: #4CAF50; color: white; border: none; border-radius: 6px; font-weight: 600; cursor: pointer;">
                    📋 Copy nội dung
                </button>
                <button onclick="window.open('https://facebook.com/YOUR_PAGE', '_blank')" style="flex: 1; padding: 12px; background: #1877F2; color: white; border: none; border-radius: 6px; font-weight: 600; cursor: pointer;">
                    👉 Mở Facebook
                </button>
                <button onclick="this.parentElement.parentElement.parentElement.remove()" style="padding: 12px 20px; background: #999; color: white; border: none; border-radius: 6px; font-weight: 600; cursor: pointer;">
                    Đóng
                </button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
}

// Order via Phone
function orderViaPhone() {
    const orderText = generateOrderText();

    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0,0,0,0.8);
        z-index: 10000;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 20px;
    `;

    modal.innerHTML = `
        <div style="background: white; padding: 40px; border-radius: 12px; max-width: 500px; width: 100%; text-align: center;">
            <div style="font-size: 60px; margin-bottom: 20px;">📞</div>
            <h2 style="margin-bottom: 20px;">Gọi điện đặt hàng</h2>
            <p style="font-size: 32px; font-weight: 900; color: #4CAF50; margin-bottom: 20px;">0123 456 789</p>
            <p style="color: #666; margin-bottom: 30px;">Giờ làm việc: 8:00 - 22:00 hàng ngày</p>
            <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin-bottom: 20px; text-align: left;">
                <strong>Thông tin đơn hàng của bạn:</strong>
                <div style="margin-top: 10px; font-size: 14px; color: #555;">
                    ${cart.map(item => {
        const product = getProductById(item.productId);
        return `• ${product.name} x${item.quantity}`;
    }).join('<br>')}
                </div>
                <div style="margin-top: 10px; font-weight: 700; color: #ff6b6b;">
                    Tổng: ${formatPrice(getCartTotal())}
                </div>
            </div>
            <div style="display: flex; gap: 10px;">
                <a href="tel:0123456789" style="flex: 1; padding: 15px; background: #4CAF50; color: white; text-decoration: none; border-radius: 6px; font-weight: 600;">
                    📞 Gọi ngay
                </a>
                <button onclick="this.parentElement.parentElement.parentElement.remove()" style="flex: 1; padding: 15px; background: #999; color: white; border: none; border-radius: 6px; font-weight: 600; cursor: pointer;">
                    Đóng
                </button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
}

// Generate order text
function generateOrderText() {
    let text = '🛒 ĐƠN HÀNG MỚI\n\n';

    cart.forEach((item, index) => {
        const product = getProductById(item.productId);
        if (product) {
            text += `${index + 1}. ${product.name}\n`;
            text += `   Số lượng: ${item.quantity}\n`;
            text += `   Đơn giá: ${formatPrice(product.price)}\n`;
            text += `   Thành tiền: ${formatPrice(product.price * item.quantity)}\n\n`;
        }
    });

    text += `━━━━━━━━━━━━━━━━━━━━\n`;
    text += `TỔNG CỘNG: ${formatPrice(getCartTotal())}\n`;
    text += `Số lượng: ${getCartCount()} sản phẩm\n\n`;
    text += `Vui lòng xác nhận đơn hàng và cung cấp thông tin giao hàng!`;

    return text;
}

// Copy order text
function copyOrderText(text) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
}

// Initialize
document.addEventListener('DOMContentLoaded', async function () {
    await window.initApp();
    loadNavigation();
    loadCartItems();
});