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
        PORT: 5000,
        ENVIRONMENT: 'production'
      },
      error_file: '/var/log/mohinhcaocap-api-error.log',
      out_file: '/var/log/mohinhcaocap-api-out.log',
      log_file: '/var/log/mohinhcaocap-api.log',
      time: true,
      watch: false,
      max_restarts: 10,
      min_uptime: '10s',
      restart_delay: 1000
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
        WEBHOOK_SECRET: 'FigureKoreaShop-Webhook-Secret-2024-ChangeMePlease'
      },
      error_file: '/var/log/webhook-deploy-error.log',
      out_file: '/var/log/webhook-deploy-out.log',
      log_file: '/var/log/webhook-deploy.log',
      time: true,
      watch: false,
      max_restarts: 5,
      min_uptime: '10s',
      restart_delay: 2000
    }
  ]
};