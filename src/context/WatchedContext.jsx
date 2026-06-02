import { useState, useEffect, createContext, useContext } from "react";
import axios from "axios";

// Contexts
import AuthContext from "./AuthContext";

const WatchedContext = createContext();

export function WatchedProvider({ children }) {
  const [watchedList, setWatchedList] = useState([]);

  const { isLogged, setIsLogged } = useContext(AuthContext);

  useEffect(() => {
    async function fetchWatched() {
      if (!isLogged) return;

      const response = await axios.get("http://localhost:3000/watched/list", {
        withCredentials: true,
      });
      setWatchedList(response.data.watchedList);
    }
    fetchWatched();
  }, [isLogged]);

  return (
    <WatchedContext.Provider value={{ watchedList, setWatchedList }}>
      {children}
    </WatchedContext.Provider>
  );
}

export function updateWatched() {
  return useContext(WatchedContext);
}

export default WatchedContext;
