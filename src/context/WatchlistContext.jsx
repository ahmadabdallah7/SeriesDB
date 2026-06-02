import { useState, useEffect, createContext, useContext } from "react";
import axios from "axios";

// Contexts
import AuthContext from "./AuthContext";

const WatchlistContext = createContext();

export function WatchlistProvider({ children }) {
  const [watchlistList, setWatchlistList] = useState([]);

  const { isLogged, setIsLogged } = useContext(AuthContext);

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
  return useContext(WatchlistContext);
}

export default WatchlistContext;
