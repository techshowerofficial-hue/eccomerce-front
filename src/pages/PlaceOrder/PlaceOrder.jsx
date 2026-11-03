
import React, { useContext, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { StoreGive } from "../../context/StoreGive";
import "./PlaceOrder.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";
const DELIVERY_CHARGE = 45;

const PlaceOrder = () => {
  const {
    shop_list = [],
    getCartItems,
    clearCart,
    token,
  } = useContext(StoreGive);

  const navigate = useNavigate();
  const location = useLocation();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successOrderId, setSuccessOrderId] = useState("");

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    house: "",
    street: "",
    city: "",
    district: "",
    state: "Madhya Pradesh",
    pincode: "",
    notes: "",
  });

  const params = new URLSearchParams(location.search);
  const productId = params.get("productId");

  const buyNowProduct = productId
    ? shop_list.find(
        (item) => String(item._id) === String(productId)
      )
    : null;

  const buyNowQuantity = Math.max(
    1,
    Math.floor(Number(location.state?.quantity) || 1)
  );

  const cartProducts =
    typeof getCartItems === "function" ? getCartItems() : [];

  const orderItems = productId
    ? buyNowProduct
      ? [
          {
            ...buyNowProduct,
            quantity: buyNowQuantity,
          },
        ]
      : []
    : cartProducts;

  const subtotal = orderItems.reduce(
    (total, item) =>
      total +
      Number(item.price || 0) * Number(item.quantity || 0),
    0
  );

  const deliveryCharge =
    orderItems.length > 0 ? DELIVERY_CHARGE : 0;

  const totalAmount = subtotal + deliveryCharge;

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const requiredFields = [
      "firstName",
      "lastName",
      "phone",
      "house",
      "street",
      "city",
      "district",
      "state",
      "pincode",
    ];

    for (const field of requiredFields) {
      if (!String(formData[field]).trim()) {
        alert(`Please enter ${field}.`);
        return false;
      }
    }

    if (!/^[6-9]\d{9}$/.test(formData.phone.trim())) {
      alert("Please enter a valid 10-digit mobile number.");
      return false;
    }

    if (!/^\d{6}$/.test(formData.pincode.trim())) {
      alert("Please enter a valid 6-digit PIN code.");
      return false;
    }

    if (formData.email.trim()) {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailPattern.test(formData.email.trim())) {
        alert("Please enter a valid email address.");
        return false;
      }
    }

    if (orderItems.length === 0) {
      alert(
        "Your cart is empty or the selected product is unavailable."
      );
      return false;
    }

    return true;
  };

  const handlePlaceOrder = async (event) => {
    event.preventDefault();

    if (isSubmitting) return;

    if (!validateForm()) return;

    // Context token first, then localStorage.
    const authToken = token || localStorage.getItem("token");

    if (!authToken) {
      alert("Please login to continue.");
      return;
    }

    setIsSubmitting(true);

    try {
      const orderData = {
        customer: {
          firstName: formData.firstName.trim(),
          lastName: formData.lastName.trim(),
          phone: formData.phone.trim(),
          email: formData.email.trim(),
        },

        address: {
          house: formData.house.trim(),
          street: formData.street.trim(),
          city: formData.city.trim(),
          district: formData.district.trim(),
          state: formData.state.trim(),
          pincode: formData.pincode.trim(),
        },

        items: orderItems.map((item) => ({
          productId: item._id,
          quantity: Number(item.quantity),
        })),

        notes: formData.notes.trim(),
      };

      const response = await axios.post(
        `${API_URL}/api/orders/place`,
        orderData,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      if (!response.data.success) {
        throw new Error(
          response.data.message || "Unable to place order."
        );
      }

      const savedOrder =
        response.data.order || response.data.data || {};

      const orderId =
        savedOrder.orderId ||
        savedOrder._id ||
        response.data.orderId ||
        "";

      // Clear cart only after successful order creation.
      if (!productId && typeof clearCart === "function") {
        clearCart();
      }

      setSuccessOrderId(String(orderId || "Confirmed"));
    } catch (error) {
      console.error("Place order error:", error);

      if (error.response?.status === 401) {
        alert(
          "Your login session is invalid or expired. Please login again."
        );
      } else {
        alert(
          error.response?.data?.message ||
            error.message ||
            "Unable to place your order. Please try again."
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Successful order screen
  if (successOrderId) {
    return (
      <div className="placeorder order-success">
        <div className="order-success-card">
          <div className="order-success-icon">✓</div>

          <h2>Order Placed Successfully!</h2>

          <p>
            Thank you for shopping with Nile. Your order has been
            submitted successfully.
          </p>

          <div className="success-order-id">
            <span>Order ID</span>
            <strong>{successOrderId}</strong>
          </div>

          <p className="success-status">
            Order Status: Pending
          </p>

          <button
            type="button"
            className="place-order-button"
            onClick={() => navigate("/")}
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  // Empty cart screen
  if (orderItems.length === 0) {
    return (
      <div className="placeorder empty-checkout">
        <h2>Your cart is empty</h2>

        <button
          type="button"
          onClick={() => navigate("/")}
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="placeorder">
      <div className="delivery-information">
        <h2>Delivery Information</h2>

        <form onSubmit={handlePlaceOrder}>
          <div className="multi-field">
            <input
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              placeholder="First Name"
              autoComplete="given-name"
              required
            />

            <input
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              placeholder="Last Name"
              autoComplete="family-name"
              required
            />
          </div>

          <input
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="10-digit Mobile Number"
            type="tel"
            inputMode="numeric"
            autoComplete="tel"
            maxLength={10}
            required
          />

          <input
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email Address (Optional)"
            type="email"
            autoComplete="email"
          />

          <input
            name="house"
            value={formData.house}
            onChange={handleChange}
            placeholder="House Number / Building"
            autoComplete="address-line1"
            required
          />

          <input
            name="street"
            value={formData.street}
            onChange={handleChange}
            placeholder="Street / Area / Landmark"
            autoComplete="address-line2"
            required
          />

          <div className="multi-field">
            <input
              name="city"
              value={formData.city}
              onChange={handleChange}
              placeholder="Village / City"
              autoComplete="address-level2"
              required
            />

            <input
              name="district"
              value={formData.district}
              onChange={handleChange}
              placeholder="District"
              required
            />
          </div>

          <div className="multi-field">
            <input
              name="state"
              value={formData.state}
              onChange={handleChange}
              placeholder="State"
              autoComplete="address-level1"
              required
            />

            <input
              name="pincode"
              value={formData.pincode}
              onChange={handleChange}
              placeholder="6-digit PIN Code"
              inputMode="numeric"
              maxLength={6}
              autoComplete="postal-code"
              required
            />
          </div>

          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            placeholder="Order Notes (Optional)"
            rows={3}
          />

          <div className="checkout-summary">
            <h3>Order Summary</h3>

            {orderItems.map((item) => (
              <div
                className="checkout-summary-item"
                key={item._id}
              >
                <span>
                  {item.name} × {item.quantity}
                </span>

                <strong>
                  ₹
                  {(
                    Number(item.price || 0) *
                    Number(item.quantity || 0)
                  ).toLocaleString("en-IN")}
                </strong>
              </div>
            ))}

            <div className="checkout-summary-item">
              <span>Subtotal</span>
              <strong>
                ₹{subtotal.toLocaleString("en-IN")}
              </strong>
            </div>

            <div className="checkout-summary-item">
              <span>Delivery Charges</span>
              <strong>
                ₹{deliveryCharge.toLocaleString("en-IN")}
              </strong>
            </div>

            <div className="checkout-total">
              <span>Total Amount</span>

              <strong>
                ₹{totalAmount.toLocaleString("en-IN")}
              </strong>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="place-order-button"
          >
            {isSubmitting
              ? "Placing Order..."
              : `Place Order — ₹${totalAmount.toLocaleString(
                  "en-IN"
                )}`}
          </button>

          <p className="checkout-note">
            Your order will be submitted through our website.
            Your order status will initially be Pending.
          </p>
        </form>
      </div>
    </div>
  );
};

export default PlaceOrder;

