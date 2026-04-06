# AWS Setup Instructions for InstaVibe

Follow these steps to configure your AWS environment to host the InstaVibe project.

## 1. Backend Setup on EC2

### 1.1 Launch an EC2 Instance
1. Go to the **EC2 Dashboard** -> **Instances** -> **Launch instances**.
2. Select **Ubuntu Server 24.04 LTS** (or 22.04 LTS).
3. Choose an instance type (e.g., `t2.micro` or `t3.micro` for free tier).
4. Create or select an existing Key Pair to access via SSH.

### 1.2 Configure Security Group
1. When configuring the network settings, ensure to:
   - Allow **SSH traffic** from anywhere (or your IP).
   - Add a Custom TCP rule for **Port 3000** (Backend Node.js server port) accessible from anywhere (`0.0.0.0/0`), so the frontend can hit the API.
   - Add a Custom TCP rule for **Port 27017** accessible ONLY via local (`127.0.0.1`) unless using MongoDB Atlas. Alternatively, if MongoDB Atlas is being used, just update `MONGODB_URL` in `.env`.

### 1.3 Deploy Backend
1. SSH into your newly created EC2 instance using your Key Pair.
2. Clone the InstaVibe repository to your server.
3. Make the script executable and run it from the root of the project:
   ```bash
   chmod +x deploy/deploy_backend.sh
   ./deploy/deploy_backend.sh
   ```
4. Put your environment configuration in `backend/.env` copying from `deploy/.env.example`. Restart backend using `pm2 restart instavibe-backend`.

## 2. Frontend Setup on S3

### 2.1 Create an S3 Bucket
1. Navigate to the **S3 Console** -> **Create bucket**.
2. Give your bucket a unique name.
3. Uncheck **"Block all public access"** and acknowledge the warning. This is required for static website hosting.

### 2.2 Configure Bucket Policy and Hosting
1. Go to the **Properties** tab of your bucket -> **Static website hosting** -> Edit -> Enable.
   - Index document: `index.html`
   - Error document: `index.html` (important for React Router fallback navigation).
2. Go to the **Permissions** tab -> **Bucket policy** -> Edit. Paste the following (replace `YOUR_BUCKET_NAME` with your actual bucket name):
```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "PublicReadGetObject",
            "Effect": "Allow",
            "Principal": "*",
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::YOUR_BUCKET_NAME/*"
        }
    ]
}
```

### 2.3 Deploy Frontend
1. On your local machine, setup your environment variables by creating `.env` in `frontend/my-app/.env`:
   ```env
   VITE_API_URL=http://<YOUR_EC2_PUBLIC_IP>:3000
   ```
2. Have the AWS CLI configured using `aws configure`.
3. Run the frontend deployment script from the project root:
   ```bash
   chmod +x deploy/deploy_frontend.sh
   S3_BUCKET_NAME=your-bucket-name ./deploy/deploy_frontend.sh
   ```

## 3. Application URLs 
- **Frontend URL**: Found in the S3 bucket's Properties tab under Static website hosting. Format: `http://your-bucket-name.s3-website.region.amazonaws.com`.
- **Backend URL**: `http://<EC2_PUBLIC_IP>:3000`
