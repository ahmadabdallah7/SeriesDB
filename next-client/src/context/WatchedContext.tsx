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

type WatchedContextType = {
  watchedList: show[];
  setWatchedList: React.Dispatch<React.SetStateAction<show[]>>;
};

const WatchedContext = createContext<WatchedContextType | null>(null);

export function WatchedProvider({
  children,
}: {
  children: React.ReactNode;
}): React.JSX.Element {
  const [watchedList, setWatchedList] = useState<show[]>([]);

  const { isLogged } = useAuth();

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
  const context = useContext(WatchedContext);

  if (!context) {
    throw new Error("updateWatched must be used within WatchedProvider");
  }

  return context;
}

export default WatchedContext;
