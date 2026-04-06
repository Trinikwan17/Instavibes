module.exports = {
  apps: [{
    name: 'instavibe-backend',
    script: 'index.js',
    cwd: '../backend',
    env: {
      NODE_ENV: 'development'
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: 3000
    }
  }]
};
