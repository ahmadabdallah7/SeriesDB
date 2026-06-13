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

type WatchingContextType = {
  watchingList: show[];
  setWatchingList: React.Dispatch<React.SetStateAction<show[]>>;
};

const WatchingContext = createContext<WatchingContextType | null>(null);

export function WatchingProvider({
  children,
}: {
  children: React.ReactNode;
}): React.JSX.Element {
  const [watchingList, setWatchingList] = useState<show[]>([]);

  const { isLogged } = useAuth();

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
  const context = useContext(WatchingContext);

  if (!context) {
    throw new Error("updateWatching must be used within WatchingProvider");
  }

  return context;
}

export default WatchingContext;
