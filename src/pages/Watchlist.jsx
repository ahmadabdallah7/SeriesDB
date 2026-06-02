import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";

// Contexts
import { useSnackbar } from "../context/SnackbarContext";
import { updateWatchlist } from "../context/WatchlistContext";
import WatchlistContext from "../context/WatchlistContext";

// Components
import Navbar from "../components/Navbar";
import ShowCard from "../components/ShowCard";
import Box from "@mui/material/Box";

// The page
function Watchlist() {
  const { showSnackbar } = useSnackbar();

  const { watchlistList, setWatchlistList } = updateWatchlist();

  useEffect(() => {
    async function fetchWatchlist() {
      const response = await axios.get("http://localhost:3000/watchlist/list", {
        withCredentials: true,
      });
      const success = response.data.success;

      if (success) {
        const watchlistList = response.data.watchlistList;
        setWatchlistList(watchlistList);
      }

      if (!success) {
        showSnackbar(response.data.error, "error");
      }
    }
    fetchWatchlist();
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
        {watchlistList.map((show) => {
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
              mode="watchlist"
            />
          );
        })}
      </Box>
    </div>
  );
}

export default Watchlist;
