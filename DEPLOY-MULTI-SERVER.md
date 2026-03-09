# Deploy Backend Song Song Với Server Hiện Tại

## Tình huống: VPS đã có server chạy rồi

Giả sử server hiện tại đang chạy ở:
- Port: 3000 hoặc 80
- Domain: example.com

Backend mới sẽ chạy ở:
- Port: 5000 (hoặc port khác chưa dùng)
- Domain: api.example.com (hoặc example.com/api)

---

## Cách 1: Dùng Subdomain (Recommended)

### Bước 1: Upload code vào thư mục mới

```bash
# SSH vào VPS
ssh user@your-vps-ip

# Tạo thư mục mới (KHÔNG đụng vào thư mục cũ)
sudo mkdir -p /var/www/mohinhcaocap-api
cd /var/www/mohinhcaocap-api

# Upload code (chọn 1 trong 2 cách)

# Cách 1: Dùng Git
git clone YOUR_REPO_URL .

# Cách 2: Dùng SCP từ máy local
# Trên máy local, cd vào thư mục backend:
# scp -r * user@your-vps-ip:/var/www/mohinhcaocap-api/
```

### Bước 2: Cài đặt dependencies

```bash
cd /var/www/mohinhcaocap-api
npm install
```

### Bước 3: Cấu hình .env

```bash
nano .env
```

Nội dung:
```env
PORT=5000
NODE_ENV=production
MONGODB_URI=mongodb://localhost:27017/mohinhcaocap
JWT_SECRET=change-this-to-random-string-xyz123
ADMIN_EMAIL=admin@mohinhcaocap.vn
ADMIN_PASSWORD=admin123
FRONTEND_URL=http://your-domain.com
```

### Bước 4: Khởi tạo database

```bash
node scripts/init-data.js
```

### Bước 5: Chạy server với PM2

```bash
# Xem các process đang chạy
pm2 list

# Start backend mới với tên khác
pm2 start server.js --name mohinhcaocap-api

# Lưu lại
pm2 save
```

### Bước 6: Cấu hình Nginx cho subdomain

```bash
# Tạo config mới
sudo nano /etc/nginx/sites-available/mohinhcaocap-api
```

Nội dung:
```nginx
server {
    listen 80;
    server_name api.yourdomain.com;  # Thay bằng subdomain của bạn

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/mohinhcaocap-api /etc/nginx/sites-enabled/

# Test config
sudo nginx -t

# Reload Nginx (KHÔNG restart để không ảnh hưởng server cũ)
sudo nginx -s reload
```

### Bước 7: Cấu hình DNS

Vào nhà cung cấp domain (GoDaddy, Namecheap, etc.) và thêm A record:
```
Type: A
Name: api
Value: YOUR_VPS_IP
TTL: 3600
```

Đợi 5-10 phút để DNS propagate.

### Bước 8: Test API

```bash
# Test local
curl http://localhost:5000/api/health

# Test qua domain
curl http://api.yourdomain.com/api/health
```

---

## Cách 2: Dùng Path-based Routing (Không cần subdomain)

Nếu không muốn tạo subdomain, dùng path: `yourdomain.com/api`

### Cấu hình Nginx

```bash
# Sửa config của domain chính
sudo nano /etc/nginx/sites-available/your-main-site
```

Thêm vào trong block `server`:
```nginx
server {
    listen 80;
    server_name yourdomain.com;

    # Server cũ (frontend)
    location / {
        proxy_pass http://localhost:3000;  # Port của server cũ
        # ... các config khác
    }

    # Backend API mới
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

```bash
# Test và reload
sudo nginx -t
sudo nginx -s reload
```

API sẽ accessible tại: `http://yourdomain.com/api/products`

---

## Cách 3: Chỉ Chạy Local (Không expose ra ngoài)

Nếu chỉ muốn backend chạy local để test:

```bash
# Chỉ cần start PM2
pm2 start server.js --name mohinhcaocap-api

# API chỉ accessible từ localhost:5000
# Không cần config Nginx
```

---

