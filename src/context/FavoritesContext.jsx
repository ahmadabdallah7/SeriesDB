import { useState, useEffect, createContext, useContext } from "react";
import axios from "axios";

// Contexts
import AuthContext from "./AuthContext";

const FavoritesContext = createContext();

export function FavoritesProvider({ children }) {
  const [favoritesList, setFavoritesList] = useState([]);

  const { isLogged, setIsLogged } = useContext(AuthContext);

  useEffect(() => {
    async function fetchFavorites() {
      if (!isLogged) return;

      const response = await axios.get("http://localhost:3000/favorites/list", {
        withCredentials: true,
      });

      setFavoritesList(response.data.favoritesList);
    }

    fetchFavorites();
  }, [isLogged]);

  return (
    <FavoritesContext.Provider value={{ favoritesList, setFavoritesList }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function updateFavorites() {
  return useContext(FavoritesContext);
}

export default FavoritesContext;
