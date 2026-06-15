import axios from "axios";
import { cookies } from "next/headers";

// Client
import FavoritesClient from "@/components/FavoritesClient";

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

type FavoritesResponse = {
  success: boolean;
  favoritesList: Show[];
  successMsg?: string;
  error?: string;
};

// The page
async function Favorites() {
  let favoritesList: Show[] = [];
  let error: string | null = null;

  // getting the incoming browser cookie
  const cookieStore = await cookies();

  // converting the cookie into a header string
  const cookieHeader = cookieStore.toString();

  try {
    const response = await axios.get<FavoritesResponse>(
      "http://localhost:3000/favorites/list",
      {
        headers: {
          Cookie: cookieHeader,
        },
      },
    );
    const success = response.data.success;

    if (success) {
      favoritesList = response.data.favoritesList;
    }

    if (!success && response.data.error) {
      error = response.data.error;
    }
  } catch (e) {
    error = "Failed to fetch favorites.";
  }

  return (
    <FavoritesClient
      initialList={favoritesList}
      error={error}
    ></FavoritesClient>
  );
}

export default Favorites;
