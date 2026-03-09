# Hướng Dẫn Kết Nối Frontend với Backend

## Đã tạo các file:

✅ `frontend/js/api.js` - API client  
✅ `frontend/js/main.js` - Homepage logic  
✅ `frontend/js/category.js` - Category page logic  
✅ `frontend/js/product-detail.js` - Product detail logic  

## Cập nhật các file HTML:

### 1. frontend/pages/index.html

Thêm trước thẻ `</body>`:

```html
<!-- API Client -->
<script src="../js/api.js"></script>
<!-- Main JS -->
<script src="../js/main.js"></script>
</body>
```

### 2. frontend/pages/category.html

Thêm trước thẻ `</body>`:

```html
<!-- API Client -->
<script src="../js/api.js"></script>
<!-- Category JS -->
<script src="../js/category.js"></script>
</body>
```

### 3. frontend/pages/product-detail.html

Thêm trước thẻ `</body>`:

```html
<!-- API Client -->
<script src="../js/api.js"></script>
<!-- Product Detail JS -->
<script src="../js/product-detail.js"></script>
</body>
```

## Cấu trúc thư mục:

```
project/
├── backend/
│   ├── server.js
│   ├── models/
│   ├── routes/
│   └── ...
│
└── frontend/
    ├── pages/
    │   ├── index.html
    │   ├── category.html
    │   ├── product-detail.html
    │   └── admin.html
    ├── css/
    │   ├── style.css
    │   ├── category.css
    │   └── cart.css
    └── js/
        ├── api.js          ← MỚI
        ├── main.js         ← MỚI
        ├── category.js     ← MỚI
        └── product-detail.js ← MỚI
```

## Chạy website:

### 1. Start Backend (Terminal 1):

```bash
cd backend
npm start
```

Server chạy tại: `http://localhost:5000`

### 2. Start Frontend (Terminal 2):

**Cách 1: Dùng Live Server (VS Code)**
- Cài extension "Live Server"
- Right-click vào `frontend/pages/index.html`
- Chọn "Open with Live Server"

**Cách 2: Dùng http-server**
```bash
cd frontend
npx http-server -p 3000
```

Frontend chạy tại: `http://localhost:3000`

### 3. Truy cập:

- **Website**: http://localhost:3000/pages/index.html
- **Admin**: http://localhost:5000/admin

## Fix CORS (nếu gặp lỗi):

Nếu thấy lỗi CORS trong console, cập nhật `server.js`:

```javascript
// Middleware
app.use(cors({
    origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
    credentials: true
}));
```

## Test:

1. ✅ Trang chủ load sản phẩm từ API
2. ✅ Click vào sản phẩm → Xem chi tiết
3. ✅ Click danh mục → Lọc sản phẩm
4. ✅ Tìm kiếm sản phẩm
5. ✅ Admin panel thêm/xóa sản phẩm

## Troubleshooting:

### Lỗi: "API is not defined"
→ Đảm bảo `api.js` được load trước các file khác

### Lỗi: "Failed to fetch"
→ Kiểm tra backend có đang chạy không (port 5000)

### Lỗi: CORS
→ Cập nhật CORS config trong server.js

### Sản phẩm không hiển thị
→ Kiểm tra console (F12) xem có lỗi gì
→ Đảm bảo đã chạy `node scripts/init-data.js`
