# ✅ Love KS - Setup & Deployment Checklist

Complete checklist for setting up and deploying Love KS. Use this to track your progress!

---

## Phase 1: Local Setup ✅

This phase gets Love KS running on your computer.

### Prerequisites
- [ ] Node.js v16+ installed from nodejs.org
- [ ] npm installed (comes with Node.js)
- [ ] Git installed (optional, for GitHub)
- [ ] Two terminal windows open

### Backend Setup

- [ ] Navigate to project folder
  ```bash
  cd c:\Users\SHUBH\OneDrive\Documents\KIvi
  ```

- [ ] Install backend dependencies
  ```bash
  npm install
  ```

- [ ] Start backend server
  ```bash
  npm start
  ```

- [ ] Verify backend running
  - [ ] Terminal shows `Server running on http://localhost:5000`
  - [ ] No error messages
  - [ ] Try `curl http://localhost:5000/api/health` in another terminal

### Frontend Setup

- [ ] Navigate to client folder (NEW TERMINAL)
  ```bash
  cd c:\Users\SHUBH\OneDrive\Documents\KIvi\client
  ```

- [ ] Install frontend dependencies
  ```bash
  npm install
  ```

- [ ] Start frontend server
  ```bash
  npm start
  ```

- [ ] Verify frontend running
  - [ ] Browser opens to http://localhost:3000
  - [ ] No red console errors (F12)
  - [ ] See "Love KS" header at top

### Test Local Installation

- [ ] Open http://localhost:3000 in browser
- [ ] Click "Sign up"
- [ ] Create test account (username: test123, password: test123)
- [ ] Successfully logged in
  - [ ] See dashboard with 8 buttons
  - [ ] Can navigate between pages
- [ ] Test Gallery feature
  - [ ] Upload a small photo
  - [ ] See photo appear in gallery
  - [ ] Image compressed successfully
- [ ] Test Real-time Sync
  - [ ] Open http://localhost:3000 in second tab
  - [ ] Log in with same account
  - [ ] Upload photo in tab 1
  - [ ] See it appear in tab 2 automatically!

✅ **Phase 1 Complete!** Love KS works locally.

---

## Phase 2: Prepare for Deployment

This phase prepares code for production deployment.

### Code Verification

- [ ] Check backend server code is correct
  ```bash
  # In terminal with backend running, Ctrl+C to stop
  # Verify no errors in logs
  npm start
  # Should start without errors
  ```

- [ ] Check frontend builds
  ```bash
  cd client
  npm run build
  ```
  - [ ] Build completes without errors
  - [ ] `build/` folder created with optimized files
  - [ ] Size shows (typically < 500KB gzipped)

- [ ] Verify database
  - [ ] `database.db` file exists in project root
  - [ ] All data from tests still there
  - [ ] No corruption errors

### Environment Variables

- [ ] Copy `.env.example` to `.env`
  ```bash
  copy .env.example .env
  ```

- [ ] Verify `.env` has correct values
  ```
  PORT=5000
  NODE_ENV=development (change to production when deploying)
  JWT_SECRET=couple-memories-secret-key (will change)
  CLIENT_URL=http://localhost:3000
  ```

