import axios from "axios";
import { cookies } from "next/headers";

// Clients
import WatchlistClient from "@/components/WatchlistClient";

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

type WatchlistResponse = {
  success: boolean;
  watchlistList: Show[];
  successMsg?: string;
  error?: string;
};

// The page
async function Watchlist() {
  let watchlistList: Show[] = [];
  let error: string | null = null;

  // getting the incoming browser cookie
  const cookieStore = await cookies();

  // converting the cookie into a header string
  const cookieHeader = cookieStore.toString();

  try {
    const response = await axios.get<WatchlistResponse>(
      "http://localhost:3000/watchlist/list",
      {
        headers: {
          Cookie: cookieHeader,
        },
      },
    );
    const success = response.data.success;

    if (success) {
      watchlistList = response.data.watchlistList;
    }

    if (!success && response.data.error) {
      error = response.data.error;
    }
  } catch (e) {
    error = "Failed to fetch watchlist.";
  }

  return (
    <WatchlistClient
      initialList={watchlistList}
      error={error}
    ></WatchlistClient>
  );
}

export default Watchlist;
