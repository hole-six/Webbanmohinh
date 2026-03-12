#!/bin/bash

# Deploy Script for Mô Hình Cao Cấp
# Usage: bash deploy.sh

echo "🚀 Starting deployment..."

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if running on server
if [ ! -d "/var/www/mohinhcaocap" ]; then
    echo -e "${RED}❌ Error: Not running on server. Please run this on your production server.${NC}"
    exit 1
fi

# Navigate to project directory
cd /var/www/mohinhcaocap

# Pull latest code
echo -e "${YELLOW}📥 Pulling latest code from Git...${NC}"
git pull origin main

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Git pull failed!${NC}"
    exit 1
fi

# Install backend dependencies
echo -e "${YELLOW}📦 Installing backend dependencies...${NC}"
cd backend
npm install --production

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ npm install failed!${NC}"
    exit 1
fi

# Create uploads directory if not exists
if [ ! -d "uploads" ]; then
    echo -e "${YELLOW}📁 Creating uploads directory...${NC}"
    mkdir -p uploads
    chmod 755 uploads
fi

# Restart PM2 process
echo -e "${YELLOW}🔄 Restarting backend...${NC}"
pm2 restart mohinhcaocap-api

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ PM2 restart failed!${NC}"
    exit 1
fi

# Reload Nginx configuration
echo -e "${YELLOW}🌐 Updating Nginx configuration...${NC}"
sudo cp nginx/mohinhcaocap.conf /etc/nginx/sites-available/mohinhcaocap.conf

# Test Nginx configuration
echo -e "${YELLOW}🔍 Testing Nginx configuration...${NC}"
sudo nginx -t

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Nginx configuration test failed!${NC}"
    exit 1
fi

# Reload Nginx
echo -e "${YELLOW}🔄 Reloading Nginx...${NC}"
sudo systemctl reload nginx

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Nginx reload failed!${NC}"
    exit 1
fi

# Show status
echo -e "${GREEN}✅ Deployment completed successfully!${NC}"
echo ""
echo "📊 Backend Status:"
pm2 status mohinhcaocap-api

echo ""
echo "🌐 Nginx Status:"
sudo systemctl status nginx --no-pager | head -n 5

echo ""
echo -e "${GREEN}🎉 Website is live at: https://mohinhcaocap.vn${NC}"
