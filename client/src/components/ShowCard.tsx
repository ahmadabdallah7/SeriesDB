import { useNavigate } from "react-router";
import axios from "axios";

// Authentication context
import { useAuth } from "../context/AuthContext";

// Snackbar context
import { useSnackbar } from "../context/SnackbarContext";

// Favorites context
import { updateFavorites } from "../context/FavoritesContext";

// Watched list context
import { updateWatched } from "../context/WatchedContext";

// Watching list context
import { updateWatching } from "../context/WatchingContext";

// Watchlist context
import { updateWatchlist } from "../context/WatchlistContext";

// Styling
import "./ShowCard.css";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

// Components
import Tooltip from "@mui/material/Tooltip";

// Types
type ShowCardProps = {
  showId: number;
  showName: string;
  status: string;
  genres: string[];
  rating: number;
  summary: string;
  imageURL: string;
  mode?: "result" | "favorites" | "watched" | "watching" | "watchlist";
};

function ShowCard(props: ShowCardProps) {
  const navigate = useNavigate();

  // States
  const { showSnackbar } = useSnackbar();

  const { isLogged } = useAuth();

  const { favoritesList, setFavoritesList } = updateFavorites();

  const { watchedList, setWatchedList } = updateWatched();

  const { watchingList, setWatchingList } = updateWatching();

  const { watchlistList, setWatchlistList } = updateWatchlist();

  // Checking if the show already exists in the user's lists
  const isFavorites = favoritesList.some(
    (show) => show.show_id === props.showId,
  );

  const isWatched = watchedList.some((show) => show.show_id === props.showId);

  const isWatching = watchingList.some((show) => show.show_id === props.showId);

  const isWatchlist = watchlistList.some(
    (show) => show.show_id === props.showId,
  );

  // Page mode:
  const mode = props.mode;

  // Handling favorites
  async function addToFavorites() {
    if (!isLogged) {
      navigate("/login", {
        state: {
          showName: props.showName,
        },
      });
    }

    if (isLogged) {
      const response = await axios.post(
        "http://localhost:3000/favorites/add",
        {
          showId: props.showId,
          showName: props.showName,
          status: props.status,
          genres: props.genres,
          rating: props.rating,
          summary: props.summary,
          imageURL: props.imageURL,
        },
        {
          withCredentials: true,
        },
      );

      const success = response.data.success;

      if (success) {
        const successMsg = response.data.successMsg;
        setFavoritesList(response.data.favoritesList);
        showSnackbar(successMsg, "success");
      }

      if (!success) {
        const error = response.data.error;
        showSnackbar(error, "error");
      }
    }
  }

  async function removeFromFavorites() {
    const response = await axios.post(
      "http://localhost:3000/favorites/remove",
      {
        showId: props.showId,
        showName: props.showName,
      },
      {
        withCredentials: true,
      },
    );

    const success = response.data.success;

    if (success) {
      const newFavoritesList = response.data.favoritesList;
      setFavoritesList(newFavoritesList);
      showSnackbar(response.data.successMsg, "success");
    }

    if (!success) {
      showSnackbar(response.data.error, "error");
    }
  }

  // Handling watched list
  async function addToWatched() {
    if (!isLogged) {
      navigate("/login", {
        state: {
          showName: props.showName,
        },
      });
    }

    if (isLogged) {
      const response = await axios.post(
        "http://localhost:3000/watched/add",
        {
          showId: props.showId,
          showName: props.showName,
          status: props.status,
          genres: props.genres,
          rating: props.rating,
          summary: props.summary,
          imageURL: props.imageURL,
        },
        {
          withCredentials: true,
        },
      );

      const success = response.data.success;

      if (mode === "watching") {
        const original = false;
        removeFromWatching(original);
      }

      if (success) {
        const successMsg = response.data.successMsg;
        setWatchedList(response.data.watchedList);
        showSnackbar(successMsg, "success");
      }

      if (!success) {
        const error = response.data.error;
        showSnackbar(error, "error");
      }
    }
  }

  async function removeFromWatched() {
    const response = await axios.post(
      "http://localhost:3000/watched/remove",
      {
        showId: props.showId,
        showName: props.showName,
      },
      {
        withCredentials: true,
      },
    );

    const success = response.data.success;

    if (success) {
      const newWatchedList = response.data.watchedList;
      setWatchedList(newWatchedList);
      showSnackbar(response.data.successMsg, "success");
    }

    if (!success) {
      showSnackbar(response.data.error, "error");
    }
  }

  // Handling watching list
  async function addToWatching() {
    if (!isLogged) {
      navigate("/login", {
        state: {
          showName: props.showName,
        },
      });
    }

    if (isLogged) {
      const response = await axios.post(
        "http://localhost:3000/watching/add",
        {
          showId: props.showId,
          showName: props.showName,
          status: props.status,
          genres: props.genres,
          rating: props.rating,
          summary: props.summary,
          imageURL: props.imageURL,
        },
        {
          withCredentials: true,
        },
      );

      const success = response.data.success;

      if (mode === "watchlist") {
        const original = false;
        removeFromWatchlist(original);
      }

      if (success) {
        const successMsg = response.data.successMsg;
        setWatchingList(response.data.watchingList);
        showSnackbar(successMsg, "success");
      }

      if (!success) {
        const error = response.data.error;
        showSnackbar(error, "error");
      }
    }
  }

  async function removeFromWatching(showMessage: boolean = true) {
    const response = await axios.post(
      "http://localhost:3000/watching/remove",
      {
        showId: props.showId,
        showName: props.showName,
      },
      {
        withCredentials: true,
      },
    );

    const success = response.data.success;

    if (success) {
      const newWatchingList = response.data.watchingList;
      setWatchingList(newWatchingList);
      if (showMessage) {
        showSnackbar(response.data.successMsg, "success");
      }
    }

    if (!success) {
      showSnackbar(response.data.error, "error");
    }
  }

  // Handling watchlist
  async function addToWatchlist() {
    if (!isLogged) {
      navigate("/login", {
        state: {
          showName: props.showName,
        },
      });
    }

    if (isLogged) {
      const response = await axios.post(
        "http://localhost:3000/watchlist/add",
        {
          showId: props.showId,
          showName: props.showName,
          status: props.status,
          genres: props.genres,
          rating: props.rating,
          summary: props.summary,
          imageURL: props.imageURL,
        },
        {
          withCredentials: true,
        },
      );

      const success = response.data.success;

      if (success) {
        const successMsg = response.data.successMsg;
        setWatchlistList(response.data.watchlistList);
        showSnackbar(successMsg, "success");
      }

      if (!success) {
        const error = response.data.error;
        showSnackbar(error, "error");
      }
    }
  }

  async function removeFromWatchlist(showMessage: boolean = true) {
    const response = await axios.post(
      "http://localhost:3000/watchlist/remove",
      {
        showId: props.showId,
        showName: props.showName,
      },
      {
        withCredentials: true,
      },
    );

    const success = response.data.success;

    if (success) {
      const newWatchlistList = response.data.watchlistList;
      setWatchlistList(newWatchlistList);
      if (showMessage) {
        showSnackbar(response.data.successMsg, "success");
      }
    }

    if (!success) {
      showSnackbar(response.data.error, "error");
    }
  }

  // Buttons rendering functions
  // Favorites buttons
  function renderFavoritesButton() {
    if (mode === "watched") {
      if (isFavorites) {
        return (
          <Tooltip
            title="Remove from favorites"
            arrow
            placement="top"
            slotProps={{
              tooltip: {
                sx: {
                  backgroundColor: "white",
                  color: "black",
                  "& .MuiTooltip-arrow": {
                    color: "white",
                  },
                },
              },
            }}
          >
            <button
              type="submit"
              className="btn btn-submit custom ms-1 text-white"
              onClick={removeFromFavorites}
            >
              <StarBorderIcon fontSize="small" />
            </button>
          </Tooltip>
        );
      }

      if (!isFavorites) {
        return (
          <Tooltip
            title="Add to favorites"
            arrow
            placement="top"
            slotProps={{
              tooltip: {
                sx: {
                  backgroundColor: "white",
                  color: "black",
                  "& .MuiTooltip-arrow": {
                    color: "white",
                  },
                },
              },
            }}
          >
            <button
              type="submit"
              className="btn btn-submit custom ms-1 text-white"
              onClick={addToFavorites}
            >
              <StarIcon fontSize="small" />
            </button>
          </Tooltip>
        );
      }
    }

    if (mode === "watching") {
      return null;
    }

    if (mode === "watchlist") {
      return null;
    }

    if (mode === "favorites") {
      return (
        <Tooltip
          title="Remove from favorites"
          arrow
          placement="top"
          slotProps={{
            tooltip: {
              sx: {
                backgroundColor: "white",
                color: "black",
                "& .MuiTooltip-arrow": {
                  color: "white",
                },
              },
            },
          }}
        >
          <button
            type="submit"
            className="btn btn-submit custom ms-1 text-white"
            onClick={removeFromFavorites}
          >
            <StarBorderIcon fontSize="small" />
          </button>
        </Tooltip>
      );
    }

    if (mode === "result") {
      if (isFavorites) {
        return (
          <Tooltip
            title="Remove from favorites"
            arrow
            placement="top"
            slotProps={{
              tooltip: {
                sx: {
                  backgroundColor: "white",
                  color: "black",
                  "& .MuiTooltip-arrow": {
                    color: "white",
                  },
                },
              },
            }}
          >
            <button
              type="submit"
              className="btn btn-submit custom ms-1 text-white"
              onClick={removeFromFavorites}
            >
              <StarBorderIcon fontSize="small" />
            </button>
          </Tooltip>
        );
      }

      if (!isFavorites) {
        return (
          <Tooltip
            title="Add to favorites"
            arrow
            placement="top"
            slotProps={{
              tooltip: {
                sx: {
                  backgroundColor: "white",
                  color: "black",
                  "& .MuiTooltip-arrow": {
                    color: "white",
                  },
                },
              },
            }}
          >
            <button
              type="submit"
              className="btn btn-submit custom ms-1 text-white"
              onClick={addToFavorites}
            >
              <StarIcon fontSize="small" />
            </button>
          </Tooltip>
        );
      }
    }
  }

  // Watched list buttons
  function renderWatchedButton() {
    if (mode === "favorites") {
      return null;
    }

    if (mode === "watching") {
      return (
        <Tooltip
          title="Add to watched"
          arrow
          placement="top"
          slotProps={{
            tooltip: {
              sx: {
                backgroundColor: "white",
                color: "black",
                "& .MuiTooltip-arrow": {
                  color: "white",
                },
              },
            },
          }}
        >
          <button
            type="submit"
            className="btn btn-submit custom ms-1 text-white"
            onClick={addToWatched}
          >
            <CheckIcon fontSize="small" />
          </button>
        </Tooltip>
      );
    }

    if (mode === "watchlist") {
      return null;
    }

    if (mode === "watched") {
      return (
        <Tooltip
          title="Remove from watched"
          arrow
          placement="top"
          slotProps={{
            tooltip: {
              sx: {
                backgroundColor: "white",
                color: "black",
                "& .MuiTooltip-arrow": {
                  color: "white",
                },
              },
            },
          }}
        >
          <button
            type="submit"
            className="btn btn-submit custom ms-1 text-white"
            onClick={removeFromWatched}
          >
            <CloseIcon fontSize="small" />
          </button>
        </Tooltip>
      );
    }

    if (mode === "result") {
      if (!isWatched) {
        return (
          <Tooltip
            title="Add to watched"
            arrow
            placement="top"
            slotProps={{
              tooltip: {
                sx: {
                  backgroundColor: "white",
                  color: "black",
                  "& .MuiTooltip-arrow": {
                    color: "white",
                  },
                },
              },
            }}
          >
            <button
              type="submit"
              className="btn btn-submit custom ms-1 text-white"
              onClick={addToWatched}
            >
              <CheckIcon fontSize="small" />
            </button>
          </Tooltip>
        );
      }

      if (isWatched) {
        return (
          <Tooltip
            title="Remove from watched"
            arrow
            placement="top"
            slotProps={{
              tooltip: {
                sx: {
                  backgroundColor: "white",
                  color: "black",
                  "& .MuiTooltip-arrow": {
                    color: "white",
                  },
                },
              },
            }}
          >
            <button
              type="submit"
              className="btn btn-submit custom ms-1 text-white"
              onClick={removeFromWatched}
            >
              <CloseIcon fontSize="small" />
            </button>
          </Tooltip>
        );
      }
    }
  }

  // Watching list buttons
  function renderWatchingButton() {
    if (mode === "favorites") {
      return null;
    }

    if (mode === "watched") {
      return null;
    }

    if (mode === "watchlist") {
      return (
        <Tooltip
          title="Add to watching"
          arrow
          placement="top"
          slotProps={{
            tooltip: {
              sx: {
                backgroundColor: "white",
                color: "black",
                "& .MuiTooltip-arrow": {
                  color: "white",
                },
              },
            },
          }}
        >
          <button
            type="submit"
            className="btn btn-submit custom ms-1 text-white"
            onClick={addToWatching}
          >
            <VisibilityIcon fontSize="small" />
          </button>
        </Tooltip>
      );
    }

    if (mode === "watching") {
      return (
        <Tooltip
          title="Remove from watching"
          arrow
          placement="top"
          slotProps={{
            tooltip: {
              sx: {
                backgroundColor: "white",
                color: "black",
                "& .MuiTooltip-arrow": {
                  color: "white",
                },
              },
            },
          }}
        >
          <button
            type="submit"
            className="btn btn-submit custom ms-1 text-white"
            onClick={() => removeFromWatching()}
          >
            <VisibilityOffIcon fontSize="small" />
          </button>
        </Tooltip>
      );
    }

    if (mode === "result") {
      if (!isWatching) {
        return (
          <Tooltip
            title="Add to watching"
            arrow
            placement="top"
            slotProps={{
              tooltip: {
                sx: {
                  backgroundColor: "white",
                  color: "black",
                  "& .MuiTooltip-arrow": {
                    color: "white",
                  },
                },
              },
            }}
          >
            <button
              type="submit"
              className="btn btn-submit custom ms-1 text-white"
              onClick={addToWatching}
            >
              <VisibilityIcon fontSize="small" />
            </button>
          </Tooltip>
        );
      }

      if (isWatching) {
        return (
          <Tooltip
            title="Remove from watching"
            arrow
            placement="top"
            slotProps={{
              tooltip: {
                sx: {
                  backgroundColor: "white",
                  color: "black",
                  "& .MuiTooltip-arrow": {
                    color: "white",
                  },
                },
              },
            }}
          >
            <button
              type="submit"
              className="btn btn-submit custom ms-1 text-white"
              onClick={() => removeFromWatching()}
            >
              <VisibilityOffIcon fontSize="small" />
            </button>
          </Tooltip>
        );
      }
    }
  }

  // Watchlist buttons
  function renderWatchlistButton() {
    if (mode === "watched") {
      return null;
    }

    if (mode === "watching") {
      return null;
    }

    if (mode === "favorites") {
      return null;
    }

    if (mode === "watchlist") {
      return (
        <Tooltip
          title="Remove from watchlist"
          arrow
          placement="top"
          slotProps={{
            tooltip: {
              sx: {
                backgroundColor: "white",
                color: "black",
                "& .MuiTooltip-arrow": {
                  color: "white",
                },
              },
            },
          }}
        >
          <button
            type="submit"
            className="btn btn-submit custom ms-1 text-white"
            onClick={() => removeFromWatchlist()}
          >
            <RemoveIcon fontSize="small" />
          </button>
        </Tooltip>
      );
    }

    if (mode === "result") {
      if (!isWatchlist) {
        return (
          <Tooltip
            title="Add to watchlist"
            arrow
            placement="top"
            slotProps={{
              tooltip: {
                sx: {
                  backgroundColor: "white",
                  color: "black",
                  "& .MuiTooltip-arrow": {
                    color: "white",
                  },
                },
              },
            }}
          >
            <button
              type="submit"
              className="btn btn-submit custom ms-1 text-white"
              onClick={addToWatchlist}
            >
              <AddIcon fontSize="small" />
            </button>
          </Tooltip>
        );
      }

      if (isWatchlist) {
        return (
          <Tooltip
            title="Remove from watchlist"
            arrow
            placement="top"
            slotProps={{
              tooltip: {
                sx: {
                  backgroundColor: "white",
                  color: "black",
                  "& .MuiTooltip-arrow": {
                    color: "white",
                  },
                },
              },
            }}
          >
            <button
              type="submit"
              className="btn btn-submit custom ms-1 text-white"
              onClick={() => removeFromWatchlist()}
            >
              <RemoveIcon fontSize="small" />
            </button>
          </Tooltip>
        );
      }
    }
  }

  return (
    <div>
      <div className="serie">
        <div className="poster">
          <img
            src={props.imageURL}
            alt={props.showName}
            width="300px"
            height="450px"
            loading="lazy"
          />
        </div>
        <div className="details">
          <div className="buttons-box d-flex mb-2 justify-content-end">
            {renderWatchlistButton()}
            {renderWatchingButton()}
            {renderWatchedButton()}
            {renderFavoritesButton()}
          </div>
          <h2>
            {props.showName} <br />
            <span>Status: {props.status}</span>
          </h2>
          <div className="rating">
            <p className="mb-0 roboto">Rating: {props.rating}</p>
          </div>
          <div className="tags mb-3">
            {props.genres.map((genre, index) => {
              return (
                <span
                  key={index}
                  className="badge rounded-pill text-bg-danger roboto"
                >
                  {genre}
                </span>
              );
            })}
          </div>
          <div
            className="info summary-box overflow-y-auto scrollable-text"
            dangerouslySetInnerHTML={{ __html: props.summary }}
          ></div>
        </div>
      </div>
    </div>
  );
}

export default ShowCard;
