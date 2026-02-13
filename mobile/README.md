# Couple Memories - React Native Mobile App

A romantic mobile app for couples to share photos, stories, and notes in real-time.

## Features

- 📱 **User Authentication** - Register and login with couple names
- 🖼️ **Photo Gallery** - Share and manage photos with real-time sync
- 💕 **Love Stories** - Write and share your love story
- 📝 **Secret Notes** - Organize notes by categories (General, Anniversary, Reminder, Dreams, Bucket List)
- 🔄 **Real-time Updates** - WebSocket integration for instant notifications
- 🔒 **Secure** - JWT authentication with encrypted tokens
- 📲 **Mobile Responsive** - Designed for iOS and Android

## Setup & Installation

### Prerequisites
- Node.js (v16+)
- Expo CLI: `npm install -g expo-cli`
- iOS Simulator (Mac) or Android Emulator

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm start
   ```

   Or use platform-specific commands:
   ```bash
   npm run android  # Android Emulator
   npm run ios      # iOS Simulator
   ```

3. **Configure Backend Connection:**
   - Update `src/services/api.js` with your backend URL
   - Update `src/services/socket.js` with your WebSocket URL
   - For emulator testing use: `http://10.0.2.2:5000` (Android) or `http://localhost:5000` (iOS)

## Project Structure

```
mobile/
├── App.js                 # Root component
├── app.json              # Expo configuration
├── index.js              # Entry point
├── package.json
├── src/
│   ├── screens/          # App screens
│   │   ├── AuthScreen.js
│   │   ├── HomeScreen.js
│   │   ├── GalleryScreen.js
│   │   ├── StoriesScreen.js
│   │   ├── NotesScreen.js
│   │   └── PhotoDetailScreen.js
│   ├── services/         # API and storage services
│   │   ├── api.js
│   │   ├── socket.js
│   │   └── storage.js
│   ├── context/          # Global state (Auth)
│   │   └── AuthContext.js
│   ├── navigation/       # Navigation setup
│   │   └── RootNavigator.js
│   └── components/       # Reusable components
```

## Authentication Flow

1. **Register**: Create account with couple names → Backend hashes password → JWT token returned
2. **Login**: Enter username → Get JWT token → Stored in AsyncStorage
3. **Protected Routes**: JWT automatically added to all API requests
4. **Logout**: Token removed from AsyncStorage → Navigation reset to Auth screen

## Real-time Features

### WebSocket Events

**Gallery:**
- `photo-uploaded` - New photo added (updates gallery in real-time)
- `photo-deleted` - Photo removed (syncs across devices)

**Stories:**
- `story-created` - New story written
- `story-deleted` - Story removed

**Notes:**
- `note-created` - New note created
- `note-deleted` - Note deleted

## Backend API Integration

The app communicates with the backend via REST API (for CRUD) and WebSockets (for real-time updates).

**API Endpoints:**
- `POST /api/auth/register` - Create account
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `GET /api/gallery` - Fetch photos
- `POST /api/gallery/upload` - Upload photo
- `DELETE /api/gallery/:id` - Delete photo
- `GET /api/stories` - Fetch stories
- `POST /api/stories/create` - Create story
- `DELETE /api/stories/:id` - Delete story
- `GET /api/notes` - Fetch notes
- `POST /api/notes/create` - Create note
- `DELETE /api/notes/:id` - Delete note

## Device Testing

### Testing on Android Emulator
```bash
# Make sure Android Emulator is running
npm run android

# In another terminal, if using localhost
# Update API URL to: http://10.0.2.2:5000
```

### Testing on iOS Simulator
```bash
# Make sure you're on macOS
npm run ios

# API URL stays: http://localhost:5000
```

### Testing on Physical Device
Using Expo Go app:
1. Install Expo Go on your phone
2. Run `npm start`
3. Scan QR code with Expo Go
4. Update API URL to your machine's local IP: `http://192.168.x.x:5000`

## Building APK/IPA

### Android APK
```bash
eas build --platform android
```

### iOS App
```bash
eas build --platform ios
```

## Development Notes

- Token is stored in AsyncStorage and persists across app restarts
- WebSocket auto-reconnects with exponential backoff (1-5s delays, max 5 attempts)
- Images compressed before upload to reduce bandwidth
- All UI components use React Native for cross-platform compatibility
- Bottom Tab Navigation for easy feature access

## Troubleshooting

**Cannot connect to backend?**
- Check backend is running on port 5000
- Update API URLs in `src/services/api.js` and `src/services/socket.js`
- For emulator: Use `10.0.2.2` instead of `localhost` (Android)

**WebSocket not connecting?**
- Enable polling fallback (already configured)
- Check CORS and Socket.io configuration on backend
- Make sure backend is NOT in HTTPS for local testing

**Image upload fails?**
- Check file permissions in `app.json`
- Ensure photo picker is properly configured
- Verify backend upload directory has write permissions

## Made with 💕 for love
