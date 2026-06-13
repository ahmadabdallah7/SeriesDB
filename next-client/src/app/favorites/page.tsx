"use client";

import { useEffect } from "react";
import axios from "axios";

// Contexts
import { useSnackbar } from "@/context/SnackbarContext";
import { updateFavorites } from "@/context/FavoritesContext";

// Components
import ShowCard from "@/components/ShowCard";
import Box from "@mui/material/Box";

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

type FavoritesResponse = {
  success: boolean;
  favoritesList: show[];
  successMsg?: string;
  error?: string;
};

// The page
function Favorites() {
  const { showSnackbar } = useSnackbar();

  const { favoritesList, setFavoritesList } = updateFavorites();

  useEffect(() => {
    async function fetchFavorites() {
      const response = await axios.get<FavoritesResponse>(
        "http://localhost:3000/favorites/list",
        {
          withCredentials: true,
        },
      );
      const success = response.data.success;

      if (success) {
        const favoritesList = response.data.favoritesList;
        setFavoritesList(favoritesList);
      }

      if (!success && response.data.error) {
        showSnackbar(response.data.error, "error");
      }
    }
    fetchFavorites();
  }, []);

  return (
    <div>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, 300px)",
          justifyContent: "center",
          gap: 3,
          mt: 5,
          px: 3,
        }}
      >
        {favoritesList
          ? favoritesList.map((show) => {
              return (
                <ShowCard
                  key={show.show_id}
                  showId={show.show_id}
                  showName={show.show_name}
                  status={show.status}
                  genres={show.genres}
                  rating={show.rating}
                  summary={show.summary}
                  imageURL={show.image_url}
                  mode="favorites"
                />
              );
            })
          : null}
      </Box>
    </div>
  );
}

export default Favorites;
