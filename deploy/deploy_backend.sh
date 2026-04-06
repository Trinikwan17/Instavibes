#!/bin/bash
# Description: Automates the setup of the EC2 instance for InstaVibe Backend

set -e

echo "Starting Backend Environment Setup..."

# Update and install Node.js (v20) and npm
sudo apt-get update -y
sudo apt-get install -y ca-certificates curl gnupg
sudo mkdir -p /etc/apt/keyrings
curl -fsSL https://deb.nodesource.com/gpgkey/nodesource-repo.gpg.key | sudo gpg --dearmor -o /etc/apt/keyrings/nodesource.gpg
echo "deb [signed-by=/etc/apt/keyrings/nodesource.gpg] https://deb.nodesource.com/node_20.x nodistro main" | sudo tee /etc/apt/sources.list.d/nodesource.list
sudo apt-get update -y
sudo apt-get install -y nodejs

# Install PM2 globally
sudo npm install -g pm2

# Assume we are in the project root directory
echo "Installing backend dependencies..."
cd backend
npm install

# Return to root and run from deploy directory
cd ..
echo "Starting application with PM2..."
pm2 start deploy/ecosystem.config.js --env production

# Setup PM2 to restart on crash/reboot
pm2 save
sudo env PATH=$PATH:/usr/bin /usr/lib/node_modules/pm2/bin/pm2 startup systemd -u $USER --hp /home/$USER

echo "Backend deployment completed successfully!"
echo "Make sure your EC2 Security Group allows inbound traffic on port 3000."