- [ ] Create strong JWT_SECRET for production
  - [ ] Online generator: Generate 32-character random string
  - [ ] Save securely (you'll use in deployment config)
  - [ ] DO NOT commit to git

### Clean Up Code

- [ ] Remove test data (optional)
  ```bash
  del database.db
  npm start  # Creates fresh database
  ```

- [ ] Check Git status
  ```bash
  git status
  ```
  - [ ] `.env` is in `.gitignore` (not tracked)
  - [ ] `database.db` is in `.gitignore` (not tracked)
  - [ ] `node_modules` is in `.gitignore` (not tracked)

### Documentation Review

- [ ] Read [DEPLOYMENT.md](./DEPLOYMENT.md) - Choose your platform
- [ ] Read [FEATURE_GUIDE.md](./FEATURE_GUIDE.md) - Understand all features
- [ ] Note any customizations needed
- [ ] Plan branding changes (optional)

✅ **Phase 2 Complete!** Ready to deploy.

---

## Phase 3: Deploy to Production

Choose ONE deployment platform below.

### Option A: Render.com (RECOMMENDED) ⭐

**Time Estimate: 10-15 minutes**

- [ ] **Step 1: Push to GitHub**
  ```bash
  git add .
  git commit -m "Love KS production ready"
  git push origin main
  ```
  - [ ] All files pushed to GitHub
  - [ ] Repository available at github.com/yourname/love-ks

- [ ] **Step 2: Sign up for Render**
  - [ ] Go to https://render.com
  - [ ] Create free account (email + password)
  - [ ] Verify email

- [ ] **Step 3: Create Web Service**
  - [ ] Click "New" → "Web Service"
  - [ ] Connect GitHub repository
  - [ ] Select repository: love-ks
  - [ ] Choose main branch

- [ ] **Step 4: Configure Service**
  - [ ] Name: love-ks (or your choice)
  - [ ] Region: US (or nearest)
  - [ ] Branch: main
  - [ ] Build Command: `npm install`
  - [ ] Start Command: `npm start`
  - [ ] Plan: Free (auto-sleeps but free)

- [ ] **Step 5: Add Environment Variables**
  - [ ] Click "Environment"
  - [ ] Add variables:
    ```
    NODE_ENV = production
    JWT_SECRET = <your-strong-secret-key>
    CLIENT_URL = https://your-app-name.onrender.com
    ```
  - [ ] Click "Create Web Service"

- [ ] **Step 6: Wait for Deploy**
  - [ ] See "Building..."
  - [ ] Wait 2-3 minutes for completion
  - [ ] See "Live" status (green checkmark)
  - [ ] Copy deployed URL

- [ ] **Step 7: Test Deployed App**
  - [ ] Visit your Render URL
  - [ ] Create new account
  - [ ] Upload test photo
  - [ ] Verify real-time sync works
  - [ ] Check browser console (no errors)

### Option B: Heroku

**Time Estimate: 15-20 minutes**

- [ ] Install Heroku CLI from heroku.com
- [ ] Login: `heroku login`
- [ ] Create app: `heroku create love-ks`
- [ ] Add buildpacks:
  ```bash
  heroku buildpacks:add heroku/nodejs
  ```
- [ ] Set environment variables:
  ```bash
  heroku config:set NODE_ENV=production
  heroku config:set JWT_SECRET=your-secret-key
  ```
- [ ] Deploy:
  ```bash
  git push heroku main
  ```
- [ ] View logs: `heroku logs --tail`
- [ ] Open app: `heroku open`

### Option C: Vercel (Frontend) + Render (Backend)

**Time Estimate: 20-30 minutes**

- [ ] Deploy backend to Render (see Option A)
- [ ] Deploy frontend to Vercel:
  ```bash
  npm install -g vercel
  cd client
  vercel
  ```
- [ ] Update frontend environment:
  - [ ] Set `REACT_APP_API_URL` to your Render backend URL
  - [ ] Redeploy frontend
- [ ] Test connection between Vercel and Render

### Option D: Railway

**Time Estimate: 10-15 minutes**

- [ ] Go to https://railway.app
- [ ] Sign up with GitHub
- [ ] Create new project
- [ ] Connect GitHub repository
- [ ] Configure variables in Dashboard
- [ ] Deploy automatically

✅ **Phase 3 Complete!** App is live on internet!

---

## Phase 4: Post-Deployment Verification

- [ ] **Visit Your App**
  - [ ] Open deployed URL
  - [ ] See "Love KS" header
  - [ ] No loading errors

- [ ] **Test Core Features**
  - [ ] Register new account
  - [ ] Login works
  - [ ] Upload photo to gallery
  - [ ] Create story
  - [ ] Create letter
  - [ ] Create journal entry
  - [ ] Add bucket item
  - [ ] Create note
  - [ ] Create album

- [ ] **Test Real-time Sync**
  - [ ] Open app in 2 browser tabs
  - [ ] Upload photo in tab 1
  - [ ] See it appear in tab 2 instantly
  - [ ] No page refresh needed

- [ ] **Check Browser Console**
  - [ ] Press F12 (DevTools)
  - [ ] Go to Console tab
  - [ ] No red error messages
  - [ ] Should see "socket connected" message

- [ ] **Check Network Requests**
  - [ ] DevTools → Network tab
  - [ ] Look for API calls to your backend
  - [ ] Status should be 200 (success)
  - [ ] No 404 or 500 errors

- [ ] **Share With Partner**
  - [ ] Send deployed URL to your partner
  - [ ] They create account
  - [ ] You upload photo
  - [ ] They see it in real-time
  - [ ] Celebrate! 🎉

✅ **Phase 4 Complete!** App is working in production!

---

## Phase 5: Ongoing Maintenance

### Regular Tasks

- [ ] **Weekly**
  - [ ] Check app is running (visit URL)
  - [ ] Verify no error emails from hosting

- [ ] **Monthly**
  - [ ] Review database size (may need cleanup)
  - [ ] Check for old test photos to delete
  - [ ] Read through entries together

- [ ] **Quarterly**
  - [ ] Backup database.db file
  - [ ] Check for new updates
  - [ ] Review error logs

### Backups

- [ ] **First Backup**
  ```bash
  # Download database.db from hosting
  # Or access through file manager
  # Save to: Backups/database-backup-2024-01-15.db
  ```

- [ ] **Automated Backups (Optional)**
  - [ ] Use hosting platform's backup features
  - [ ] Set schedules (weekly recommended)
  - [ ] Test restore process

### Updates

- [ ] **To Add Feature**
  - [ ] Follow [DEVELOPER_GUIDE.md](./DEVELOPER_GUIDE.md)
  - [ ] Test locally first
  - [ ] Push to GitHub
  - [ ] Render auto-deploys

- [ ] **To Fix Bug**
  - [ ] Check [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)
  - [ ] Fix code locally
  - [ ] Test thoroughly
  - [ ] Push to GitHub
  - [ ] Render auto-deploys

✅ **Maintenance Ready!** App maintained and updated.

---

## 🎯 Customization (Optional)

These are nice-to-have customizations:

### Branding

- [ ] Change app name
  - [ ] Edit `client/src/components/Layout.js`
  - [ ] Change "Love KS" to your names
  - [ ] Rebuild: `npm run build`
  - [ ] Deploy

- [ ] Change colors
  - [ ] Edit `client/src/styles/layout.css`
  - [ ] Update `--primary-pink` color
  - [ ] Rebuild and deploy

- [ ] Change logo
  - [ ] Replace image file
  - [ ] Update reference in Layout.js
  - [ ] Rebuild and deploy

### Features (Advanced)

- [ ] Add new feature following [DEVELOPER_GUIDE.md](./DEVELOPER_GUIDE.md)
- [ ] Test locally first
- [ ] Remove features (optional)
- [ ] Modify existing pages

---

## ✅ Final Checklist

Before declaring success:

- [ ] Love KS runs locally without errors
- [ ] Love KS is deployed to production
- [ ] Production app is accessible via URL
- [ ] Can create account
- [ ] Can upload photos
- [ ] Real-time sync works
- [ ] All 8 features work
- [ ] Database is backed up
- [ ] Partner can access and use app
- [ ] Documentation is read and understood

---

## 🎉 Success! You're All Set

**Congratulations!** Love KS is:

✅ Running locally
✅ Deployed to production  
✅ Tested and working
✅ Ready for you and your partner
✅ Fully documented
✅ Easy to maintain

---

## 📚 Reference Links

| Document | Purpose |
|----------|---------|
| [INDEX.md](./INDEX.md) | Documentation portal |
| [README.md](./README.md) | Main documentation |
| [QUICKSTART.md](./QUICKSTART.md) | 5-minute setup |
| [DEPLOYMENT.md](./DEPLOYMENT.md) | Deploy guide |
| [FEATURE_GUIDE.md](./FEATURE_GUIDE.md) | How to use features |
| [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) | Fix issues |
| [DEVELOPER_GUIDE.md](./DEVELOPER_GUIDE.md) | Code reference |

---

## 💕 You're Ready!

Everything is prepared. Time to create beautiful memories together!

**Next Step:** Share your Love KS with your partner and start adding memories! 📸💑

---

Made with 💕 for Love KS
