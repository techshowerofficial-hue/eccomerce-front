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
  ✦ WELCOME TO ZIVNEL ✦
</span>

<h1>
  Elevate Your Style.
  <br />
  <span>Define Your Look.</span>
</h1>

<p>
  Discover stylish clothing for every occasion.
  Explore our latest collection and find fashion that
  matches your personality.
</p>

        <div className="header-buttons">
          <button
            className="header-primary-btn"
            onClick={exploreProducts}
          >
            Explore Our Collection <span>→</span>
          </button>

<span className="header-note">
  Discover Your Style with Zivnel.
</span>
        </div>
      </div>
<div className="header-bottom-label">
  <span className="header-bottom-line"></span>
  EVERYDAY FASHION · YOUR STYLE · ZIVNEL
</div>
    </section>
  );
};

export default Header;
