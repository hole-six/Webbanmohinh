# 🚀 CI/CD Setup Guide - Tự động deploy khi commit

## 📋 Thông tin cần thiết

Để setup CI/CD tự động, tôi cần bạn cung cấp:

### 1. Thông tin VPS
- **IP Address VPS**: `_______________`
- **Username SSH**: `_______________` (thường là `root` hoặc `ubuntu`)
- **Port SSH**: `_______________` (mặc định là 22)
- **Domain**: `mohinhcaocap.wavestore.id.vn` ✅

### 2. Thông tin GitHub Repository
- **Repository URL**: `_______________`
- **Branch chính**: `main` hoặc `master`
- **GitHub Username**: `_______________`

### 3. Đường dẫn trên VPS
- **Project path**: `/var/www/mohinhcaocap` (xác nhận đúng không?)
- **Nginx config**: `/etc/nginx/sites-available/mohinhcaocap.conf`
- **PM2 process name**: `mohinhcaocap-api`

## 🔧 Các bước setup

### Bước 1: Chuẩn bị VPS (chạy trên server)
```bash
# Upload và chạy script setup
scp setup-cicd.sh root@YOUR_VPS_IP:/var/www/mohinhcaocap/
ssh root@YOUR_VPS_IP
cd /var/www/mohinhcaocap
chmod +x setup-cicd.sh
sudo ./setup-cicd.sh
```

### Bước 2: Cấu hình GitHub Repository
1. **Thêm SSH Key** (sẽ được tạo tự động):
   - Copy SSH public key từ VPS
   - Thêm vào GitHub repo → Settings → Deploy keys

2. **Tạo GitHub Secrets** (cho GitHub Actions):
   - `VPS_HOST`: IP address VPS
   - `VPS_USERNAME`: username SSH
   - `VPS_SSH_KEY`: private SSH key
   - `VPS_PORT`: port SSH (thường là 22)

3. **Setup Webhook** (cho instant deploy):
   - URL: `https://mohinhcaocap.wavestore.id.vn/webhook`
   - Content type: `application/json`
   - Secret: `your-webhook-secret`
   - Events: `Just the push event`

### Bước 3: Test CI/CD
```bash
# Test commit
git add .
git commit -m "test: CI/CD setup"
git push origin main
```

## 🎯 Hai phương thức deploy

### 1. GitHub Actions (Recommended)
- ✅ Chạy tests trước khi deploy
- ✅ Deploy chỉ khi push lên main/master
- ✅ Log đầy đủ trên GitHub
- ⏱️ Delay: 1-2 phút

### 2. Webhook (Instant)
- ✅ Deploy ngay lập tức
- ✅ Không cần GitHub Actions
- ✅ Lightweight
- ⏱️ Delay: 10-30 giây

## 📊 Monitoring & Logs

### Kiểm tra trạng thái
```bash
# Trên VPS
./check-deployment.sh

# Hoặc
pm2 status
pm2 logs
tail -f /var/log/webhook-deploy.log
```

### Health checks
- API: `https://mohinhcaocap.wavestore.id.vn/api/health`
- Webhook: `https://mohinhcaocap.wavestore.id.vn/webhook/health`

## 🔒 Security

### SSH Key Setup
```bash
# Trên VPS (sẽ được tạo tự động)
ssh-keygen -t rsa -b 4096 -C "deploy@mohinhcaocap.vn"
cat ~/.ssh/id_rsa.pub  # Copy này vào GitHub
```

### Webhook Secret
- Tạo secret key mạnh
- Cập nhật trong `ecosystem.config.js`
- Sử dụng cùng secret trong GitHub webhook

## 🚨 Troubleshooting

### Lỗi thường gặp:
1. **SSH connection failed**: Kiểm tra IP, port, username
2. **Git pull failed**: Kiểm tra SSH key trong GitHub
3. **PM2 restart failed**: Kiểm tra process name và permissions
4. **Nginx reload failed**: Kiểm tra syntax config file
5. **Webhook not triggered**: Kiểm tra URL và secret

### Debug commands:
```bash
# Kiểm tra SSH connection
ssh -T git@github.com

# Test webhook manually
curl -X POST https://mohinhcaocap.wavestore.id.vn/webhook \
  -H "Content-Type: application/json" \
  -d '{"test": true}'

# Check processes
pm2 status
systemctl status nginx
```

---

## ✅ Checklist Setup

- [ ] Cung cấp thông tin VPS (IP, username, port)
- [ ] Xác nhận đường dẫn project trên VPS
- [ ] Chạy `setup-cicd.sh` trên VPS
- [ ] Thêm SSH key vào GitHub
- [ ] Tạo GitHub Secrets (nếu dùng Actions)
- [ ] Setup GitHub Webhook (nếu dùng webhook)
- [ ] Test deploy với commit
- [ ] Kiểm tra logs và monitoring

**Hãy cung cấp thông tin VPS để tôi có thể tùy chỉnh config cho phù hợp!**