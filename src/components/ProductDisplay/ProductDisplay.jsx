import React from "react";
import { useContext } from "react";
import { StoreGive } from "../../context/StoreGive";
import "./ProductDisplay.css";
const ProductDisplay = ({ category = "All" }) => {
  const {
    shop_list = [],
    productsLoading,
    productsError,
    fetchProducts,
  } = useContext(StoreGive);

  // Filter products according to the selected category
  const selectedCategory = String(category || "All")
    .trim()
    .toLowerCase();

  const filteredProducts = shop_list.filter((product) => {
    // All category: display every product
    if (selectedCategory === "all") {
      return true;
    }

    // Match selected category with product category
    const productCategory = String(product.category || "")
      .trim()
      .toLowerCase();

    return productCategory === selectedCategory;
  });

  // Loading state
  if (productsLoading) {
    return (
      <section className="product-display" id="product-display">
        <div className="no-products">
          <p>Loading products...</p>
        </div>
      </section>
    );
  }

  // Error state
  if (productsError) {
    return (
      <section className="product-display" id="product-display">
        <div className="no-products">
          <h3>Unable to load products</h3>
          <p>{productsError}</p>

          <button type="button" onClick={fetchProducts}>
            Try Again
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="product-display" id="product-display">
      <div className="product-display-header">
        <h2>
          {selectedCategory === "all"
            ? "Explore Our Products"
            : category}
        </h2>

        <p>Discover your favourite products from Nile.</p>
      </div>

      {filteredProducts.length > 0 ? (
        <div className="product-display-list">
          {filteredProducts.map((product) => (
            <ProductItem
              key={product._id}
              id={product._id}
              name={product.name}
              description={product.description}
              price={product.price}
              image={product.image}
              images={product.images}
              category={product.category}
              stock={product.stock}
            />
          ))}
        </div>
      ) : (
        <div className="no-products">
          <h3>No Products Found</h3>

          <p>
            {selectedCategory === "all"
              ? "No products are currently available."
              : `Currently, no products are available in the ${category} category.`}
          </p>
        </div>
      )}
    </section>
  );
};

export default ProductDisplay;

