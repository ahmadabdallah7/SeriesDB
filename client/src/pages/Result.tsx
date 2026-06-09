import { useState, useEffect } from "react";
import { useLocation } from "react-router";
import axios from "axios";

// Contexts
import { useSnackbar } from "../context/SnackbarContext";

// Components
import SearchBar from "../components/SearchBar";
import Navbar from "../components/Navbar";
import ShowCard from "../components/ShowCard";

// Types
type ShowDataType = {
  id: number;
  name: string;
  status: string;
  genres: string[];
  rating: {
    average: number;
  };
  summary: string;
  image: {
    original: string;
  };
};

// The page
function Result() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const query = params.get("q");

  const { showSnackbar } = useSnackbar();

  const [showData, setShowData] = useState<ShowDataType | null>(null);

  useEffect(() => {
    async function fetchShow() {
      try {
        const response = await axios.get<ShowDataType>(
          "https://api.tvmaze.com/singlesearch/shows?q=" + query,
        );

        setShowData(response.data);
      } catch (error) {
        console.log(error);

        setShowData(null);

        showSnackbar("Show not found! Try to search again.", "error");
      }
    }
    fetchShow();
  }, [query]);

  return (
    <div>
      <Navbar />
      <div className="container result-box d-flex flex-column justify-content-center align-items-center">
        <SearchBar />
        {showData && (
          <ShowCard
            showId={showData.id}
            showName={showData.name}
            status={showData.status}
            genres={showData.genres}
            rating={showData.rating.average}
            summary={showData.summary}
            imageURL={showData.image.original}
            mode="result"
          />
        )}
      </div>
    </div>
  );
}

export default Result;
