# Love KS - Deployment Guide

## 🚀 Quick Deployment to Render.com

Render is a modern cloud platform with **free tier** that's perfect for this app.

### Step 1: Prepare for Deployment

✅ Files already created:
- `render.yaml` - Deployment configuration
- `.env.example` - Environment template

### Step 2: Push to GitHub

1. Create GitHub account (if not already): https://github.com
2. Create new repository: `love-ks`
3. Push your code:
```bash
git init
git add .
git commit -m "Initial Love KS deployment"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/love-ks.git
git push -u origin main
```

### Step 3: Deploy on Render

1. Go to https://render.com and sign up (free)
2. Click "New +" → "Web Service"
3. Connect your GitHub repository: `love-ks`
4. Fill in deployment settings:
   - **Name**: `love-ks`
   - **Root Directory**: `.` (leave empty)
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free
5. Add environment variables:
   - `NODE_ENV` = production
   - `JWT_SECRET` = (generate a random strong key)
   - `CLIENT_URL` = (your Render URL once deployed)

6. Click "Create Web Service"

### Step 4: Deploy Frontend

1. In Render dashboard, click "New +" → "Static Site"
2. Connect same GitHub repo
3. Fill in:
   - **Name**: `love-ks-frontend`
   - **Build Command**: `cd client && npm install && npm run build`
   - **Publish Directory**: `client/build`
4. Add environment variable:
   - `REACT_APP_API_URL` = `https://love-ks.onrender.com/api` (adjust to your backend URL)
5. Click "Create Static Site"

### Step 5: Update Database & Configuration

After deployment:

1. SSH into your backend service:
```bash
# In Render dashboard, open Shell
# The database will auto-initialize
```

2. Update frontend environment:
```bash
# In Render dashboard for frontend, add build env variable:
REACT_APP_API_URL=https://your-backend-url.onrender.com/api
```

### Alternative Deployment Options

#### Option A: Vercel (Frontend) + Render (Backend)

**Frontend on Vercel:**
```bash
npm install -g vercel
cd client
vercel login
vercel deploy --prod
```

**Backend on Render** (as shown above)

#### Option B: Railway.app

Similar to Render, Railway also offers free tier:
1. Go to https://railway.app
2. Connect GitHub
3. Auto-detects Node.js project
4. Configure environment variables
5. Deploy!

#### Option C: Heroku (Limited Free Tier)

```bash
npm install -g heroku
heroku login
heroku create love-ks
git push heroku main
```

## 📋 Deployment Checklist

- [ ] Push code to GitHub
- [ ] Create Render account
- [ ] Deploy backend service
- [ ] Deploy frontend service
- [ ] Test API endpoints
- [ ] Test WebSocket connections
- [ ] Upload test photo
- [ ] Create test story/journal entry
- [ ] Verify real-time sync across tabs

## 🔒 Security Checklist

- [ ] Change JWT_SECRET to strong random value
- [ ] Enable HTTPS (automatic on Render)
- [ ] Set proper CORS origins
- [ ] Use environment variables for all secrets
- [ ] Enable database backups
- [ ] Set up monitoring/alerts

## 📊 Performance Tips

1. **Enable CDN** for static files
2. **Compress images** on upload (already done ✅)
3. **Use lazy loading** for photo gallery
4. **Enable caching** headers

## 🆘 Troubleshooting

### "Cannot connect to API"
- Check `REACT_APP_API_URL` in frontend
- Verify CORS configuration in backend
- Check Render logs for errors

### "WebSocket not connecting"
- Ensure backend is running
- Check Render logs for socket.io errors
- Update client socket URL to match backend

### "Database errors"
- Render auto-creates SQLite
- If issues, SSH into backend and run:
```bash
node -e "require('./config/database').initialize()"
```

### "Build fails"
- Check Render build logs
- Verify all dependencies in package.json
- Ensure NODE_ENV is set correctly

## ✨ Post-Deployment

After deployment, you can:

1. **Enable auto-deploy** on GitHub commits
2. **Set up backups** for SQLite database
3. **Monitor analytics** with Render
4. **Enable email notifications** for errors
5. **Scale** to paid plan if needed

## 📱 Mobile App Deployment

For React Native app:

1. **iOS**: Use Expo:
```bash
eas build --platform ios --auto-submit
```

2. **Android**: Use Expo:
```bash
eas build --platform android
```

Then submit to App Store / Google Play Store.

---

## 🎉 You're Done!

Once deployed:
- **Website**: https://your-love-ks.onrender.com
- **API**: https://your-api-url.onrender.com/api
- **Mobile**: Available on Expo Go (for testing)

Share the link with your partner and start creating memories! 💕
