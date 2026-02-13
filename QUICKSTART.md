# ⚡ Love KS - Quick Start (5 Minutes)

Get Love KS running locally in 5 minutes!

## 📋 Prerequisites
- Node.js v16+ ([Download](https://nodejs.org))
- npm (comes with Node.js)
- Git (optional)

## ⚡ Steps

### 1️⃣ Open Two Terminals

**Terminal 1** - Backend (stays open)
**Terminal 2** - Frontend (stays open)

### 2️⃣ Backend Setup (Terminal 1)

```bash
cd c:\Users\SHUBH\OneDrive\Documents\KIvi
npm install
npm start
```

✅ You should see: `Server running on http://localhost:5000`

### 3️⃣ Frontend Setup (Terminal 2)

```bash
cd c:\Users\SHUBH\OneDrive\Documents\KIvi\client
npm install
npm start
```

✅ Browser opens automatically to http://localhost:3000

## 🎉 You're Done!

### Create Account
1. Click **"Sign up"**
2. Create username & password
3. Click **Sign up**

### Try Features
- 📸 **Gallery** - Upload a photo
- 💕 **Stories** - Write a memory
- 💌 **Letters** - Write a love letter
- 📔 **Journal** - Create daily entry
- More in navigation!

## 🔥 Quick Features to Try

### Test Real-time Sync
1. Open http://localhost:3000 in **second browser tab**
2. Log in same account
3. Upload photo in tab 1
4. Watch it appear in tab 2 instantly! 🚀

### Test Image Compression
1. Gallery → Upload
2. Pick any large photo (5MB+)
3. Watch it compress before upload ✨
4. Check browser console to see compression stats

## ❌ Troubleshooting

### "Port 3000 already in use"
```bash
# Frontend on different port
cd client
PORT=3001 npm start
```

### "Port 5000 already in use"
```bash
# Backend on different port
PORT=5001 npm start
```

### "npm install fails"
```bash
# Clear cache and try again
npm cache clean --force
npm install
```

### "Cannot connect to API"
1. Check Terminal 1 shows "Server running on port 5000"
2. Kill all node processes: `taskkill /F /IM node.exe`
3. Run `npm start` again in Terminal 1

## 📱 Optional: Mobile App

```bash
cd mobile
npm install
npm start
# Scan QR with Expo Go app on phone
```

## 🚀 Next Steps

### When Ready to Deploy:
See [DEPLOYMENT.md](./DEPLOYMENT.md) - Deploy to Render in 5 minutes!

### Customize:
- Change brand name: Edit `client/src/components/Layout.js`
- Change colors: Edit `client/src/styles/layout.css`
- Add features: Create new route in `routes/` folder

## 📚 Full Documentation

- [Main README](./README.md) - Complete guide
- [Deployment Guide](./DEPLOYMENT.md) - Deploy to production
- [API Routes](./routes/) - All API endpoints
- [Frontend Guide](./client/README.md) - React frontend details

## 💡 Tips

✨ **Pro Tips:**
- Use dark mode (DevTools) for better viewing
- Open on mobile with Android Studio/XCode to test responsive design
- Upload small images first to test (large files take longer)
- Use fake data first, then add real memories

## 🎯 Test Account (First Run)

If you want to test before creating account:
```
Username: test
Password: test
```
(Auto-created on first backend start)

---

**That's it! Enjoy Love KS! 💕**

Questions? Check [README.md](./README.md) or [DEPLOYMENT.md](./DEPLOYMENT.md)
