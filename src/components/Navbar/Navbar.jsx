import React, { useContext, useState, useEffect } from "react";
import "./Navbar.css";
import { assets } from "../../assets/assets";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { StoreGive } from "../../context/StoreGive";

const Navbar = () => {
  const { cartItems } = useContext(StoreGive);

  const location = useLocation();
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);
  const [customer, setCustomer] = useState(null);

  // Load customer information
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

  // Calculate cart quantity
  const cartCount = Object.values(cartItems || {}).reduce(
    (total, quantity) => total + (Number(quantity) || 0),
    0
  );

  // Close menu when route changes
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname, location.hash]);

  const closeMenu = () => setMenuOpen(false);

  // Logout
  const handleLogout = () => {
    const confirmLogout = window.confirm(
      "Are you sure you want to logout?"
    );

    if (!confirmLogout) {
      return;
    }

    localStorage.removeItem("token");
    localStorage.removeItem("nile_customer");

    setCustomer(null);
    setMenuOpen(false);

    navigate("/login");
  };

  // Check active route
  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      {/* Logo */}
      <Link to="/" className="brand-logo" onClick={closeMenu}>
        <img
          src={assets.logo}
          alt="Nile Gifts"
          className="logo-img"
        />

        <div className="brand-text">
          <h2>Nile</h2>
          <span>Handmade With Love</span>
        </div>
      </Link>

      {/* Desktop Navigation */}
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

        {/* My Orders */}
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

      {/* Desktop Actions */}
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
        <a href="tel:+916263515604" className="nav-call-button">
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

      {/* Mobile Cart */}
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

      {/* Mobile Menu Toggle */}
      <button
        type="button"
        className="mobile-menu-toggle"
        onClick={() => setMenuOpen((previous) => !previous)}
        aria-label={menuOpen ? "Close menu" : "Open menu"}
        aria-expanded={menuOpen}
      >
        {menuOpen ? (
          <span className="menu-close-icon">✕</span>
        ) : (
          <span className="menu-open-icon">☰</span>
        )}
      </button>

      {/* Mobile Menu Overlay */}
      {menuOpen && (
        <div className="mobile-menu-overlay" onClick={closeMenu}>
          <div
            className="mobile-menu-panel"
            onClick={(event) => event.stopPropagation()}
          >
            {/* Mobile Menu Header */}
            <div className="mobile-menu-header">
              <div>
                <h3>Nile</h3>
                <p>Handmade With Love</p>
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

            {/* Mobile Menu Links */}
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

              {/* My Orders - Mobile */}
              <Link
                to="/my-orders"
                className={isActive("/my-orders") ? "active" : ""}
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
                  <Link to="/my-account" onClick={closeMenu}>
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

            {/* Mobile Support Actions */}
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
              Thoughtful Gifts · Personalized Creations
            </p>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;