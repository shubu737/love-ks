# React Native Mobile App - Setup & Usage Guide

## 🚀 Quick Start

### 1. Install Dependencies
```bash
cd mobile
npm install
```

### 2. Configure Backend URL
The app is configured to connect to `http://localhost:5000` by default.

**For different environments:**
- **iOS Simulator**: Use `http://localhost:5000` (already configured)
- **Android Emulator**: Use `http://10.0.2.2:5000` - Update in `src/services/api.js` and `src/services/socket.js`
- **Physical Device**: Use your machine's local IP: `http://192.168.x.x:5000`

### 3. Start Development Server
```bash
# Start Expo dev server (opens QR code for scanning)
npm start

# Or directly on Android
npm run android

# Or directly on iOS (macOS only)
npm run ios
```

## 📱 What's Included

### Core Features
✅ **User Authentication** - Register/Login with couple names  
✅ **Photo Gallery** - Upload, view, delete photos with compression  
✅ **Love Stories** - Create, read, delete romantic stories  
✅ **Secret Notes** - Manage notes with 5 categories  
✅ **Real-time Sync** - WebSockets for instant updates across devices  
✅ **Secure Storage** - JWT tokens in AsyncStorage  
✅ **Mobile UI** - Romantic pink theme, responsive design  

### Technical Stack
- **Framework**: React Native with Expo
- **Navigation**: React Navigation (Bottom Tabs + Stack)
- **State Management**: React Context + AsyncStorage
- **API Communication**: Axios + Socket.io
- **Image Handling**: Expo Image Picker + Image Manipulator
- **Storage**: AsyncStorage for persistent tokens

## 📂 File Structure Created

```
mobile/
├── App.js                          # Root app component
├── index.js                        # Entry point (Expo)
├── app.json                        # Expo configuration
├── package.json                    # Dependencies (Expo, React Native, etc.)
├── README.md                       # User-facing documentation
├── .babelrc                        # Babel configuration
├── .env.example                    # Environment template
├── .gitignore
│
├── src/
│   ├── screens/
│   │   ├── AuthScreen.js          # Login/Register (animated form)
│   │   ├── HomeScreen.js          # Dashboard with feature cards
│   │   ├── GalleryScreen.js       # Photo upload + gallery grid
│   │   ├── StoriesScreen.js       # Story CRUD with WebSocket
│   │   ├── NotesScreen.js         # Notes with categories + WebSocket
│   │   └── PhotoDetailScreen.js   # Photo detail view
│   │
│   ├── services/
│   │   ├── api.js                 # Axios instance with auth interceptor
│   │   ├── socket.js              # SocketService (WebSocket singleton)
│   │   └── storage.js             # AsyncStorage wrapper (token + user)
│   │
│   ├── context/
│   │   └── AuthContext.js         # Global auth state + hooks
│   │
│   └── navigation/
│       └── RootNavigator.js       # Tab + Stack navigation setup
```

## 🎯 Key Features Explained

### Authentication Flow
1. User registers or logs in
2. Backend returns JWT token
3. Token stored in AsyncStorage
4. Token automatically sent with every API request
5. User can restart app and stay logged in
6. Logout clears token and resets navigation

### Real-time Updates
All CRUD operations are synced in real-time:
- **Upload photo** → `photo-uploaded` event → Other devices see it instantly
- **Create story** → `story-created` event → All connected devices updated
- **Create note** → `note-created` event → Sync across devices

### Image Handling
- User selects image from device
- Image is automatically resized to max 1920px (maintains aspect ratio)
- Compressed before upload to save bandwidth
- Displayed in gallery with delete option

## 🔧 Configuration

### Changing Backend URL
**File: `src/services/api.js` (line 3)**
```javascript
const API_BASE_URL = 'http://localhost:5000/api';
```

**File: `src/services/socket.js` (line 3)**
```javascript
const SOCKET_URL = 'http://localhost:5000';
```

### Modifying Colors (Romantic Pink Theme)
- Primary color: `#ff6b9d` (pink)
- Used in all buttons, headers, accents
- Change in each screen's styles object to customize

## 📦 Dependencies

### Navigation
- `@react-navigation/native`
- `@react-navigation/bottom-tabs`
- `@react-navigation/stack`
- `react-native-screens`
- `react-native-safe-area-context`
- `react-native-gesture-handler`

### API & Data
- `axios` - HTTP client
- `socket.io-client` - WebSocket client

### Storage
- `@react-native-async-storage/async-storage` - Persistent storage

### Image Handling
- `expo-image-picker` - Photo/camera access
- `expo-image-manipulator` - Image compression

### UI
- `react-native-vector-icons` - Material icons

## 🧪 Testing

### Test Account
```
Username: test
Password: test (same as username in this setup)
```

### Quick Test Workflow
1. Register as "John & Jane"
2. Take/upload a photo
3. Open second device/emulator
4. Login with same account
5. You should see the photo appear in real-time! 🎉

## 🚀 Building for Production

### Android
```bash
eas build --platform android --release
```

### iOS
```bash
eas build --platform ios --release
```

## 📝 Notes

- **First Load**: App checks for saved token and auto-logs in if available
- **Offline Support**: AsyncStorage persists data; sync when connected
- **Image Limits**: 1920px max width/height, auto-resized before upload
- **Security**: JWT tokens expire after 24 hours (configured on backend)

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| Cannot connect to API | Check backend is running, update API_BASE_URL |
| WebSocket not working | Enable polling fallback, check CORS on backend |
| Image upload fails | Check camera permissions in `app.json` |
| Can't open emulator | Install Android SDK / Xcode Command Line Tools |
| Blank screen on startup | Clear Expo cache: `expo start --clear` |

## 💡 Tips

- Use Android emulator: `npm run android` (faster)
- Use iOS: `npm run ios` (smoother on Mac)
- Monitor backend logs to debug API issues
- Use React Native DevTools: `j` key in Expo CLI

## Made with 💕 for love and mobile romance!
