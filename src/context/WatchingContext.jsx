import { useState, useEffect, createContext, useContext } from "react";
import axios from "axios";

// Contexts
import AuthContext from "./AuthContext";

const WatchingContext = createContext();

export function WatchingProvider({ children }) {
  const [watchingList, setWatchingList] = useState([]);

  const { isLogged, setIsLogged } = useContext(AuthContext);

  useEffect(() => {
    async function fetchWatching() {
      if (!isLogged) return;

      const response = await axios.get("http://localhost:3000/watching/list", {
        withCredentials: true,
      });
      setWatchingList(response.data.watchingList);
    }
    fetchWatching();
  }, [isLogged]);

  return (
    <WatchingContext.Provider value={{ watchingList, setWatchingList }}>
      {children}
    </WatchingContext.Provider>
  );
}

export function updateWatching() {
  return useContext(WatchingContext);
}

export default WatchingContext;
