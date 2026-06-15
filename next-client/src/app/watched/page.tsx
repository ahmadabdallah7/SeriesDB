import axios from "axios";
import { cookies } from "next/headers";

// Client
import WatchedClient from "@/components/WatchedClient";

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

type WatchedResponse = {
  success: boolean;
  watchedList: Show[];
  successMsg?: string;
  error?: string;
};

// The page
async function Watched() {
  let watchedList: Show[] = [];
  let error: string | null = null;

  // getting incoming browser cookies
  const cookieStore = await cookies();

  // converting cookies into header string
  const cookieHeader = cookieStore.toString();

  try {
    const response = await axios.get<WatchedResponse>(
      "http://localhost:3000/watched/list",
      {
        headers: {
          Cookie: cookieHeader,
        },
      },
    );
    const success = response.data.success;

    if (success) {
      watchedList = response.data.watchedList;
    }
    if (!success && response.data.error) {
      error = response.data.error;
    }
  } catch (e) {
    error = "Failed to fetch watched list";
  }

  return (
    <WatchedClient initialList={watchedList} error={error}></WatchedClient>
  );
}

export default Watched;
