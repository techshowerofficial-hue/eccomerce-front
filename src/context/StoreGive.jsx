import {
createContext,
useCallback,
useEffect,
useState,
} from "react";
import axios from "axios";

export const StoreGive = createContext(null);

const API_URL = "http://localhost:4000";

const normalizeProduct = (product) => {
const images = Array.isArray(product.images)
? product.images.filter(Boolean)
: product.image
? [product.image]
: [];

return {
...product,
images,
image: images[0] || "",
price: Number(product.price) || 0,
stock: Number(product.stock) || 0,
};
};

const getImageUrl = (image) => {
if (!image) return "";

if (image.startsWith("http://") || image.startsWith("https://")) {
return image;
}

return `${API_URL}/images/${image.replace(/^\/+/, "")}`;
};

const StoreGiveProvider = ({ children }) => {
const [token, setToken] = useState("");

const [shop_list, setShopList] = useState([]);
const [productsLoading, setProductsLoading] = useState(true);
const [productsError, setProductsError] = useState("");
const [categories, setCategories] = useState([]);
const [categoriesLoading, setCategoriesLoading] = useState(true);
const [categoriesError, setCategoriesError] = useState("");
const [cartItems, setCartItems] = useState(() => {
try {
const savedCart = localStorage.getItem("nile_cart");
return savedCart ? JSON.parse(savedCart) : {};
} catch {
return {};
}
});

// Fetch products from backend
const fetchProducts = useCallback(async () => {
setProductsLoading(true);


try {
  setProductsError("");

  const response = await axios.get(
    `${API_URL}/api/products/list`
  );

  if (!response.data.success) {
    throw new Error(
      response.data.message || "Unable to load products."
    );
  }

  const products = (response.data.data || []).map(normalizeProduct);

  setShopList(products);
} catch (error) {
  console.error("Fetch products error:", error);

  setProductsError(
    error.response?.data?.message ||
      error.message ||
      "Unable to load products."
  );
} finally {
  setProductsLoading(false);
}


}, []);

useEffect(() => {
fetchProducts();
}, [fetchProducts]);

// Add product to cart
const addToCart = useCallback((itemId, quantity = 1) => {
  const id = String(itemId || "");
  const amount = Math.max(1, Math.floor(Number(quantity) || 1));

  if (!id) {
    console.error("Cannot add product: missing product ID");
    return;
  }

  setCartItems((previous) => {
    const currentQuantity = Number(previous[id]) || 0;

    return {
      ...previous,
      [id]: currentQuantity + amount,
    };
  });
}, []);

// Decrease quantity
const removeToCart = (itemId) => {
setCartItems((previous) => {
const updated = { ...previous };


  if (!updated[itemId]) return previous;

  if (updated[itemId] <= 1) {
    delete updated[itemId];
  } else {
    updated[itemId] -= 1;
  }

  return updated;
});


};

// Set exact quantity
const updateCartQuantity = (itemId, quantity) => {
const amount = Math.floor(Number(quantity) || 0);


setCartItems((previous) => {
  const updated = { ...previous };

  if (amount <= 0) {
    delete updated[itemId];
  } else {
    updated[itemId] = amount;
  }

  return updated;
});


};
const fetchCategories = useCallback(async () => {
  setCategoriesLoading(true);

  try {
    setCategoriesError("");

    const response = await axios.get(
      `${API_URL}/api/categories/list`
    );

    if (!response.data.success) {
      throw new Error(
        response.data.message || "Unable to load categories."
      );
    }

    const categoryData = response.data.data || [];

    setCategories(
      categoryData.filter((item) => item.isActive !== false)
    );
  } catch (error) {
    console.error("Fetch categories error:", error);

    setCategoriesError(
      error.response?.data?.message ||
        error.message ||
        "Unable to load categories."
    );
  } finally {
    setCategoriesLoading(false);
  }
}, []);
useEffect(() => {
  fetchCategories();
}, [fetchCategories]);
// Remove product completely
const deleteFromCart = (itemId) => {
setCartItems((previous) => {
const updated = { ...previous };
delete updated[itemId];
return updated;
});
};

// Get cart products
const getCartItems = () => {
return Object.entries(cartItems)
.map(([itemId, quantity]) => {
const itemInfo = shop_list.find(
(product) => String(product._id) === String(itemId)
);


    if (!itemInfo || quantity <= 0) return null;

    return {
      ...itemInfo,
      quantity,
      lineTotal: Number(itemInfo.price) * quantity,
    };
  })
  .filter(Boolean);


};

// Calculate subtotal
const getTotalCartAmount = () => {
return getCartItems().reduce(
(total, item) => total + item.lineTotal,
0
);
};

// Total product quantity
const getTotalCartItems = () => {
return Object.values(cartItems).reduce(
(total, quantity) => total + quantity,
0
);
};

// Clear cart
const clearCart = () => {
setCartItems({});
};

// Persist cart
useEffect(() => {
localStorage.setItem("nile_cart", JSON.stringify(cartItems));
}, [cartItems]);

// Restore token
useEffect(() => {
const savedToken = localStorage.getItem("token");


if (savedToken) {
  setToken(savedToken);
}


}, []);

const contextValue = {
shop_list,
setShopList,


productsLoading,
productsError,
fetchProducts,

getImageUrl,

cartItems,
setCartItems,

addToCart,
removeToCart,
updateCartQuantity,
deleteFromCart,

getCartItems,
getTotalCartAmount,
getTotalCartItems,
clearCart,
categories,
categoriesLoading,
categoriesError,
fetchCategories,
token,
setToken,


};

return (
<StoreGive.Provider value={contextValue}>
{children}
</StoreGive.Provider>
);
};

export default StoreGiveProvider;
