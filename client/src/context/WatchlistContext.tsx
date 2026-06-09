import { useState, useEffect, createContext, useContext } from "react";
import axios from "axios";

// Contexts
import { useAuth } from "./AuthContext";

// Types
type show = {
  show_id: number;
  show_name: string;
  status: string;
  genres: string[];
  rating: number;
  summary: string;
  image_url: string;
};

type WatchlistContextType = {
  watchlistList: show[];
  setWatchlistList: React.Dispatch<React.SetStateAction<show[]>>;
};

const WatchlistContext = createContext<WatchlistContextType | null>(null);

export function WatchlistProvider({
  children,
}: {
  children: React.ReactNode;
}): React.JSX.Element {
  const [watchlistList, setWatchlistList] = useState<show[]>([]);

  const { isLogged } = useAuth();

  useEffect(() => {
    async function fetchWatchlist() {
      if (!isLogged) return;

      const response = await axios.get("http://localhost:3000/watchlist/list", {
        withCredentials: true,
      });
      setWatchlistList(response.data.watchlistList);
    }
    fetchWatchlist();
  }, [isLogged]);

  return (
    <WatchlistContext.Provider value={{ watchlistList, setWatchlistList }}>
      {children}
    </WatchlistContext.Provider>
  );
}

export function updateWatchlist() {
  const context = useContext(WatchlistContext);

  if (!context) {
    throw new Error("updateWatchlist must be used within WatchlistProvider");
  }

  return context;
}

export default WatchlistContext;
