import React from "react";
import { Link } from "react-router-dom";
import "./Footer.css";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="nile-footer" id="Footer">
      <div className="footer-main">
        {/* Brand Section */}
        <div className="footer-brand">
          <Link to="/" className="footer-logo">
            Zivnel<span>.</span>
          </Link>

<p className="footer-tagline">
  Affordable Fashion. A Second Life.
</p>

<p className="footer-description">
  Welcome to Zivnel! We offer pre-loved clothing at affordable prices.
  Our products are pre-owned and are not brand-new. Please check each
  product's description, images, measurements, and condition before ordering.
</p>


          <div className="footer-socials">
            <a
              href="https://www.instagram.com/"
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
              className="footer-social-link"
            >
              IG
            </a>

            <a
              href="https://www.facebook.com/"
              target="_blank"
              rel="noreferrer"
              aria-label="Facebook"
              className="footer-social-link"
            >
              f
            </a>

            <a
              href="https://wa.me/+916263515604"
              target="_blank"
              rel="noreferrer"
              aria-label="WhatsApp"
              className="footer-social-link"
            >
              WA
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div className="footer-column">
          <h3>Explore</h3>

          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>

            <li>
              <Link to="/#Explore">Categories</Link>
            </li>

            <li>
              <Link to="/#Shop">Our Products</Link>
            </li>

            <li>
              <Link to="/cart">Shopping Cart</Link>
            </li>
          </ul>
        </div>

        {/* Customer Support */}
        <div className="footer-column">
          <h3>Customer Care</h3>

          <ul>
            <li>
              <a href="tel:+916263515604">Call Us</a>
            </li>

            <li>
              <a
                href="https://wa.me/YOUR_WHATSAPP_NUMBER"
                target="_blank"
                rel="noreferrer"
              >
                WhatsApp Orders
              </a>
            </li>

            <li>
              <a href="mailto:niteshsinghtomar424@gmail.com">
                Email Support
              </a>
            </li>

            <li>
              <Link to="/#Footer">Contact Us</Link>
            </li>
          </ul>
        </div>

        {/* Contact Section */}
        <div className="footer-column footer-contact">
          <h3>Get In Touch</h3>

          <p className="footer-contact-text">
            Have something special in mind? We would love to hear from you.
          </p>

          <a
            href="tel:+916263515604"
            className="footer-contact-item"
          >
            <span className="footer-contact-icon">☎</span>
            <span>+91 6263515604</span>
          </a>

          <a
            href="mailto:niteshsinghtomar424@gmail.com"
            className="footer-contact-item"
          >
            <span className="footer-contact-icon">✉</span>
            <span>niteshsinghtomar424@gmail.com</span>
          </a>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="footer-bottom">
        <p>
          © {currentYear} <strong>Zivnel</strong>. All rights reserved.
        </p>

        <p className="footer-made-with">
          Made with <span>♥</span> for your special moments.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
