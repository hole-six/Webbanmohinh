# 🎯 Website Bán Mô Hình Cao Cấp

Website thương mại điện tử chuyên bán mô hình cao cấp: Transformers, Marvel, DC Comics, Gundam, Star Wars, Anime.

## 🌟 Tính Năng

### Frontend (Khách Hàng)
- ✅ Trang chủ với sản phẩm nổi bật
- ✅ Danh sách sản phẩm theo danh mục
- ✅ Chi tiết sản phẩm với gallery ảnh
- ✅ Giỏ hàng (localStorage)
- ✅ Tìm kiếm sản phẩm
- ✅ Responsive design (Mobile, Tablet, Desktop)
- ✅ Liên hệ qua Messenger/Facebook/Phone

### Admin Panel
- ✅ Đăng nhập bảo mật (JWT)
- ✅ Quản lý sản phẩm (CRUD)
- ✅ Quản lý danh mục (CRUD)
- ✅ Quản lý thương hiệu (CRUD)
- ✅ Upload nhiều ảnh cùng lúc
- ✅ Auto-save form data (localStorage)
- ✅ Responsive admin panel

### Backend API
- ✅ RESTful API với Express.js
- ✅ MongoDB Atlas (Cloud Database)
- ✅ JWT Authentication
- ✅ Image upload với Multer
- ✅ CORS enabled
- ✅ Error handling

## 🛠️ Tech Stack

**Frontend:**
- HTML5, CSS3, JavaScript (Vanilla)
- Responsive Design
- LocalStorage API

**Backend:**
- Node.js + Express.js
- MongoDB + Mongoose
- JWT Authentication
- Multer (File Upload)
- Bcrypt (Password Hashing)

**Deployment:**
- Nginx (Web Server)
- PM2 (Process Manager)
- Let's Encrypt (SSL)
- Ubuntu Server

## 📦 Cài Đặt Local

### 1. Clone Repository
```bash
git clone https://github.com/hole-six/Webbanmohinh.git
cd Webbanmohinh
```

### 2. Cài Đặt Backend
```bash
cd backend
npm install
```

### 3. Cấu Hình Environment
Tạo file `backend/.env`:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://admin:123123Aa@mohinhcaocap.s2liv1g.mongodb.net/mohinhcaocap?retryWrites=true&w=majority&appName=mohinhcaocap
JWT_SECRET=your-secret-key
ADMIN_EMAIL=admin@mohinhcaocap.vn
ADMIN_PASSWORD=admin123
FRONTEND_URL=http://localhost:5500
```

### 4. Khởi Tạo Database
```bash
cd backend
node scripts/init-data.js
```

### 5. Chạy Backend
```bash
cd backend
npm start
# hoặc development mode
npm run dev
```

Backend chạy tại: `http://localhost:5000`

### 6. Chạy Frontend
Sử dụng Live Server (VS Code Extension) hoặc bất kỳ static server nào:
```bash
# Với Live Server
# Click chuột phải vào frontend/pages/index.html -> Open with Live Server
```

Frontend chạy tại: `http://localhost:5500`

## 🚀 Deploy Production

Xem hướng dẫn chi tiết trong [DEPLOY-GUIDE.md](./DEPLOY-GUIDE.md)

### Quick Deploy
```bash
# Trên server
cd /var/www/mohinhcaocap
bash deploy.sh
```

## 📱 Demo

**Website:** https://mohinhcaocap.vn (sẽ cập nhật sau khi deploy)

**Admin Panel:** https://mohinhcaocap.vn/login.html

**Thông tin đăng nhập:**
- Email: `admin@mohinhcaocap.vn`
- Password: `admin123`

## 📂 Cấu Trúc Project

```
Webbanmohinh/
├── backend/
│   ├── middleware/
│   │   └── auth.js
│   ├── models/
│   │   ├── Admin.js
│   │   ├── Brand.js
│   │   ├── Category.js
│   │   └── Product.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── brands.js
│   │   ├── categories.js
│   │   ├── products.js
│   │   └── upload.js
│   ├── scripts/
│   │   └── init-data.js
│   ├── uploads/
│   ├── .env
│   ├── database.js
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── css/
│   │   ├── cart.css
│   │   ├── category.css
│   │   ├── product-detail.css
│   │   └── style.css
│   ├── js/
│   │   ├── api.js
│   │   ├── auth.js
│   │   ├── cart.js
│   │   ├── category.js
│   │   ├── data.js
│   │   ├── main.js
│   │   └── product-detail.js
│   └── pages/
│       ├── admin-brands.html
│       ├── admin-categories.html
│       ├── admin-products.html
│       ├── cart.html
│       ├── category.html
│       ├── index.html
│       ├── login.html
│       └── product-detail.html
├── nginx/
│   └── mohinhcaocap.conf
├── .gitignore
├── deploy.sh
├── DEPLOY-GUIDE.md
└── README.md
```

## 🔑 API Endpoints

### Products
- `GET /api/products` - Lấy danh sách sản phẩm
- `GET /api/products/:id` - Lấy chi tiết sản phẩm
- `POST /api/products` - Tạo sản phẩm mới (Admin)
- `PUT /api/products/:id` - Cập nhật sản phẩm (Admin)
- `DELETE /api/products/:id` - Xóa sản phẩm (Admin)

### Categories
- `GET /api/categories` - Lấy danh sách danh mục
- `GET /api/categories/:id` - Lấy chi tiết danh mục
- `POST /api/categories` - Tạo danh mục (Admin)
- `PUT /api/categories/:id` - Cập nhật danh mục (Admin)
- `DELETE /api/categories/:id` - Xóa danh mục (Admin)

### Brands
- `GET /api/brands` - Lấy danh sách thương hiệu
- `GET /api/brands/:id` - Lấy chi tiết thương hiệu
- `POST /api/brands` - Tạo thương hiệu (Admin)
- `PUT /api/brands/:id` - Cập nhật thương hiệu (Admin)
- `DELETE /api/brands/:id` - Xóa thương hiệu (Admin)

### Auth
- `POST /api/auth/login` - Đăng nhập admin
- `POST /api/auth/register` - Đăng ký admin (chỉ lần đầu)
- `GET /api/auth/verify` - Verify token

### Upload
- `POST /api/upload` - Upload ảnh (Admin)

## 🔒 Bảo Mật

- JWT Authentication cho admin
- Password hashing với bcrypt
- CORS configuration
- Input validation
- File upload restrictions
- Environment variables

## 📝 License

MIT License - Tự do sử dụng cho mục đích cá nhân và thương mại.

## 👨‍💻 Author

**Hole Six**
- GitHub: [@hole-six](https://github.com/hole-six)
- Repository: [Webbanmohinh](https://github.com/hole-six/Webbanmohinh)

## 🤝 Contributing

Contributions, issues và feature requests đều được chào đón!

## ⭐ Support

Nếu project này hữu ích, hãy cho một ⭐ trên GitHub!
