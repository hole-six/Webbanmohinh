# Hướng Dẫn Deploy Backend lên VPS

## 1. Cài đặt trên VPS

### Bước 1: Cài đặt Node.js và MongoDB

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 18.x
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install MongoDB
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
sudo apt update
sudo apt install -y mongodb-org

# Start MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod
```

### Bước 2: Upload code lên VPS

```bash
# Tạo thư mục project
mkdir -p /var/www/mohinhcaocap-backend
cd /var/www/mohinhcaocap-backend

# Upload code (dùng git hoặc scp)
# Cách 1: Git
git clone YOUR_REPO_URL .

# Cách 2: SCP từ máy local
# scp -r * user@your-vps-ip:/var/www/mohinhcaocap-backend/
```

### Bước 3: Cài đặt dependencies

```bash
cd /var/www/mohinhcaocap-backend
npm install
```

### Bước 4: Cấu hình .env

```bash
nano .env
```

Sửa các giá trị:
```
PORT=5000
NODE_ENV=production
MONGODB_URI=mongodb://localhost:27017/mohinhcaocap
JWT_SECRET=your-super-secret-key-change-this
ADMIN_EMAIL=admin@mohinhcaocap.vn
ADMIN_PASSWORD=admin123
FRONTEND_URL=http://your-domain.com
```

### Bước 5: Khởi tạo database

```bash
node scripts/init-data.js
```

### Bước 6: Cài đặt PM2 (Process Manager)

```bash
# Install PM2
sudo npm install -g pm2

# Start server
pm2 start server.js --name mohinhcaocap-api

# Auto start on reboot
pm2 startup
pm2 save
```

### Bước 7: Cài đặt Nginx (Reverse Proxy)

```bash
# Install Nginx
sudo apt install -y nginx

# Create config
sudo nano /etc/nginx/sites-available/mohinhcaocap-api
```

Nội dung file config:
```nginx
server {
    listen 80;
    server_name api.your-domain.com;

    location / {
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
# Enable site
sudo ln -s /etc/nginx/sites-available/mohinhcaocap-api /etc/nginx/sites-enabled/

# Test config
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
```

### Bước 8: Cài đặt SSL (Optional nhưng recommended)

```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d api.your-domain.com
```

## 2. API Endpoints

### Products
- `GET /api/products` - Lấy danh sách sản phẩm
- `GET /api/products/:id` - Lấy chi tiết sản phẩm
- `POST /api/products` - Thêm sản phẩm (Admin)
- `PUT /api/products/:id` - Sửa sản phẩm (Admin)
- `DELETE /api/products/:id` - Xóa sản phẩm (Admin)

### Categories
- `GET /api/categories` - Lấy danh sách danh mục
- `POST /api/categories` - Thêm danh mục (Admin)
- `PUT /api/categories/:id` - Sửa danh mục (Admin)
- `DELETE /api/categories/:id` - Xóa danh mục (Admin)

### Auth
- `POST /api/auth/login` - Đăng nhập admin
- `GET /api/auth/verify` - Verify token

## 3. Quản lý PM2

```bash
# Xem logs
pm2 logs mohinhcaocap-api

# Restart
pm2 restart mohinhcaocap-api

# Stop
pm2 stop mohinhcaocap-api

# Delete
pm2 delete mohinhcaocap-api

# Monitor
pm2 monit
```

## 4. Backup Database

```bash
# Backup
mongodump --db mohinhcaocap --out /backup/$(date +%Y%m%d)

# Restore
mongorestore --db mohinhcaocap /backup/20240101/mohinhcaocap
```

## 5. Test API

```bash
# Health check
curl http://localhost:5000/api/health

# Get products
curl http://localhost:5000/api/products

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@mohinhcaocap.vn","password":"admin123"}'
```

## 6. Troubleshooting

### MongoDB không start
```bash
sudo systemctl status mongod
sudo journalctl -u mongod
```

### Port 5000 đã được sử dụng
```bash
# Tìm process
sudo lsof -i :5000

# Kill process
sudo kill -9 PID
```

### Nginx error
```bash
sudo nginx -t
sudo tail -f /var/log/nginx/error.log
```
