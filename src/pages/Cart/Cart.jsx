import React, { useContext } from "react";
import "./Cart.css";
import { StoreGive } from "../../context/StoreGive";
import { useNavigate } from "react-router-dom";

const DELIVERY_CHARGE = 45;

const Cart = () => {
const {
cartItems,
shop_list,
removeToCart,
addToCart,
getTotalCartAmount,
deleteFromCart,
} = useContext(StoreGive);

const navigate = useNavigate();

const cartProducts = shop_list.filter(
(item) => Number(cartItems[item._id]) > 0
);

const subtotal = Number(getTotalCartAmount()) || 0;
const deliveryFee = subtotal > 0 ? DELIVERY_CHARGE : 0;
const grandTotal = subtotal + deliveryFee;

const formatPrice = (price) =>
`₹${Number(price || 0).toLocaleString("en-IN", {
      maximumFractionDigits: 2,
    })}`;

const getImage = (image) => {
if (Array.isArray(image)) {
return image.find((src) => typeof src === "string" && src.trim()) || "";
}


return typeof image === "string" ? image : "";


};

const handleDecrease = (productId) => {
const quantity = Number(cartItems[productId]) || 0;


if (quantity > 1) {
  removeToCart(productId);
} else if (deleteFromCart) {
  deleteFromCart(productId);
} else {
  removeToCart(productId);
}


};

const handleRemove = (productId, quantity) => {
if (deleteFromCart) {
deleteFromCart(productId);
return;
}


for (let i = 0; i < quantity; i++) {
  removeToCart(productId);
}


};

if (cartProducts.length === 0) {
return ( <main className="cartd"> <section className="cart-empty"> <div className="cart-empty-icon">🛍️</div> <h2>Your Cart Is Empty</h2> <p>
Looks like you haven't added any products yet.
Explore our collection and find something you love. </p>


      <button type="button" onClick={() => navigate("/")}>
        Continue Shopping
      </button>
    </section>
  </main>
);


}

return ( <main className="cartd"> <div className="cart-page-header"> <div> <span className="cart-eyebrow">YOUR SHOPPING BAG</span> <h1>Shopping Cart</h1> <p>
{cartProducts.length}{" "}
{cartProducts.length === 1 ? "product" : "products"} in your cart </p> </div>


    <button
      type="button"
      className="cart-back-shopping"
      onClick={() => navigate("/")}
    >
      ← Continue Shopping
    </button>
  </div>

  <div className="cart-layout">
    <section className="cart-list-item">
      <div className="cart-section-heading">
        <h2>Your Items</h2>
        <span>{cartProducts.length} items</span>
      </div>

      <div className="cart-products-list">
        {cartProducts.map((item) => {
          const quantity = Number(cartItems[item._id]) || 0;
          const itemPrice = Number(item.price) || 0;
          const itemTotal = itemPrice * quantity;
          const image = getImage(item.image);

          return (
            <article className="cart-product-card" key={item._id}>
              <div className="cart-product-visual">
                {image ? (
                  <img
                    src={image}
                    alt={item.name || "Product"}
                    className="cart-product-image"
                    loading="lazy"
                    onError={(event) => {
                      event.currentTarget.style.display = "none";
                      const fallback =
                        event.currentTarget.parentElement?.querySelector(
                          ".cart-image-fallback"
                        );
                      if (fallback) fallback.style.display = "flex";
                    }}
                  />
                ) : null}

                <div
                  className="cart-image-fallback"
                  style={{ display: image ? "none" : "flex" }}
                >
                  🛍️
                </div>
              </div>

              <div className="cart-product-content">
                <div className="cart-product-top">
                  <div className="cart-product-info">
                    <h3 className="cart-product-name">
                      {item.name || "Product"}
                    </h3>
                    {item.category && (
                      <span className="cart-product-category">
                        {item.category}
                      </span>
                    )}
                    <p className="cart-unit-price">
                      {formatPrice(itemPrice)}{" "}
                      <span>per item</span>
                    </p>
                  </div>

                  <button
                    type="button"
                    className="remove-cart-item"
                    onClick={() => handleRemove(item._id, quantity)}
                    aria-label={`Remove ${item.name} from cart`}
                    title="Remove product"
                  >
                    ×
                  </button>
                </div>

                <div className="cart-product-bottom">
                  <div className="cart-quantity-section">
                    <span className="cart-small-label">Quantity</span>

                    <div className="cart-quantity-control">
                      <button
                        type="button"
                        onClick={() => handleDecrease(item._id)}
                        aria-label={`Decrease ${item.name} quantity`}
                        disabled={quantity <= 0}
                      >
                        −
                      </button>

                      <span>{quantity}</span>

                      <button
                        type="button"
                        onClick={() => addToCart(item._id)}
                        aria-label={`Increase ${item.name} quantity`}
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="cart-item-total">
                    <span className="cart-small-label">Item Total</span>
                    <strong>{formatPrice(itemTotal)}</strong>
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>

    <aside className="cart-total">
      <h2>Order Summary</h2>

      <div className="cart-summary-item-count">
        <span>Products</span>
        <span>
          {cartProducts.reduce(
            (total, item) => total + (Number(cartItems[item._id]) || 0),
            0
          )}{" "}
          items
        </span>
      </div>

      <div className="cart-total-deatails">
        <p>Subtotal</p>
        <p>{formatPrice(subtotal)}</p>
      </div>

      <div className="cart-total-deatails">
        <p>Delivery Fee</p>
        <p>
          {deliveryFee === 0 ? "Free" : formatPrice(deliveryFee)}
        </p>
      </div>

      <div className="cart-delivery-note">
        Delivery charges are calculated at checkout if applicable.
      </div>

      <hr />

      <div className="cart-total-deatails cart-grand-total">
        <p>Total Amount</p>
        <p>{formatPrice(grandTotal)}</p>
      </div>

      <button
        type="button"
        onClick={() => navigate("/order")}
        className="checkout-button"
      >
        Proceed To Checkout <span>→</span>
      </button>

      <button
        type="button"
        onClick={() => navigate("/")}
        className="continue-shopping-button"
      >
        Continue Shopping
      </button>

      <div className="cart-secure-note">
        <span>✓</span>
        Review your order details before checkout.
      </div>
    </aside>
  </div>
</main>


);
};

export default Cart;
