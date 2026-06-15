import axios from "axios";
import { cookies } from "next/headers";

// Client
import WatchingClient from "@/components/WatchingClient";

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

type WatchingResponse = {
  success: boolean;
  watchingList: Show[];
  successMsg?: string;
  error?: string;
};

// The page
async function Watching() {
  let watchingList: Show[] = [];
  let error: string | null = null;

  // getting the incoming browser cookie
  const cookieStore = await cookies();

  // converting the cookie into a header string
  const cookieHeader = cookieStore.toString();

  try {
    const response = await axios.get<WatchingResponse>(
      "http://localhost:3000/watching/list",
      {
        headers: {
          Cookie: cookieHeader,
        },
      },
    );
    const success = response.data.success;

    if (success) {
      watchingList = response.data.watchingList;
    }

    if (!success && response.data.error) {
      error = response.data.error;
    }
  } catch (e) {
    error = "Failed to fetch watching list";
  }

  return (
    <WatchingClient initialList={watchingList} error={error}></WatchingClient>
  );
}

export default Watching;
