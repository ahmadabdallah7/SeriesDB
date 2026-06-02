import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";

// Contexts
import { useSnackbar } from "../context/SnackbarContext";
import { updateWatching } from "../context/WatchingContext";
import WatchingContext from "../context/WatchingContext";

// Components
import Navbar from "../components/Navbar";
import ShowCard from "../components/ShowCard";
import Box from "@mui/material/Box";

// The page
function Watching() {
  const { showSnackbar } = useSnackbar();

  const { watchingList, setWatchingList } = updateWatching();

  useEffect(() => {
    async function fetchWatching() {
      const response = await axios.get("http://localhost:3000/watching/list", {
        withCredentials: true,
      });
      const success = response.data.success;

      if (success) {
        const watchingList = response.data.watchingList;
        setWatchingList(watchingList);
      }

      if (!success) {
        showSnackbar(response.data.error, "error");
      }
    }
    fetchWatching();
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
        {watchingList.map((show) => {
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
              mode="watching"
            />
          );
        })}
      </Box>
    </div>
  );
}

export default Watching;
