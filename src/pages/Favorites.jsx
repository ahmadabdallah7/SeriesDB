import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";

// Contexts
import { useSnackbar } from "../context/SnackbarContext";
import { updateFavorites } from "../context/FavoritesContext";
import FavoritesContext from "../context/FavoritesContext";

// Components
import Navbar from "../components/Navbar";
import ShowCard from "../components/ShowCard";
import Box from "@mui/material/Box";

// The page
function Favorites() {
  const { showSnackbar } = useSnackbar();

  const { favoritesList, setFavoritesList } = updateFavorites();

  useEffect(() => {
    async function fetchFavorites() {
      const response = await axios.get("http://localhost:3000/favorites/list", {
        withCredentials: true,
      });
      const success = response.data.success;

      if (success) {
        const favoritesList = response.data.favoritesList;
        setFavoritesList(favoritesList);
      }

      if (!success) {
        showSnackbar(response.data.error, "error");
      }
    }
    fetchFavorites();
  }, []);

  return (
    <div>
      <Navbar />
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
        {favoritesList.map((show) => {
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
        })}
      </Box>
    </div>
  );
}

export default Favorites;
