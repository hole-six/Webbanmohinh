# Hướng dẫn Deploy Mô Hình Cao Cấp (Cấu trúc mới)

Cấu trúc thư mục mới đã tách biệt **Frontend** và **Backend** hoàn toàn.

## 1. Chuẩn bị VPS
1. Cài đặt Nginx: `sudo apt install nginx -y`
2. Cài đặt Node.js (khuyên dùng nvm hoặc v20.x): `curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash - && sudo apt-get install -y nodejs`
3. Cài đặt PM2 để chạy backend nền: `sudo npm install pm2 -g`

## 2. Copy Code lên VPS
1. Tạo thư mục chứa: `sudo mkdir -p /var/www/mohinhcaocap`
2. Chuyển quyền: `sudo chown -R $USER:$USER /var/www/mohinhcaocap`
3. Upload thư mục `backend` và `frontend` lên `/var/www/mohinhcaocap`

## 3. Khởi chạy Backend
```bash
cd /var/www/mohinhcaocap/backend
npm install
# Sửa file .env (Điền URI MongoDB Atlas của bạn)
nano .env

# Chạy server với PM2
pm2 start server.js --name "mohinhcaocap-api"
pm2 save
pm2 startup
```

## 4. Cấu hình Nginx
1. Sửa file: `nginx/mohinhcaocap.conf` (Thay `yourdomain.com` bằng domain thực tế của bạn)
2. Copy file config vào Nginx:
```bash
sudo cp /var/www/mohinhcaocap/nginx/mohinhcaocap.conf /etc/nginx/sites-available/
sudo ln -s /etc/nginx/sites-available/mohinhcaocap.conf /etc/nginx/sites-enabled/
```
3. Kiểm tra Nginx: `sudo nginx -t`
4. Khởi động lại Nginx: `sudo systemctl restart nginx`

## 5. Bật HTTPS / SSL (Let's Encrypt)
Chạy lệnh certbot tự động để thêm SSL:
```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

Xong! Web sẽ chạy siêu mượt với frontend trả về qua Nginx cache và backend xử lý logic ở Node.js.
