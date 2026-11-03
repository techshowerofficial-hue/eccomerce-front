import React from "react";
import { useNavigate } from "react-router-dom";
import "./Header.css";

const Header = () => {
  const navigate = useNavigate();

  const exploreProducts = () => {
  const shopSection = document.getElementById("ProductDisplay");

  if (shopSection) {
    shopSection.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  } else {
    navigate("/#ProductDisplay");
  }
};

  return (
    <section className="header" id="header">
      <div className="header-overlay"></div>

      <div className="header-contents">
        <span className="header-eyebrow">
          ✦ MADE WITH LOVE, JUST FOR YOU ✦
        </span>

        <h1>
          Gifts That Feel
          <br />
          <span>Extra Special.</span>
        </h1>

        <p>
          Discover beautiful handmade creations and personalized gifts
          crafted to celebrate your most precious moments. Add your own
          touch and turn every gift into a lasting memory.
        </p>

        <div className="header-buttons">
          <button
            className="header-primary-btn"
            onClick={exploreProducts}
          >
            Explore Our Collection <span>→</span>
          </button>

          <span className="header-note">
            Handmade with care. Personalized for you.
          </span>
        </div>
      </div>

      <div className="header-bottom-label">
        <span className="header-bottom-line"></span>
        THOUGHTFUL GIFTS · PERSONALIZED CREATIONS
      </div>
    </section>
  );
};

export default Header;
