#!/bin/bash

# Deploy Script for Mô Hình Cao Cấp
# Usage: bash deploy.sh

echo "🚀 Starting deployment..."

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Log function
log_message() {
    echo -e "${BLUE}[$(date '+%Y-%m-%d %H:%M:%S')]${NC} $1"
}

# Check if running on server
if [ ! -d "/var/www/mohinhcaocap" ]; then
    echo -e "${RED}❌ Error: Not running on server. Please run this on your production server.${NC}"
    exit 1
fi

# Navigate to project directory
cd /var/www/mohinhcaocap

log_message "📁 Current directory: $(pwd)"

# Backup current version (optional)
log_message "� Creating backup..."
BACKUP_DIR="/var/backups/mohinhcaocap-$(date +%Y%m%d-%H%M%S)"
mkdir -p /var/backups
cp -r /var/www/mohinhcaocap $BACKUP_DIR
log_message "✅ Backup created: $BACKUP_DIR"

# Pull latest code
log_message "📥 Pulling latest code from Git..."
git fetch origin
git reset --hard origin/master

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Git pull failed!${NC}"
    exit 1
fi

log_message "✅ Code updated successfully"

# Install backend dependencies
log_message "� Installing backend dependencies..."
cd backend
npm install --production

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ npm install failed!${NC}"
    exit 1
fi

log_message "✅ Dependencies installed"

# Create uploads directory if not exists
if [ ! -d "uploads" ]; then
    log_message "� Creating uploads directory..."
    mkdir -p uploads
    chmod 755 uploads
fi

# Set proper permissions
log_message "🔒 Setting file permissions..."
chown -R www-data:www-data /var/www/mohinhcaocap
chmod -R 755 /var/www/mohinhcaocap

# Restart PM2 process
log_message "🔄 Restarting backend..."
pm2 restart mohinhcaocap-api

if [ $? -ne 0 ]; then
    log_message "⚠️ PM2 restart failed, trying to start..."
    pm2 start server.js --name mohinhcaocap-api
    
    if [ $? -ne 0 ]; then
        echo -e "${RED}❌ Failed to start backend service!${NC}"
        exit 1
    fi
fi

log_message "✅ Backend restarted"

# Update Nginx configuration
log_message "� Upd ating Nginx configuration..."
cd ..
sudo cp nginx/mohinhcaocap.conf /etc/nginx/sites-available/mohinhcaocap.conf

# Test Nginx configuration
log_message "🔍 Testing Nginx configuration..."
sudo nginx -t

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Nginx configuration test failed!${NC}"
    exit 1
fi

# Reload Nginx
log_message "🔄 Reloading Nginx..."
sudo systemctl reload nginx

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Nginx reload failed!${NC}"
    exit 1
fi

log_message "✅ Nginx updated"

# Clear any caches (if applicable)
log_message "🧹 Clearing caches..."
# Add cache clearing commands here if needed

# Health check
log_message "🏥 Running health check..."
sleep 5

# Check if API is responding
API_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:5000/api/health)
if [ "$API_STATUS" = "200" ]; then
    log_message "✅ API health check passed"
else
    echo -e "${YELLOW}⚠️ API health check failed (Status: $API_STATUS)${NC}"
fi

# Show final status
echo ""
echo -e "${GREEN}🎉 Deployment completed successfully!${NC}"
echo ""
echo "📊 System Status:"
echo "=================="

echo ""
echo "🔧 Backend Status:"
pm2 status mohinhcaocap-api

echo ""
echo "🌐 Nginx Status:"
sudo systemctl status nginx --no-pager | head -n 5

echo ""
echo "💾 Latest Backup:"
echo "$BACKUP_DIR"

echo ""
echo -e "${GREEN}🌍 Website is live at: https://figurekoreashop.com${NC}"
echo -e "${BLUE}📊 Monitor logs: pm2 logs mohinhcaocap-api${NC}"

# Log deployment completion
echo "[$(date '+%Y-%m-%d %H:%M:%S')] ✅ Deployment completed successfully" >> /var/log/deployment.log
