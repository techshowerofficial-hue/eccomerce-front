
import React, {
  useContext,
  useEffect,
  useState,
} from "react";

import { useParams, useNavigate } from "react-router-dom";
import { StoreGive } from "../../context/StoreGive";
import "./ProductDetails.css";
import ReadMoreText from "../../components/ReadMoreText/ReadMoreText";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    shop_list = [],
    productsLoading,
    productsError,
    getImageUrl,
    addToCart,
  } = useContext(StoreGive);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  const product = shop_list.find(
    (item) => String(item._id) === String(id)
  );

  const productImages = Array.isArray(product?.images)
    ? product.images.filter(Boolean)
    : product?.image
    ? [product.image]
    : [];

  const [quantity, setQuantity] = useState(1);
  const [customMessage, setCustomMessage] = useState("");
  const [selectedImage, setSelectedImage] = useState("");

  const [touchStartX, setTouchStartX] = useState(null);
  const [touchEndX, setTouchEndX] = useState(null);

  useEffect(() => {
    setSelectedImage(productImages[0] || "");
    setQuantity(1);
    setCustomMessage("");
  }, [id, product?._id]);

  // Loading state
  if (productsLoading) {
    return (
      <div className="product-not-found">
        <h2>Loading product...</h2>
      </div>
    );
  }

  // API error state
  if (productsError) {
    return (
      <div className="product-not-found">
        <h2>Unable to load product</h2>
        <p>{productsError}</p>

        <button type="button" onClick={() => navigate("/")}>
          Back to Shop
        </button>
      </div>
    );
  }

  // Product not found
  if (!product) {
    return (
      <div className="product-not-found">
        <h2>Product not found</h2>
        <p>
          This product may have been removed or is unavailable.
        </p>

        <button type="button" onClick={() => navigate("/")}>
          Back to Shop
        </button>
      </div>
    );
  }

  // --------------------------------
  // PRICE AND DISCOUNT CALCULATION
  // --------------------------------

  const price = Number(product.price) || 0;
  const marketPrice = Number(product.marketPrice) || 0;

  const hasDiscount =
    marketPrice > 0 && marketPrice > price;

  const discountPercentage = hasDiscount
    ? Math.round(
        ((marketPrice - price) / marketPrice) * 100
      )
    : 0;

  const amountSaved = hasDiscount
    ? marketPrice - price
    : 0;

  const currentImageIndex =
    productImages.indexOf(selectedImage);

  const stock = Number(product.stock ?? 0);
  const outOfStock = stock <= 0;

  // --------------------------------
  // ADD TO CART
  // --------------------------------

  const handleAddToCart = () => {
    if (outOfStock) {
      alert("This product is currently out of stock.");
      return;
    }

    if (!product?._id) {
      console.error("Product not found:", product);
      alert("Product not found. Please refresh the page.");
      return;
    }

    addToCart(String(product._id), quantity);

    alert(`${product.name} added to cart successfully!`);
  };

  // --------------------------------
  // BUY NOW
  // --------------------------------

  const handleBuyNow = () => {
    if (outOfStock) {
      alert("This product is currently out of stock.");
      return;
    }

    addToCart(String(product._id), quantity);

    navigate(
      `/order?productId=${encodeURIComponent(product._id)}`
    );
  };

  // --------------------------------
  // IMAGE GALLERY
  // --------------------------------

  const showPreviousImage = () => {
    const index = productImages.indexOf(selectedImage);

    if (index > 0) {
      setSelectedImage(productImages[index - 1]);
    }
  };

  const showNextImage = () => {
    const index = productImages.indexOf(selectedImage);

    if (index < productImages.length - 1) {
      setSelectedImage(productImages[index + 1]);
    }
  };

  const handleTouchStart = (event) => {
    setTouchStartX(event.touches[0].clientX);
    setTouchEndX(null);
  };

  const handleTouchMove = (event) => {
    setTouchEndX(event.touches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStartX === null || touchEndX === null) {
      return;
    }

    const difference = touchStartX - touchEndX;

    if (Math.abs(difference) < 45) {
      setTouchStartX(null);
      setTouchEndX(null);
      return;
    }

    const currentIndex =
      productImages.indexOf(selectedImage);

    if (
      difference > 0 &&
      currentIndex < productImages.length - 1
    ) {
      setSelectedImage(productImages[currentIndex + 1]);
    } else if (difference < 0 && currentIndex > 0) {
      setSelectedImage(productImages[currentIndex - 1]);
    }

    setTouchStartX(null);
    setTouchEndX(null);
  };

  // --------------------------------
  // PRODUCT DETAILS PAGE
  // --------------------------------

  return (
    <div className="product-details-page">
      {/* Breadcrumb */}
      <div className="product-breadcrumb">
        <span onClick={() => navigate("/")}>Home</span>
        <span>/</span>
        <span>Shop</span>
        <span>/</span>

        <span className="breadcrumb-current">
          {product.name}
        </span>
      </div>

      <div className="product-details-container">
        {/* --------------------------------
            PRODUCT IMAGE GALLERY
        -------------------------------- */}

        <div className="product-gallery">
          <div
            className="product-main-image"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {selectedImage ? (
              <img
                src={getImageUrl(selectedImage)}
                alt={product.name}
                draggable="false"
              />
            ) : (
              <div className="product-image-placeholder">
                Image not available
              </div>
            )}

            {productImages.length > 1 && (
              <>
                <button
                  type="button"
                  className="gallery-arrow gallery-arrow-left"
                  onClick={showPreviousImage}
                  disabled={currentImageIndex <= 0}
                  aria-label="Previous image"
                >
                  ‹
                </button>

                <button
                  type="button"
                  className="gallery-arrow gallery-arrow-right"
                  onClick={showNextImage}
                  disabled={
                    currentImageIndex >=
                    productImages.length - 1
                  }
                  aria-label="Next image"
                >
                  ›
                </button>

                <div className="gallery-image-counter">
                  {Math.max(currentImageIndex + 1, 1)} /{" "}
                  {productImages.length}
                </div>
              </>
            )}
          </div>

          {/* Image Thumbnails */}
          {productImages.length > 1 && (
            <div className="product-thumbnail-wrapper">
              <div className="product-thumbnail-list">
                {productImages.map((image, index) => (
                  <button
                    key={`${image}-${index}`}
                    type="button"
                    className={`product-thumbnail ${
                      selectedImage === image ? "active" : ""
                    }`}
                    onClick={() => setSelectedImage(image)}
                    aria-label={`View image ${index + 1}`}
                    aria-pressed={selectedImage === image}
                  >
                    <img
                      src={getImageUrl(image)}
                      alt={`${product.name} view ${index + 1}`}
                      draggable="false"
                    />
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="product-gallery-note">
            <span>✦</span>
            Made with care, especially for you.
          </div>
        </div>

        {/* --------------------------------
            PRODUCT INFORMATION
        -------------------------------- */}

        <div className="product-information">
          <div className="product-tag">
            HANDMADE WITH LOVE
          </div>

          <h1>{product.name}</h1>

          <ReadMoreText
            text={
              product.description ||
              "A thoughtful gift made to create beautiful memories."
            }
            lines={3}
            className="product-short-description"
          />

          {/* --------------------------------
              MARKET PRICE AND SELLING PRICE
          -------------------------------- */}

          <div className="product-pricing-section">
            {/* Selling Price */}
            <div className="product-current-price">
              ₹{price.toLocaleString("en-IN")}
            </div>

            {/* Original Market Price + Discount */}
            {hasDiscount && (
              <div className="product-discount-row">
                <span className="product-market-price">
                  ₹{marketPrice.toLocaleString("en-IN")}
                </span>

                <span className="product-discount-badge">
                  {discountPercentage}% OFF
                </span>
              </div>
            )}

            {/* Customer Savings */}
            {hasDiscount && (
              <p className="product-saving-message">
                You save ₹
                {amountSaved.toLocaleString("en-IN")}
              </p>
            )}
          </div>

          <p className="product-price-note">
            Shipping charges, if applicable, will be shown
            during checkout.
          </p>

          <div className="product-divider" />

          {/* --------------------------------
              QUANTITY SELECTOR
          -------------------------------- */}

          <div className="product-quantity-section">
            <span>Quantity</span>

            <div className="quantity-selector">
              <button
                type="button"
                onClick={() =>
                  setQuantity((q) => Math.max(1, q - 1))
                }
                disabled={quantity <= 1}
                aria-label="Decrease quantity"
              >
                −
              </button>

              <span>{quantity}</span>

              <button
                type="button"
                onClick={() =>
                  setQuantity((q) =>
                    Math.min(stock, q + 1)
                  )
                }
                disabled={quantity >= stock}
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>
          </div>

          {/* Out of Stock Message */}
          {outOfStock && (
            <p className="out-of-stock-message">
              This product is currently out of stock.
            </p>
          )}

          {/* --------------------------------
              ORDER BUTTONS
          -------------------------------- */}

          <div className="product-order-buttons">
            <button
              type="button"
              className="product-add-cart-button"
              onClick={handleAddToCart}
              disabled={outOfStock}
            >
              Add to Cart
            </button>

            <button
              type="button"
              className="product-buy-now-button"
              onClick={handleBuyNow}
              disabled={outOfStock}
            >
              Buy Now
            </button>
          </div>

          {/* --------------------------------
              TRUST POINTS
          -------------------------------- */}

          <div className="product-trust-points">
            <div>
              <span>✦</span>
              <p>Thoughtful Gifting</p>
            </div>

            <div>
              <span>♡</span>
              <p>Personalization Available</p>
            </div>

            <div>
              <span>✓</span>
              <p>Order Assistance</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;

