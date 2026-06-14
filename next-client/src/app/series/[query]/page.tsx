import axios from "axios";

// Components
import SearchBar from "@/components/SearchBar";
import ShowCard from "@/components/ShowCard";
import ResultClient from "@/components/ResultClient";

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

type ResultPageParams = {
  params: Promise<{ query: string }>;
};

// The page
async function Result({ params }: ResultPageParams) {
  const { query } = await params;

  let showData = null;
  let error = null;

  try {
    const response = await axios.get<ShowDataType>(
      "https://api.tvmaze.com/singlesearch/shows?q=" + query,
    );
    error = null;
    showData = response.data;
  } catch (e) {
    console.log(e);

    showData = null;
    error = "Show not found! Try to search again.";
  }

  return (
    <ResultClient error={error}>
      <div>
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
    </ResultClient>
  );
}

export default Result;
