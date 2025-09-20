# 🔧 Environment Setup Guide

This guide will help you set up all the required APIs and credentials for the Movie Web App.

## 📋 Required Services & APIs

### 1. 🎬 TMDB (The Movie Database) API
**Purpose**: Movie, TV show, and anime data, trailers, cast information

**Setup Steps**:
1. Go to [TMDB](https://www.themoviedb.org/settings/api)
2. Create an account (free)
3. Request an API key (v3) or access token (v4)
4. **Recommended**: Use v4 access token for better performance

**Required Credentials**:
```env
TMDB_ACCESS_TOKEN=your_tmdb_access_token_here
TMDB_API_KEY=your_tmdb_api_key_here
```

### 2. 🔐 Firebase Authentication
**Purpose**: User authentication (Google sign-in)

**Setup Steps**:
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Enable Authentication:
   - Go to Authentication > Sign-in method
   - Enable Google provider
   - Add your domain to authorized domains
4. Get Web App configuration:
   - Go to Project Settings > General
   - Scroll down to "Your apps" section
   - Click "Add app" > Web app
   - Copy the config values

**Required Credentials**:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### 3. 🔑 Firebase Admin SDK
**Purpose**: Server-side authentication verification

**Setup Steps**:
1. In Firebase Console, go to Project Settings > Service Accounts
2. Click "Generate new private key"
3. Download the JSON file
4. Extract the values from the JSON file

**Required Credentials**:
```env
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_CLIENT_EMAIL=your_service_account_email
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour private key here\n-----END PRIVATE KEY-----\n"
```

### 4. 🗄️ MongoDB Database
**Purpose**: Store user watchlists and data

**Option A: MongoDB Atlas (Cloud) - Recommended**
1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a free account
3. Create a new cluster
4. Create a database user
5. Get connection string

**Option B: Local MongoDB**
1. Install MongoDB locally
2. Start MongoDB service
3. Create database `movie-web`

**Required Credentials**:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/movie-web
# OR for local:
MONGODB_URI=mongodb://localhost:27017/movie-web
```

## 🚀 Complete .env.local File

Create a `.env.local` file in your project root with all the credentials:

```env
# TMDB API Configuration
TMDB_ACCESS_TOKEN=eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI...
TMDB_API_KEY=your_tmdb_api_key_here

# Firebase Configuration (Client-side)
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyC...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef

# Firebase Admin SDK (Server-side)
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC...\n-----END PRIVATE KEY-----\n"

# MongoDB Configuration
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/movie-web
```

## 🔍 How to Get Each Credential

### TMDB API Key
1. Visit: https://www.themoviedb.org/settings/api
2. Click "Create" under API
3. Choose "Developer" type
4. Fill in the form
5. Copy the API Key (v3) or Access Token (v4)

### Firebase Web App Config
1. Visit: https://console.firebase.google.com/
2. Select your project
3. Go to Project Settings (gear icon)
4. Scroll to "Your apps" section
5. Click "Add app" > Web app
6. Register app and copy config

### Firebase Admin SDK
1. In Firebase Console > Project Settings
2. Go to "Service accounts" tab
3. Click "Generate new private key"
4. Download JSON file
5. Extract: project_id, client_email, private_key

### MongoDB Atlas Connection
1. Visit: https://www.mongodb.com/atlas
2. Create cluster
3. Click "Connect" > "Connect your application"
4. Copy connection string
5. Replace `<password>` with your database user password

## ✅ Verification Steps

After setting up all credentials:

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Test the build**:
   ```bash
   npm run build
   ```

3. **Start development server**:
   ```bash
   npm run dev
   ```

4. **Test features**:
   - Sign in with Google
   - Browse movies/TV shows/anime
   - Add items to watchlist
   - View detailed content pages

## 🚨 Common Issues & Solutions

### Firebase Import Error
- **Issue**: `Module not found: Can't resolve 'firebase/app'`
- **Solution**: Run `npm install firebase firebase-admin`

### MongoDB Connection Error
- **Issue**: `MongoServerError: Authentication failed`
- **Solution**: Check MongoDB URI and ensure user has proper permissions

### TMDB API Error
- **Issue**: `401 Unauthorized`
- **Solution**: Verify TMDB API key/token is correct

### Firebase Auth Error
- **Issue**: `Firebase: Error (auth/configuration-not-found)`
- **Solution**: Check all Firebase environment variables are set

## 📞 Support

If you encounter any issues:
1. Check the console for error messages
2. Verify all environment variables are set correctly
3. Ensure all services are properly configured
4. Check the browser network tab for API call failures

## 🎯 Quick Start Checklist

- [ ] TMDB API key obtained
- [ ] Firebase project created and configured
- [ ] Firebase Admin SDK credentials obtained
- [ ] MongoDB database set up
- [ ] All environment variables added to `.env.local`
- [ ] Dependencies installed (`npm install`)
- [ ] Application builds successfully (`npm run build`)
- [ ] Development server starts (`npm run dev`)
