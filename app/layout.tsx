import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AuthProvider } from "@/contexts/AuthContext";
import GenreDropdown from "@/components/GenreDropdown";
import ErrorBoundary from "@/components/ErrorBoundary";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "Movie Web App",
    template: "%s | Movie Web App",
  },
  description: "Discover and explore movies, TV shows, and anime. Browse trending content, search for your favorites, and create your personal watchlist.",
  keywords: ["movies", "TV shows", "anime", "entertainment", "watchlist", "streaming"],
  authors: [{ name: "Movie Web Team" }],
  creator: "Movie Web Team",
  publisher: "Movie Web",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    title: 'Movie Web App',
    description: 'Discover and explore movies, TV shows, and anime. Browse trending content, search for your favorites, and create your personal watchlist.',
    siteName: 'Movie Web App',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Movie Web App',
    description: 'Discover and explore movies, TV shows, and anime. Browse trending content, search for your favorites, and create your personal watchlist.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ErrorBoundary>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <AuthProvider>
              <Header genreDropdown={<GenreDropdown />} />
              {children}
            </AuthProvider>
          </ThemeProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}