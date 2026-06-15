"use client";

import { useEffect } from "react";

// Contexts
import { useSnackbar } from "@/context/SnackbarContext";
import { updateWatching } from "@/context/WatchingContext";

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

type WatchingClientProps = {
  initialList: Show[];
  error: string | null;
};

export default function WatchingClient({
  initialList,
  error,
}: WatchingClientProps) {
  const { showSnackbar } = useSnackbar();

  const { watchingList, setWatchingList } = updateWatching();

  useEffect(() => {
    setWatchingList(initialList);
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
