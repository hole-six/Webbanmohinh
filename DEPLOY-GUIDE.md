# 🚀 Hướng Dẫn Deploy Website Mô Hình Cao Cấp

## 📋 Yêu Cầu Server

- Ubuntu 20.04 hoặc mới hơn
- Node.js 18+ 
- Nginx
- PM2 (process manager)
- MongoDB Atlas (đã có)
- Domain đã trỏ về IP server

## 🔧 Bước 1: Chuẩn Bị Git Repository

```bash
# Khởi tạo git (nếu chưa có)
git init

# Thêm tất cả file
git add .

# Commit
git commit -m "Initial commit - E-commerce website"

# Thêm remote repository (thay YOUR_REPO_URL)
git remote add origin YOUR_REPO_URL

# Push lên GitHub/GitLab
git push -u origin main
```

## 🖥️ Bước 2: Kết Nối SSH vào Server

```bash
ssh root@YOUR_SERVER_IP
# hoặc
ssh username@YOUR_SERVER_IP
```

## 📦 Bước 3: Cài Đặt Môi Trường trên Server

### 3.1. Cập nhật hệ thống
```bash
sudo apt update && sudo apt upgrade -y
```

### 3.2. Cài đặt Node.js 18
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs
node -v  # Kiểm tra version
npm -v
```

### 3.3. Cài đặt PM2
```bash
sudo npm install -g pm2
pm2 --version
```

### 3.4. Cài đặt Nginx
```bash
sudo apt install -y nginx
sudo systemctl status nginx
```

### 3.5. Cài đặt Git
```bash
sudo apt install -y git
```

## 📥 Bước 4: Clone Code từ Git

```bash
# Tạo thư mục cho project
cd /var/www
sudo mkdir mohinhcaocap
sudo chown -R $USER:$USER mohinhcaocap
cd mohinhcaocap

# Clone repository
git clone YOUR_REPO_URL .

# Hoặc nếu đã có folder
git pull origin main
```

## ⚙️ Bước 5: Cấu Hình Backend

### 5.1. Cài đặt dependencies
```bash
cd /var/www/mohinhcaocap/backend
npm install
```

### 5.2. Tạo file .env cho production
```bash
nano .env
```

Nội dung file `.env`:
```env
# Server Configuration
PORT=5000
NODE_ENV=production

# MongoDB Configuration - ATLAS (Cloud)
MONGODB_URI=mongodb+srv://admin:123123Aa@mohinhcaocap.s2liv1g.mongodb.net/mohinhcaocap?retryWrites=true&w=majority&appName=mohinhcaocap

# JWT Secret (ĐỔI THÀNH CHUỖI NGẪU NHIÊN)
JWT_SECRET=your-super-secret-key-change-this-in-production

# Admin Default Credentials
ADMIN_EMAIL=admin@mohinhcaocap.vn
ADMIN_PASSWORD=admin123

