import { useEffect, useState, type KeyboardEvent } from "react";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import ProductsPage from "./pages/ProductsPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import CartPage from "./pages/CartPage";
import { useAuth } from "./context/AuthContext";
import { apiGet } from "./api/client";
import type { CartResponse } from "./types";
import "./App.css";

function App() {
  const { token, isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    if (!token) {
      setCartCount(0);
      return;
    }
    apiGet<CartResponse>("/cart", token)
      .then((cart) => setCartCount(cart.items.reduce((sum, item) => sum + item.quantity, 0)))
      .catch(() => {});
  }, [token]);

  function handleLogout() {
    logout();
    navigate("/");
  }

  function handleSearchKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      navigate(`/?search=${encodeURIComponent(search)}`);
    }
  }

  return (
    <div className="app">
      <header className="app-header">
        <Link to="/" className="logo">
          <svg width="20" height="20" viewBox="0 0 40 40" aria-hidden="true">
            <path d="M8 4h24l-4 8H16l-2 5h14l-4 8H10l-4 8H0l8-29z" fill="#c6ff3a" />
          </svg>
          FITLY
        </Link>
        <div className="search-box">
          <span aria-hidden="true">⌕</span>
          <input
            placeholder="Search products…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={handleSearchKeyDown}
          />
        </div>
        <nav>
          <Link to="/cart" className="cart-link">
            Cart
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </Link>
          {isLoggedIn ? (
            <button onClick={handleLogout}>Log out</button>
          ) : (
            <Link to="/login">Log in</Link>
          )}
        </nav>
      </header>
      <main className="app-main">
        <Routes>
          <Route path="/" element={<ProductsPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/cart" element={<CartPage />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
