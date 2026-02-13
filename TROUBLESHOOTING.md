# 🔧 Love KS - Troubleshooting Guide

Common issues and solutions when running Love KS.

## 🔴 Backend Issues

### Backend won't start / "Port 5000 already in use"

**Error Message:**
```
Error: listen EADDRINUSE :::5000
```

**Solutions:**

1. **Use different port:**
```bash
set PORT=5001
npm start
```

2. **Kill process using port 5000 (Windows):**
```bash
netstat -ano | findstr :5000
taskkill /PID <PID> /F
npm start
```

3. **Kill all Node processes:**
```bash
taskkill /F /IM node.exe
npm start
```

---

### "Cannot find module 'express'"

**Error Message:**
```
Cannot find module 'express' from '/Love KS'
```

**Solution:**
```bash
# Reinstall dependencies
rm -r node_modules package-lock.json
npm install
npm start
```

---

### "sqlite3 module not found"

**Error Message:**
```
Cannot find module 'better-sqlite3'
```

**Solution:**
```bash
# Install missing dependency
npm install sqlite3
npm start
```

---

### "Database locked" error

**Error Message:**
```
Error: database is locked
```

**Solution:**
1. Stop all running servers (Ctrl+C)
2. Wait 2 seconds
3. Delete `database.db` (it will recreate):
```bash
del database.db
npm start
```

---

### Backend starts but won't respond to requests

**Error:** Frontend shows "Cannot connect to API"

**Checklist:**
1. ✅ Terminal shows `Server running on http://localhost:5000`?
2. ✅ Try `curl http://localhost:5000/api/health` in another terminal
3. ✅ Check firewall isn't blocking port 5000
4. ✅ Make sure you're not on VPN

**Solution:**
```bash
# Restart with debug info
set DEBUG=*
npm start
```

---

## 🔴 Frontend Issues

### Frontend won't start / "Port 3000 already in use"

**Error Message:**
```
Something is already running on port 3000
```

**Solutions:**

1. **Use different port:**
```bash
cd client
set PORT=3001
npm start
# Then visit http://localhost:3001
```

2. **Kill process using port 3000:**
```bash
netstat -ano | findstr :3000
taskkill /PID <PID> /F
npm start
```

---

### "npm ERR! code ERESOLVE"

**Error Message:**
```
npm ERR! code ERESOLVE
npm ERR! ERESOLVE unable to resolve dependency tree
```

**Solution:**
```bash
cd client
# Use legacy peer deps
npm install --legacy-peer-deps
npm start
```

---

### Blank white screen or "Loading forever..."

**Checklist:**
1. Open Chrome DevTools (F12)
2. Check Console tab for red errors
3. Check Network tab:
   - Red requests indicate API failures
   - Check if requests go to `localhost:5000`

**If API calls show 404:**
```bash
# Make sure backend is running on port 5000
# Open another terminal and check:
curl http://localhost:5000/api/health
```

**If API calls show 0 (no response):**
```bash
# Backend not running. Start it:
npm start  # In project root terminal
```

---

### "Cannot GET /login"

**Cause:** Frontend routing issue

**Solution:**
```bash
cd client
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm start
```

---

### "WebSocket connection failed"

**Console shows:**
```
WebSocket connection to 'ws://localhost:5000/socket.io' failed
```

**Solutions:**
1. Verify backend is running: `npm start` in project root
2. Check firewall isn't blocking WebSocket
3. Restart both frontend and backend

---

## 🔴 Authentication Issues

### "Cannot read property 'user' of undefined"

**Cause:** Not logged in, token expired, or login failed

**Solution:**
1. Clear localStorage:
```javascript
// Paste in browser console (F12):
localStorage.clear();
window.location.reload();
```

2. Try logging in again

---

### Login page won't accept credentials

**Checklist:**
1. Backend running? See server logs in Terminal 1
2. Database exists? Check `database.db` file exists in project root
3. User exists? Check backend console for "User created" message

**Reset database:**
```bash
# Stop backend (Ctrl+C)
del database.db
npm start
# Now test account is auto-created
# Username: test
# Password: test
```

---

### Registration fails with no error

**Solution:**
1. Check browser console (F12) for errors
2. Check backend terminal logs for error message
3. Try different username (might be taken)
4. Verify all fields are filled

**Debug registration:**
```bash
# In another terminal, test API directly:
curl http://localhost:5000/api/auth/register -X POST \
  -H "Content-Type: application/json" \
  -d "{\"username\":\"testuser\",\"password\":\"pass123\"}"

# Should return: {"success":true,"token":"...","user":{...}}
```

---

## 🔴 Upload & Photo Issues

### Photos won't upload

**Error in console:**
- "File too large"
- "Network error"
- "Upload failed"

**Checklist:**
1. ✅ File size < 10MB?
2. ✅ File format: JPG, PNG, GIF?
3. ✅ `public/uploads/` folder exists?
4. ✅ Permissions to write to folder?

**Solution:**
```bash
# Make sure uploads folder exists:
mkdir public\uploads

# Try uploading smaller file first (< 1MB)
```

---

### "Image compression failed"

**Cause:** Large image, browser running out of memory

