import { useState } from "react";
import { useNavigate } from "react-router";

// Styling
import "./SearchBar.css";

function SearchBar() {
  const navigate = useNavigate();

  const [show, setShow] = useState<string>("");

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    setShow(event.target.value);
  }

  function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    navigate("/search?q=" + encodeURIComponent(show));
  }

  return (
    <section id="main" className="mb-3">
      <div className="container">
        <div className="row">
          <div className="col-12 col-md-12 col-lg-12">
            <div className="search-container position-relative align-items-center mb-4">
              <form
                className="d-flex align-items-center"
                onSubmit={handleSubmit}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="search-icon feather feather-search"
                >
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
                <input
                  className="form-control search-input ps-5"
                  name="selection"
                  type="search"
                  placeholder="Search for any show..."
                  aria-label="Search"
                  onChange={handleChange}
                />
                <button className="btn-search ms-2" type="submit">
                  Search
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default SearchBar;
