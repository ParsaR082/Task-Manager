# Task Manager - Docker Production Setup

A Next.js 14 Task Manager application with NextAuth (Google OAuth), Prisma, and MongoDB, containerized for production deployment.

## Prerequisites

- Ubuntu 22.04+ server
- Domain pointing to your server IP (using `103.75.197.66.sslip.io` for this setup)
- Google Cloud Console project for OAuth

## Quick Start

### 1. Install Docker and Docker Compose

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# Install Docker Compose plugin
sudo apt install docker-compose-plugin

# Logout and login again to apply group changes
```

### 2. Setup DNS

Ensure `103.75.197.66.sslip.io` resolves to your server IP. The `.sslip.io` service automatically resolves to the IP in the subdomain.

### 3. Configure Environment

```bash
# Clone your repository
git clone <your-repo-url>
cd task-manager

# Create environment file
cp .env.example .env

# Edit environment variables
nano .env
```

Required environment variables:
```bash
DATABASE_URL="mongodb://mongo:27017/taskmanager?directConnection=true"
NEXTAUTH_URL="https://103.75.197.66.sslip.io"
NEXTAUTH_SECRET="$(openssl rand -base64 32)"
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
CADDY_EMAIL="your-email@example.com"
CADDY_DOMAIN="103.75.197.66.sslip.io"
```

### 4. Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client IDs"
5. Configure OAuth consent screen
6. Set application type to "Web application"
7. Add authorized origins and redirect URIs:

**Authorized JavaScript origins:**
```
https://103.75.197.66.sslip.io
```

**Authorized redirect URIs:**
```
https://103.75.197.66.sslip.io/api/auth/callback/google
```

### 5. Initialize Database (if needed)

```bash
# Generate Prisma client and push schema
docker compose run --rm web npx prisma db push
```

### 6. Start Application

```bash
# Build and start all services
docker compose up -d --build

# Check status
docker compose ps

# View logs
docker compose logs -f
```

### 7. Verify Deployment

- Application: https://103.75.197.66.sslip.io
- Health check: https://103.75.197.66.sslip.io/api/health
- Google OAuth: https://103.75.197.66.sslip.io/api/auth/signin

## Alternative: Nginx Setup

If you prefer Nginx over Caddy:

### 1. Use Nginx Compose File

```bash
# Use the Nginx version
docker compose -f docker-compose.nginx.yml up -d
```

### 2. Set Up SSL with Certbot

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Stop Nginx container temporarily
docker compose -f docker-compose.nginx.yml stop nginx

# Get SSL certificate
sudo certbot certonly --standalone -d your-domain.com

# Create SSL directory and copy certificates
sudo mkdir -p ./ssl
sudo cp /etc/letsencrypt/live/your-domain.com/fullchain.pem ./ssl/
sudo cp /etc/letsencrypt/live/your-domain.com/privkey.pem ./ssl/
sudo chown -R $USER:$USER ./ssl

# Update nginx.conf with your domain
sed -i 's/your-domain.com/YOUR_ACTUAL_DOMAIN/g' nginx.conf

# Restart services
docker compose -f docker-compose.nginx.yml up -d
```

### 3. Auto-renewal Setup

```bash
# Add cron job for certificate renewal
echo "0 12 * * * /usr/bin/certbot renew --quiet && docker compose -f /path/to/your/app/docker-compose.nginx.yml restart nginx" | sudo crontab -
```

## Production Hardening

### Security Considerations

1. **Firewall Configuration**:
```bash
sudo ufw allow ssh
sudo ufw allow 80
sudo ufw allow 443
sudo ufw enable
```

2. **Regular Updates**:
```bash
# Update system packages
sudo apt update && sudo apt upgrade -y

# Update Docker images
docker compose pull
docker compose up -d
```

3. **Monitoring**:
```bash
# Check application health
curl -f https://your-domain.com/api/health

# Monitor logs
docker compose logs -f --tail=100

# Check resource usage
docker stats
```

### Backup Strategy

1. **Database Backup**:
```bash
# Create backup
docker compose exec mongo mongodump --db taskmanager --out /data/backup

# Copy backup to host
docker cp $(docker compose ps -q mongo):/data/backup ./backup-$(date +%Y%m%d)

# Restore backup
docker compose exec mongo mongorestore --db taskmanager /data/backup/taskmanager
```

2. **Automated Backups**:
```bash
# Create backup script
cat > backup.sh << 'EOF'
#!/bin/bash
BACKUP_DIR="/home/$USER/backups"
DATE=$(date +%Y%m%d_%H%M%S)
mkdir -p $BACKUP_DIR

# Backup database
docker compose exec -T mongo mongodump --db taskmanager --archive | gzip > $BACKUP_DIR/mongo_backup_$DATE.gz

# Keep only last 7 days of backups
find $BACKUP_DIR -name "mongo_backup_*.gz" -mtime +7 -delete
EOF

chmod +x backup.sh

# Add to crontab (daily at 2 AM)
echo "0 2 * * * /home/$USER/task-manager/backup.sh" | crontab -
```

## Troubleshooting

### Common Issues

1. **Application won't start**:
```bash
# Check logs
docker compose logs web

# Check environment variables
docker compose config

# Restart services
docker compose restart
```

2. **Database connection issues**:
```bash
# Check MongoDB status
docker compose logs mongo

# Test database connection
docker compose exec web npx prisma db push
```

3. **SSL/HTTPS issues**:
```bash
# Check Caddy logs
docker compose logs caddy

# Verify domain DNS
nslookup your-domain.com

# Test HTTP access
curl -I http://your-domain.com
```

4. **OAuth issues**:
- Verify Google OAuth redirect URIs
- Check NEXTAUTH_URL matches your domain
- Ensure NEXTAUTH_SECRET is set

### Performance Optimization

1. **Resource Limits**:
```yaml
# Add to docker-compose.yml services
deploy:
  resources:
    limits:
      memory: 512M
      cpus: '0.5'
```

2. **Database Optimization**:
```bash
# Create database indexes
docker compose exec web npx prisma db push
```

## Zero-Downtime Updates

```bash
# Pull latest images
docker compose pull

# Recreate containers with new images
docker compose up -d

# Clean up old images
docker image prune -f
```

## Support

For issues and questions:
1. Check application logs: `docker compose logs -f`
2. Verify health endpoint: `https://your-domain.com/api/health`
3. Review this documentation
4. Check GitHub issues

## Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | MongoDB connection string | `mongodb://mongo:27017/taskmanager?directConnection=true` |
| `NEXTAUTH_URL` | Application URL | `https://your-domain.com` |
| `NEXTAUTH_SECRET` | NextAuth secret key | Generate with `openssl rand -base64 32` |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID | From Google Cloud Console |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret | From Google Cloud Console |
| `CADDY_EMAIL` | Email for Let's Encrypt | `admin@your-domain.com` |
| `DOMAIN` | Your domain name | `your-domain.com` |