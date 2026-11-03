import React, { useContext } from "react";
import "./Cart.css";
import { StoreGive } from "../../context/StoreGive";
import { useNavigate } from "react-router-dom";

const DELIVERY_CHARGE = 45;

const Cart = () => {
const {
shop_list = [],
getCartItems,
clearCart,
} = useContext(StoreGive);

const navigate = useNavigate();

const cartItems =
typeof getCartItems === "function" ? getCartItems() : [];

const subtotal = cartItems.reduce((total, item) => {
const price = Number(item.price || 0);
const quantity = Number(item.quantity || 0);


return total + price * quantity;


}, 0);

const deliveryCharge =
cartItems.length > 0 ? DELIVERY_CHARGE : 0;

const totalAmount = subtotal + deliveryCharge;

// Require login before checkout.
const handleCheckout = () => {
const token = localStorage.getItem("token");


if (!token) {
  alert("Please login first.");

  navigate("/login", {
    state: {
      from: "/order",
    },
  });

  return;
}

navigate("/order");


};

const handleContinueShopping = () => {
navigate("/");
};

const getProductImage = (item) => {
if (item.image) {
return Array.isArray(item.image)
? item.image[0]
: item.image;
}


if (item.images) {
  return Array.isArray(item.images)
    ? item.images[0]
    : item.images;
}

return "";


};

if (!cartItems || cartItems.length === 0) {
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

return ( <div className="cart-page"> <div className="cart-container"> <div className="cart-header"> <div> <h1>Shopping Cart</h1>


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
        {cartItems.map((item, index) => {
          const image = getProductImage(item);
          const price = Number(item.price || 0);
          const quantity = Number(item.quantity || 0);
          const itemTotal = price * quantity;

          return (
            <div
              className="cart-product-card"
              key={item._id || item.id || index}
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

                {item.category && (
                  <p className="cart-product-category">
                    {item.category}
                  </p>
                )}

                <p className="cart-product-price">
                  ₹{price.toLocaleString("en-IN")}
                </p>

                <div className="cart-product-bottom">
                  <span className="cart-quantity">
                    Quantity: {quantity}
                  </span>

                  <strong className="cart-item-total">
                    ₹{itemTotal.toLocaleString("en-IN")}
                  </strong>
                </div>
              </div>
            </div>
          );
        })}
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
