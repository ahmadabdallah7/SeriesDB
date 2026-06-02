import React from "react";

// Components
import Navbar from "../components/Navbar";
import SearchBar from "../components/SearchBar";

// The page
function Home() {
  return (
    <div>
      <Navbar />
      <div className="search-box d-flex justify-content-center align-items-center">
        <SearchBar />
      </div>
    </div>
  );
}

export default Home;
