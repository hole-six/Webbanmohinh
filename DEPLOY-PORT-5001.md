# Hướng Dẫn Deploy Port 5001 + HTTPS

## Vấn Đề
- Backend đang chạy trên port 5001 (theo `backend/.env`)
- Site dùng HTTPS nhưng API URLs dùng HTTP → Mixed Content Error
- Người dùng nước ngoài không load được dữ liệu

## Đã Sửa
✅ `frontend/js/api.js` - Cập nhật HTTPS cho production
✅ `api-client.js` - Cập nhật HTTPS cho production
✅ `frontend/pages/login.html` - Cập nhật HTTPS
✅ `frontend/pages/admin-products.html` - Cập nhật HTTPS
✅ `frontend/pages/admin-brands.html` - Cập nhật HTTPS
✅ `frontend/pages/admin-categories.html` - Cập nhật HTTPS
✅ `nginx/mohinhcaocap.conf` - Cập nhật proxy_pass sang port 5001

## Các Bước Deploy

### 1. Commit và Push lên GitHub
```bash
git add .
git commit -m "Fix: Update all API URLs to use HTTPS in production"
git push origin master
```

### 2. SSH vào VPS
```bash
ssh root@14.225.255.110
```

### 3. Pull code mới
```bash
cd /var/www/mohinhcaocap
git pull origin master
```

### 4. Cập nhật Nginx Configuration
```bash
# Copy nginx config mới
sudo cp nginx/mohinhcaocap.conf /etc/nginx/sites-available/mohinhcaocap.conf

# Test nginx config
sudo nginx -t

# Reload nginx
sudo systemctl reload nginx
```

### 5. Restart Backend Server
```bash
# Xem danh sách PM2 processes
pm2 list

# Restart backend (tên process có thể là wavestore-server hoặc mohinhcaocap)
pm2 restart wavestore-server

# Hoặc nếu tên khác:
pm2 restart all

# Xem logs để kiểm tra
pm2 logs wavestore-server --lines 50
```

### 6. Kiểm Tra
```bash
# Kiểm tra backend đang chạy trên port 5001
curl http://localhost:5001/api/categories

# Kiểm tra qua nginx với HTTPS
curl https://mohinhcaocap.wavestore.id.vn/api/categories
```

### 7. Test từ Browser
- Mở: https://mohinhcaocap.wavestore.id.vn
- Kiểm tra xem có load được sản phẩm không
- Mở Developer Console (F12) - không còn Mixed Content errors
- Kiểm tra Network tab xem API calls đều dùng HTTPS

## Cấu Hình Hiện Tại

### Backend (.env)
```
PORT=5001
```

### Frontend (Production)
```javascript
const API_URL = 'https://mohinhcaocap.wavestore.id.vn/api'  // HTTPS!
```

### Frontend (Local Development)
```javascript
const API_URL = 'http://localhost:5001/api'
```

### Nginx
```
location /api/ {
    proxy_pass http://localhost:5001;  # Backend vẫn dùng HTTP local
}
```

## Giải Thích
- Browser yêu cầu: HTTPS page → HTTPS API
- Nginx nhận HTTPS request từ browser
- Nginx proxy sang HTTP localhost:5001 (OK vì internal)
- Backend trả về qua Nginx
- Nginx trả về browser qua HTTPS

## Troubleshooting

### Nếu vẫn không load được:
1. Kiểm tra PM2 logs: `pm2 logs`
2. Kiểm tra Nginx logs: `sudo tail -f /var/log/nginx/error.log`
3. Kiểm tra port: `netstat -tulpn | grep 5001`
4. Restart tất cả: `pm2 restart all && sudo systemctl reload nginx`

### Nếu Mixed Content Error vẫn còn:
1. Hard refresh browser: Ctrl+Shift+R (Windows) hoặc Cmd+Shift+R (Mac)
2. Clear browser cache
3. Kiểm tra Network tab xem API URL có dùng HTTPS không

### Nếu MongoDB timeout:
- Đã thêm timeout options trong `backend/server.js`
- Kiểm tra MongoDB Atlas whitelist IP của VPS

## Lưu Ý Quan Trọng
- Production PHẢI dùng HTTPS cho API URLs
- Local development vẫn dùng HTTP (localhost:5001)
- Nginx xử lý HTTPS termination
- Backend chỉ cần HTTP vì chạy local trên VPS
