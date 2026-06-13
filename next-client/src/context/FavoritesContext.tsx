"use client";

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

type FavoritesContextType = {
  favoritesList: show[];
  setFavoritesList: React.Dispatch<React.SetStateAction<show[]>>;
};

const FavoritesContext = createContext<FavoritesContextType | null>(null);

export function FavoritesProvider({
  children,
}: {
  children: React.ReactNode;
}): React.JSX.Element {
  const [favoritesList, setFavoritesList] = useState<show[]>([]);

  const { isLogged } = useAuth();

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
  const context = useContext(FavoritesContext);

  if (!context) {
    throw new Error("updateFavorites must be used within FavoritesProvider");
  }

  return context;
}

export default FavoritesContext;
