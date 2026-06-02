import React from "react";
import ReactDOM from "react-dom/client";

// Contexts
import { AuthProvider } from "./context/AuthContext.jsx";
import { SnackbarProvider } from "./context/SnackbarContext.jsx";
import { FavoritesProvider } from "./context/FavoritesContext.jsx";
import { WatchedProvider } from "./context/WatchedContext.jsx";
import { WatchingProvider } from "./context/WatchingContext.jsx";
import { WatchlistProvider } from "./context/WatchlistContext.jsx";

// App
import App from "./components/App.jsx";

// Styling
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "./styles/main.css";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <AuthProvider>
    <FavoritesProvider>
      <WatchedProvider>
        <WatchingProvider>
          <WatchlistProvider>
            <SnackbarProvider>
              <App />
            </SnackbarProvider>
          </WatchlistProvider>
        </WatchingProvider>
      </WatchedProvider>
    </FavoritesProvider>
  </AuthProvider>,
);
