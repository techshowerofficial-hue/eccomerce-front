import React, { useContext } from "react";
import "./Cart.css";
import { StoreGive } from "../../context/StoreGive";
import { useNavigate } from "react-router-dom";

const DELIVERY_CHARGE = 0;

const Cart = () => {
const {
getCartItems,
clearCart,
addToCart,
removeToCart,
deleteFromCart,
getImageUrl,
} = useContext(StoreGive);

const navigate = useNavigate();

const cartItems =
typeof getCartItems === "function" ? getCartItems() : [];

const subtotal = cartItems.reduce(
(total, item) =>
total + Number(item.price || 0) * Number(item.quantity || 0),
0
);

const deliveryCharge =
cartItems.length > 0 ? DELIVERY_CHARGE : 0;

const totalAmount = subtotal + deliveryCharge;

const handleCheckout = () => {
const token = localStorage.getItem("token");


if (!token) {
  alert("Please login first.");

  navigate("/login", {
    state: { from: "/order" },
  });

  return;
}

navigate("/order");


};

const handleContinueShopping = () => {
navigate("/");
};

const getProductImage = (item) => {
const image = item.image || item.images?.[0] || "";


if (!image) return "";

return typeof getImageUrl === "function"
  ? getImageUrl(image)
  : image;


};

if (cartItems.length === 0) {
return ( <div className="cart-page"> <div className="cart-empty"> <div className="cart-empty-icon">🛒</div>


      <h2>Your Cart Is Empty</h2>

      <p>
        Looks like you haven't added anything to your cart yet.
      </p>

      <button
        type="button"
        className="cart-continue-btn"
        onClick={handleContinueShopping}
      >
        Continue Shopping
      </button>
    </div>
  </div>
);


}

return ( <div className="cart-page"> <div className="cart-container">


    <div className="cart-header">
      <div>
        <h1>Shopping Cart</h1>

        <p>
          {cartItems.length}{" "}
          {cartItems.length === 1 ? "item" : "items"} in your cart
        </p>
      </div>

      <button
        type="button"
        className="cart-back-btn"
        onClick={handleContinueShopping}
      >
        Continue Shopping
      </button>
    </div>

    <div className="cart-layout">

      {/* Cart Products */}
      <div className="cart-products">

        {cartItems.map((item) => {
          const image = getProductImage(item);
          const price = Number(item.price || 0);
          const quantity = Number(item.quantity || 0);
          const itemTotal = price * quantity;

          return (
            <div
              className="cart-product-card"
              key={item._id}
            >

              <div className="cart-product-image">
                {image ? (
                  <img
                    src={image}
                    alt={item.name || "Product"}
                    onError={(event) => {
                      event.currentTarget.style.display = "none";
                    }}
                  />
                ) : (
                  <div className="cart-image-placeholder">
                    No Image
                  </div>
                )}
              </div>

              <div className="cart-product-details">

                <h3>{item.name || "Product"}</h3>

                <p className="cart-product-price">
                  ₹{price.toLocaleString("en-IN")}
                </p>

       <div className="cart-product-bottom">

  <div className="cart-product-actions">

    {/* Quantity Controls */}
    <div className="cart-quantity-controls">
      <button
        type="button"
        className="cart-qty-btn"
        onClick={() => removeToCart(item._id)}
      >
        −
      </button>

      <span className="cart-quantity">
        {quantity}
      </span>

      <button
        type="button"
        className="cart-qty-btn"
        onClick={() => addToCart(item._id, 1)}
        disabled={
          Number(item.stock) > 0 &&
          quantity >= Number(item.stock)
        }
      >
        +
      </button>
    </div>

    {/* Delete Icon */}
    <button
      type="button"
      className="cart-delete-icon"
     onClick={() => {
  const confirmed = window.confirm(
    `Are you sure you want to remove "${item.name}" from your cart?`
  );

  if (confirmed) {
    deleteFromCart(item._id);
  }
}}
      aria-label="Remove product"
      title="Remove product"
    >
      🗑
    </button>

  </div>

  <strong className="cart-item-total">
    ₹{itemTotal.toLocaleString("en-IN")}
  </strong>

</div>

              </div>
            </div>
          );
        })}

        <button
          type="button"
          className="cart-clear-btn"
          onClick={clearCart}
        >
          Clear Entire Cart
        </button>

      </div>

      {/* Order Summary */}
      <aside className="cart-summary">

        <h2>Order Summary</h2>

        <div className="cart-summary-row">
          <span>Items</span>

          <span>
            {cartItems.reduce(
              (total, item) =>
                total + Number(item.quantity || 0),
              0
            )}
          </span>
        </div>

        <div className="cart-summary-row">
          <span>Subtotal</span>

          <span>
            ₹{subtotal.toLocaleString("en-IN")}
          </span>
        </div>

        <div className="cart-summary-row">
          <span>Delivery Charges</span>

          <span>
            ₹{deliveryCharge.toLocaleString("en-IN")}
          </span>
        </div>

        <div className="cart-summary-divider" />

        <div className="cart-summary-total">
          <span>Total Amount</span>

          <strong>
            ₹{totalAmount.toLocaleString("en-IN")}
          </strong>
        </div>

        <button
          type="button"
          className="cart-checkout-btn"
          onClick={handleCheckout}
        >
          Proceed To Checkout
        </button>

        <p className="cart-secure-note">
          Your order details will be collected at checkout.
        </p>

      </aside>

    </div>
  </div>
</div>


);
};

export default Cart;
