# Garde - Deployment Guide

Deploy your full-stack Garde app to production!

## Option 1: Railway.app (Recommended - Easiest)

Railway is the easiest way to deploy both backend and PostgreSQL.

### Backend Deployment

1. **Sign up** at https://railway.app
2. **Click "New Project"**
3. **Deploy from GitHub**:
   - Connect GitHub account
   - Select `spalombo101-alt/Garde` repository
   - Railway auto-detects it's a monorepo

4. **Create PostgreSQL plugin**:
   - Click "Add Service" → PostgreSQL
   - Railway creates the database automatically

5. **Configure Backend**:
   - Go to Backend service settings
   - Set root directory: `backend`
   - Set start command: `npm run build && npm start`
   - Add environment variables:
     ```
     DATABASE_URL=<auto-populated from PostgreSQL>
     JWT_SECRET=<generate-strong-secret>
     NODE_ENV=production
     CORS_ORIGIN=<your-frontend-url>
     ```

6. **Deploy**:
   - Railway auto-deploys on every push to `master`
   - Get backend URL from service details
   - Update `EXPO_PUBLIC_API_URL` in frontend

### Frontend Deployment (Web)

Deploy web version to Vercel:

1. **Go to** https://vercel.com
2. **Import Project** → Select Garde repo
3. **Framework**: Expo (or Node.js)
4. **Environment Variables**:
   ```
   EXPO_PUBLIC_API_URL=<your-railway-backend-url>
   ```
5. **Deploy** → Get web URL

**For iOS/Android**: Use Expo EAS (see below)

---

## Option 2: Docker + Self-Hosted

### Local Testing with Docker

```bash
# Build and run everything locally
docker-compose up

# Backend: http://localhost:3000
# PostgreSQL: localhost:5432
```

### Deploy to Your Server

```bash
# 1. SSH into your server
ssh user@your-server.com

# 2. Clone repository
git clone https://github.com/spalombo101-alt/Garde.git
cd Garde

# 3. Setup environment
cp backend/.env.example backend/.env
# Edit backend/.env with your secrets

# 4. Run with Docker Compose
docker-compose up -d

# 5. Setup domain (optional)
# Point your domain to your server's IP
# Use nginx as reverse proxy
```

---

## Option 3: Heroku (Legacy but still works)

```bash
# Install Heroku CLI
npm install -g heroku

# Login
heroku login

# Create app
heroku create garde-backend

# Add PostgreSQL
heroku addons:create heroku-postgresql:hobby-dev -a garde-backend

# Set environment variables
heroku config:set JWT_SECRET=your-secret -a garde-backend
heroku config:set CORS_ORIGIN=your-frontend-url -a garde-backend

# Deploy
git push heroku master
```

---

## Mobile App Deployment

### iOS & Android with Expo EAS

```bash
npm install -g eas-cli
cd Garde

# Login to Expo
eas login

# Build iOS
eas build --platform ios

# Build Android
eas build --platform android

# Submit to stores
eas submit -p ios  # App Store
eas submit -p android  # Google Play
```

### Prepare for App Stores

**iOS App Store**:
- Need Apple Developer account ($99/year)
- Create App ID
- Generate provisioning profiles
- Upload build via Transporter

**Google Play**:
- Need Google Play Developer account ($25 one-time)
- Create app listing
- Upload signed APK/AAB
- Fill store listing details

---

## Production Checklist

### Backend
- [ ] Set strong `JWT_SECRET`
- [ ] Set `NODE_ENV=production`
- [ ] Enable CORS for your frontend domain only
- [ ] Setup database backups
- [ ] Enable SSL/HTTPS
- [ ] Setup error logging (e.g., Sentry)
- [ ] Add rate limiting
- [ ] Enable GZIP compression

### Frontend
- [ ] Update API URL to production backend
- [ ] Test all features
- [ ] Setup analytics (optional)
- [ ] Configure app icons and splash screens
- [ ] Test on real devices

### Database
- [ ] Backup PostgreSQL regularly
- [ ] Enable database encryption
- [ ] Setup connection pooling
- [ ] Monitor query performance
- [ ] Regular maintenance (VACUUM, ANALYZE)

---

## Environment Variables

### Backend (.env)
```
DATABASE_URL=postgresql://user:pass@host:5432/garde_db
JWT_SECRET=long-random-string-minimum-32-chars
NODE_ENV=production
PORT=3000
CORS_ORIGIN=https://your-frontend.com
```

### Frontend (.env / .env.production)
```
EXPO_PUBLIC_API_URL=https://your-backend.railway.app
EXPO_PUBLIC_ENV=production
```

---

## Monitoring & Maintenance

### Logs
- **Railway**: View in dashboard
- **Docker**: `docker logs <container-id>`
- **Heroku**: `heroku logs --tail`

### Performance
- Monitor database query performance
- Setup uptime monitoring (Uptimerobot)
- Monitor API response times
- Track error rates

### Security
- Rotate JWT_SECRET regularly
- Keep dependencies updated (`npm audit fix`)
- Monitor for vulnerabilities
- Setup WAF (Web Application Firewall)

---

## Troubleshooting Deployments

**Database connection fails**
- Verify DATABASE_URL is correct
- Check database is accessible from server
- Verify credentials are correct

**CORS errors**
- Update CORS_ORIGIN to match frontend URL
- Check backend logs for blocked requests

**Frontend can't reach API**
- Verify EXPO_PUBLIC_API_URL is correct
- Check backend is running and healthy
- Check network connectivity

**Build failures**
- Check build logs
- Verify all dependencies installed
- Check Node version compatibility

---

## Cost Estimates

| Service | Cost | Notes |
|---------|------|-------|
| Railway PostgreSQL | $0-10/month | Free tier available |
| Railway Backend | $0-10/month | Free tier available |
| Vercel Frontend | $0-20/month | Free tier available |
| Domain | $10-15/year | Optional |
| **Total** | **$10-50/month** | Starting cost |

---

## Quick Deploy Commands

```bash
# Railway (after setup)
git push origin master  # Auto-deploys

# Docker local
docker-compose up -d

# Heroku
git push heroku master

# EAS build
eas build --platform ios --platform android
```

---

## Next Steps

1. Choose deployment platform (Railway recommended)
2. Setup database
3. Deploy backend
4. Deploy frontend
5. Test in production
6. Monitor and maintain

**Good luck shipping! 🚀**
