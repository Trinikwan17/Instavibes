#!/bin/bash
# Description: Builds the React application and deploys it to an S3 bucket

set -e

echo "Starting Frontend Build and Deployment..."

if [ -z "$S3_BUCKET_NAME" ]; then
  echo "Error: Please set S3_BUCKET_NAME environment variable."
  echo "Usage: S3_BUCKET_NAME=your-bucket-name ./deploy/deploy_frontend.sh"
  exit 1
fi

echo "Installing frontend dependencies..."
cd frontend/my-app
npm install

echo "Building frontend project..."
npm run build

echo "Syncing build artifacts to S3..."
aws s3 sync dist/ s3://$S3_BUCKET_NAME/ --delete

echo "Frontend deployment to S3 completed successfully!"
