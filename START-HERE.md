# 🚀 HƯỚNG DẪN CHẠY WEBSITE

## ✅ Đã hoàn thành:

1. ✅ Backend API với Node.js + Express + MongoDB
2. ✅ Admin Panel để quản lý sản phẩm
3. ✅ Frontend kết nối với Backend API
4. ✅ Tất cả script đã được thêm vào HTML

---

## 📋 Yêu cầu:

- Node.js (đã cài)
- MongoDB Atlas account (đã có)
- Browser (Chrome, Firefox, etc.)

---

## 🎯 CÁCH CHẠY:

### Bước 1: Start Backend

Mở Terminal/CMD và chạy:

```bash
# Cài dependencies (chỉ chạy 1 lần đầu)
npm install

# Khởi tạo database (chỉ chạy 1 lần đầu)
node scripts/init-data.js

# Start server
npm start
```

**Kết quả:**
```
✅ MongoDB Connected
🚀 Server running on port 5000
📍 API: http://localhost:5000/api
```

### Bước 2: Mở Frontend

**Cách 1: Dùng Live Server (Recommended)**
1. Cài extension "Live Server" trong VS Code
2. Right-click vào `frontend/pages/index.html`
3. Chọn "Open with Live Server"
4. Website sẽ mở tại: `http://localhost:5500` hoặc `http://127.0.0.1:5500`

**Cách 2: Mở trực tiếp file**
1. Double-click vào `frontend/pages/index.html`
2. Website sẽ mở trong browser

**Cách 3: Dùng http-server**
```bash
cd frontend
npx http-server -p 3000
```
Website tại: `http://localhost:3000/pages/index.html`

---

## 🔗 Các URL quan trọng:

### Frontend (Website):
- **Trang chủ**: `http://localhost:5500/pages/index.html`
- **Danh mục**: `http://localhost:5500/pages/category.html`
- **Chi tiết SP**: `http://localhost:5500/pages/product-detail.html?id=xxx`
- **Giỏ hàng**: `http://localhost:5500/pages/cart.html`

### Backend (API):
- **API Root**: `http://localhost:5000`
- **Admin Panel**: `http://localhost:5000/admin`
- **Products API**: `http://localhost:5000/api/products`
- **Categories API**: `http://localhost:5000/api/categories`

---

## 👨‍💼 ADMIN PANEL:

### Truy cập:
```
http://localhost:5000/admin
```

### Login:
- **Email**: `admin@mohinhcaocap.vn`
- **Password**: `admin123`

### Chức năng:
- ✅ Xem danh sách sản phẩm
- ✅ Thêm sản phẩm mới
- ✅ Xóa sản phẩm
- ✅ Quản lý danh mục
- ✅ Quản lý thương hiệu

---

## 🧪 TEST WEBSITE:

### 1. Test Trang Chủ:
- Mở `http://localhost:5500/pages/index.html`
- Kiểm tra: Sản phẩm có hiển thị không?
- Kiểm tra: Thanh danh mục trên cùng có hiển thị không?

### 2. Test Danh Mục:
- Click vào 1 danh mục (VD: Transformers)
- Kiểm tra: Sản phẩm được lọc theo danh mục

### 3. Test Chi Tiết Sản Phẩm:
- Click vào 1 sản phẩm
- Kiểm tra: Hiển thị đầy đủ thông tin, ảnh, giá

### 4. Test Admin:
- Vào `http://localhost:5000/admin`
- Login với email/password
- Thử thêm 1 sản phẩm mới
- Refresh trang chủ → Sản phẩm mới xuất hiện

---

## 🐛 TROUBLESHOOTING:

### Lỗi: "Cannot GET /"
→ Backend chưa chạy. Chạy `npm start`

### Lỗi: "Failed to fetch" / "Network Error"
→ Kiểm tra backend có chạy không (port 5000)
→ Kiểm tra URL trong `frontend/js/api.js` có đúng không

### Lỗi: "MongoServerError: bad auth"
→ Kiểm tra password trong file `.env`
→ Đảm bảo password khớp với MongoDB Atlas

### Lỗi: CORS
→ Thêm vào `server.js`:
```javascript
app.use(cors({
    origin: '*',
    credentials: true
}));
```

### Sản phẩm không hiển thị:
→ Mở Console (F12) xem lỗi
→ Kiểm tra đã chạy `node scripts/init-data.js` chưa
→ Kiểm tra MongoDB có dữ liệu không (vào MongoDB Atlas → Browse Collections)

### Admin không login được:
→ Kiểm tra đã chạy `node scripts/init-data.js` chưa
→ Kiểm tra email/password: `admin@mohinhcaocap.vn` / `admin123`

---

## 📁 CẤU TRÚC PROJECT:

```
project/
├── backend/
│   ├── server.js              ← Server chính
│   ├── .env                   ← Config (MongoDB, JWT)
│   ├── models/                ← Database models
│   ├── routes/                ← API routes
│   ├── middleware/            ← Auth middleware
│   ├── scripts/               ← Init data script
│   └── public/
│       └── admin.html         ← Admin panel
│
├── frontend/
│   ├── pages/
│   │   ├── index.html         ← Trang chủ
│   │   ├── category.html      ← Trang danh mục
│   │   ├── product-detail.html ← Chi tiết SP
│   │   └── cart.html          ← Giỏ hàng
│   ├── css/                   ← Styles
│   └── js/
│       ├── api.js             ← API client
│       ├── main.js            ← Homepage logic
│       ├── category.js        ← Category logic
│       └── product-detail.js  ← Product detail logic
│
└── START-HERE.md              ← File này
```

---

## 🚀 DEPLOY LÊN VPS:

Xem file: `DEPLOY-MULTI-SERVER.md`

---

## 📞 HỖ TRỢ:

Nếu gặp lỗi:
1. Kiểm tra Console (F12) xem lỗi gì
2. Kiểm tra Terminal xem backend có lỗi không
3. Đọc phần Troubleshooting ở trên

---

## ✨ TÍNH NĂNG:

### Website (Frontend):
- ✅ Hiển thị sản phẩm từ database
- ✅ Lọc theo danh mục
- ✅ Tìm kiếm sản phẩm
- ✅ Xem chi tiết sản phẩm
- ✅ Liên hệ qua Messenger/Facebook/Phone

### Admin Panel:
- ✅ Đăng nhập/Đăng xuất
- ✅ Thêm sản phẩm mới
- ✅ Xóa sản phẩm
- ✅ Quản lý danh mục
- ✅ Quản lý thương hiệu
- ✅ Dữ liệu lưu vào MongoDB (không mất khi refresh)

---

## 🎉 HOÀN THÀNH!

Website của bạn đã sẵn sàng! Chúc bạn thành công! 🚀
