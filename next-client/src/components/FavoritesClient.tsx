"use client";

import { useEffect } from "react";

// Contexts
import { useSnackbar } from "@/context/SnackbarContext";
import { updateFavorites } from "@/context/FavoritesContext";

// Components
import ShowCard from "@/components/ShowCard";
import Box from "@mui/material/Box";

// Types
type Show = {
  show_id: number;
  show_name: string;
  status: string;
  genres: string[];
  rating: number;
  summary: string;
  image_url: string;
};

type FavoritesClientProps = {
  initialList: Show[];
  error: string | null;
};

export default function FavoritesClient({
  initialList,
  error,
}: FavoritesClientProps) {
  const { showSnackbar } = useSnackbar();
  const { favoritesList, setFavoritesList } = updateFavorites();

  useEffect(() => {
    setFavoritesList(initialList);
  }, [initialList]);

  useEffect(() => {
    if (error) {
      showSnackbar(error, "error");
    }
  }, [error]);

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
