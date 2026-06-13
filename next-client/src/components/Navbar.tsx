"use client";

import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";

// Contexts
import { useAuth } from "@/context/AuthContext";
import { useSnackbar } from "@/context/SnackbarContext";

// Styling
import "./Navbar.css";
import LiveTvIcon from "@mui/icons-material/LiveTv";

// Types
type LogoutData = {
  success: boolean;
  isAuthenticated: boolean;
  successMsg?: string;
  error?: string;
};

type AuthCheckData = {
  isAuthenticated: boolean;
};

function Navbar() {
  const { showSnackbar } = useSnackbar();
  const router = useRouter();

  function handleLogin() {
    router.push("/login");
  }

  // Conditional rendering for the login/logout buttons
  const { isLogged, setIsLogged } = useAuth();

  // Handling logout
  async function handleLogout() {
    try {
      const response = await axios.post<LogoutData>(
        "http://localhost:3000/logout",
        {},
        {
          withCredentials: true,
        },
      );

      if (response.data.success && response.data.successMsg) {
        setIsLogged(false);
        showSnackbar(response.data.successMsg, "success");
        router.push("/");
      }
    } catch (error) {
      console.log("Error logging out the user: ", error);
    }
  }

  // Handling favorites list get request
  async function handleFavorites() {
    const response = await axios.get<AuthCheckData>(
      "http://localhost:3000/auth/status",
      {
        withCredentials: true,
      },
    );

    const isAuthenticated = response.data.isAuthenticated;

    if (isAuthenticated) {
      router.push("/favorites");
    } else {
      router.push("/login");
    }
  }

  // Handling watched list get request
  async function handleWatched() {
    const response = await axios.get<AuthCheckData>(
      "http://localhost:3000/auth/status",
      {
        withCredentials: true,
      },
    );

    const isAuthenticated = response.data.isAuthenticated;

    if (isAuthenticated) {
      router.push("/watched");
    } else {
      router.push("/login");
    }
  }

  // Handling watching list get request
  async function handleWatching() {
    const response = await axios.get<AuthCheckData>(
      "http://localhost:3000/auth/status",
      {
        withCredentials: true,
      },
    );

    const isAuthenticated = response.data.isAuthenticated;

    if (isAuthenticated) {
      router.push("/watching");
    } else {
      router.push("/login");
    }
  }

  // Handling watchlist get request
  async function handleWatchlist() {
    const response = await axios.get<AuthCheckData>(
      "http://localhost:3000/auth/status",
      {
        withCredentials: true,
      },
    );

    const isAuthenticated = response.data.isAuthenticated;

    if (isAuthenticated) {
      router.push("/watchlist");
    } else {
      router.push("/login");
    }
  }

  return (
    <section id="bar">
      <nav className="navbar navbar-expand-lg navbar-dark">
        <div className="container">
          <Link className="navbar-brand ms-3 kanit-medium" href="/">
            <LiveTvIcon fontSize="medium" sx={{ mr: "5px", mt: "-8px" }} />
            SeriesDB
          </Link>
          <button
            className="navbar-toggler me-3"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <Link className="nav-link roboto" href="/">
                  Home
                </Link>
              </li>
              <li className="nav-item">
                <button
                  className="nav-link me-2 roboto border-0 bg-transparent"
                  onClick={handleFavorites}
                >
                  Favorites
                </button>
              </li>
              <li className="nav-item">
                <button
                  className="nav-link me-2 roboto border-0 bg-transparent"
                  onClick={handleWatched}
                >
                  Watched
                </button>
              </li>
              <li className="nav-item">
                <button
                  className="nav-link me-2 roboto border-0 bg-transparent"
                  onClick={handleWatching}
                >
                  Watching
                </button>
              </li>
              <li className="nav-item">
                <button
                  className="nav-link me-2 roboto border-0 bg-transparent"
                  onClick={handleWatchlist}
                >
                  Watchlist
                </button>
              </li>

              {isLogged ? (
                <li>
                  <button
                    type="button"
                    className="btn btn-light login-btn roboto"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </li>
              ) : (
                <li>
                  <button
                    type="button"
                    className="btn btn-light login-btn roboto"
                    onClick={handleLogin}
                  >
                    Login
                  </button>
                </li>
              )}
            </ul>
          </div>
        </div>
      </nav>
    </section>
  );
}

export default Navbar;
