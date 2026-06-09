import { BrowserRouter, Routes, Route } from "react-router";

// Styling
import "./App.css";

// Pages
import Home from "../pages/Home";
import Result from "../pages/Result";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Favorites from "../pages/Favorites";
import Watched from "../pages/Watched";
import Watching from "../pages/Watching";
import Watchlist from "../pages/Watchlist";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/search" element={<Result />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/watching" element={<Watching />} />
        <Route path="/watchlist" element={<Watchlist />} />
        <Route path="/watched" element={<Watched />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
