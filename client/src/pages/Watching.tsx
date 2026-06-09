import { useEffect } from "react";
import axios from "axios";

// Contexts
import { useSnackbar } from "../context/SnackbarContext";
import { updateWatching } from "../context/WatchingContext";

// Components
import Navbar from "../components/Navbar";
import ShowCard from "../components/ShowCard";
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

type WatchingResponse = {
  success: boolean;
  watchingList: show[];
  successMsg?: string;
  error?: string;
};

// The page
function Watching() {
  const { showSnackbar } = useSnackbar();

  const { watchingList, setWatchingList } = updateWatching();

  useEffect(() => {
    async function fetchWatching() {
      const response = await axios.get<WatchingResponse>(
        "http://localhost:3000/watching/list",
        {
          withCredentials: true,
        },
      );
      const success = response.data.success;

      if (success) {
        const watchingList = response.data.watchingList;
        setWatchingList(watchingList);
      }

      if (!success && response.data.error) {
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
        {watchingList
          ? watchingList.map((show) => {
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
            })
          : null}
      </Box>
    </div>
  );
}

export default Watching;
