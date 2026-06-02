import React, { useState, useContext } from "react";
import { useNavigate } from "react-router";
import axios from "axios";

// Contexts
import AuthContext from "../context/AuthContext";
import { useSnackbar } from "../context/SnackbarContext";

// Styling
import "./RegisterForm.css";

function RegisterForm() {
  const navigate = useNavigate();

  const { showSnackbar } = useSnackbar();

  const { setIsLogged } = useContext(AuthContext);

  // States
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmedPassword, setConfirmedPassword] = useState("");

  function handleUsername(event) {
    setUsername(event.target.value);
  }

  function handlePassword(event) {
    setPassword(event.target.value);
  }

  function handleConfirmPassword(event) {
    setConfirmedPassword(event.target.value);
  }

  // Handling the register attempt
  async function handleRegister(event) {
    event.preventDefault();

    if (password === confirmedPassword) {
      const response = await axios.post(
        "http://localhost:3000/register",
        {
          username: username,
          password: password,
        },
        { withCredentials: true },
      );
      const isAuthenticated = response.data.isAuthenticated;

      if (response.data.error) {
        showSnackbar(response.data.error, "error");
      }

      if (isAuthenticated) {
        setIsLogged(true);
        showSnackbar(response.data.successMsg, "success");
        navigate("/");
      }
    } else {
      showSnackbar(
        "Passwords don't match, please double check the password fields.",
        "error",
      );
    }
  }

  return (
    <div className="container mt-5">
      <div className="row">
        <div className="bigBox d-flex flex-column justify-content-center align-items-center">
          <div className="col-xl-5 col-lg-6 col-md-8 col-sm-9 col-9">
            <div className="card shadow-lg">
              <div className="card-body">
                <h3 className="card-title text-center mb-4 roboto">
                  Create your account
                </h3>
                <form id="registerForm" onSubmit={handleRegister}>
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
                    <label
                      htmlFor="confirmPassword"
                      className="form-label roboto"
                    >
                      Password
                    </label>
                    <input
                      type="password"
                      className="form-control"
                      id="password"
                      placeholder="Enter your password"
                      required
                      minLength="6"
                      onChange={handlePassword}
                    />
                  </div>
                  <div className="mb-3">
                    <label
                      htmlFor="confirmPassword"
                      className="form-label roboto"
                    >
                      Confirm password
                    </label>
                    <input
                      type="password"
                      className="form-control"
                      id="password"
                      placeholder="Confirm your password"
                      required
                      minLength="6"
                      onChange={handleConfirmPassword}
                    />
                  </div>
                  <div className="text-center">
                    <button
                      type="submit"
                      id="register-btn"
                      className="btn btn-primary btn-lg roboto mt-2"
                    >
                      Register
                    </button>
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

export default RegisterForm;