# CORS - Thay YOUR_DOMAIN
FRONTEND_URL=https://mohinhcaocap.vn
```

Lưu file: `Ctrl + X`, `Y`, `Enter`

### 5.3. Khởi tạo dữ liệu (chỉ lần đầu)
```bash
node scripts/init-data.js
```

### 5.4. Tạo thư mục uploads
```bash
mkdir -p uploads
chmod 755 uploads
```

### 5.5. Chạy backend với PM2
```bash
pm2 start server.js --name mohinhcaocap-api
pm2 save
pm2 startup
```

Kiểm tra:
```bash
pm2 status
pm2 logs mohinhcaocap-api
```

## 🌐 Bước 6: Cấu Hình Nginx

### 6.1. Tạo file cấu hình Nginx
```bash
sudo nano /etc/nginx/sites-available/mohinhcaocap
```

Nội dung (thay `mohinhcaocap.vn` bằng domain của bạn):
```nginx
server {
    listen 80;
    server_name mohinhcaocap.vn www.mohinhcaocap.vn;

    # Frontend
    root /var/www/mohinhcaocap/frontend/pages;
    index index.html;

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

    # Frontend static files
    location / {
        try_files $uri $uri/ /index.html;
    }

    # CSS files
    location /css/ {
        alias /var/www/mohinhcaocap/frontend/css/;
    }

    # JS files
    location /js/ {
        alias /var/www/mohinhcaocap/frontend/js/;
    }

    # Backend API
    location /api/ {
        proxy_pass http://localhost:5000/api/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Uploaded images
    location /uploads/ {
        alias /var/www/mohinhcaocap/backend/uploads/;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
}
```

Lưu file: `Ctrl + X`, `Y`, `Enter`

### 6.2. Kích hoạt site
```bash
sudo ln -s /etc/nginx/sites-available/mohinhcaocap /etc/nginx/sites-enabled/
sudo nginx -t  # Test cấu hình
sudo systemctl restart nginx
```

## 🔒 Bước 7: Cài Đặt SSL (HTTPS)

### 7.1. Cài đặt Certbot
```bash
sudo apt install -y certbot python3-certbot-nginx
```

### 7.2. Tạo SSL certificate
```bash
sudo certbot --nginx -d mohinhcaocap.vn -d www.mohinhcaocap.vn
```

Làm theo hướng dẫn:
- Nhập email
- Đồng ý điều khoản
- Chọn redirect HTTP sang HTTPS

### 7.3. Auto-renew SSL
```bash
sudo certbot renew --dry-run
```

## 🔄 Bước 8: Cập Nhật Frontend URLs

Sửa file API trong frontend để dùng domain thật:

```bash
nano /var/www/mohinhcaocap/frontend/js/api.js
```

Đổi:
```javascript
const API_BASE_URL = 'http://localhost:5000/api';
```

Thành:
```javascript
const API_BASE_URL = 'https://mohinhcaocap.vn/api';
```

Tương tự với các file admin:
- `frontend/pages/admin-products.html`
- `frontend/pages/admin-categories.html`
- `frontend/pages/admin-brands.html`
- `frontend/pages/login.html`

Đổi:
```javascript
const API = 'http://localhost:5000/api';
```

Thành:
```javascript
const API = 'https://mohinhcaocap.vn/api';
```

## ✅ Bước 9: Kiểm Tra Website

1. Truy cập: `https://mohinhcaocap.vn`
2. Kiểm tra trang chủ
3. Kiểm tra trang sản phẩm
4. Đăng nhập admin: `https://mohinhcaocap.vn/login.html`
5. Test upload ảnh
6. Test thêm/sửa/xóa sản phẩm

## 🔧 Các Lệnh Hữu Ích

### PM2 Commands
```bash
pm2 list                    # Xem danh sách process
pm2 logs mohinhcaocap-api   # Xem logs
pm2 restart mohinhcaocap-api # Restart
pm2 stop mohinhcaocap-api   # Dừng
pm2 delete mohinhcaocap-api # Xóa
```

### Nginx Commands
```bash
sudo systemctl status nginx  # Kiểm tra status
sudo systemctl restart nginx # Restart
sudo nginx -t               # Test config
sudo tail -f /var/log/nginx/error.log  # Xem error log
```

### Git Commands (cập nhật code)
```bash
cd /var/www/mohinhcaocap
git pull origin main
cd backend
npm install  # Nếu có package mới
pm2 restart mohinhcaocap-api
```

## 🐛 Troubleshooting

### Lỗi: Cannot connect to MongoDB
- Kiểm tra MongoDB Atlas whitelist IP (thêm IP server)
- Kiểm tra connection string trong `.env`

### Lỗi: 502 Bad Gateway
- Kiểm tra backend có chạy: `pm2 status`
- Xem logs: `pm2 logs mohinhcaocap-api`
- Restart: `pm2 restart mohinhcaocap-api`

### Lỗi: Permission denied khi upload
```bash
sudo chown -R www-data:www-data /var/www/mohinhcaocap/backend/uploads
sudo chmod -R 755 /var/www/mohinhcaocap/backend/uploads
```

### Lỗi: CORS
- Kiểm tra `FRONTEND_URL` trong `.env`
- Restart backend: `pm2 restart mohinhcaocap-api`

## 📊 Monitoring

### Xem resource usage
```bash
pm2 monit
```

### Xem logs realtime
```bash
pm2 logs mohinhcaocap-api --lines 100
```

## 🔐 Bảo Mật

1. Đổi JWT_SECRET trong `.env`
2. Đổi mật khẩu admin sau khi deploy
3. Cấu hình firewall:
```bash
sudo ufw allow 22    # SSH
sudo ufw allow 80    # HTTP
sudo ufw allow 443   # HTTPS
sudo ufw enable
```

4. Giới hạn rate limit trong Nginx (tùy chọn)

## 🎉 Hoàn Thành!

Website của bạn đã sẵn sàng tại: `https://mohinhcaocap.vn`

Admin panel: `https://mohinhcaocap.vn/login.html`
