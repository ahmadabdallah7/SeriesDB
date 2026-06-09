import { useState } from "react";
import { useNavigate, useLocation } from "react-router";
import axios from "axios";

// Contexts
import { useAuth } from "../context/AuthContext";
import { useSnackbar } from "../context/SnackbarContext";

// Styling
import "./SignIn.css";

// Types
type AttemptData = {
  success: boolean;
  isAuthenticated: boolean;
  successMsg?: string;
  error?: string;
};

function SignIn() {
  const navigate = useNavigate();
  const location = useLocation();

  const { showName } = location.state || {};

  const { showSnackbar } = useSnackbar();

  const { setIsLogged } = useAuth();

  function handleRegister() {
    navigate("/register");
  }

  // States
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  function handleUsername(event: React.ChangeEvent<HTMLInputElement>) {
    setUsername(event.target.value);
  }

  function handlePassword(event: React.ChangeEvent<HTMLInputElement>) {
    setPassword(event.target.value);
  }

  // Handling the login attempt
  async function handleLogin(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    const response = await axios.post<AttemptData>(
      "http://localhost:3000/login",
      {
        username: username,
        password: password,
      },
      {
        withCredentials: true,
      },
    );

    const isAuthenticated = response.data.isAuthenticated;

    if (response.data.error) {
      showSnackbar(response.data.error, "error");
    }

    if (isAuthenticated && response.data.successMsg) {
      setIsLogged(true);
      showSnackbar(response.data.successMsg, "success");

      if (showName) {
        navigate("/search?q=" + encodeURIComponent(showName));
      } else {
        navigate("/");
      }
    }
  }

  return (
    <div className="container mt-5">
      <div className="row">
        <div className="bigBox d-flex flex-column justify-content-center align-items-center">
          <div className="col-xl-4 col-lg-5 col-md-7 col-sm-9 col-9">
            <div className="card shadow-lg">
              <div className="card-body">
                <h3 className="card-title text-center mb-4 roboto">Sign in</h3>
                <form id="loginForm" onSubmit={handleLogin}>
                  <div className="mb-3">
                    <label htmlFor="username" className="form-label roboto">
                      Username
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="username"
                      placeholder="Enter your username"
                      required
                      onChange={handleUsername}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="password" className="form-label roboto">
                      Password
                    </label>
                    <input
                      type="password"
                      className="form-control"
                      id="password"
                      placeholder="Enter your password"
                      required
                      minLength={6}
                      onChange={handlePassword}
                    />
                  </div>
                  <div className="text-center">
                    <button
                      type="submit"
                      id="login-btn"
                      className="btn btn-primary btn-lg roboto mt-2"
                    >
                      Login
                    </button>
                    <p className="text-center text-muted mt-4">
                      Don't have an account yet?{" "}
                      <button
                        type="button"
                        className="text-decoration-none register-button px-0 border-0 bg-transparent"
                        onClick={handleRegister}
                      >
                        Register
                      </button>
                      .
                    </p>
                    <div id="formFeedback" className="mt-3"></div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignIn;
