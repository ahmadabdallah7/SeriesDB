import ReactDOM from "react-dom/client";

// Contexts
import { AuthProvider } from "./context/AuthContext";
import { SnackbarProvider } from "./context/SnackbarContext";
import { FavoritesProvider } from "./context/FavoritesContext";
import { WatchedProvider } from "./context/WatchedContext";
import { WatchingProvider } from "./context/WatchingContext";
import { WatchlistProvider } from "./context/WatchlistContext";

// App
import App from "./components/App";

// Styling
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "./styles/main.css";

const root = ReactDOM.createRoot(document.getElementById("root")!);

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
