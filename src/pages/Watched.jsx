import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";

// Contexts
import { useSnackbar } from "../context/SnackbarContext";
import { updateWatched } from "../context/WatchedContext";
import WatchedContext from "../context/WatchedContext";

// Components
import Navbar from "../components/Navbar";
import ShowCard from "../components/ShowCard";
import Box from "@mui/material/Box";

// The page
function Watched() {
  const { showSnackbar } = useSnackbar();

  const { watchedList, setWatchedList } = updateWatched();

  useEffect(() => {
    async function fetchWatched() {
      const response = await axios.get("http://localhost:3000/watched/list", {
        withCredentials: true,
      });
      const success = response.data.success;

      if (success) {
        const watchedList = response.data.watchedList;
        setWatchedList(watchedList);
      }

      if (!success) {
        showSnackbar(response.data.error, "error");
      }
    }
    fetchWatched();
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
        {watchedList.map((show) => {
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
              mode="watched"
            />
          );
        })}
      </Box>
    </div>
  );
}

export default Watched;
