# Firebase Auth Template Setup Guide

## Prerequisites
- Node.js 18+
- npm atau yarn
- Expo CLI
- Firebase Account

## Setup Steps

### 1. Clone & Install Dependencies
```bash
npm install
# atau
yarn install
```

### 2. Firebase Setup

#### A. Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create new project
3. Enable Authentication → Email/Password
4. Create Firestore Database
5. Get your config from Project Settings

#### B. Configure Firebase
1. Copy `.env.example` to `.env`
2. Fill in your Firebase config:
```bash
EXPO_PUBLIC_FIREBASE_API_KEY=your_actual_api_key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
EXPO_PUBLIC_FIREBASE_APP_ID=1:123456789:web:xxxxxxxxxxxxx
EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX
```

### 3. Run the App
```bash
npm start
# atau
yarn start
```

## Default Accounts

### Admin Account
- Email: `admin@gmail.com`
- Password: any password (will get admin role automatically)

### Regular User
- Register normally with any email
- Will get user role

## Troubleshooting

### White Screen on Login
1. Check Firebase config in `.env`
2. Check console for errors
3. Ensure Firebase Auth is enabled
4. Clear cache: `npm run clear`

### Firebase Errors
1. Verify all Firebase config values
2. Check Firebase project settings
3. Ensure Firestore rules allow read/write

### Build Issues
1. Clear node_modules: `rm -rf node_modules && npm install`
2. Clear Expo cache: `npx expo start --clear`
3. Reset Metro: `npx react-native start --reset-cache`

## Features
- 🔐 Email/Password Authentication
- 👤 User Profile Management
- 👨‍💼 Admin Panel
- 📊 Data Table Management
- 🌍 Multi-language (EN/ID)
- 🌙 Dark/Light Theme
- 📱 Responsive Design

## File Structure
```
├── app/                    # App screens (Expo Router)
│   ├── (auth)/            # Auth screens
│   ├── (tabs)/            # Main app tabs
│   ├── (admin)/           # Admin panel
│   └── index.jsx          # Entry point
├── components/            # Reusable components
├── contexts/              # React contexts
├── services/              # API services
├── utils/                 # Utility functions
└── constants/             # App constants
```

## Production Deployment
1. Update Firebase security rules
2. Configure proper domains in Firebase
3. Set up environment variables in hosting service
4. Build: `npx expo build:web` or `eas build`