# Movie Web App Setup Guide

This is a comprehensive movie browsing application built with Next.js, TypeScript, Firebase Auth, and MongoDB.

## Features

- 🎬 Browse Movies, TV Shows, and Anime
- 🔍 Search functionality across all content types
- ⭐ User ratings and reviews
- 🎭 Cast and crew information
- 🎥 Movie trailers and videos
- ❤️ Personal watchlist
- 🔐 Firebase Authentication
- 📱 Responsive design
- 🌙 Dark/Light theme

## Prerequisites

- Node.js 18+ 
- MongoDB database
- Firebase project
- TMDB API account

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# TMDB API Configuration
TMDB_ACCESS_TOKEN=your_tmdb_access_token_here
TMDB_API_KEY=your_tmdb_api_key_here

# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Firebase Admin SDK
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_CLIENT_EMAIL=your_service_account_email
FIREBASE_PRIVATE_KEY=your_private_key

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/movie-web
```

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. TMDB API Setup

1. Go to [TMDB](https://www.themoviedb.org/settings/api)
2. Create an account if you don't have one
3. Request an API key (v3) or access token (v4)
4. Add the credentials to your `.env.local` file

### 3. Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Enable Authentication and select Google as a provider
4. Go to Project Settings > Service Accounts
5. Generate a new private key and download the JSON file
6. Add the credentials to your `.env.local` file

### 4. MongoDB Setup

1. Install MongoDB locally or use MongoDB Atlas
2. Create a database named `movie-web`
3. Add the connection string to your `.env.local` file

### 5. Run the Application

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Project Structure

```
movie-web/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── ui/               # Shadcn UI components
│   ├── AuthButton.tsx    # Authentication button
│   ├── ContentTypeDropdown.tsx
│   ├── MovieCard.tsx     # Enhanced movie card
│   ├── MovieCarousel.tsx # Content carousel
│   └── MovieDetailModal.tsx
├── contexts/             # React contexts
│   └── AuthContext.tsx   # Firebase auth context
├── hooks/                # Custom hooks
│   └── useWatchlist.ts   # Watchlist management
├── lib/                  # Utility functions
│   ├── firebase.ts       # Firebase config
│   ├── mongodb.ts        # MongoDB config
│   └── getMovies.ts      # TMDB API functions
└── typing.ts             # TypeScript types
```

## API Endpoints

- `GET /api/movie/[id]` - Get movie details
- `GET /api/movie/[id]/credits` - Get movie cast and crew
- `GET /api/movie/[id]/videos` - Get movie videos/trailers
- `GET /api/tv/[id]` - Get TV show details
- `GET /api/tv/[id]/credits` - Get TV show cast and crew
- `GET /api/tv/[id]/videos` - Get TV show videos/trailers
- `GET /api/watchlist` - Get user's watchlist
- `POST /api/watchlist` - Add item to watchlist
- `DELETE /api/watchlist` - Remove item from watchlist

## Technologies Used

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS, Shadcn UI
- **Authentication**: Firebase Auth
- **Database**: MongoDB
- **API**: TMDB API
- **Icons**: Lucide React

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License.
