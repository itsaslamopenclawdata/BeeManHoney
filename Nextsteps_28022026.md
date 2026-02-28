# NextSteps_28022026 - BeeManHoney Go-Live Deployment Plan (DETAILED)

**Date:** February 28, 2026  
**Project:** BeeManHoney E-commerce Platform  
**Goal:** Make application live for production deployment

---

# TABLE OF CONTENTS
1. [Prerequisites Checklist](#prerequisites-checklist)
2. [Phase 1: Environment Setup](#phase-1-environment-setup)
3. [Phase 2: Server Provisioning](#phase-2-server-provisioning)
4. [Phase 3: Docker Installation](#phase-3-docker-installation)
5. [Phase 4: Database Setup](#phase-4-database-setup)
6. [Phase 5: Application Deployment](#phase-5-application-deployment)
7. [Phase 6: Domain & SSL](#phase-6-domain--ssl)
8. [Phase 7: Testing](#phase-7-testing)
9. [Phase 8: Go-Live](#phase-8-go-live)

---

# PREREQUISITES CHECKLIST

Before starting, ensure you have:

| Item | Description | Where to Get |
|------|-------------|--------------|
| GitHub Account | Access to BeeManHoney repo | github.com |
| Server (VPS) | Ubuntu 22.04 LTS server | AWS/DigitalOcean/Linode/etc |
| Domain Name | For your website | Namecheap/GoDaddy/etc |
| Email Account | For SMTP (notifications) | Gmail or any SMTP provider |

---

# PHASE 1: ENVIRONMENT SETUP

## Step 1.1: Generate All Required Keys

### 1.1.1 Generate JWT_SECRET (Required)

**What is this?** A secure key used to sign JWT tokens for authentication.

```bash
# Run this command to generate a secure 256-bit key:
openssl rand -base64 32
```

**Example output:** `aB3cD9eF4gH6iJ0kL2mN4oP6qR8sT0uV2wX4yZ6aB8cD0eF2gH4iJ6kL`

**Save this key** - you'll need it for JWT_SECRET

### 1.1.2 Generate Database Password (Required)

```bash
# Generate a strong database password:
openssl rand -base64 16
```

**Example output:** `M2wX9yK5rT7uP3nL`

### 1.1.3 Get Gmail App Password (For SMTP)

**Follow these steps:**

1. Go to https://myaccount.google.com/
2. Click **Security** (left sidebar)
3. Enable **2-Step Verification** if not already enabled
4. Go to https://myaccount.google.com/apppasswords
5. Select **App** = Mail, **Device** = Other (custom name)
6. Click **Generate**
7. Copy the 16-character password (format: `xxxx xxxx xxxx xxxx`)

**Remove spaces** when using as SMTP_PASS

### 1.1.4 Get OpenAI API Key (Optional - for AI features)

1. Go to https://platform.openai.com/api-keys
2. Click **Create new secret key**
3. Copy the key (starts with `sk-`)
4. **Warning:** This key is shown only once!

### 1.1.5 Get Razorpay Keys (Optional - for payments)

1. Go to https://dashboard.razorpay.com/app/keys
2. Copy **Key Id** (starts with `rzp_test_` or `rzp_live_`)
3. Copy **Key Secret** (for live mode only)

---

## Step 1.2: Create .env File

### 1.2.1 Backend Environment File

Navigate to your server or local machine:

```bash
cd BeeManHoney/backend
cp .env.example .env
nano .env
```

**Edit the .env file with your values:**

```env
# ===========================================
# DATABASE CONFIGURATION
# ===========================================
# Format: postgresql+asyncpg://username:password@host:port/database_name
# For local Docker: postgresql+asyncpg://admin:secret@db:5432/beemanhoney
# For production: postgresql+asyncpg://admin:M2wX9yK5rT7uP3nL@your-server-ip:5432/beemanhoney
DATABASE_URL=postgresql+asyncpg://admin:secret@db:5432/beemanhoney

# ===========================================
# REDIS CONFIGURATION
# ===========================================
# For Docker: redis://redis:6379/0
# For production: redis://your-server-ip:6379/0
REDIS_URL=redis://redis:6379/0

# ===========================================
# JWT AUTHENTICATION
# ===========================================
# Use the key you generated in Step 1.1.1
JWT_SECRET=aB3cD9eF4gH6iJ0kL2mN4oP6qR8sT0uV2wX4yZ6aB8cD0eF2gH4iJ6kL

# JWT token expiration (in minutes)
JWT_ACCESS_TOKEN_EXPIRE_MINUTES=30

# ===========================================
# OPENAI CONFIGURATION (Optional)
# ===========================================
OPENAI_API_KEY=sk-your-key-here

# ===========================================
# SMTP EMAIL CONFIGURATION
# ===========================================
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=xxxx xxxx xxxx xxxx

# ===========================================
# APPLICATION SETTINGS
# ===========================================
DEBUG=False
ALLOWED_HOSTS=localhost,yourdomain.com,www.yourdomain.com
CORS_ORIGINS=http://localhost:3000,https://yourdomain.com
```

### 1.2.2 Frontend Environment File

```bash
cd BeeManHoney/frontend
cp .env.example .env
nano .env
```

**Edit the frontend .env:**

```env
# API Base URL
# For local development:
VITE_API_BASE_URL=http://localhost:8000/api/v1

# For production (replace yourdomain.com):
VITE_API_BASE_URL=https://yourdomain.com/api/v1
```

---

# PHASE 2: SERVER PROVISIONING

## Step 2.1: Provision Server

### Option A: DigitalOcean
1. Go to https://digitalocean.com
2. Create **Droplet**
3. Select: **Ubuntu 22.04 LTS** (Standard droplet)
4. Size: **$20/month** (4GB RAM, 2 CPUs, 80GB SSD)
5. Choose datacenter region (closest to your customers)
6. Add SSH key (optional but recommended)
7. Click **Create Droplet**

### Option B: AWS EC2
1. Go to https://aws.amazon.com/ec2/
2. Click **Launch Instance**
3. Select **Ubuntu Server 22.04 LTS** (Free tier eligible)
4. Instance Type: **t3.small** or larger
5. Configure Security Group:
   - Open ports: 22 (SSH), 80 (HTTP), 443 (HTTPS), 3000, 8000
6. Launch and download key pair

### Option C: Linode
1. Go to https://linode.com
2. Create **Linode**
3. Select **Ubuntu 22.04 LTS**
4. Plan: **Shared CPU - Standard** (4GB RAM)
5. Choose datacenter
6. Click **Create Linode**

## Step 2.2: Connect to Server

```bash
# Replace with your server IP
ssh root@your-server-ip

# If using SSH key:
ssh -i /path/to/key.pem root@your-server-ip
```

## Step 2.3: Update Server

```bash
# Update package lists
apt update

# Upgrade packages
apt upgrade -y

# Install essential tools
apt install -y curl wget git unzip vim
```

---

# PHASE 3: DOCKER INSTALLATION

## Step 3.1: Install Docker

Run these commands on your server:

```bash
# 1. Update apt
apt update

# 2. Install prerequisites
apt install -y ca-certificates curl gnupg lsb-release

# 3. Add Docker GPG key
mkdir -p /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /etc/apt/keyrings/docker.gpg

# 4. Add Docker repository
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null

# 5. Install Docker
apt update
apt install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

# 6. Verify installation
docker --version
docker-compose --version
```

## Step 3.2: Configure Docker (Optional but Recommended)

```bash
# Add current user to docker group (avoid using sudo)
usermod -aG docker $USER

# Enable Docker on boot
systemctl enable docker

# Start Docker
systemctl start docker
```

---

# PHASE 4: DATABASE SETUP

## Step 4.1: Start Database with Docker

```bash
# Create Docker network
docker network create beemanhoney-network

# Start PostgreSQL container
docker run -d \
  --name beemanhoney-db \
  --network beemanhoney-network \
  -e POSTGRES_USER=admin \
  -e POSTGRES_PASSWORD=secret \
  -e POSTGRES_DB=beemanhoney \
  -v postgres_data:/var/lib/postgresql/data \
  -p 5432:5432 \
  ankane/pgvector:v0.5.1

# Verify database is running
docker ps
```

## Step 4.2: Start Redis

```bash
# Start Redis container
docker run -d \
  --name beemanhoney-redis \
  --network beemanhoney-network \
  -v redis_data:/data \
  -p 6379:6379 \
  redis:7-alpine redis-server --save 60 1

# Verify Redis
docker exec beemanhoney-redis redis-cli ping
# Should return: PONG
```

---

# PHASE 5: APPLICATION DEPLOYMENT

## Step 5.1: Clone Repository

```bash
# Clone BeeManHoney
cd /root
git clone https://github.com/itsaslamopenclawdata/BeeManHoney.git
cd BeeManHoney
```

## Step 5.2: Configure Environment

```bash
# Copy and edit backend .env
cp backend/.env.example backend/.env
nano backend/.env

# Copy and edit frontend .env
cp frontend/.env.example frontend/.env
nano frontend/.env
```

**Use the keys you generated in Phase 1!**

## Step 5.3: Build and Start Application

```bash
# Build and start all services
docker-compose up -d --build

# Check status
docker-compose ps

# View logs
docker-compose logs -f api
```

## Step 5.4: Verify Services

```bash
# Check if API is running
curl http://localhost:8000/health

# Expected output: {"status":"ok"}

# Check if Frontend is running
curl http://localhost:3000

# Check database connection
docker exec beemanhoney-api python -c "import asyncio; from app.db.database import async_session; print('DB OK')"
```

---

# PHASE 6: DOMAIN & SSL

## Step 6.1: Point Domain to Server

1. **Buy domain** (if not already):
   - Go to Namecheap/GoDaddy
   - Search for desired domain
   - Purchase

2. **Point to server**:
   - Go to Domain DNS settings
   - Add **A Record**:
     - Host: `@` or `yourdomain.com`
     - Value: `your-server-ip`
   - Add **A Record**:
     - Host: `www`
     - Value: `your-server-ip`

3. **Wait** for DNS propagation (can take up to 24 hours, usually minutes)

**Verify with:**
```bash
# Check DNS
dig yourdomain.com
# or
nslookup yourdomain.com
```

## Step 6.2: Install Nginx & SSL

```bash
# Install Nginx
apt install -y nginx

# Install Certbot
apt install -y certbot python3-certbot-nginx

# Stop Nginx temporarily
systemctl stop nginx

# Get SSL certificate (replace yourdomain.com)
certbot certonly --standalone -d yourdomain.com -d www.yourdomain.com

# If successful, certificate files are at:
# /etc/letsencrypt/live/yourdomain.com/fullchain.pem
# /etc/letsencrypt/live/yourdomain.com/privkey.pem
```

## Step 6.3: Configure Nginx with SSL

```bash
# Create Nginx config
nano /etc/nginx/sites-available/beemanhoney
```

**Paste this configuration:**

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

    # Frontend
    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Backend WebSocket support (if needed)
    location /ws {
        proxy_pass http://localhost:8000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
```

```bash
# Enable the site
ln -s /etc/nginx/sites-available/beemanhoney /etc/nginx/sites-enabled/

# Test Nginx config
nginx -t

# Restart Nginx
systemctl restart nginx
```

## Step 6.4: Auto-renew SSL

```bash
# Test renewal (dry run)
certbot renew --dry-run

# Add to crontab (runs twice daily)
crontab -e

# Add this line:
0 0,12 * * * certbot renew --quiet --deploy-hook "systemctl reload nginx"
```

---

# PHASE 7: TESTING

## Step 7.1: Manual Testing Checklist

Open browser and test each item:

### User Flow Tests
| # | Test | Expected Result | Pass |
|---|------|----------------|------|
| 1 | Visit https://yourdomain.com | Homepage loads | [ ] |
| 2 | Click "Sign Up" | Registration form appears | [ ] |
| 3 | Register with new email | Account created, logged in | [ ] |
| 4 | Click "Login" | Login form appears | [ ] |
| 5 | Login with registered credentials | Redirect to homepage | [ ] |
| 6 | Browse products | Products displayed in grid | [ ] |
| 7 | Click on a product | Product details shown | [ ] |
| 8 | Click "Add to Cart" | Item added, cart count updates | [ ] |
| 9 | Go to Cart | Cart page shows items | [ ] |
| 10 | Update quantity | Total updates | [ ] |
| 11 | Click "Checkout" | Checkout form appears | [ ] |
| 12 | Enter address | Address form validates | [ ] |
| 13 | Select COD payment | Payment selected | [ ] |
| 14 | Place Order | Order confirmed | [ ] |
| 15 | View Order History | Past orders shown | [ ] |

### Admin Flow Tests
| # | Test | Expected Result | Pass |
|---|------|----------------|------|
| 1 | Login as admin | Dashboard loads | [ ] |
| 2 | View all orders | Orders list shown | [ ] |
| 3 | Change order status | Status updates | [ ] |
| 4 | Go to Products | Product list shown | [ ] |
| 5 | Add new product | Product created | [ ] |
| 6 | Edit product | Product updates | [ ] |
| 7 | Mark as featured | Shows on homepage | [ ] |

## Step 7.2: API Testing

```bash
# Test registration
curl -X POST http://localhost:8000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test12345!","full_name":"Test User"}'

# Test login
curl -X POST http://localhost:8000/api/v1/auth/token \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=test@example.com&password=Test12345!"

# Test products
curl http://localhost:8000/api/v1/products

# Test featured products
curl http://localhost:8000/api/v1/products/featured
```

---

# PHASE 8: GO-LIVE

## Step 8.1: Final Checklist

| Item | Description | Status |
|------|-------------|--------|
| ✅ | All tests passed | [ ] |
| ✅ | SSL valid (green lock icon) | [ ] |
| ✅ | Domain resolves correctly | [ ] |
| ✅ | Admin account works | [ ] |
| ✅ | Payments work (if enabled) | [ ] |
| ✅ | Emails sending | [ ] |
| ✅ | Backups configured | [ ] |
| ✅ | Monitoring active | [ ] |

## Step 8.2: Create Admin User (If not exists)

```bash
# Via API
curl -X POST http://localhost:8000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@beemanhoney.com","password":"BeeManHoney@Admin2024!Secure","full_name":"Admin"}'
```

## Step 8.3: Make User Admin (Database)

```bash
# Connect to database
docker exec -it beemanhoney-db psql -U admin -d beemanhoney

# Make user admin
UPDATE users SET is_superuser = true, is_active = true WHERE email = 'admin@beemanhoney.com';

# Exit
\q
```

---

# QUICK REFERENCE COMMANDS

```bash
# Start application
docker-compose up -d

# Stop application
docker-compose down

# View logs
docker-compose logs -f

# Restart API
docker-compose restart api

# View running containers
docker-compose ps

# Access database
docker exec -it beemanhoney-db psql -U admin -d beemanhoney

# Backup database
docker exec beemanhoney-db pg_dump -U admin beemanhoney > backup.sql

# SSL renewal
certbot renew
```

---

# TEST ACCOUNTS

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@beemanhoney.com | BeeManHoney@Admin2024!Secure |
| Test User | test@example.com | Test12345! |

---

# ACCESS URLs

| Service | URL |
|---------|-----|
| Frontend | http://localhost:3000 (local) / https://yourdomain.com (production) |
| Backend API | http://localhost:8000 (local) / https://yourdomain.com/api |
| API Docs | http://localhost:8000/docs |
| pgAdmin | http://localhost:5050 (if configured) |

---

# TROUBLESHOOTING

## Common Issues

### 1. Database Connection Error
```bash
# Check database status
docker logs beemanhoney-db

# Check if database is ready
docker exec beemanhoney-db pg_isready
```

### 2. Port Already in Use
```bash
# Find what's using the port
lsof -i :3000

# Kill the process
kill -9 <PID>
```

### 3. SSL Certificate Error
```bash
# Check certificate status
certbot certificates

# Renew certificate
certbot renew --force-renewal
```

### 4. Docker Permission Denied
```bash
# Add user to docker group
sudo usermod -aG docker $USER

# Log out and log back in
logout
```

---

# DOCUMENT VERSION

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | Feb 28, 2026 | Initial detailed guide |

---

**End of Document**
