import React, { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { StoreGive } from "../../context/StoreGive";
import "./PlaceOrder.css";
import API_URL from "../../api/api";

const DELIVERY_CHARGE = 0;

const INITIAL_FORM = {
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
};

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

  // Form state
  const [formData, setFormData] = useState(INITIAL_FORM);

  // Saved address states
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState("");
  const [loadingAddresses, setLoadingAddresses] = useState(true);
  const [showAddressForm, setShowAddressForm] = useState(true);

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

  // ==========================================
  // FETCH SAVED ADDRESSES
  // ==========================================

  useEffect(() => {
    let isMounted = true;

    const fetchAddresses = async () => {
      const authToken = token || localStorage.getItem("token");

      if (!authToken) {
        if (isMounted) {
          setSavedAddresses([]);
          setSelectedAddressId("");
          setShowAddressForm(true);
          setLoadingAddresses(false);
        }
        return;
      }

      try {
        const response = await axios.get(
          `${API_URL}/api/user/addresses`,
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        );

        if (!isMounted) return;

        if (response.data?.success) {
          const addresses = Array.isArray(response.data.addresses)
            ? response.data.addresses
            : [];

          setSavedAddresses(addresses);

          if (addresses.length > 0) {
            const defaultAddress =
              addresses.find((address) => address.isDefault) ||
              addresses[0];

            setSelectedAddressId(defaultAddress._id);
            setShowAddressForm(false);

            // Load the selected saved address into the form.
            const nameParts = String(
              defaultAddress.fullName || ""
            )
              .trim()
              .split(/\s+/);

            setFormData((previous) => ({
              ...previous,
              firstName: nameParts[0] || "",
              lastName: nameParts.slice(1).join(" "),
              phone: defaultAddress.phone || "",
              house: defaultAddress.houseNo || "",
              street: defaultAddress.area || "",
              city: defaultAddress.city || "",
              district: defaultAddress.district || "",
              state:
                defaultAddress.state || "Madhya Pradesh",
              pincode: defaultAddress.pincode || "",
            }));
          } else {
            setSelectedAddressId("");
            setShowAddressForm(true);
          }
        }
      } catch (error) {
        console.error(
          "Fetch saved addresses error:",
          error.response?.data || error.message
        );

        if (isMounted) {
          setSavedAddresses([]);
          setSelectedAddressId("");
          setShowAddressForm(true);
        }
      } finally {
        if (isMounted) {
          setLoadingAddresses(false);
        }
      }
    };

    fetchAddresses();

    return () => {
      isMounted = false;
    };
  }, [token]);

  // ==========================================
  // FORM CHANGE
  // ==========================================

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // ==========================================
  // SELECT SAVED ADDRESS
  // ==========================================

  const handleSelectAddress = (address) => {
    setSelectedAddressId(address._id);

    const nameParts = String(address.fullName || "")
      .trim()
      .split(/\s+/);

    setFormData((previous) => ({
      ...previous,
      firstName: nameParts[0] || "",
      lastName: nameParts.slice(1).join(" "),
      phone: address.phone || "",
      house: address.houseNo || "",
      street: address.area || "",
      city: address.city || "",
      district: address.district || "",
      state: address.state || "Madhya Pradesh",
      pincode: address.pincode || "",
    }));

    setShowAddressForm(false);
  };

  // ==========================================
  // ADD ANOTHER ADDRESS
  // ==========================================

  const handleAddAnotherAddress = () => {
    setSelectedAddressId("");
    setShowAddressForm(true);

    // Keep customer details but clear the previous address.
    setFormData((previous) => ({
      ...previous,
      house: "",
      street: "",
      city: "",
      district: "",
      state: "Madhya Pradesh",
      pincode: "",
    }));
  };

  // ==========================================
  // CANCEL NEW ADDRESS
  // ==========================================

  const handleCancelNewAddress = () => {
    const previousAddress = savedAddresses.find(
      (address) => String(address._id) === String(selectedAddressId)
    );

    if (previousAddress) {
      handleSelectAddress(previousAddress);
      return;
    }

    const defaultAddress =
      savedAddresses.find((address) => address.isDefault) ||
      savedAddresses[0];

    if (defaultAddress) {
      handleSelectAddress(defaultAddress);
    } else {
      setShowAddressForm(true);
    }
  };

  // ==========================================
  // VALIDATE FORM
  // ==========================================

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
      if (!String(formData[field] || "").trim()) {
        const fieldLabels = {
          firstName: "first name",
          lastName: "last name",
          phone: "mobile number",
          house: "house number / building",
          street: "street / area",
          city: "village / city",
          district: "district",
          state: "state",
          pincode: "PIN code",
        };

        alert(`Please enter ${fieldLabels[field] || field}.`);
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

  // ==========================================
  // PLACE ORDER
  // ==========================================

  const handlePlaceOrder = async (event) => {
    event.preventDefault();

    if (isSubmitting) return;

    if (!validateForm()) return;

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

      if (!response.data?.success) {
        throw new Error(
          response.data?.message || "Unable to place order."
        );
      }

      const savedOrder =
        response.data.order || response.data.data || {};

      const orderId =
        savedOrder.orderId ||
        savedOrder._id ||
        response.data.orderId ||
        "";

      // Refresh address list after successful order.
      // Backend should save new addresses in user.addresses.
      try {
        const addressResponse = await axios.get(
          `${API_URL}/api/user/addresses`,
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        );

        if (addressResponse.data?.success) {
          setSavedAddresses(
            Array.isArray(addressResponse.data.addresses)
              ? addressResponse.data.addresses
              : []
          );
        }
      } catch (addressError) {
        console.error(
          "Refresh saved addresses error:",
          addressError.response?.data || addressError.message
        );
      }

      if (!productId && typeof clearCart === "function") {
        clearCart();
      }

      setSuccessOrderId(String(orderId || "Confirmed"));
    } catch (error) {
      console.error(
        "Place order error:",
        error.response?.data || error
      );

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

  // ==========================================
  // SUCCESS SCREEN
  // ==========================================

  if (successOrderId) {
    return (
      <div className="placeorder order-success">
        <div className="order-success-card">
          <div className="order-success-icon">✓</div>

          <h2>Order Placed Successfully!</h2>

          <p>
            Thank you for shopping with Zivnel. Your order has been
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

  // ==========================================
  // EMPTY CART SCREEN
  // ==========================================

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

  // ==========================================
  // CHECKOUT SCREEN
  // ==========================================

  return (
    <div className="placeorder">
      <div className="delivery-information">
        <h2>Delivery Information</h2>

        {loadingAddresses ? (
          <div className="address-loading">
            Loading saved addresses...
          </div>
        ) : (
          <>
            {/* SAVED ADDRESS LIST */}

            {savedAddresses.length > 0 && (
              <div className="saved-addresses-section">
                <h3>Select Delivery Address</h3>

                <div className="saved-addresses-list">
                  {savedAddresses.map((address) => (
                    <div
                      key={address._id}
                      className={`saved-address-card ${
                        String(selectedAddressId) ===
                        String(address._id)
                          ? "selected"
                          : ""
                      }`}
                      onClick={() => handleSelectAddress(address)}
                    >
                      <div className="saved-address-header">
                        <label>
                          <input
                            type="radio"
                            name="savedAddress"
                            checked={
                              String(selectedAddressId) ===
                              String(address._id)
                            }
                            onChange={() =>
                              handleSelectAddress(address)
                            }
                          />

                          <strong>{address.fullName}</strong>
                        </label>

                        {address.isDefault && (
                          <span className="default-address-badge">
                            Default
                          </span>
                        )}
                      </div>

                      <p>
                        {address.houseNo}, {address.area}
                      </p>

                      {address.landmark && (
                        <p>
                          Landmark: {address.landmark}
                        </p>
                      )}

                      <p>
                        {address.city}, {address.district}
                      </p>

                      <p>
                        {address.state} - {address.pincode}
                      </p>

                      <p>Mobile: {address.phone}</p>

                      <span className="address-type">
                        {address.addressType || "Home"}
                      </span>
                    </div>
                  ))}
                </div>

                {!showAddressForm && (
                  <button
                    type="button"
                    className="add-another-address-button"
                    onClick={handleAddAnotherAddress}
                  >
                    + Add Another Address
                  </button>
                )}
              </div>
            )}

            {/* DELIVERY FORM */}

            {showAddressForm && (
              <div className="new-address-form">
                <div className="new-address-heading">
                  <h3>
                    {savedAddresses.length > 0
                      ? "Add Another Address"
                      : "Add Delivery Address"}
                  </h3>

                  {savedAddresses.length > 0 && (
                    <button
                      type="button"
                      className="cancel-address-button"
                      onClick={handleCancelNewAddress}
                    >
                      Cancel
                    </button>
                  )}
                </div>

                <p className="address-form-note">
                  Enter the address where you want your order delivered.
                </p>
              </div>
            )}
          </>
        )}

        {/* ONE FORM ONLY: SAVED ADDRESS AND NEW ADDRESS */}

        <form onSubmit={handlePlaceOrder}>
          {showAddressForm && (
            <>
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
            </>
          )}

          {!showAddressForm && selectedAddressId && (
            <div className="selected-address-summary">
              <h3>Delivering To</h3>

              <p>
                <strong>
                  {formData.firstName} {formData.lastName}
                </strong>
              </p>

              <p>
                {formData.house}, {formData.street}
              </p>

              <p>
                {formData.city}, {formData.district}
              </p>

              <p>
                {formData.state} - {formData.pincode}
              </p>

              <p>Mobile: {formData.phone}</p>

              <button
                type="button"
                className="edit-selected-address-button"
                onClick={() => setShowAddressForm(true)}
              >
                Edit Address Details
              </button>
            </div>
          )}

          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            placeholder="Order Notes (Optional)"
            rows={3}
          />

          {/* ORDER SUMMARY */}

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
            disabled={isSubmitting || loadingAddresses}
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