// Hệ thống xác thực admin
let isAdmin = false;

// Kiểm tra trạng thái đăng nhập khi load trang
function checkAdminStatus() {
    const adminStatus = sessionStorage.getItem('isAdmin');
    if (adminStatus === 'true') {
        isAdmin = true;
        updateAdminUI();
    }
}

// Hiển thị form đăng nhập
function showLoginModal() {
    const modal = document.getElementById('login-modal');
    modal.style.display = 'block';
}

// Đăng nhập admin
function adminLogin() {
    const password = document.getElementById('admin-password').value;
    
    if (password === 'admin123') {
        isAdmin = true;
        sessionStorage.setItem('isAdmin', 'true');
        closeLoginModal();
        updateAdminUI();
        alert('Đăng nhập admin thành công!');
    } else {
        alert('Mật khẩu không đúng!');
    }
}

// Đăng xuất admin
function adminLogout() {
    if (confirm('Bạn có chắc muốn đăng xuất?')) {
        isAdmin = false;
        sessionStorage.removeItem('isAdmin');
        updateAdminUI();
        alert('Đã đăng xuất!');
    }
}

// Cập nhật giao diện admin
function updateAdminUI() {
    const loginBtn = document.getElementById('admin-login-btn');
    const logoutBtn = document.getElementById('admin-logout-btn');
    const adminBadge = document.getElementById('admin-badge');
    
    if (isAdmin) {
        loginBtn.style.display = 'none';
        logoutBtn.style.display = 'flex';
        adminBadge.style.display = 'inline-block';
        
        // Hiển thị các nút admin
        document.querySelectorAll('.btn-add-product').forEach(btn => {
            btn.style.display = 'inline-block';
        });
        
        document.querySelectorAll('.product-actions').forEach(actions => {
            actions.style.display = 'flex';
        });
    } else {
        loginBtn.style.display = 'flex';
        logoutBtn.style.display = 'none';
        adminBadge.style.display = 'none';
        
        // Ẩn các nút admin
        document.querySelectorAll('.btn-add-product').forEach(btn => {
            btn.style.display = 'none';
        });
        
        document.querySelectorAll('.product-actions').forEach(actions => {
            actions.style.display = 'none';
        });
    }
}

// Đóng modal đăng nhập
function closeLoginModal() {
    document.getElementById('login-modal').style.display = 'none';
    document.getElementById('admin-password').value = '';
}

// Khởi tạo khi trang load
document.addEventListener('DOMContentLoaded', function() {
    checkAdminStatus();
    
    // Đóng modal khi click bên ngoài
    window.onclick = function(event) {
        const loginModal = document.getElementById('login-modal');
        if (event.target === loginModal) {
            closeLoginModal();
        }
    }
    
    // Enter để đăng nhập
    document.getElementById('admin-password')?.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            adminLogin();
        }
    });
});