## Kiểm Tra Port Đang Dùng

```bash
# Xem port nào đang được dùng
sudo netstat -tulpn | grep LISTEN

# Hoặc
sudo lsof -i -P -n | grep LISTEN

# Kết quả sẽ hiện:
# node    1234  user   23u  IPv4  12345      0t0  TCP *:3000 (LISTEN)  <- Server cũ
# node    5678  user   24u  IPv4  67890      0t0  TCP *:5000 (LISTEN)  <- Backend mới
```

---

## Quản Lý Nhiều Server với PM2

```bash
# Xem tất cả process
pm2 list

# Kết quả:
# ┌─────┬──────────────────┬─────────┬─────────┬──────────┐
# │ id  │ name             │ status  │ cpu     │ memory   │
# ├─────┼──────────────────┼─────────┼─────────┼──────────┤
# │ 0   │ old-server       │ online  │ 0%      │ 50.2mb   │
# │ 1   │ mohinhcaocap-api │ online  │ 0%      │ 45.8mb   │
# └─────┴──────────────────┴─────────┴─────────┴──────────┘

# Restart từng server riêng
pm2 restart mohinhcaocap-api

# Stop server cụ thể
pm2 stop mohinhcaocap-api

# Xem logs
pm2 logs mohinhcaocap-api

# Monitor
pm2 monit
```

---

## Cấu Trúc Thư Mục Trên VPS

```
/var/www/
├── old-project/              # Server cũ (port 3000)
│   ├── index.html
│   └── ...
│
└── mohinhcaocap-api/         # Backend mới (port 5000)
    ├── server.js
    ├── models/
    ├── routes/
    └── ...
```

---

## Troubleshooting

### Lỗi: Port 5000 đã được dùng

```bash
# Tìm process đang dùng port 5000
sudo lsof -i :5000

# Kill process
sudo kill -9 PID

# Hoặc đổi port trong .env
PORT=5001
```

### Lỗi: MongoDB connection failed

```bash
# Check MongoDB đang chạy
sudo systemctl status mongod

# Start MongoDB
sudo systemctl start mongod

# Enable auto-start
sudo systemctl enable mongod
```

### Lỗi: Cannot find module

```bash
# Cài lại dependencies
cd /var/www/mohinhcaocap-api
rm -rf node_modules
npm install
pm2 restart mohinhcaocap-api
```

### Nginx 502 Bad Gateway

```bash
# Check backend có chạy không
pm2 list

# Check logs
pm2 logs mohinhcaocap-api

# Check Nginx logs
sudo tail -f /var/log/nginx/error.log
```

---

## SSL Certificate (Nếu dùng subdomain)

```bash
# Install certbot nếu chưa có
sudo apt install certbot python3-certbot-nginx

# Get certificate cho subdomain
sudo certbot --nginx -d api.yourdomain.com

# Certbot sẽ tự động config HTTPS
```

---

## Quick Start Commands

```bash
# 1. Upload code
cd /var/www/mohinhcaocap-api

# 2. Install
npm install

# 3. Config
nano .env

# 4. Init DB
node scripts/init-data.js

# 5. Start
pm2 start server.js --name mohinhcaocap-api
pm2 save

# 6. Config Nginx (nếu cần)
sudo nano /etc/nginx/sites-available/mohinhcaocap-api
sudo ln -s /etc/nginx/sites-available/mohinhcaocap-api /etc/nginx/sites-enabled/
sudo nginx -t
sudo nginx -s reload

# 7. Test
curl http://localhost:5000/api/health
```

---

## Tóm Tắt

✅ **Server cũ:** Vẫn chạy bình thường ở port cũ  
✅ **Backend mới:** Chạy ở port 5000  
✅ **Không conflict:** Mỗi server có thư mục riêng, port riêng  
✅ **Nginx:** Route traffic đến đúng server dựa vào domain/path  
✅ **PM2:** Quản lý cả 2 server độc lập  

Bạn có thể chạy bao nhiêu server cũng được, miễn mỗi server dùng port khác nhau!
