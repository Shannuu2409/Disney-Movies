import { z } from 'zod';

const envSchema = z.object({
  // TMDB API
  TMDB_ACCESS_TOKEN: z.string().optional(),
  TMDB_API_KEY: z.string().optional(),
  
  // Clerk
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string().min(1),
  CLERK_SECRET_KEY: z.string().min(1),

  // MongoDB
  MONGODB_URI: z.string().min(1),
  
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
