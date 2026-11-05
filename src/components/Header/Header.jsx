
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Header.css";

const offers = [
  {
    id: 1,
    tag: "FESTIVE SPECIAL",
    title: "Diwali Special Offer",
    highlight: "Celebrate More, Save More!",
    description:
      "Explore amazing fashion deals and discover something special this festive season.",
    button: "Shop Diwali Offers",
    image: "/offers/diwali.png",
    position: "center",
  },
  {
    id: 2,
    tag: "FRESH FINDS",
    title: "Discover Your Style",
    highlight: "Fashion for Every Mood.",
    description:
      "Explore new and preloved fashion at prices you'll love.",
    button: "Explore Collection",
    image: "/offers/fashion.png",
    position: "center",
  },
  {
    id: 3,
    tag: "SPECIAL DEALS",
    title: "More Offers. More Savings.",
    highlight: "Your Favourite Deals Await!",
    description:
      "Discover exciting deals across fashion, accessories and stationery.",
    button: "Get More Offers",
    image: "/offers/deals.png",
    position: "center",
  },
];

const Header = () => {
  const navigate = useNavigate();
  const [activeSlide, setActiveSlide] = useState(0);

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

  const nextSlide = () => {
    setActiveSlide((prev) => (prev + 1) % offers.length);
  };

  const prevSlide = () => {
    setActiveSlide(
      (prev) => (prev - 1 + offers.length) % offers.length
    );
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % offers.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const currentOffer = offers[activeSlide];

  return (
    <section className="zivnel-hero" id="header">
      <div
        className="zivnel-hero-image"
        style={{
          backgroundImage: `url("${currentOffer.image}")`,
          backgroundPosition: currentOffer.position,
        }}
        key={currentOffer.id}
      />

      <div className="zivnel-hero-overlay" />

      <div className="zivnel-hero-content" key={currentOffer.id}>
        <span className="zivnel-offer-tag">
          ✦ {currentOffer.tag}
        </span>

        <h1>
          {currentOffer.title}
          <br />
          <span>{currentOffer.highlight}</span>
        </h1>

        <p>{currentOffer.description}</p>

        <button
          className="zivnel-hero-button"
          onClick={exploreProducts}
        >
          {currentOffer.button}
          <span>→</span>
        </button>
      </div>

      <button
        className="zivnel-slider-arrow prev"
        onClick={prevSlide}
        aria-label="Previous offer"
      >
        &#10094;
      </button>

      <button
        className="zivnel-slider-arrow next"
        onClick={nextSlide}
        aria-label="Next offer"
      >
        &#10095;
      </button>

      <div className="zivnel-slider-dots">
        {offers.map((offer, index) => (
          <button
            key={offer.id}
            className={activeSlide === index ? "active" : ""}
            onClick={() => setActiveSlide(index)}
            aria-label={`Go to offer ${index + 1}`}
          />
        ))}
      </div>

      <div className="zivnel-hero-bottom">
        FASHION · LIFESTYLE · EVERYDAY ESSENTIALS
      </div>
    </section>
  );
};

export default Header;

