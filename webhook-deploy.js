const express = require('express');
const { exec } = require('child_process');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.WEBHOOK_PORT || 3001;

// GitHub webhook secret (set this in your GitHub repo settings)
const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET || 'your-webhook-secret-here';

// Middleware
app.use(express.json());

// Verify GitHub webhook signature
function verifySignature(payload, signature) {
    const hmac = crypto.createHmac('sha256', WEBHOOK_SECRET);
    const digest = 'sha256=' + hmac.update(payload).digest('hex');
    return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(digest));
}

// Log deployment activity
function logDeployment(message) {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] ${message}\n`;
    
    console.log(logMessage.trim());
    
    // Also write to log file
    fs.appendFileSync('/var/log/webhook-deploy.log', logMessage);
}

// Execute deployment script
function runDeployment() {
    return new Promise((resolve, reject) => {
        logDeployment('🚀 Starting deployment...');
        
        const deployScript = path.join(__dirname, 'deploy.sh');
        
        exec(`bash ${deployScript}`, (error, stdout, stderr) => {
            if (error) {
                logDeployment(`❌ Deployment failed: ${error.message}`);
                reject(error);
                return;
            }
            
            if (stderr) {
                logDeployment(`⚠️ Deployment warnings: ${stderr}`);
            }
            
            logDeployment(`✅ Deployment completed successfully`);
            logDeployment(`📋 Output: ${stdout}`);
            resolve(stdout);
        });
    });
}

// Webhook endpoint
app.post('/webhook', async (req, res) => {
    try {
        const signature = req.headers['x-hub-signature-256'];
        const payload = JSON.stringify(req.body);
        
        // Verify webhook signature
        if (!verifySignature(payload, signature)) {
            logDeployment('❌ Invalid webhook signature');
            return res.status(401).json({ error: 'Invalid signature' });
        }
        
        const event = req.headers['x-github-event'];
        const { ref, repository, commits } = req.body;
        
        logDeployment(`📨 Received ${event} event from ${repository?.name}`);
        
        // Only deploy on push to master branch
        if (event === 'push' && ref === 'refs/heads/master') {
            logDeployment(`📥 Push to ${ref} detected`);
            logDeployment(`📝 Commits: ${commits?.length || 0}`);
            
            try {
                await runDeployment();
                res.json({ 
                    success: true, 
                    message: 'Deployment completed successfully',
                    timestamp: new Date().toISOString()
                });
            } catch (error) {
                res.status(500).json({ 
                    success: false, 
                    message: 'Deployment failed',
                    error: error.message 
                });
            }
        } else {
            logDeployment(`⏭️ Skipping deployment for ${event} on ${ref}`);
            res.json({ 
                success: true, 
                message: 'Event ignored - not a push to master',
                event,
                ref 
            });
        }
        
    } catch (error) {
        logDeployment(`❌ Webhook error: ${error.message}`);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        service: 'Webhook Deploy Service',
        timestamp: new Date().toISOString()
    });
});

// Status endpoint
app.get('/status', (req, res) => {
    try {
        const logFile = '/var/log/webhook-deploy.log';
        const logs = fs.existsSync(logFile) 
            ? fs.readFileSync(logFile, 'utf8').split('\n').slice(-10).join('\n')
            : 'No logs available';
            
        res.json({
            status: 'Running',
            port: PORT,
            lastLogs: logs
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Start server
app.listen(PORT, () => {
    logDeployment(`🎯 Webhook deploy service started on port ${PORT}`);
    logDeployment(`📍 Webhook URL: http://your-server.com:${PORT}/webhook`);
    logDeployment(`🔍 Health check: http://your-server.com:${PORT}/health`);
});

// Handle graceful shutdown
process.on('SIGTERM', () => {
    logDeployment('🛑 Webhook service shutting down...');
    process.exit(0);
});

process.on('SIGINT', () => {
    logDeployment('🛑 Webhook service shutting down...');
    process.exit(0);
});