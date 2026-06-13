import type { Metadata } from "next";

// Styling
import "bootstrap/dist/css/bootstrap.min.css";
import BootstrapClient from "@/components/BootstrapClient";
import "./globals.css";

// Contexts
import { AuthProvider } from "@/context/AuthContext";
import { FavoritesProvider } from "@/context/FavoritesContext";
import { WatchedProvider } from "@/context/WatchedContext";
import { SnackbarProvider } from "@/context/SnackbarContext";
import { WatchingProvider } from "@/context/WatchingContext";
import { WatchlistProvider } from "@/context/WatchlistContext";

// Components
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "SeriesDB",
  description: "A web app for discovering and tracking TV series.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <FavoritesProvider>
            <WatchedProvider>
              <WatchingProvider>
                <WatchlistProvider>
                  <SnackbarProvider>
                    <BootstrapClient />
                    <Navbar />
                    {children}
                  </SnackbarProvider>
                </WatchlistProvider>
              </WatchingProvider>
            </WatchedProvider>
          </FavoritesProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
