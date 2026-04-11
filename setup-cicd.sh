#!/bin/bash

# Setup CI/CD for Mô Hình Cao Cấp
# Run this script on your VPS to setup automatic deployment

echo "🔧 Setting up CI/CD for Mô Hình Cao Cấp..."

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if running as root or with sudo
if [ "$EUID" -ne 0 ]; then
    echo -e "${RED}❌ Please run this script with sudo${NC}"
    exit 1
fi

# Project directory
PROJECT_DIR="/var/www/mohinhcaocap"

echo -e "${BLUE}📁 Project directory: $PROJECT_DIR${NC}"

# Check if project directory exists
if [ ! -d "$PROJECT_DIR" ]; then
    echo -e "${RED}❌ Project directory not found: $PROJECT_DIR${NC}"
    echo -e "${YELLOW}💡 Please ensure your project is cloned to $PROJECT_DIR${NC}"
    exit 1
fi

cd $PROJECT_DIR

# Install PM2 globally if not installed
echo -e "${YELLOW}📦 Checking PM2 installation...${NC}"
if ! command -v pm2 &> /dev/null; then
    echo -e "${YELLOW}📦 Installing PM2...${NC}"
    npm install -g pm2
else
    echo -e "${GREEN}✅ PM2 already installed${NC}"
fi

# Create PM2 ecosystem file
echo -e "${YELLOW}⚙️ Creating PM2 ecosystem file...${NC}"
cat > ecosystem.config.js << 'EOF'
module.exports = {
  apps: [
    {
      name: 'mohinhcaocap-api',
      script: './backend/server.js',
      cwd: '/var/www/mohinhcaocap',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production',
        PORT: 5000
      },
      error_file: '/var/log/mohinhcaocap-api-error.log',
      out_file: '/var/log/mohinhcaocap-api-out.log',
      log_file: '/var/log/mohinhcaocap-api.log',
      time: true,
      watch: false,
      max_restarts: 10,
      min_uptime: '10s'
    },
    {
      name: 'webhook-deploy',
      script: './webhook-deploy.js',
      cwd: '/var/www/mohinhcaocap',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production',
        WEBHOOK_PORT: 3001,
        WEBHOOK_SECRET: 'change-this-secret-key'
      },
      error_file: '/var/log/webhook-deploy-error.log',
      out_file: '/var/log/webhook-deploy-out.log',
      log_file: '/var/log/webhook-deploy.log',
      time: true,
      watch: false
    }
  ]
};
EOF

# Install webhook dependencies
echo -e "${YELLOW}📦 Installing webhook dependencies...${NC}"
npm install express crypto

# Create log directory
echo -e "${YELLOW}📁 Creating log directory...${NC}"
mkdir -p /var/log
touch /var/log/webhook-deploy.log
chmod 644 /var/log/webhook-deploy.log

# Start/restart PM2 processes
echo -e "${YELLOW}🚀 Starting PM2 processes...${NC}"
pm2 delete all 2>/dev/null || true
pm2 start ecosystem.config.js

# Save PM2 configuration
echo -e "${YELLOW}💾 Saving PM2 configuration...${NC}"
pm2 save
pm2 startup

# Update Nginx configuration for webhook
echo -e "${YELLOW}🌐 Updating Nginx configuration...${NC}"
NGINX_CONFIG="/etc/nginx/sites-available/mohinhcaocap.conf"

# Backup existing config
cp $NGINX_CONFIG ${NGINX_CONFIG}.backup

# Add webhook location to Nginx config
if ! grep -q "location /webhook" $NGINX_CONFIG; then
    # Insert webhook location before the main location block
    sed -i '/location \/ {/i\
    # Webhook endpoint for auto-deployment\
    location /webhook {\
        proxy_pass http://localhost:3001;\
        proxy_http_version 1.1;\
        proxy_set_header Upgrade $http_upgrade;\
        proxy_set_header Connection "upgrade";\
        proxy_set_header Host $host;\
        proxy_set_header X-Real-IP $remote_addr;\
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;\
        proxy_set_header X-Forwarded-Proto $scheme;\
        proxy_cache_bypass $http_upgrade;\
    }\
' $NGINX_CONFIG
fi

# Test and reload Nginx
echo -e "${YELLOW}🔍 Testing Nginx configuration...${NC}"
nginx -t

if [ $? -eq 0 ]; then
    echo -e "${YELLOW}🔄 Reloading Nginx...${NC}"
    systemctl reload nginx
    echo -e "${GREEN}✅ Nginx configuration updated${NC}"
else
    echo -e "${RED}❌ Nginx configuration test failed${NC}"
    echo -e "${YELLOW}🔄 Restoring backup...${NC}"
    cp ${NGINX_CONFIG}.backup $NGINX_CONFIG
    exit 1
fi

# Create deployment status script
echo -e "${YELLOW}📊 Creating deployment status script...${NC}"
cat > check-deployment.sh << 'EOF'
#!/bin/bash
echo "📊 Deployment Status Check"
echo "=========================="
echo ""
echo "🔧 PM2 Processes:"
pm2 status
echo ""
echo "📋 Recent Webhook Logs:"
tail -n 10 /var/log/webhook-deploy.log
echo ""
echo "🌐 Nginx Status:"
systemctl status nginx --no-pager | head -n 5
echo ""
echo "🔗 Webhook URL: https://figurekoreashop.com/webhook"
EOF

chmod +x check-deployment.sh

# Generate SSH key for GitHub (if not exists)
echo -e "${YELLOW}🔑 Checking SSH key for GitHub...${NC}"
if [ ! -f ~/.ssh/id_rsa ]; then
    echo -e "${YELLOW}🔑 Generating SSH key...${NC}"
    ssh-keygen -t rsa -b 4096 -C "server@mohinhcaocap.vn" -f ~/.ssh/id_rsa -N ""
    echo -e "${BLUE}📋 Add this public key to your GitHub repository:${NC}"
    cat ~/.ssh/id_rsa.pub
    echo ""
else
    echo -e "${GREEN}✅ SSH key already exists${NC}"
fi

# Final instructions
echo ""
echo -e "${GREEN}🎉 CI/CD Setup Complete!${NC}"
echo ""
echo -e "${BLUE}📋 Next Steps:${NC}"
echo "1. Add SSH key to GitHub (if not done already)"
echo "2. Set up GitHub webhook:"
echo "   - Go to your GitHub repo → Settings → Webhooks"
echo "   - Add webhook URL: https://figurekoreashop.com/webhook"
echo "   - Content type: application/json"
echo "   - Secret: change-this-secret-key (update in ecosystem.config.js)"
echo "   - Events: Just the push event"
echo ""
echo "3. Update webhook secret in ecosystem.config.js"
echo "4. Restart webhook service: pm2 restart webhook-deploy"
echo ""
echo -e "${BLUE}🔍 Useful Commands:${NC}"
echo "- Check status: ./check-deployment.sh"
echo "- View logs: pm2 logs"
echo "- Restart services: pm2 restart all"
echo "- Manual deploy: bash deploy.sh"
echo ""
echo -e "${GREEN}✅ Your website will now auto-update when you push to GitHub!${NC}"