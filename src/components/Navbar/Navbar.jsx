
import React, { useContext, useState, useEffect } from "react";
import "./Navbar.css";
import { assets } from "../../assets/assets";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { StoreGive } from "../../context/StoreGive";

const Navbar = () => {
  const {
    cartItems,
    shop_list = [],
    getImageUrl,
  } = useContext(StoreGive);

  const location = useLocation();
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);
  const [customer, setCustomer] = useState(null);

  // Search States
  const [searchQuery, setSearchQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);

  // Load Customer Information
  const loadCustomer = () => {
    try {
      const savedCustomer = localStorage.getItem("nile_customer");
      const savedToken = localStorage.getItem("token");

      if (savedCustomer && savedToken) {
        setCustomer(JSON.parse(savedCustomer));
      } else {
        setCustomer(null);
      }
    } catch (error) {
      console.error("Unable to load customer:", error);
      setCustomer(null);
    }
  };

  useEffect(() => {
    loadCustomer();
  }, [location.pathname]);

  // Calculate Cart Quantity
  const cartCount = Object.values(cartItems || {}).reduce(
    (total, quantity) => total + (Number(quantity) || 0),
    0
  );

  // Close Menu and Search on Route Change
  useEffect(() => {
    setMenuOpen(false);
    setSearchOpen(false);
  }, [location.pathname, location.hash]);

  const closeMenu = () => setMenuOpen(false);

  // Logout
  const handleLogout = () => {
    const confirmLogout = window.confirm(
      "Are you sure you want to logout?"
    );

    if (!confirmLogout) return;

    localStorage.removeItem("token");
    localStorage.removeItem("nile_customer");

    setCustomer(null);
    setMenuOpen(false);

    navigate("/login");
  };

  // Check Active Route
  const isActive = (path) => location.pathname === path;

  // ================================
  // PRODUCT SEARCH
  // ================================

  const searchResults = searchQuery.trim()
    ? shop_list
        .filter((product) => {
          const query = searchQuery.trim().toLowerCase();

          const productName = product.name?.toLowerCase() || "";
          const description =
            product.description?.toLowerCase() || "";

          return (
            productName.includes(query) ||
            description.includes(query)
          );
        })
        .slice(0, 6)
    : [];

  // Get Product Image
  const getSearchImage = (product) => {
    const image = product.images?.[0] || product.image;

    if (!image) return "";

    if (
      image.startsWith("http://") ||
      image.startsWith("https://")
    ) {
      return image;
    }

    return typeof getImageUrl === "function"
      ? getImageUrl(image)
      : "";
  };

  // Open Product Details
  const handleProductSearch = (product) => {
    if (!product?._id) return;

    navigate(`/product/${product._id}`);

    setSearchQuery("");
    setSearchOpen(false);
    setMenuOpen(false);
  };

  // Clear Search
  const clearSearch = () => {
    setSearchQuery("");
    setSearchOpen(false);
  };

  // Search Results Component
  const SearchResults = () => (
    <div className="navbar-search-results">
      {searchResults.length > 0 ? (
        searchResults.map((product) => (
          <button
            type="button"
            key={product._id}
            className="navbar-search-result"
            onClick={() => handleProductSearch(product)}
          >
            {getSearchImage(product) ? (
              <img
                src={getSearchImage(product)}
                alt={product.name}
              />
            ) : (
              <div className="search-image-placeholder">
                ✦
              </div>
            )}

            <span className="search-product-info">
              <strong>{product.name}</strong>

              <small>
                ₹
                {Number(product.price).toLocaleString("en-IN")}
              </small>
            </span>
          </button>
        ))
      ) : (
        <p className="search-no-results">
          No products found.
        </p>
      )}
    </div>
  );

  return (
    <>
      <nav className="navbar">

        {/* ================================
            LOGO
        ================================= */}

        <Link
          to="/"
          className="brand-logo"
          onClick={closeMenu}
        >
          <div className="brand-text">
            <img
              src={assets.logo}
              alt="Zivnel - Online Shopping Store"
              className="logo-img"
            />
          </div>
        </Link>

        {/* ================================
            DESKTOP SEARCH
        ================================= */}

        <div className="navbar-search">

          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="19"
            height="19"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-4-4" />
          </svg>

          <input
            type="search"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(event) => {
              setSearchQuery(event.target.value);
              setSearchOpen(true);
            }}
            onFocus={() => setSearchOpen(true)}
            aria-label="Search products"
          />

          {searchQuery && (
            <button
              type="button"
              onClick={clearSearch}
              aria-label="Clear search"
            >
              ✕
            </button>
          )}

          {searchOpen && searchQuery.trim() && (
            <SearchResults />
          )}

        </div>

        {/* ================================
            DESKTOP NAVIGATION
        ================================= */}

        <div className="navbar-links">

          <Link to="/#home" onClick={closeMenu}>
            Home
          </Link>

          <Link to="/#explore" onClick={closeMenu}>
            Categories
          </Link>

          <Link to="/#ProductDisplay" onClick={closeMenu}>
            Shop
          </Link>

          <Link
            to="/my-orders"
            className={isActive("/my-orders") ? "active" : ""}
            onClick={closeMenu}
          >
            My Orders
          </Link>

          <Link to="/#Footer" onClick={closeMenu}>
            Contact
          </Link>

        </div>

        {/* ================================
            DESKTOP ACTIONS
        ================================= */}

        <div className="nav-actions">

          {/* Cart */}

          <Link
            to="/cart"
            className={`navbar-cart ${
              isActive("/cart") ? "active" : ""
            }`}
            aria-label={`Shopping cart with ${cartCount} items`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>

            <span className="cart-label">Cart</span>

            {cartCount > 0 && (
              <span className="cart-count">
                {cartCount > 99 ? "99+" : cartCount}
              </span>
            )}
          </Link>

          {/* Support */}

          <a
            href="tel:+916263515604"
            className="nav-call-button"
          >
            <span>☎</span>
            Support
          </a>

          {/* Customer Account */}

          {customer ? (
            <div className="navbar-account">

              <Link
                to="/my-account"
                className={`navbar-account-button ${
                  isActive("/my-account") ? "active" : ""
                }`}
                onClick={closeMenu}
              >
                <span className="account-icon">👤</span>

                <span>
                  {customer.name?.split(" ")[0] || "My Account"}
                </span>
              </Link>

              <button
                type="button"
                className="navbar-logout-button"
                onClick={handleLogout}
              >
                Logout
              </button>

            </div>
          ) : (
            <Link
              to="/login"
              className={`navbar-login-button ${
                isActive("/login") ? "active" : ""
              }`}
              onClick={closeMenu}
            >
              <span>👤</span>
              Login
            </Link>
          )}

        </div>

        {/* ================================
            MOBILE CART
        ================================= */}

        <Link
          to="/cart"
          className="mobile-cart-icon"
          aria-label={`Shopping cart with ${cartCount} items`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="23"
            height="23"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="9" cy="21" r="1" />
            <circle cx="20" cy="21" r="1" />
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
          </svg>

          {cartCount > 0 && (
            <span className="cart-count">
              {cartCount > 99 ? "99+" : cartCount}
            </span>
          )}
        </Link>

        {/* ================================
            MOBILE MENU TOGGLE
        ================================= */}

        <button
          type="button"
          className="mobile-menu-toggle"
          onClick={() =>
            setMenuOpen((previous) => !previous)
          }
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
        >
          {menuOpen ? (
            <span className="menu-close-icon">✕</span>
          ) : (
            <span className="menu-open-icon">☰</span>
          )}
        </button>

        {/* ================================
            MOBILE MENU OVERLAY
        ================================= */}

        {menuOpen && (
          <div
            className="mobile-menu-overlay"
            onClick={closeMenu}
          >
            <div
              className="mobile-menu-panel"
              onClick={(event) => event.stopPropagation()}
            >

              {/* Mobile Header */}

              <div className="mobile-menu-header">
                <div>
                  <h3>Zivnel</h3>
                  <p>
                    Fashion · Lifestyle · Everyday Essentials
                  </p>
                </div>

                <button
                  type="button"
                  className="mobile-menu-close"
                  onClick={closeMenu}
                  aria-label="Close menu"
                >
                  ✕
                </button>
              </div>

              {/* Mobile Links */}

              <div className="mobile-menu-links">

                <Link to="/#home" onClick={closeMenu}>
                  <span>⌂</span>
                  Home
                </Link>

                <Link to="/#explore" onClick={closeMenu}>
                  <span>◇</span>
                  Categories
                </Link>

                <Link to="/#ProductDisplay" onClick={closeMenu}>
                  <span>♡</span>
                  Shop
                </Link>

                <Link
                  to="/my-orders"
                  className={
                    isActive("/my-orders") ? "active" : ""
                  }
                  onClick={closeMenu}
                >
                  <span>📦</span>
                  My Orders
                </Link>

                <Link to="/#Footer" onClick={closeMenu}>
                  <span>☏</span>
                  Contact
                </Link>

                <Link to="/cart" onClick={closeMenu}>
                  <span>🛒</span>
                  My Cart ({cartCount})
                </Link>

                {customer ? (
                  <>
                    <Link
                      to="/my-account"
                      onClick={closeMenu}
                    >
                      <span>👤</span>
                      My Account
                    </Link>

                    <button
                      type="button"
                      className="mobile-logout-button"
                      onClick={handleLogout}
                    >
                      <span>↪</span>
                      Logout
                    </button>
                  </>
                ) : (
                  <Link to="/login" onClick={closeMenu}>
                    <span>👤</span>
                    Login / Register
                  </Link>
                )}

              </div>

              {/* Mobile Support */}

              <div className="mobile-menu-actions">

                <a
                  href="tel:+916263515604"
                  className="mobile-call-button"
                  onClick={closeMenu}
                >
                  ☎ Call Us
                </a>

                <a
                  href="https://wa.me/916263515604"
                  target="_blank"
                  rel="noreferrer"
                  className="mobile-whatsapp-button"
                  onClick={closeMenu}
                >
                  WhatsApp Us ↗
                </a>

              </div>

              <p className="mobile-menu-footer">
                Discover More. Shop Better. Live Stylish.
              </p>

            </div>
          </div>
        )}

      </nav>

      {/* ================================
          MOBILE PRODUCT SEARCH
      ================================= */}

 {/* MOBILE PRODUCT SEARCH */}

{!menuOpen && (
  <div className="mobile-navbar-search">

    {/* Existing search SVG */}
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="19"
      height="19"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-4-4" />
    </svg>

    <input
      type="search"
      placeholder="Search clothes, accessories, stationery..."
      value={searchQuery}
      onChange={(event) => {
        setSearchQuery(event.target.value);
        setSearchOpen(true);
      }}
      onFocus={() => setSearchOpen(true)}
      aria-label="Search products"
    />

    {searchQuery && (
      <button
        type="button"
        onClick={clearSearch}
        aria-label="Clear search"
      >
        ✕
      </button>
    )}

    {searchOpen && searchQuery.trim() && (
      <SearchResults />
    )}

  </div>
)}

    </>
  );
};

export default Navbar;

