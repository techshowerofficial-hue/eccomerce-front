
import React, { useEffect, useState } from "react";
import axios from "axios";
import "./MyOrders.css";
import API_URL from "../../api/api";

const formatPrice = (amount) => {
  return `₹${Number(amount || 0).toLocaleString("en-IN", {
    maximumFractionDigits: 2,
  })}`;
};

const formatDate = (date) => {
  if (!date) return "N/A";

  return new Date(date).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const getStatusClass = (status) => {
  return String(status || "Pending")
    .toLowerCase()
    .replace(/\s+/g, "-");
};

const getStatusMessage = (status) => {
  switch (status) {
    case "Pending":
      return "Your order has been received and is awaiting confirmation.";

    case "Confirmed":
      return "Your order has been confirmed.";

    case "Processing":
      return "Your order is being prepared.";

    case "Shipped":
      return "Your order has been shipped.";

    case "Delivered":
      return "Your order has been delivered successfully.";

    case "Cancelled":
      return "This order has been cancelled.";

    default:
      return "Order status is currently unavailable.";
  }
};

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [activeTab, setActiveTab] = useState("Active");

  // Fetch customer orders
  const fetchMyOrders = async () => {
    try {
      setLoading(true);
      setError("");

      const authToken = localStorage.getItem("token");

      if (!authToken) {
        setOrders([]);
        setError("Please login to view your orders.");
        return;
      }

      const response = await axios.get(
        `${API_URL}/api/orders/my-orders`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      if (response.data?.success) {
        setOrders(response.data.orders || []);
      } else {
        setOrders([]);
        setError(
          response.data?.message || "Unable to load your orders."
        );
      }
    } catch (err) {
      console.error(
        "Fetch orders error:",
        err.response?.data || err.message || err
      );

      setOrders([]);

      if (err.response?.status === 401) {
        setError("Your session has expired. Please login again.");
      } else {
        setError(
          err.response?.data?.message ||
            "Unable to load orders. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyOrders();
  }, []);

  // Order categories
  const activeOrders = orders.filter((order) =>
    ["Pending", "Confirmed", "Processing", "Shipped"].includes(
      order.status
    )
  );

  const completedOrders = orders.filter(
    (order) => order.status === "Delivered"
  );

  const cancelledOrders = orders.filter(
    (order) => order.status === "Cancelled"
  );

  // Orders shown in the selected tab
  const filteredOrders =
    activeTab === "Active"
      ? activeOrders
      : activeTab === "Completed"
      ? completedOrders
      : cancelledOrders;

  const tabCounts = {
    Active: activeOrders.length,
    Completed: completedOrders.length,
    Cancelled: cancelledOrders.length,
  };

  const toggleOrderDetails = (orderId) => {
    setExpandedOrder((previous) =>
      previous === orderId ? null : orderId
    );
  };

  const changeTab = (tab) => {
    setActiveTab(tab);
    setExpandedOrder(null);
  };

  // Loading screen
  if (loading) {
    return (
      <div className="my-orders-page">
        <div className="my-orders-loading">
          <div className="orders-spinner"></div>
          <p>Loading your orders...</p>
        </div>
      </div>
    );
  }

  // Error screen
  if (error) {
    return (
      <div className="my-orders-page">
        <div className="orders-message-card">
          <div className="orders-message-icon">!</div>

          <h2>Unable to load orders</h2>
          <p>{error}</p>

          <button
            type="button"
            className="orders-primary-btn"
            onClick={fetchMyOrders}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="my-orders-page">
      <div className="my-orders-container">
        {/* Page Header */}
        <div className="my-orders-header">
          <div>
            <span className="orders-eyebrow">YOUR ACCOUNT</span>
            <h1>My Orders</h1>
            <p>View your purchases and track your orders.</p>
          </div>

          <button
            type="button"
            className="orders-refresh-btn"
            onClick={fetchMyOrders}
          >
            ↻ Refresh
          </button>
        </div>

        {/* Order Summary */}
        <div className="orders-summary">
          <div className="orders-summary-card">
            <span className="summary-icon">📦</span>

            <div>
              <p>Total Orders</p>
              <h3>{orders.length}</h3>
            </div>
          </div>

          <div className="orders-summary-card">
            <span className="summary-icon">🚚</span>

            <div>
              <p>In Progress</p>
              <h3>{activeOrders.length}</h3>
            </div>
          </div>

          <div className="orders-summary-card">
            <span className="summary-icon">✅</span>

            <div>
              <p>Delivered</p>
              <h3>{completedOrders.length}</h3>
            </div>
          </div>
        </div>

        {/* Order Tabs */}
        <div className="orders-tabs">
          {["Active", "Completed", "Cancelled"].map((tab) => (
            <button
              type="button"
              key={tab}
              className={`orders-tab ${
                activeTab === tab ? "active" : ""
              }`}
              onClick={() => changeTab(tab)}
            >
              <span>{tab}</span>

              <span className="orders-tab-count">
                {tabCounts[tab]}
              </span>
            </button>
          ))}
        </div>

        {/* Empty State */}
        {filteredOrders.length === 0 ? (
          <div className="orders-empty">
            <div className="orders-empty-icon">
              {activeTab === "Active"
                ? "📦"
                : activeTab === "Completed"
                ? "✅"
                : "❌"}
            </div>

            <h2>
              {activeTab === "Active"
                ? "No active orders"
                : activeTab === "Completed"
                ? "No completed orders"
                : "No cancelled orders"}
            </h2>

            <p>
              {activeTab === "Active"
                ? "Your ongoing orders will appear here."
                : activeTab === "Completed"
                ? "Your delivered orders will appear here."
                : "Your cancelled orders will appear here."}
            </p>

            {activeTab !== "Active" && (
              <button
                type="button"
                className="orders-primary-btn"
                onClick={() => changeTab("Active")}
              >
                View Active Orders
              </button>
            )}

            {activeTab === "Active" && (
              <a href="/" className="orders-primary-btn">
                Start Shopping
              </a>
            )}
          </div>
        ) : (
          /* Filtered Orders List */
          <div className="orders-list">
            {filteredOrders.map((order) => {
              const isExpanded = expandedOrder === order._id;

              const address = order.address || {};
              const customer = order.customer || {};
              const items = order.items || [];

              return (
                <article className="order-card" key={order._id}>
                  {/* Order Header */}
                  <div className="order-card-header">
                    <div className="order-reference">
                      <span className="order-label">ORDER ID</span>

                      <h3>{order.orderId || order._id}</h3>

                      <p>Placed on {formatDate(order.createdAt)}</p>
                    </div>

                    <div className="order-header-badges">
                      <span
                        className={`order-status-badge ${getStatusClass(
                          order.status
                        )}`}
                      >
                        {order.status || "Pending"}
                      </span>

                      <span
                        className={`payment-status-badge ${getStatusClass(
                          order.paymentStatus
                        )}`}
                      >
                        Payment: {order.paymentStatus || "Pending"}
                      </span>
                    </div>
                  </div>

                  {/* Order Products */}
                  <div className="order-card-body">
                    <div className="order-products">
                      {items.slice(0, 3).map((item, index) => (
                        <div
                          className="order-product-row"
                          key={
                            item.productId ||
                            `${item.name}-${index}`
                          }
                        >
                          <div className="order-product-placeholder">
                            🛍️
                          </div>

                          <div className="order-product-info">
                            <h4>{item.name || "Product"}</h4>
                            <p>Quantity: {item.quantity || 1}</p>
                          </div>

                          <div className="order-product-price">
                            {formatPrice(
                              item.lineTotal ??
                                Number(item.price || 0) *
                                  Number(item.quantity || 1)
                            )}
                          </div>
                        </div>
                      ))}

                      {items.length > 3 && (
                        <p className="order-more-items">
                          +{items.length - 3} more item(s)
                        </p>
                      )}
                    </div>

                    <div className="order-total-box">
                      <span>Total Amount</span>
                      <strong>{formatPrice(order.totalAmount)}</strong>
                    </div>
                  </div>

                  {/* Status Message */}
                  <div className="order-status-message">
                    <span className="status-message-dot"></span>
                    <p>{getStatusMessage(order.status)}</p>
                  </div>

                  {/* Card Footer */}
                  <div className="order-card-footer">
                    <button
                      type="button"
                      className="order-details-btn"
                      onClick={() => toggleOrderDetails(order._id)}
                    >
                      {isExpanded
                        ? "Hide Details ↑"
                        : "View Details ↓"}
                    </button>

                    <span className="order-payment-method">
                      Payment: {order.paymentMethod || "N/A"}
                    </span>
                  </div>

                  {/* Expanded Order Details */}
                  {isExpanded && (
                    <div className="order-expanded-details">
                      {/* Items */}
                      <div className="order-detail-section">
                        <h4>Order Items</h4>

                        {items.length === 0 ? (
                          <p>No items found.</p>
                        ) : (
                          <div className="order-detail-items">
                            {items.map((item, index) => (
                              <div
                                className="order-detail-item"
                                key={`${item.productId || item.name}-${index}`}
                              >
                                <div>
                                  <strong>
                                    {item.name || "Product"}
                                  </strong>

                                  <p>
                                    {formatPrice(item.price)} ×{" "}
                                    {item.quantity || 1}
                                  </p>
                                </div>

                                <strong>
                                  {formatPrice(
                                    item.lineTotal ??
                                      Number(item.price || 0) *
                                        Number(item.quantity || 1)
                                  )}
                                </strong>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Address */}
                      <div className="order-detail-section">
                        <h4>Delivery Address</h4>

                        <p className="delivery-customer-name">
                          {[
                            customer.firstName,
                            customer.lastName,
                          ]
                            .filter(Boolean)
                            .join(" ") || "Customer"}
                        </p>

                        <p>
                          {[
                            address.house,
                            address.street,
                            address.city,
                            address.district,
                            address.state,
                            address.pincode,
                          ]
                            .filter(Boolean)
                            .join(", ") || "Address not available"}
                        </p>

                        {customer.phone && (
                          <p>Phone: {customer.phone}</p>
                        )}

                        {customer.email && (
                          <p>Email: {customer.email}</p>
                        )}
                      </div>

                      {/* Price Summary */}
                      <div className="order-detail-section">
                        <h4>Price Summary</h4>

                        <div className="price-summary-row">
                          <span>Subtotal</span>
                          <span>{formatPrice(order.subtotal)}</span>
                        </div>

                        <div className="price-summary-row">
                          <span>Delivery Charge</span>
                          <span>
                            {formatPrice(order.deliveryCharge)}
                          </span>
                        </div>

                        <div className="price-summary-row price-summary-total">
                          <span>Total</span>
                          <strong>
                            {formatPrice(order.totalAmount)}
                          </strong>
                        </div>
                      </div>

                      {/* Notes */}
                      {order.notes && (
                        <div className="order-detail-section">
                          <h4>Order Notes</h4>
                          <p>{order.notes}</p>
                        </div>
                      )}

                      {/* Order Information */}
                      <div className="order-detail-section">
                        <h4>Order Information</h4>

                        <div className="price-summary-row">
                          <span>Order ID</span>
                          <span>{order.orderId || order._id}</span>
                        </div>

                        <div className="price-summary-row">
                          <span>Order Date</span>
                          <span>{formatDate(order.createdAt)}</span>
                        </div>

                        <div className="price-summary-row">
                          <span>Last Updated</span>
                          <span>{formatDate(order.updatedAt)}</span>
                        </div>

                        <div className="price-summary-row">
                          <span>Order Status</span>
                          <strong>{order.status || "Pending"}</strong>
                        </div>

                        <div className="price-summary-row">
                          <span>Payment Status</span>
                          <strong>
                            {order.paymentStatus || "Pending"}
                          </strong>
                        </div>
                      </div>
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrders;

