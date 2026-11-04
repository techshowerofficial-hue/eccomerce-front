import React, { useContext } from "react";
import "./ProductItem.css";
import { useNavigate } from "react-router-dom";
import { StoreGive } from "../../context/StoreGive";
import ReadMoreText from "../ReadMoreText/ReadMoreText";
const ProductItem = ({
id,
name,
price,
description,
image,
images = [],
stock,
}) => {
const navigate = useNavigate();
const { addToCart, getImageUrl } = useContext(StoreGive);

const productImage = images.length > 0
? images[0]
: image;

const imageUrl = getImageUrl(productImage);
const outOfStock = Number(stock) <= 0;

const handleAddToCart = () => {
  if (outOfStock) {
    alert("This product is currently out of stock.");
    return;
  }

  if (!id) {
    console.error("Product ID is missing:", {
      id,
      name,
    });
    alert("Product ID is missing. Please refresh the page.");
    return;
  }

  addToCart(String(id), 1);

  console.log("Added to cart:", {
    id,
    name,
    quantity: 1,
  });
};

const handleBuyNow = () => {
if (outOfStock) return;


navigate(`/order?productId=${encodeURIComponent(id)}`);


};

return ( <article className="ProductItem">
<button
type="button"
className="product-image-button"
onClick={() => navigate(`/product/${id}`)}
aria-label={`View ${name} details`}
>
{imageUrl ? (
<img
className="product-item-img"
src={imageUrl}
alt={name}
loading="lazy"
onError={(event) => {
event.currentTarget.style.visibility = "hidden";
}}
/>
) : ( <div className="product-image-placeholder">
Image not available </div>
)}


  <span className="custom-badge">Zivnel Collection</span>
  </button>

  <div className="product-item-info">
    <button
      type="button"
      className="product-name-button"
      onClick={() => navigate(`/product/${id}`)}
    >
      {name}
    </button>

<p className="product-description">
  {description || ""}
</p>
    <div className="product-item-price">
      <span className="price">
        ₹{Number(price).toLocaleString("en-IN")}
      </span>
    </div>

    {outOfStock && (
      <p className="out-of-stock-message">Out of stock</p>
    )}

    <div className="product-actions">
 <button
  type="button"
  className="add-to-cart-button"
  onClick={handleAddToCart}
  disabled={outOfStock}
>
  {outOfStock ? "Out of Stock" : "Add to Cart"}
</button>

      <button
        type="button"
        className="buy-now-button"
        onClick={handleBuyNow}
        disabled={outOfStock}
      >
        Buy Now
      </button>
    </div>
  </div>
</article>


);
};

export default ProductItem;