**Solution:**
1. Use smaller images (< 5MB)
2. Close other browser tabs
3. Restart browser
4. Try again

---

### Photos upload but don't appear

**Checklist:**
1. Check browser Network tab for upload success (200 status)
2. Check if image file created in `public/uploads/`
3. Refresh page to see if they appear

**If file in uploads but not showing:**
```bash
# Restart both servers
# Terminal 1: Ctrl+C, then npm start
# Terminal 2: Ctrl+C, then npm start in client folder
```

---

## 🔴 Real-time Sync Issues

### Changes don't sync between tabs

**Checklist:**
1. WebSocket connected? Check browser console for "socket connected" message
2. Same account logged in both tabs?
3. Same feature page open in both?

**Debug WebSocket:**
```javascript
// Browser console:
socket.connected  // Should be true
socket.emit('test', {data: 'hello'});  // Log shows it's working
```

**If not connected:**
1. Check backend running: See "Backend won't start" section
2. Restart both frontend and backend

---

### "Socket.io is not a function"

**Error in console:**
```
socketio is not a function
```

**Solution:**
```bash
cd client
npm install socket.io-client
npm start
```

---

## 🔴 Database Issues

### "Table 'users' already exists"

**Cause:** Database corrupted from previous run

**Solution:**
```bash
# Stop server (Ctrl+C)
del database.db
npm start
```

---

### "Cannot read property 'run' of undefined"

**Cause:** Database not initialized

**Solution:**
```bash
del database.db
npm start
# Wait for "Database tables initialized" message
```

---

### Database keeps getting corrupted

**Cause:** Multiple servers trying to access same database

**Solution:**
```bash
# Make sure ONLY ONE server is running
taskkill /F /IM node.exe
npm start  # Only one terminal
```

---

## 🔴 Styling & UI Issues

### Page looks ugly / colors wrong / layout broken

**Solutions:**
1. Hard refresh browser:
```
Windows: Ctrl+Shift+R
Mac: Cmd+Shift+R
```

2. Clear browser cache:
   - Chrome: Ctrl+Shift+Delete → Clear all

3. Restart frontend:
```bash
cd client
npm start
```

---

### Can't see images that uploaded

**Checklist:**
1. Image file exists in `public/uploads/`?
2. Page refreshed after upload?
3. Correct path in image src: `/uploads/filename.jpg`?

**Debug:**
```bash
# Check uploads folder
dir public\uploads

# If empty, upload failed. See "Photos won't upload" section
```

---

## 🔴 Performance & Disconnections

### App freezes or becomes unresponsive

**Causes:**
- Too many photos (1000s)
- WebSocket disconnected
- Memory leak

**Solutions:**
1. Refresh page: F5
2. Close other browser tabs
3. Restart servers

**If persists:**
```bash
# Nuclear option: kill all node processes
taskkill /F /IM node.exe
npm start  # Backend
# In another terminal:
cd client && npm start  # Frontend
```

---

### Frequently disconnected from backend

**Symptoms:**
- "Cannot connect to API"
- Photos won't upload
- Pages reload unexpectedly

**Solutions:**
1. Restart backend: `Ctrl+C`, then `npm start`
2. Check Internet connection
3. Check firewall settings
4. If on WiFi, try ethernet

---

## 🔴 Deployment Issues

### Changes not showing in production

**Cause:** Need to rebuild and redeploy

**Solution:**
```bash
# Build React
cd client
npm run build

# Commit and push
git add .
git commit -m "Love KS update"
git push

# Render auto-deploys from GitHub
```

---

### "Application error" on Render

**Solutions:**
1. Check Render dashboard for logs
2. Verify environment variables set (NODE_ENV, JWT_SECRET)
3. Check JWT_SECRET is strong (32+ characters)
4. Verify database is initialized

```bash
# Test locally first
npm start
```

---

## 🧪 Complete Restart (Nuclear Option)

When everything is broken:

```bash
# 1. Kill all Node processes
taskkill /F /IM node.exe

# 2. Delete database
del database.db

# 3. Clean install
rm -r node_modules package-lock.json
npm install

# 4. Clean frontend
cd client
rm -r node_modules package-lock.json
npm install
cd ..

# 5. Start backend
npm start

# 6. In new terminal, start frontend
cd client
npm start
```

---

## 🆘 Still Having Issues?

### Debugging Checklist
- [ ] Both servers running? Check 2 terminals
- [ ] Correct ports? Backend 5000, Frontend 3000
- [ ] Database exists? Check `database.db` file
- [ ] No errors in console? Press F12 and check
- [ ] Network requests successful? Check Network tab in DevTools
- [ ] Token in localStorage? Check Application tab in DevTools

### Gather Info for Help
1. What error message do you see?
2. Where does error appear? (Browser, terminal, DevTools)
3. What were you doing? (Upload, login, navigate)
4. Screenshots/screenshots of error?
5. Check both terminal outputs

### Get Help
1. Read [README.md](./README.md) - Full documentation
2. Check [DEPLOYMENT.md](./DEPLOYMENT.md) - Deploy help
3. Search this file for your error message
4. Create GitHub issue with details above

---

Made with 💕 for Love KS
