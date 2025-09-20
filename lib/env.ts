import { z } from 'zod';

const envSchema = z.object({
  // TMDB API
  TMDB_ACCESS_TOKEN: z.string().optional(),
  TMDB_API_KEY: z.string().optional(),
  
  // Firebase Client
  NEXT_PUBLIC_FIREBASE_API_KEY: z.string().min(1),
  NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: z.string().min(1),
  NEXT_PUBLIC_FIREBASE_PROJECT_ID: z.string().min(1),
  NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: z.string().min(1),
  NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: z.string().min(1),
  NEXT_PUBLIC_FIREBASE_APP_ID: z.string().min(1),
  
  // Firebase Admin
  FIREBASE_PROJECT_ID: z.string().min(1),
  FIREBASE_CLIENT_EMAIL: z.string().min(1),
  FIREBASE_PRIVATE_KEY: z.string().min(1),
  
  // MongoDB
  MONGODB_URI: z.string().min(1),
  
  // Next.js
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  NEXT_PUBLIC_APP_URL: z.string().url().optional(),
});

// Validate environment variables
const parseEnv = () => {
  try {
    return envSchema.parse(process.env);
  } catch (error) {
    console.error('❌ Invalid environment variables:', error);
    throw new Error('Invalid environment variables');
  }
};

export const env = parseEnv();

// Helper to check if we have TMDB credentials
export const hasTMDBCredentials = () => {
  return !!(env.TMDB_ACCESS_TOKEN || env.TMDB_API_KEY);
};

// Helper to get TMDB token
export const getTMDBToken = () => {
  if (env.TMDB_ACCESS_TOKEN) {
    return { type: 'access_token' as const, value: env.TMDB_ACCESS_TOKEN };
  }
  if (env.TMDB_API_KEY) {
    return { type: 'api_key' as const, value: env.TMDB_API_KEY };
  }
  throw new Error('No TMDB credentials found');
};
